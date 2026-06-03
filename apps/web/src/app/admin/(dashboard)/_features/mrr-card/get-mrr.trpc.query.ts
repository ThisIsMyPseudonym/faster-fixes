import { SubscriptionStatus } from "@/server/auth/config/subscription-plans";
import { stripeApi } from "@/server/stripe";
import { adminProcedure } from "@/server/trpc/trpc";
import { inferProcedureOutput } from "@trpc/server";
import { prisma } from "@workspace/db/index";
import Stripe from "stripe";
import { getMonthlyChurnRate } from "../../_utils/get-churn-rate";

export const getMrr = adminProcedure.query(async () => {
  const subscriptions = await prisma.subscription.findMany({
    where: { status: SubscriptionStatus.Active },
    select: { stripeSubscriptionId: true },
  });

  let totalMrrCents = 0;

  for (const subscription of subscriptions) {
    if (!subscription.stripeSubscriptionId) continue;

    try {
      const stripeSubscription = await stripeApi.subscriptions.retrieve(
        subscription.stripeSubscriptionId,
        { expand: ["items.data.price"] }
      );

      for (const item of stripeSubscription.items.data) {
        const price = item.price as Stripe.Price;

        if (!price.unit_amount) continue;

        // unit_amount is per seat; multiply by quantity or seat-based plans
        // (e.g. 5-seat Agency) are counted as a single seat and MRR collapses.
        const quantity = item.quantity ?? 1;
        let monthlyAmount = price.unit_amount * quantity;

        if (price.recurring?.interval === "year") {
          monthlyAmount = monthlyAmount / 12;
        }

        totalMrrCents += monthlyAmount;
      }
    } catch (error) {
      console.error(
        `Failed to fetch Stripe subscription ${subscription.stripeSubscriptionId}:`,
        error
      );
    }
  }

  // Gross = money charged to customers; net = what actually lands after Stripe
  // fees and refunds. `net` alone (the previous behaviour) under-reports the
  // headline figure, and `limit: 100` silently capped the sum at 100 charges —
  // auto-pagination walks the full history instead.
  let grossRevenueCents = 0;
  let netRevenueCents = 0;
  try {
    for await (const txn of stripeApi.balanceTransactions.list({
      limit: 100,
    })) {
      if (txn.type === "charge" || txn.type === "payment") {
        grossRevenueCents += txn.amount;
      }
      // net nets out fees for charges and subtracts refunds/chargebacks.
      netRevenueCents += txn.net;
    }
  } catch (error) {
    console.error("Failed to fetch Stripe balance transactions:", error);
  }

  const activeCount = subscriptions.length;
  const churnRate = await getMonthlyChurnRate();

  const mrr = totalMrrCents / 100;
  const arr = mrr * 12;
  const grossRevenue = grossRevenueCents / 100;
  const netRevenue = netRevenueCents / 100;

  // LTV = ARPA / monthly churn. Undefined when churn is 0 or there is no active
  // base to derive ARPA from — return null so the UI shows "—" instead of ∞.
  const arpa = activeCount > 0 ? mrr / activeCount : 0;
  const ltv = churnRate && churnRate > 0 ? arpa / churnRate : null;

  return { mrr, arr, grossRevenue, netRevenue, ltv };
});

export type GetMrrOutput = inferProcedureOutput<typeof getMrr>;

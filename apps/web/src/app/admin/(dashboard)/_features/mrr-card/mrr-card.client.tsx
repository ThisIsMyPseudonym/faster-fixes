"use client";

import { useTRPC } from "@/lib/trpc/trpc-client";
import { useQuery } from "@tanstack/react-query";
import { matchQueryStatus } from "@/utils/tanstack-query/match-query-status";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";

export function MrrCard() {
  const trpc = useTRPC();
  const query = useQuery(trpc.admin.dashboard.mrr.get.queryOptions());

  return matchQueryStatus(query, {
    Loading: <MrrCardLoading />,
    Errored: <MrrCardError />,
    Success: ({ data }) => {
      const formatEur = (value: number) =>
        new Intl.NumberFormat("fr-FR", {
          style: "currency",
          currency: "EUR",
        }).format(value);

      const formattedGrossRevenue = formatEur(data?.grossRevenue ?? 0);
      const formattedNetRevenue = formatEur(data?.netRevenue ?? 0);
      const formattedMrr = formatEur(data?.mrr ?? 0);
      const formattedArr = formatEur(data?.arr ?? 0);
      const formattedLtv = data?.ltv == null ? "—" : formatEur(data.ltv);

      return (
        <Card>
          <CardContent>
            <div className="text-2xl font-bold">{formattedGrossRevenue}</div>
            <p className="text-muted-foreground text-xs">Gross revenue</p>
            <p className="text-muted-foreground mb-4 text-xs">
              {formattedNetRevenue} net
            </p>

            {/* Breakdown section */}
            <div className="space-y-3 border-t pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground text-xs">MRR</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{formattedMrr}</span>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground text-xs">ARR</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold">
                      {formattedArr}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">LTV</span>
                  <span className="text-muted-foreground text-xs">
                    {formattedLtv}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    },
  });
}

function MrrCardLoading() {
  return (
    <Card>
      <CardContent>
        <div className="mb-4 flex items-baseline gap-2">
          <Skeleton className="h-8 w-20" />
        </div>
        <div className="space-y-3 border-t pt-4">
          <Skeleton className="size-40" />
          <Skeleton className="size-40" />
        </div>
      </CardContent>
    </Card>
  );
}

function MrrCardError() {
  return (
    <Card className="border-destructive/50">
      <CardContent className="pt-6">
        <p className="text-destructive text-sm">
          Failed to load statistics
        </p>
      </CardContent>
    </Card>
  );
}

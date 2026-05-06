import { Button } from "@workspace/ui/components/button";
import { ArrowRightIcon } from "lucide-react";
import type { Route } from "next";
import Link from "next/link";

export function LinearCtaSection() {
  return (
    <section className="bg-muted/50 w-full py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <h2 className="text-3xl font-bold md:text-4xl">
            Connect Faster Fixes to your Linear workspace
          </h2>
          <p className="text-muted-foreground mt-4 text-lg md:text-xl">
            The integration works alongside your existing Linear teams,
            workflow states, and issue hierarchy — nothing to reconfigure.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg">
              <Link href={"/docs/integrations/linear" as Route}>
                Read the docs
                <ArrowRightIcon />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/pricing">View pricing</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

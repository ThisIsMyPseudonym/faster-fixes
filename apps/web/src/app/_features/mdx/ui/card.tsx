import {
  Card as BaseCard,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";
import type { ReactNode } from "react";

type MdxCardProps = {
  children: ReactNode;
  title?: string;
  className?: string;
};

export function MdxCard({ children, title, className }: MdxCardProps) {
  return (
    <BaseCard className={cn("not-prose h-full", className)}>
      {title && (
        <CardHeader>
          <CardTitle className="text-primary text-lg">
            {title}
          </CardTitle>
        </CardHeader>
      )}
      <CardContent className="text-muted-foreground text-sm leading-relaxed [&_li]:leading-relaxed [&>ul]:list-disc [&>ul]:space-y-1.5 [&>ul]:pl-4">
        {children}
      </CardContent>
    </BaseCard>
  );
}

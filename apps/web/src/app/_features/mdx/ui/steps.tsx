import { cn } from "@workspace/ui/lib/utils";
import { Children, type ReactNode } from "react";

type StepsProps = {
  children: ReactNode;
};

type StepProps = {
  title: string;
  children: ReactNode;
};

export function Steps({ children }: StepsProps) {
  const items = Children.toArray(children);

  return (
    <div className="not-prose space-y-0">
      {items.map((child, index) => (
        <div key={index} className="relative flex gap-5">
          {/* Vertical line */}
          <div className="flex flex-col items-center">
            <div className="bg-primary text-primary-foreground flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold">
              {index + 1}
            </div>
            {index < items.length - 1 && (
              <div className="bg-border w-px grow" />
            )}
          </div>
          {/* Content */}
          <div className={cn("pb-8", index === items.length - 1 && "pb-0")}>
            {child}
          </div>
        </div>
      ))}
    </div>
  );
}

export function Step({ title, children }: StepProps) {
  return (
    <div>
      <p className="text-foreground mb-1.5 text-base font-semibold">{title}</p>
      <div className="text-muted-foreground text-sm leading-relaxed">
        {children}
      </div>
    </div>
  );
}

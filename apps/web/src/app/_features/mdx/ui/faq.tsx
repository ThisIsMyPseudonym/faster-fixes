import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import type { ReactNode } from "react";

type FAQItem = {
  question: string;
  answer: ReactNode;
};

type FAQProps = {
  items: FAQItem[];
};

export function FAQ({ items }: FAQProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Accordion type="single" collapsible className="w-full">
        {items.map((item, index) => (
          <AccordionItem
            key={index}
            value={`faq-${index}`}
            className="border-b"
          >
            <AccordionTrigger className="hover:text-primary text-left text-base font-medium">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="prose dark:prose-invert max-w-none pt-4 pb-4">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

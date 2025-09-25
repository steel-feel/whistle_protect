
import React from "react";
import { Check, ArrowRight } from "lucide-react";

interface StepIndicatorProps {
  steps: { label: string }[];
  current: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, current }) => (
  <nav aria-label="progress" className="flex items-center justify-center gap-4 mb-8">
    {steps.map((step, idx) => (
      <div key={step.label} className="flex items-center">
        <div
          className={`flex items-center justify-center rounded-full transition-all duration-300 w-10 h-10 font-bold text-base
            ${
              idx < current
                ? "bg-primary text-background shadow-lg"
                : idx === current
                ? "border-2 border-primary bg-muted text-foreground ring-2 ring-primary/20"
                : "bg-muted text-muted-foreground"
            }`}
        >
          {idx < current ? <Check className="h-5 w-5" /> : idx + 1}
        </div>
        {idx !== steps.length - 1 && (
          <ArrowRight className={`mx-3 h-5 w-5 transition-colors duration-300 ${idx < current ? "text-primary" : "text-muted-foreground"}`} />
        )}
      </div>
    ))}
  </nav>
);

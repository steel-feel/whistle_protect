
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
          className={`flex items-center justify-center rounded-full transition-all duration-300 w-10 h-10
            ${
              idx < current
                ? "bg-[#3FB8AF] text-[#0D1117] shadow-lg"
                : idx === current
                ? "border-2 border-[#3FB8AF] bg-[#161B22] text-white ring-2 ring-[#3FB8AF]/20"
                : "bg-[#27272a] text-gray-500"
            } font-bold text-base`}
        >
          {idx < current ? <Check className="h-5 w-5" /> : idx + 1}
        </div>
        {idx !== steps.length - 1 && (
          <ArrowRight className={`mx-3 h-5 w-5 transition-colors duration-300 ${idx < current ? "text-[#3FB8AF]" : "text-gray-600"}`} />
        )}
      </div>
    ))}
  </nav>
);

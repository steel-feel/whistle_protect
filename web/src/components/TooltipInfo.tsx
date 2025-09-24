
import React from "react";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipInfoProps {
  text: string;
  tooltip: string;
}

export const TooltipInfo: React.FC<TooltipInfoProps> = ({ text, tooltip }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <span className="relative inline-flex items-center">
          <span className="border-b border-dotted border-[#3FB8AF] cursor-help">{text}</span>
          <Info className="h-4 w-4 text-[#3FB8AF] opacity-75 cursor-help ml-1" />
        </span>
      </TooltipTrigger>
      <TooltipContent 
        className="max-w-xs bg-gray-800 text-white p-3 rounded-md shadow-lg border border-gray-700"
        side="top"
        sideOffset={5}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

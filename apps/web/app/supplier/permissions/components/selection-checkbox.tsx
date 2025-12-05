"use client";

import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { SelectionState } from "../types";

interface SelectionCheckboxProps {
  state: SelectionState;
  onClick: (e: React.MouseEvent) => void;
}

export function SelectionCheckbox({ state, onClick }: SelectionCheckboxProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-4 h-4 rounded border flex items-center justify-center transition-colors",
        state === "all" && "bg-teal-600 border-teal-600",
        state === "partial" && "bg-teal-600/50 border-teal-600",
        state === "none" && "border-slate-300 dark:border-slate-600 hover:border-teal-500"
      )}
    >
      {state === "all" && <Check size={12} className="text-white" />}
      {state === "partial" && <Minus size={12} className="text-white" />}
    </button>
  );
}

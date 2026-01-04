import type { PartConfig } from "@/types/part-config";
import { Package, TrendingUp, Clock, Sparkles } from "lucide-react";
import React from "react";

export interface Suggestion {
  id: string;
  type: "quantity" | "material" | "finish" | "leadtime";
  title: string;
  description: string;
  partId: string;
  partName: string;
  currentValue: string | number;
  suggestedValue: string | number;
  impact: {
    savings?: number;
    savingsPercentage?: number;
    leadTimeReduction?: number;
  };
  icon: React.ReactNode;
  color: "blue" | "purple" | "green" | "amber";
}

export function generateSuggestions(parts: PartConfig[]): Suggestion[] {
  const suggestions: Suggestion[] = [];

  parts.forEach((part) => {
    // Quantity optimization suggestion
    if (part.quantity === 10) {
      suggestions.push({
        id: `qty-${part.id}`,
        type: "quantity",
        title: "Volume Pricing Unlock",
        description: `Boosting to 15 units triggers a 12% price break on this specific geometry.`,
        partId: part.id,
        partName: part.fileName,
        currentValue: part.quantity,
        suggestedValue: 15,
        impact: {
          savings: 45.5,
          savingsPercentage: 12,
        },
        icon: React.createElement(Package, { className: "w-5 h-5" }),
        color: "blue",
      });
    }

    // Material suggestion
    if (part.material === "Aluminum 6061") {
      suggestions.push({
        id: `mat-${part.id}`,
        type: "material",
        title: "Material Substitution",
        description: `Aluminum 7075 offers superior tensile strength with minimal thermal variance.`,
        partId: part.id,
        partName: part.fileName,
        currentValue: part.material,
        suggestedValue: "Aluminum 7075",
        impact: {
          savings: -25.0,
          savingsPercentage: 8,
        },
        icon: React.createElement(TrendingUp, { className: "w-5 h-5" }),
        color: "purple",
      });
    }

    // Lead time optimization
    if (part.leadTimeType === "expedited") {
      suggestions.push({
        id: `lead-${part.id}`,
        type: "leadtime",
        title: "Consider Standard Lead Time",
        description: `Switching to standard lead time can save 35% on this part`,
        partId: part.id,
        partName: part.fileName,
        currentValue: "Expedited",
        suggestedValue: "Standard",
        impact: {
          savings: 120.0,
          savingsPercentage: 35,
          leadTimeReduction: -5,
        },
        icon: React.createElement(Clock, { className: "w-5 h-5" }),
        color: "green",
      });
    }

    // Finish optimization
    if (part.finish === "Anodizing") {
      suggestions.push({
        id: `finish-${part.id}`,
        type: "finish",
        title: "Cost-Effective Finish Option",
        description: `Powder coating provides similar protection at 20% lower cost`,
        partId: part.id,
        partName: part.fileName,
        currentValue: part.finish || "As Machined",
        suggestedValue: "Powder Coating",
        impact: {
          savings: 35.0,
          savingsPercentage: 20,
        },
        icon: React.createElement(Sparkles, { className: "w-5 h-5" }),
        color: "amber",
      });
    }
  });

  return suggestions;
}

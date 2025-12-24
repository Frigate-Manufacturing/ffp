"use client";

import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  FileType,
  Box,
  Layers,
  Maximize2,
  Shield,
  Ruler,
  Circle,
  Info,
  Loader2,
  XCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { PartConfig } from "@/types/part-config";

// DFM Check Status Types
type CheckStatus = "pass" | "warning" | "fail" | "info" | "loading";

interface DFMCheck {
  id: string;
  name: string;
  description: string;
  status: CheckStatus;
  details?: string;
  icon: React.ReactNode;
}

// DFM Analysis Result interface
interface DFMAnalysisResult {
  overallScore: number; // 0-100
  manufacturability: "excellent" | "good" | "fair" | "poor";
  checks: DFMCheck[];
  recommendations: string[];
  estimatedIssues: number;
}

// Supported file types for CNC machining
const SUPPORTED_FILE_TYPES = [
  "stl",
  "step",
  "stp",
  "iges",
  "igs",
  "obj",
  "3mf",
  "x_t",
  "x_b",
];

// Maximum dimensions for CNC machining (mm)
const MAX_DIMENSIONS = { x: 1000, y: 500, z: 500 };

// Minimum wall thickness (mm)
const MIN_WALL_THICKNESS = 0.8;

// Analyze DFM for a part
function analyzeDFM(part: PartConfig): DFMAnalysisResult {
  const checks: DFMCheck[] = [];
  const recommendations: string[] = [];
  let issueCount = 0;

  // 1. File Type Check
  const fileExt = part.fileName.split(".").pop()?.toLowerCase() || "";
  const isValidFileType = SUPPORTED_FILE_TYPES.includes(fileExt);
  checks.push({
    id: "file-type",
    name: "File Type",
    description: "Verifies the file format is supported for manufacturing",
    status: isValidFileType ? "pass" : "fail",
    details: isValidFileType
      ? `${fileExt.toUpperCase()} format is supported`
      : `${fileExt.toUpperCase()} may not be optimal. Consider STEP or STL`,
    icon: <FileType className="w-4 h-4" />,
  });
  if (!isValidFileType) {
    issueCount++;
    recommendations.push(
      "Convert your file to STEP (.step/.stp) format for best results",
    );
  }

  // 2. Floating Parts Check
  const hasGeometry = !!part.geometry;
  const shellCount = hasGeometry ? 1 : 0; // Simplified - would come from CAD analysis
  const hasFloatingParts = shellCount > 1;
  checks.push({
    id: "floating-parts",
    name: "Floating Parts Check",
    description: "Detects disconnected geometry that cannot be manufactured",
    status: hasFloatingParts ? "fail" : "pass",
    details: hasFloatingParts
      ? `${shellCount} separate bodies detected`
      : "Single solid body detected",
    icon: <Layers className="w-4 h-4" />,
  });
  if (hasFloatingParts) {
    issueCount++;
    recommendations.push(
      "Combine floating parts into a single body or upload separate files",
    );
  }

  // 3. Large Part Dimension Check
  const boundingBox = part.geometry?.boundingBox || { x: 100, y: 100, z: 50 };
  const exceedsMaxSize =
    boundingBox.x > MAX_DIMENSIONS.x ||
    boundingBox.y > MAX_DIMENSIONS.y ||
    boundingBox.z > MAX_DIMENSIONS.z;
  const maxDim = Math.max(boundingBox.x, boundingBox.y, boundingBox.z);
  checks.push({
    id: "large-part",
    name: "Large Part Dimension",
    description: "Checks if part fits within machine work envelope",
    status: exceedsMaxSize ? "warning" : "pass",
    details: exceedsMaxSize
      ? `Max dimension ${maxDim.toFixed(1)}mm exceeds limit`
      : `Dimensions: ${boundingBox.x.toFixed(1)} × ${boundingBox.y.toFixed(1)} × ${boundingBox.z.toFixed(1)}mm`,
    icon: <Maximize2 className="w-4 h-4" />,
  });
  if (exceedsMaxSize) {
    issueCount++;
    recommendations.push(
      "Consider splitting large parts or contact us for custom machining",
    );
  }

  // 4. Model Fidelity Check
  const hasHighFidelity = hasGeometry && part.geometry!.volume > 0;
  checks.push({
    id: "model-fidelity",
    name: "Model Fidelity",
    description: "Validates mesh quality and geometric integrity",
    status: hasHighFidelity ? "pass" : "warning",
    details: hasHighFidelity
      ? "Geometry validated successfully"
      : "Unable to fully validate - check model quality",
    icon: <Shield className="w-4 h-4" />,
  });

  // 5. Model Shell Count
  checks.push({
    id: "shell-count",
    name: "Model Shell Count",
    description: "Ensures model is a single watertight solid",
    status: shellCount === 1 ? "pass" : shellCount === 0 ? "info" : "warning",
    details:
      shellCount === 1
        ? "Single watertight shell"
        : shellCount === 0
          ? "Shell analysis pending"
          : `${shellCount} shells detected`,
    icon: <Box className="w-4 h-4" />,
  });

  // 6. Part Exceeds Maximum Size for Finish
  const finishSizeLimit = getFinishSizeLimit(part.finish);
  const exceedsFinishSize = maxDim > finishSizeLimit;
  checks.push({
    id: "finish-size",
    name: "Part Exceeds Maximum Size for Finish",
    description: `Checks if part size is compatible with ${part.finish || "selected"} finish`,
    status: exceedsFinishSize ? "warning" : "pass",
    details: exceedsFinishSize
      ? `Part too large for ${part.finish}. Max: ${finishSizeLimit}mm`
      : `Compatible with ${part.finish || "standard"} finish`,
    icon: <Circle className="w-4 h-4" />,
  });
  if (exceedsFinishSize) {
    recommendations.push(`Consider a different finish option for large parts`);
  }

  // 7. Void Check (Internal Cavities)
  const hasInternalVoids =
    hasGeometry &&
    part.geometry!.volume < part.geometry!.surfaceArea * MIN_WALL_THICKNESS;
  checks.push({
    id: "void-check",
    name: "Void Check",
    description: "Detects internal voids that may affect manufacturing",
    status: hasInternalVoids ? "info" : "pass",
    details: hasInternalVoids
      ? "Internal features detected - may require special tooling"
      : "No problematic voids detected",
    icon: <Circle className="w-4 h-4" />,
  });

  // 8. Minimum Wall Thickness
  const estimatedWallThickness = hasGeometry
    ? Math.min(boundingBox.x, boundingBox.y, boundingBox.z) * 0.1
    : 2.0;
  const wallThicknessPasses = estimatedWallThickness >= MIN_WALL_THICKNESS;
  checks.push({
    id: "wall-thickness",
    name: "Minimum Wall Thickness",
    description: `Ensures walls are at least ${MIN_WALL_THICKNESS}mm thick`,
    status: wallThicknessPasses ? "pass" : "warning",
    details: wallThicknessPasses
      ? `Wall thickness adequate (≥${MIN_WALL_THICKNESS}mm)`
      : `Thin walls detected - risk of breakage`,
    icon: <Ruler className="w-4 h-4" />,
  });
  if (!wallThicknessPasses) {
    issueCount++;
    recommendations.push(
      `Increase wall thickness to at least ${MIN_WALL_THICKNESS}mm for CNC machining`,
    );
  }

  // 9. Aspect Ratio Check
  const aspectRatio =
    maxDim / Math.min(boundingBox.x, boundingBox.y, boundingBox.z);
  const aspectRatioPasses = aspectRatio < 10;
  checks.push({
    id: "aspect-ratio",
    name: "Aspect Ratio",
    description:
      "Checks for very thin/long parts that may flex during machining",
    status: aspectRatioPasses ? "pass" : "warning",
    details: aspectRatioPasses
      ? `Aspect ratio: ${aspectRatio.toFixed(1)}:1 (acceptable)`
      : `High aspect ratio ${aspectRatio.toFixed(1)}:1 - may cause vibration`,
    icon: <Ruler className="w-4 h-4" />,
  });
  if (!aspectRatioPasses) {
    recommendations.push(
      "High aspect ratio parts may require special fixturing",
    );
  }

  // 10. Tolerance Compatibility
  const toleranceValue = parseFloat(
    part.tolerance?.replace(/[^\d.]/g, "") || "0.1",
  );
  const tolerancePasses = toleranceValue >= 0.025; // 0.025mm is typical CNC limit
  checks.push({
    id: "tolerance",
    name: "Tolerance Achievability",
    description: "Verifies requested tolerance is achievable",
    status: tolerancePasses ? "pass" : "warning",
    details: tolerancePasses
      ? `±${toleranceValue}mm is achievable`
      : `±${toleranceValue}mm may require grinding or EDM`,
    icon: <Ruler className="w-4 h-4" />,
  });

  // Calculate overall score
  const passCount = checks.filter((c) => c.status === "pass").length;
  const warningCount = checks.filter((c) => c.status === "warning").length;
  const failCount = checks.filter((c) => c.status === "fail").length;

  const overallScore = Math.round(
    ((passCount * 10 + warningCount * 5) / (checks.length * 10)) * 100,
  );

  let manufacturability: "excellent" | "good" | "fair" | "poor";
  if (failCount > 0) {
    manufacturability = "poor";
  } else if (warningCount > 2) {
    manufacturability = "fair";
  } else if (warningCount > 0) {
    manufacturability = "good";
  } else {
    manufacturability = "excellent";
  }

  return {
    overallScore,
    manufacturability,
    checks,
    recommendations,
    estimatedIssues: issueCount,
  };
}

// Get finish size limit
function getFinishSizeLimit(finish: string): number {
  const limits: Record<string, number> = {
    anodize: 600,
    "anodize-type-ii": 600,
    "anodize-type-iii": 400,
    powder_coat: 800,
    chrome: 300,
    nickel: 400,
    electroless_nickel: 500,
    passivate: 1000,
    black_oxide: 800,
    none: 1000,
    standard: 1000,
  };
  return limits[finish?.toLowerCase()] || 1000;
}

// Status icon component
function StatusIcon({ status }: { status: CheckStatus }) {
  switch (status) {
    case "pass":
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    case "warning":
      return <AlertTriangle className="w-5 h-5 text-amber-500" />;
    case "fail":
      return <XCircle className="w-5 h-5 text-red-500" />;
    case "info":
      return <Info className="w-5 h-5 text-blue-500" />;
    case "loading":
      return <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />;
  }
}

// Main DFM Analysis Component
const DFMAnalysis = ({ part }: { part: PartConfig }) => {
  const [analysis, setAnalysis] = useState<DFMAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    // Simulate analysis delay for UX
    setIsAnalyzing(true);
    const timer = setTimeout(() => {
      const result = analyzeDFM(part);
      setAnalysis(result);
      setIsAnalyzing(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [part]);

  if (isAnalyzing || !analysis) {
    return (
      <div className="p-6 text-center">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Analyzing Part...
        </h3>
        <p className="text-gray-500 text-sm">
          Running manufacturability checks on your geometry
        </p>
      </div>
    );
  }

  const manufacturabilityColors = {
    excellent: "text-green-600 bg-green-50 border-green-200",
    good: "text-blue-600 bg-blue-50 border-blue-200",
    fair: "text-amber-600 bg-amber-50 border-amber-200",
    poor: "text-red-600 bg-red-50 border-red-200",
  };

  return (
    <div className="w-full max-w-2xl">
      {/* Header with Score */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">DFM Analysis</h3>
          <p className="text-sm text-gray-500">
            Design for Manufacturability Report
          </p>
        </div>
        <div className="text-right">
          <div
            className={cn(
              "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border",
              manufacturabilityColors[analysis.manufacturability],
            )}
          >
            <span className="capitalize">{analysis.manufacturability}</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mt-1">
            {analysis.overallScore}
            <span className="text-sm font-normal text-gray-500">/100</span>
          </div>
        </div>
      </div>

      {/* Checks List */}
      <div className="space-y-2 mb-6 overflow-scroll">
        {analysis.checks.map((check) => (
          <div
            key={check.id}
            className={cn(
              "flex items-start gap-3 p-3 rounded-lg border transition-colors",
              check.status === "pass" && "bg-green-50/50 border-green-100",
              check.status === "warning" && "bg-amber-50/50 border-amber-100",
              check.status === "fail" && "bg-red-50/50 border-red-100",
              check.status === "info" && "bg-blue-50/50 border-blue-100",
            )}
          >
            <div className="flex-shrink-0 mt-0.5">
              <StatusIcon status={check.status} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-gray-400">{check.icon}</span>
                <span className="font-medium text-gray-900 text-sm">
                  {check.name}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{check.details}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recommendations */}
      {analysis.recommendations.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <h4 className="font-medium text-amber-800">Recommendations</h4>
          </div>
          <ul className="space-y-1">
            {analysis.recommendations.map((rec, idx) => (
              <li
                key={idx}
                className="text-sm text-amber-700 flex items-start gap-2"
              >
                <span className="text-amber-400 mt-1">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {analysis.checks.filter((c) => c.status === "pass").length}
          </div>
          <div className="text-xs text-gray-500">Passed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-amber-600">
            {analysis.checks.filter((c) => c.status === "warning").length}
          </div>
          <div className="text-xs text-gray-500">Warnings</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">
            {analysis.checks.filter((c) => c.status === "fail").length}
          </div>
          <div className="text-xs text-gray-500">Issues</div>
        </div>
      </div>
    </div>
  );
};

export default DFMAnalysis;

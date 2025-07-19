import { cn } from "@/lib/utils";

interface RiskTagProps {
  risk: number; // 0-1
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function RiskTag({ risk, className, size = "md" }: RiskTagProps) {
  const getRiskLabel = (risk: number) => {
    if (risk <= 0.33) return "Low";
    if (risk <= 0.66) return "Med";
    return "High";
  };

  const getRiskVariant = (risk: number) => {
    if (risk <= 0.33) return "score-high";
    if (risk <= 0.66) return "score-medium";
    return "score-low";
  };

  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        getRiskVariant(risk),
        sizeClasses[size],
        className
      )}
    >
      {getRiskLabel(risk)} Risk
    </div>
  );
}
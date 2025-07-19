import { cn } from "@/lib/utils";

interface ScoreBadgeProps {
  value: number; // 0-100
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ScoreBadge({ value, className, size = "md" }: ScoreBadgeProps) {
  const getScoreVariant = (score: number) => {
    if (score >= 75) return "score-high";
    if (score >= 50) return "score-medium";
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
        getScoreVariant(value),
        sizeClasses[size],
        className
      )}
    >
      {Math.round(value)}%
    </div>
  );
}
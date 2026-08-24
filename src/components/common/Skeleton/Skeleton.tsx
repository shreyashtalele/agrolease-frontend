import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
  count?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = "",
  variant = "text",
  width,
  height,
  count = 1,
}) => {
  const baseClasses = `
    bg-neutral-200 animate-pulse rounded
    ${variant === "circular" ? "rounded-full" : ""}
    ${variant === "text" ? "rounded-md" : ""}
    ${variant === "rectangular" ? "rounded-lg" : ""}
    ${className}
  `
    .replace(/\s+/g, " ")
    .trim();

  const style = {
    width: width || (variant === "text" ? "100%" : undefined),
    height: height || (variant === "text" ? "1rem" : undefined),
  };

  if (count > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className={baseClasses} style={style} />
        ))}
      </div>
    );
  }

  return <div className={baseClasses} style={style} />;
};

export const SkeletonCard: React.FC<{ count?: number }> = ({ count = 1 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-neutral-100 p-4 shadow-sm"
        >
          <Skeleton height="180px" variant="rectangular" className="mb-4" />
          <Skeleton width="60%" height="20px" className="mb-2" />
          <Skeleton width="40%" height="16px" className="mb-1" />
          <Skeleton width="30%" height="24px" className="mt-2" />
        </div>
      ))}
    </div>
  );
};

export const SkeletonText: React.FC<{ lines?: number }> = ({ lines = 3 }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? "70%" : "100%"}
          height="16px"
        />
      ))}
    </div>
  );
};

export const SkeletonAvatar: React.FC<{ size?: string }> = ({
  size = "w-12 h-12",
}) => {
  return (
    <Skeleton variant="circular" width="48px" height="48px" className={size} />
  );
};

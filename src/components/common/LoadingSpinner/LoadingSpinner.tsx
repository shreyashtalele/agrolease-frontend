import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className = "",
}) => {
  const sizeClasses = {
    sm: "spinner-sm",
    md: "",
    lg: "spinner-lg",
  };

  return (
    <div
      className={`
        spinner
        ${sizeClasses[size]}
        ${className}
      `
        .replace(/\s+/g, " ")
        .trim()}
      aria-label="Loading"
    />
  );
};

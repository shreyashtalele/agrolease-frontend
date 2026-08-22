import React, { useEffect } from "react";

interface ToastProps {
  type: "success" | "error" | "info" | "warning";
  message: string;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  type = "info",
  message,
  onClose,
  duration = 5000,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const variants = {
    success: {
      border: "border-success-500",
      icon: "✅",
    },
    error: {
      border: "border-error-500",
      icon: "❌",
    },
    info: {
      border: "border-info-500",
      icon: "ℹ️",
    },
    warning: {
      border: "border-warning-500",
      icon: "⚠️",
    },
  };

  const variant = variants[type];

  return (
    <div
      className={`
        rounded-lg shadow-lg border border-neutral-200
        p-4 flex items-start gap-3
        border-l-4 ${variant.border} bg-white
        animate-slide-in
        min-w-[300px] max-w-sm
      `}
      role="alert"
    >
      <span className="text-lg" aria-hidden="true">
        {variant.icon}
      </span>
      <div className="flex-1">
        <div className="text-sm font-medium text-neutral-800 capitalize">
          {type}
        </div>
        <div className="text-sm text-neutral-500">{message}</div>
      </div>
      <button
        onClick={onClose}
        className="text-neutral-400 hover:text-neutral-600 transition-colors flex-shrink-0"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
};

import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = "md",
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  return (
    <div
      className="fixed inset-0 bg-neutral-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className={`
          bg-white rounded-2xl shadow-2xl w-full
          max-h-[90vh] overflow-y-auto animate-fade-in
          ${maxWidthClasses[maxWidth]}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="px-6 md:px-8 pt-6 md:pt-8 pb-4 border-b border-neutral-100 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-neutral-800">{title}</h2>
            <button
              className="text-neutral-400 hover:text-neutral-600 transition-colors text-xl"
              onClick={onClose}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        )}

        <div className="px-6 md:px-8 py-6">{children}</div>

        {footer && (
          <div className="px-6 md:px-8 py-4 border-t border-neutral-100 flex flex-col sm:flex-row gap-3 bg-neutral-50 rounded-b-2xl">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

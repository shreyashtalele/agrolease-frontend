import React, { useState } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helper?: string;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helper,
  type = "text",
  required = false,
  disabled = false,
  className = "",
  onChange,
  onBlur,
  value,
  placeholder,
  id,
  name,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  const inputId =
    id || name || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = `${inputId}-error`;
  const helperId = `${inputId}-helper`;

  const inputClasses = `
    w-full px-4 py-2.5
    border rounded-md
    bg-white text-neutral-800
    placeholder:text-neutral-400
    transition-all duration-200
    focus:outline-none
    disabled:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-60
    ${error ? "border-error-500 ring-2 ring-error-100" : "border-neutral-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"}
    ${!error && value ? "border-primary-300 bg-neutral-50" : ""}
    ${className}
  `
    .replace(/\s+/g, " ")
    .trim();

  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium uppercase tracking-wider text-neutral-500"
        >
          {label}
          {required && <span className="text-error-500 ml-0.5">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          id={inputId}
          name={name}
          type={inputType}
          className={inputClasses}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          required={required}
          aria-required={required}
          aria-invalid={!!error}
          aria-describedby={
            [error && errorId, helper && helperId].filter(Boolean).join(" ") ||
            undefined
          }
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        )}
      </div>

      {error && (
        <p
          id={errorId}
          className="text-sm text-error-600 flex items-center gap-1"
        >
          <span aria-hidden="true">⚠️</span>
          {error}
        </p>
      )}

      {helper && !error && (
        <p id={helperId} className="text-sm text-neutral-500">
          {helper}
        </p>
      )}
    </div>
  );
};

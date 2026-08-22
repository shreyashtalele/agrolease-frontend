import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "interactive" | "selected" | "elevated";
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> & {
  Image: React.FC<CardImageProps>;
  Header: React.FC<CardHeaderProps>;
  Body: React.FC<CardBodyProps>;
  Footer: React.FC<CardFooterProps>;
} = ({ variant = "default", children, className = "", onClick, ...props }) => {
  const baseClasses = `
    bg-white rounded-xl
    border border-neutral-100
    overflow-hidden
    transition-all duration-200
  `;

  const variantClasses = {
    default: "shadow-sm",
    interactive: `
      shadow-sm cursor-pointer
      hover:shadow-md hover:-translate-y-1 hover:border-primary-200
      active:scale-98
    `,
    selected: `
      shadow-md border-2 border-primary-500 bg-primary-50
    `,
    elevated: "shadow-lg",
  };

  const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${className}
  `
    .replace(/\s+/g, " ")
    .trim();

  return (
    <div
      className={combinedClasses}
      onClick={onClick}
      role={variant === "interactive" ? "button" : undefined}
      tabIndex={variant === "interactive" ? 0 : undefined}
      onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
        if (variant === "interactive" && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick?.(e as any);
        }
      }}
      {...props}
    >
      {children}
    </div>
  );
};

interface CardImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  children?: React.ReactNode;
}

const CardImage: React.FC<CardImageProps> = ({
  src,
  alt,
  className = "",
  children,
  ...props
}) => (
  <div className="relative w-full aspect-video bg-neutral-200 overflow-hidden">
    {src ? (
      <img
        src={src}
        alt={alt || "Card image"}
        className={`w-full h-full object-cover ${className}`}
        {...props}
      />
    ) : (
      <div className="w-full h-full flex items-center justify-center text-4xl text-neutral-400">
        {children || "🖼️"}
      </div>
    )}
  </div>
);

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = "",
  ...props
}) => (
  <div
    className={`px-4 md:px-6 pt-4 md:pt-6 pb-2 border-b border-neutral-100 ${className}`}
    {...props}
  >
    {children}
  </div>
);

interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardBody: React.FC<CardBodyProps> = ({
  children,
  className = "",
  ...props
}) => (
  <div className={`px-4 md:px-6 py-4 md:py-6 ${className}`} {...props}>
    {children}
  </div>
);

interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = "",
  ...props
}) => (
  <div
    className={`px-4 md:px-6 py-3 md:py-4 border-t border-neutral-100 bg-neutral-50 ${className}`}
    {...props}
  >
    {children}
  </div>
);

// Attach sub-components to Card
Card.Image = CardImage;
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

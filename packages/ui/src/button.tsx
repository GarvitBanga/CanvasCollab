"use client";

import { ReactNode } from "react";

interface ButtonProps {
  variant: "primary" | "outline" | "secondary"|"ghost";
  size: "lg" | "md" | "sm";
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
}

export const Button = ({
  variant,
  size,
  children,
  className = "",
  onClick,
  type = "button",
}: ButtonProps) => {
  const base ="inline-flex items-center gap-2 flex-nowrap justify-center font-medium rounded-2xl shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    outline:
      "border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground",
    ghost:"bg-transparent text-muted hover:bg-accent"
  };
  const sizes = {
    sm: "px-3 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      type={type}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
    >
      <span className="flex items-center gap-2">
      {children}
    </span>
    </button>
  );
};
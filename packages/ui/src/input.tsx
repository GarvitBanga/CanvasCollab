import { ChangeEvent } from "react";

interface InputProps {
  type: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export function Input({
  type,
  placeholder,
  value,
  onChange,
  className = "",
}: InputProps) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full px-4 py-2 rounded-2xl border border-input bg-background text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
    />
  );
}
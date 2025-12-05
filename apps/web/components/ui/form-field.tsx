"use client";

import { forwardRef, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ label, error, required, hint, children, className }: FormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label}
        {required && <span className="text-neutral-400 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
      {hint && !error && <p className="text-xs text-neutral-400">{hint}</p>}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ error, className, disabled, ...props }, ref) => (
  <input
    ref={ref}
    disabled={disabled}
    className={cn(
      "w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100",
      "placeholder:text-neutral-400 dark:placeholder:text-neutral-500",
      "transition-all duration-150 outline-none",
      "focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10",
      disabled && "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 cursor-not-allowed",
      error
        ? "border-red-400 dark:border-red-600 focus:border-red-500"
        : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 focus:border-neutral-900 dark:focus:border-white",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  value: string;
  onChange: (e: { target: { value: string } }) => void;
  options: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

export function Select({ value, onChange, options, placeholder, disabled, error, className }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onChange({ target: { value: optionValue } });
    setIsOpen(false);
  };

  const dropdown = isOpen && !disabled && typeof document !== "undefined" ? createPortal(
    <div
      ref={dropdownRef}
      className="fixed py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-xl"
      style={{
        top: dropdownPosition.top,
        left: dropdownPosition.left,
        width: dropdownPosition.width,
        zIndex: 9999,
      }}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => handleSelect(option.value)}
          className={cn(
            "w-full px-4 py-2.5 text-left text-sm flex items-center justify-between gap-2",
            "transition-colors duration-100",
            option.value === value
              ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white"
              : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
          )}
        >
          <span>{option.label}</span>
          {option.value === value && (
            <Check size={14} className="text-neutral-900 dark:text-white" />
          )}
        </button>
      ))}
    </div>,
    document.body
  ) : null;

  return (
    <div className={cn("relative", className)}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-neutral-900 text-left",
          "transition-all duration-150 outline-none",
          "focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10",
          "flex items-center justify-between gap-2",
          disabled && "bg-neutral-100 dark:bg-neutral-800 cursor-not-allowed",
          error
            ? "border-red-400 dark:border-red-600"
            : isOpen
              ? "border-neutral-900 dark:border-white ring-2 ring-neutral-900/10 dark:ring-white/10"
              : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600"
        )}
      >
        <span
          className={cn(
            "truncate",
            selectedOption
              ? disabled
                ? "text-neutral-500"
                : "text-neutral-900 dark:text-neutral-100"
              : "text-neutral-400 dark:text-neutral-500"
          )}
        >
          {selectedOption?.label || placeholder || "Select..."}
        </span>
        <ChevronDown
          size={16}
          className={cn(
            "flex-shrink-0 transition-transform duration-200",
            disabled ? "text-neutral-400" : "text-neutral-500",
            isOpen && "rotate-180"
          )}
        />
      </button>
      {dropdown}
    </div>
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ error, className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full px-4 py-2.5 rounded-lg border bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100",
      "placeholder:text-neutral-400 dark:placeholder:text-neutral-500 resize-none",
      "transition-all duration-150 outline-none",
      "focus:ring-2 focus:ring-neutral-900/10 dark:focus:ring-white/10",
      error
        ? "border-red-400 dark:border-red-600 focus:border-red-500"
        : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 focus:border-neutral-900 dark:focus:border-white",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

interface RadioGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

export function RadioGroup({ name, value, onChange, options }: RadioGroupProps) {
  return (
    <div className="flex gap-3">
      {options.map((opt) => (
        <label
          key={opt.value}
          className={cn(
            "flex items-center gap-2.5 px-4 py-2.5 rounded-lg border cursor-pointer transition-all",
            value === opt.value
              ? "border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white"
              : "border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 bg-white dark:bg-neutral-900"
          )}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="sr-only"
          />
          <div
            className={cn(
              "w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors",
              value === opt.value
                ? "border-white dark:border-neutral-900"
                : "border-neutral-300 dark:border-neutral-600"
            )}
          >
            {value === opt.value && (
              <div className="w-2 h-2 rounded-full bg-white dark:bg-neutral-900" />
            )}
          </div>
          <span
            className={cn(
              "text-sm font-medium",
              value === opt.value
                ? "text-white dark:text-neutral-900"
                : "text-neutral-600 dark:text-neutral-400"
            )}
          >
            {opt.label}
          </span>
        </label>
      ))}
    </div>
  );
}

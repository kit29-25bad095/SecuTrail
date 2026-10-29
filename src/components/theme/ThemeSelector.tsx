"use client";

import * as React from "react";
import { Sun, Moon, Laptop, Check } from "lucide-react";
import { useTheme, Theme } from "./ThemeProvider";
import { cn } from "@/lib/utils";

interface ThemeSelectorProps {
  className?: string;
  variant?: "dropdown" | "pills";
}

export function ThemeSelector({ className, variant = "dropdown" }: ThemeSelectorProps) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close dropdown on Escape
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const options: { id: Theme; label: string; sublabel: string; icon: React.ElementType }[] = [
    {
      id: "light",
      label: "Light",
      sublabel: "Lavender Serenity",
      icon: Sun,
    },
    {
      id: "dark",
      label: "Dark",
      sublabel: "Midnight & Ice",
      icon: Moon,
    },
    {
      id: "system",
      label: "System",
      sublabel: "Follow OS preference",
      icon: Laptop,
    },
  ];

  if (variant === "pills") {
    return (
      <div
        role="radiogroup"
        aria-label="Theme preference"
        className={cn(
          "inline-flex items-center gap-1 p-1 rounded-xl bg-muted/60 border border-border text-xs select-none",
          className
        )}
      >
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = theme === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => setTheme(opt.id)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer",
                isSelected
                  ? "bg-card text-foreground font-semibold shadow-xs border border-border/80"
                  : "text-muted-foreground hover:text-foreground hover:bg-card/50"
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Dropdown style
  const CurrentIcon = resolvedTheme === "dark" ? Moon : Sun;

  return (
    <div ref={dropdownRef} className={cn("relative inline-block text-left", className)}>
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`Theme: currently ${theme}. Click to change theme`}
        title={`Theme: currently ${theme} (${resolvedTheme === "dark" ? "Midnight & Ice" : "Lavender Serenity"})`}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors cursor-pointer shadow-2xs"
      >
        <CurrentIcon className="h-4 w-4 shrink-0 transition-transform duration-200" />
      </button>

      {isOpen && (
        <div
          role="menu"
          aria-label="Theme options"
          className="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-card p-1.5 shadow-lg z-50 text-xs animate-in fade-in-50 zoom-in-95 duration-150"
        >
          <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/60 mb-1">
            Display Theme
          </div>

          {options.map((opt) => {
            const Icon = opt.icon;
            const isSelected = theme === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="menuitemradio"
                aria-checked={isSelected}
                onClick={() => {
                  setTheme(opt.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left font-medium transition-colors cursor-pointer",
                  isSelected
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "text-foreground hover:bg-muted"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <div>
                    <div className="leading-tight">{opt.label}</div>
                    <div
                      className={cn(
                        "text-[10px] leading-tight mt-0.5",
                        isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                      )}
                    >
                      {opt.sublabel}
                    </div>
                  </div>
                </div>

                {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-full bg-muted animate-pulse-soft" />
    );
  }

  const cycleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const icon =
    theme === "dark" ? (
      <Moon className="w-4 h-4" />
    ) : theme === "light" ? (
      <Sun className="w-4 h-4" />
    ) : (
      <Monitor className="w-4 h-4" />
    );

  if (compact) {
    return (
      <button
        onClick={cycleTheme}
        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
        aria-label="Toggle theme"
      >
        {icon}
      </button>
    );
  }

  return (
    <div className="flex items-center gap-1 bg-muted rounded-full p-1">
      {(["light", "dark", "system"] as const).map((t) => (
        <button
          key={t}
          onClick={() => setTheme(t)}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
            theme === t
              ? "bg-surface shadow-sm text-accent"
              : "text-muted-foreground hover:text-foreground"
          }`}
          aria-label={`Set ${t} theme`}
        >
          {t === "light" ? (
            <Sun className="w-3.5 h-3.5" />
          ) : t === "dark" ? (
            <Moon className="w-3.5 h-3.5" />
          ) : (
            <Monitor className="w-3.5 h-3.5" />
          )}
        </button>
      ))}
    </div>
  );
}

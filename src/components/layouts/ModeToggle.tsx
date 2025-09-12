"use client";

import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { cn } from "~/lib/utils";

const KEY = "theme";
type Mode = "light" | "dark";

function applyThemeClass(next: Mode) {
  // <html>
  const html = document.documentElement;
  html.classList.remove("light", "dark");
  html.classList.add(next);
  // <body>
  const body = document.body;
  if (body) {
    body.classList.remove("light", "dark");
    body.classList.add(next);
  }
}

export function ThemeToggle({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<Mode>("light");

  useEffect(() => {
    setMounted(true);
    try {
      const saved = (localStorage.getItem(KEY) as Mode | null) ?? null;
      let initial: Mode = "light";
      if (saved === "light" || saved === "dark") {
        initial = saved;
      } else if (window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
        initial = "dark";
      }
      setMode(initial);
      applyThemeClass(initial);
    } catch {}
  }, []);

  const toggle = () => {
    const next: Mode = mode === "dark" ? "light" : "dark";
    setMode(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {}
    applyThemeClass(next);
  };

  // Render trung tính trước khi mounted để tránh sai khác SSR/CSR
  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className={cn("rounded-full", className)}
        aria-label="Toggle theme"
        disabled
      >
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  const isDark = mode === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("rounded-full relative", className)}
      aria-label={isDark ? "Switch to light" : "Switch to dark"}
      onClick={toggle}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      <Sun
        className={cn(
          "h-5 w-5 transition duration-200",
          isDark ? "opacity-0 scale-75" : "opacity-100 scale-100"
        )}
      />
      <Moon
        className={cn(
          "absolute h-5 w-5 transition duration-200",
          isDark ? "opacity-100 scale-100" : "opacity-0 scale-75"
        )}
      />
    </Button>
  );
}

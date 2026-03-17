"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

export function ThemeShortcut() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Shortcut: Alt + T or Ctrl + Shift + T
      if ((e.altKey && e.key.toLowerCase() === "t") || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "t")) {
        e.preventDefault();
        const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
        setTheme(nextTheme);
        
        toast.info(`Theme switched to ${nextTheme}`, {
            icon: nextTheme === "dark" ? "🌙" : "☀️",
            duration: 1500,
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setTheme, resolvedTheme]);

  return null;
}

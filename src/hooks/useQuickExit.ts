"use client";

import { useEffect, useRef, useCallback } from "react";
import { performQuickExit } from "@/services/safety/quickExit";

export interface UseQuickExitOptions {
  windowMs?: number; // Time window for double ESC detection (default: 1000ms)
  onExit?: () => void;
}

/**
 * useQuickExit Hook
 *
 * Listens for global double-Escape keypress within a 1-second threshold.
 * - Single ESC: Does nothing.
 * - Double ESC within windowMs: Immediately triggers non-blocking Quick Exit.
 */
export function useQuickExit(options?: UseQuickExitOptions) {
  const windowMs = options?.windowMs ?? 1000;
  const lastEscPressTimeRef = useRef<number>(0);

  const exit = useCallback(() => {
    if (options?.onExit) {
      options.onExit();
    }
    performQuickExit();
  }, [options]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const now = Date.now();
        const timeDiff = now - lastEscPressTimeRef.current;

        // If double ESC is pressed within the threshold (e.g. 1000ms)
        if (lastEscPressTimeRef.current > 0 && timeDiff > 0 && timeDiff <= windowMs) {
          e.preventDefault();
          lastEscPressTimeRef.current = 0; // Reset
          exit();
        } else {
          // First ESC press: Record timestamp and do nothing
          lastEscPressTimeRef.current = now;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [exit, windowMs]);

  return { exit };
}

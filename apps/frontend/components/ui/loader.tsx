"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LoaderProps {
  isLoading?: boolean;
  onLoadingComplete?: () => void;
  timeout?: number;
}

export function Loader({
  isLoading = false,
  onLoadingComplete,
  timeout = 2000,
}: LoaderProps) {
  const [visible, setVisible] = useState(isLoading);
  const [dots, setDots] = useState("...");

  useEffect(() => {
    if (isLoading) {
      setVisible(true);

      const dotsInterval = setInterval(() => {
        setDots((prev) => {
          if (prev === "...") return ".";
          if (prev === ".") return "..";
          return "...";
        });
      }, 500);

      return () => clearInterval(dotsInterval);
    } else if (visible) {
      const timer = setTimeout(() => {
        setVisible(false);
        onLoadingComplete?.();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isLoading, visible, onLoadingComplete]);

  useEffect(() => {
    if (isLoading && timeout > 0) {
      const timer = setTimeout(() => {
        setVisible(false);
        onLoadingComplete?.();
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [isLoading, timeout, onLoadingComplete]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center transition-all duration-500",
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="absolute inset-0 bg-black/95"></div>

      <div className="flex flex-col items-center justify-center z-10">
        <div className="mb-8">
          <Image
            src="/Primary Logo_Primary Color.svg"
            alt="Tatami Logo"
            width={140}
            height={140}
            priority
          />
        </div>

        <div className="flex items-center space-x-1 mt-2">
          <p className="text-white text-lg  tracking-widest">Loading{dots}</p>
        </div>
      </div>
    </div>
  );
}

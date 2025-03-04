import React from "react";
import { cn } from "@/lib/utils";

interface CustomScrollProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function CustomScroll({ children, className, ...props }: CustomScrollProps) {
  return (
    <div
      className={cn(
        "scrollbar-thin scrollbar-thumb-yellow-500 scrollbar-track-transparent overflow-y-auto",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
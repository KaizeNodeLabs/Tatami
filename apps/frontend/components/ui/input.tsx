import { cn } from "@/lib/utils";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

const inputVariants = cva(
  "flex w-full text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "rounded-md border border-input shadow-sm focus-visible:ring-1 focus-visible:ring-ring",
        ghost: "border-none shadow-none",
        inline: "border-none bg-muted/50",
        footer: `
          bg-transparent border-0 border-b border-white/40 rounded-none px-0 text-lg 
          text-white placeholder:text-white focus:border-white hover:border-white/60
          [&:-webkit-autofill]:bg-transparent
          [&:-webkit-autofill]:text-white
          [&:-webkit-autofill]:[-webkit-text-fill-color:white]
          [&:-webkit-autofill]:[-webkit-box-shadow:0_0_0px_1000px_#000_inset]
          [&:autofill]:bg-transparent
          [&:autofill]:text-white
          [&:autofill]:[box-shadow:0_0_0px_1000px_#000_inset]
        `,
      },
      size: {
        default: "h-9 px-3 py-1",
        sm: "h-8 px-2 text-xs",
        lg: "h-10 px-4",
        xl: "h-12 px-0 text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <input
        className={cn(inputVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input, inputVariants };

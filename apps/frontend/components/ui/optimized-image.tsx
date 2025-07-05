"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends Omit<ImageProps, "onLoad" | "onError"> {
  fallbackSrc?: string;
  showLoader?: boolean;
  loaderClassName?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  fallbackSrc,
  showLoader = true,
  loaderClassName,
  className,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
      setIsLoading(true);
    }
  };

  return (
    <div className="relative">
      {isLoading && showLoader && (
        <div
          className={cn(
            "absolute inset-0 bg-gray-200 animate-pulse rounded",
            loaderClassName
          )}
        />
      )}
      <Image
        src={currentSrc}
        alt={alt}
        className={cn(
          className,
          isLoading ? "opacity-0" : "opacity-100",
          "transition-opacity duration-300"
        )}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
      />
      {hasError && !fallbackSrc && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
          Failed to load image
        </div>
      )}
    </div>
  );
};

"use client";

import { cn } from "@/lib/utils";
import { useState, forwardRef } from "react";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  alt?: string;
  fallback: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, fallback, size = "md", ...props }, ref) => {
    const [imgError, setImgError] = useState(false);
    const showImage = src && !imgError;

    const initials = fallback
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const sizes: Record<string, string> = {
      xs: "h-6 w-6 text-[10px]",
      sm: "h-8 w-8 text-caption",
      md: "h-10 w-10 text-body-sm",
      lg: "h-12 w-12 text-body",
      xl: "h-16 w-16 text-h4",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary-muted font-display font-semibold text-primary select-none",
          sizes[size],
          className
        )}
        {...props}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt || fallback}
            onError={() => setImgError(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span aria-label={fallback}>{initials}</span>
        )}
      </div>
    );
  }
);
Avatar.displayName = "Avatar";

export { Avatar };

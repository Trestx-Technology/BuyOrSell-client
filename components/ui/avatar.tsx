"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const AvatarContext = React.createContext<{
  imageError: boolean;
  setImageError: (error: boolean) => void;
}>({
  imageError: false,
  setImageError: () => {},
});

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, ...props }, ref) => {
    const [imageError, setImageError] = React.useState(false);

    return (
      <AvatarContext.Provider value={{ imageError, setImageError }}>
        <div
          ref={ref}
          className={cn(
            "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
            className
          )}
          {...props}
        />
      </AvatarContext.Provider>
    );
  }
);
Avatar.displayName = "Avatar";

interface AvatarImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  src?: string;
  alt?: string;
  className?: string;
}

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ src, alt, className, ...props }, ref) => {
    const { imageError, setImageError } = React.useContext(AvatarContext);

    React.useEffect(() => {
      if (!src) {
        setImageError(true);
      } else {
        setImageError(false);
      }
    }, [src, setImageError]);

    if (!src || imageError) return null;

    return (
      <img
        ref={ref}
        src={src}
        alt={alt || "Avatar"}
        className={cn(
          "absolute inset-0 aspect-square h-full w-full object-cover",
          className
        )}
        onError={() => setImageError(true)}
        {...props}
      />
    );
  }
);
AvatarImage.displayName = "AvatarImage";

interface AvatarFallbackProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const AvatarFallback = React.forwardRef<HTMLDivElement, AvatarFallbackProps>(
  ({ className, ...props }, ref) => {
    const { imageError } = React.useContext(AvatarContext);

    return (
      <div
        ref={ref}
        className={cn(
          "absolute inset-0 flex h-full w-full items-center justify-center rounded-full bg-muted",
          imageError ? "z-10" : "z-0",
          className
        )}
        {...props}
      />
    );
  }
);
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };

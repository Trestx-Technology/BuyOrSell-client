import React, { useState } from "react";
import Image, { ImageProps } from "next/image";
import { ImageOff } from "lucide-react";
import { BASE64 } from "@/constants/base64";
import { cn } from "@/lib/utils";

interface SafeImageProps extends Omit<ImageProps, "onError"> {
  fallbackClassName?: string;
  iconClassName?: string;
}

export const SafeImage = ({
  src,
  alt,
  className,
  fallbackClassName,
  iconClassName,
  placeholder = "blur",
  blurDataURL = BASE64,
  ...props
}: SafeImageProps) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={cn(
          "w-full h-full bg-gray-100 flex items-center justify-center",
          fallbackClassName
        )}
      >
        <ImageOff className={cn("text-gray-300 w-10 h-10", iconClassName)} />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      className={className}
      placeholder={placeholder}
      blurDataURL={blurDataURL}
      onError={() => setHasError(true)}
      {...props}
    />
  );
};

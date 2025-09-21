"use client";

import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,

  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DrawerWrapperProps {
  children: React.ReactNode;
  direction?: "top" | "bottom" | "left" | "right";
  className?: string;
  contentClassName?: string;
  trigger?: React.ReactNode;
  onClose?: () => void;
  title?: string;
  showCloseButton?: boolean;
  showBackButton?: boolean;
}

const DrawerWrapper: React.FC<DrawerWrapperProps> = ({
  children,
  direction = "bottom",
  className,
  contentClassName,
  trigger,
  onClose,
  title,
  showCloseButton = true,
  showBackButton = false,
}) => {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  return (
    <Drawer direction={direction} open={open} onOpenChange={setOpen}>
      <DrawerTrigger className={className}>{trigger}</DrawerTrigger>

      <DrawerContent className={cn(contentClassName)}>
        {/* Content Section */}
        {title && (
          <DrawerHeader className="-mb-4">
            <div className="flex justify-between">
              <DrawerTitle className="flex items-center gap-2">
                {showBackButton && (
                  <Button
                    icon={<ChevronLeft className="h-4 w-4" />}
                    onClick={handleClose}
                    variant="ghost"
                    size={"icon"}
                    iconPosition="center"
                  />
                )}
                {title}
              </DrawerTitle>
              {showCloseButton && (
                <Button
                  icon={<X className="h-4 w-4" />}
                  onClick={handleClose}
                  variant="ghost"
                  size={"icon"}
                  iconPosition="center"
                />
              )}
            </div>
          </DrawerHeader>
        )}

        <div className="flex-1 overflow-y-auto">{children}</div>
      </DrawerContent>
    </Drawer>
  );
};

export default DrawerWrapper;

"use client";

import * as React from "react";
import { useMediaQuery } from "usehooks-ts";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

interface ResponsiveDialogDrawerProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
  title?: string;
  description?: string;
  children: React.ReactNode;
  dialogContentClassName?: string;
  drawerContentClassName?: string;
  mobileBreakpoint?: number;
}

export function ResponsiveDialogDrawer({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  trigger,
  title,
  description,
  children,
  dialogContentClassName,
  drawerContentClassName,
  mobileBreakpoint = 650,
}: ResponsiveDialogDrawerProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isMobile = useMediaQuery(`(max-width: ${mobileBreakpoint}px)`);

  // Use controlled or internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange || setInternalOpen;

  // Handle trigger - clone element to add onClick handler if it's a React element
  const triggerElement = React.useMemo(() => {
    if (!trigger) return null;

    // If trigger is a React element, clone it and add onClick
    if (React.isValidElement(trigger)) {
      const element = trigger as React.ReactElement<{
        onClick?: (e: React.MouseEvent) => void;
      }>;
      const originalOnClick = element.props?.onClick;

      return React.cloneElement(element, {
        onClick: (e: React.MouseEvent) => {
          setOpen(true);
          // Call original onClick if it exists
          if (originalOnClick) {
            originalOnClick(e);
          }
        },
      } as Partial<{ onClick: (e: React.MouseEvent) => void }>);
    }

    // Otherwise, wrap in a div
    return (
      <div
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        role="button"
        tabIndex={0}
        className="inline-block"
      >
        {trigger}
      </div>
    );
  }, [trigger, setOpen]);

  if (isMobile) {
    return (
      <>
        {triggerElement}
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className={cn(drawerContentClassName)}>
            {(title || description) && (
              <DrawerHeader>
                {title && <DrawerTitle>{title}</DrawerTitle>}
                {description && (
                  <DrawerDescription>{description}</DrawerDescription>
                )}
              </DrawerHeader>
            )}
            {children}
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <>
      {triggerElement}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={cn(dialogContentClassName, "p-0")}>
          {(title || description) && (
            <DialogHeader className="p-4">
              {title && <DialogTitle>{title}</DialogTitle>}
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </DialogHeader>
          )}
          {children}
        </DialogContent>
      </Dialog>
    </>
  );
}

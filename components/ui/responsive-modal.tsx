"use client";

import * as React from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

interface ResponsiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface ResponsiveModalContentProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  showCloseButton?: boolean;
}

interface ResponsiveModalHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface ResponsiveModalTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface ResponsiveModalDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface ResponsiveModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

interface ResponsiveModalCloseProps {
  children: React.ReactNode;
  className?: string;
  asChild?: boolean;
}

const ResponsiveModalContext = React.createContext<{ isMobile: boolean }>({
  isMobile: false,
});

const useResponsiveModal = () => React.useContext(ResponsiveModalContext);

const ResponsiveModal = ({
  open,
  onOpenChange,
  children,
}: ResponsiveModalProps) => {
  const isMobile = useIsMobile();

  return (
    <ResponsiveModalContext.Provider value={{ isMobile }}>
      {isMobile ? (
        <Drawer open={open} onOpenChange={onOpenChange}>
          {children}
        </Drawer>
      ) : (
        <Dialog open={open} onOpenChange={onOpenChange}>
          {children}
        </Dialog>
      )}
    </ResponsiveModalContext.Provider>
  );
};

const ResponsiveModalContent = ({
  children,
  className,
  style,
  showCloseButton,
}: ResponsiveModalContentProps) => {
  const { isMobile } = useResponsiveModal();

  if (isMobile) {
    return (
      <DrawerContent className={cn(className, "z-999")} style={style}>
        {children}
      </DrawerContent>
    );
  }

  return (
    <DialogContent className={cn(className, "z-999")} style={style} showCloseButton={showCloseButton}>{children}</DialogContent>
  );
};

const ResponsiveModalHeader = ({
  children,
  className,
}: ResponsiveModalHeaderProps) => {
  const { isMobile } = useResponsiveModal();

  if (isMobile) {
    return <DrawerHeader className={className}>{children}</DrawerHeader>;
  }

  return <DialogHeader className={className}>{children}</DialogHeader>;
};

const ResponsiveModalTitle = ({
  children,
  className,
}: ResponsiveModalTitleProps) => {
  const { isMobile } = useResponsiveModal();

  if (isMobile) {
    return <DrawerTitle className={className}>{children}</DrawerTitle>;
  }

  return <DialogTitle className={className}>{children}</DialogTitle>;
};

const ResponsiveModalDescription = ({
  children,
  className,
}: ResponsiveModalDescriptionProps) => {
  const { isMobile } = useResponsiveModal();

  if (isMobile) {
    return (
      <DrawerDescription className={className}>{children}</DrawerDescription>
    );
  }

  return (
    <DialogDescription className={className}>{children}</DialogDescription>
  );
};

const ResponsiveModalFooter = ({
  children,
  className,
}: ResponsiveModalFooterProps) => {
  const { isMobile } = useResponsiveModal();

  if (isMobile) {
    return <DrawerFooter className={className}>{children}</DrawerFooter>;
  }

  return <DialogFooter className={className}>{children}</DialogFooter>;
};

const ResponsiveModalClose = ({
  children,
  className,
  asChild,
}: ResponsiveModalCloseProps) => {
  const { isMobile } = useResponsiveModal();

  if (isMobile) {
    return (
      <DrawerClose className={className} asChild={asChild}>
        {children}
      </DrawerClose>
    );
  }

  return (
    <DialogClose className={className} asChild={asChild}>
      {children}
    </DialogClose>
  );
};

export {
  ResponsiveModal,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalTitle,
  ResponsiveModalDescription,
  ResponsiveModalFooter,
  ResponsiveModalClose,
  useResponsiveModal,
};

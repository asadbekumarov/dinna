"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { cn } from "@/lib/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  overlayClassName?: string;
  closeOnBackdropClick?: boolean;
  closeOnEsc?: boolean;
  ariaLabel?: string;
}

export function Modal({
  isOpen,
  onClose,
  children,
  className,
  ariaLabel = "Dialog",
}: ModalProps) {
  // Mobile-first check using useSyncExternalStore (stable SSR)
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent
          className={cn(
            "max-w-lg w-full max-h-[90vh] max-h-[90dvh] overflow-y-auto overflow-x-hidden bg-cream border border-border text-charcoal shadow-modal p-6 sm:p-10 rounded-3xl",
            className
          )}
        >
          <span className="sr-only">
            <DialogTitle>{ariaLabel}</DialogTitle>
          </span>
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent
        className={cn(
          "bg-cream border-t border-border text-charcoal rounded-t-[28px] max-h-[90vh] max-h-[90dvh] flex flex-col overflow-hidden",
          className
        )}
      >
        <span className="sr-only">
          <DrawerTitle>{ariaLabel}</DrawerTitle>
        </span>

        {/* Drag Handle on Top */}
        <div className="pt-3 pb-1 flex justify-center shrink-0">
          <div className="w-12 h-1.5 rounded-full bg-charcoal/20" aria-hidden="true" />
        </div>

        {/* Scrollable Container */}
        <div className="flex-1 overflow-y-auto px-5 pb-8 pt-2">
          {children}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

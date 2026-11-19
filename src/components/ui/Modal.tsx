"use client";

import React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
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
  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogPrimitive.Portal>
        {/* Backdrop Overlay */}
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-200"
        />

        {/* Content Container (Mobile: Bottom Sheet Drawer, Desktop: Centered Dialog) */}
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={cn(
            // FIXED ON SCREEN & ON TOP OF BACKDROP
            "fixed z-50 bg-cream text-charcoal flex flex-col focus:outline-none shadow-modal",
            // Mobile: Bottom Sheet
            "inset-x-0 bottom-0 max-h-[90dvh] rounded-t-[28px] border-t border-border overflow-hidden",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom duration-300",
            // Desktop (sm: / md:): Centered Modal
            "sm:inset-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg sm:rounded-3xl sm:border sm:border-border sm:max-h-[90dvh]",
            "sm:data-[state=closed]:zoom-out-95 sm:data-[state=open]:zoom-in-95 sm:data-[state=closed]:slide-out-to-bottom-0 sm:data-[state=open]:slide-in-from-bottom-0",
            className
          )}
        >
          <span className="sr-only">
            <DialogPrimitive.Title>{ariaLabel}</DialogPrimitive.Title>
          </span>

          {/* Drag Handle for Mobile */}
          <div className="pt-3 pb-1 flex justify-center shrink-0 sm:hidden" aria-hidden="true">
            <div className="w-12 h-1.5 rounded-full bg-charcoal/20" />
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7">
            {children}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

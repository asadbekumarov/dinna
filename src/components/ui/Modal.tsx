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
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />

        {/* Responsive Content: Bottom Sheet on Mobile (< md:), Centered Modal on Desktop (md:+) */}
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={cn(
            // Mobile (Drawer)
            "fixed inset-x-0 bottom-0 z-50 max-h-[90dvh] bg-cream border-t border-border text-charcoal rounded-t-[28px] flex flex-col overflow-hidden shadow-2xl focus:outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom duration-300",
            // Desktop (Centered Modal)
            "md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg md:rounded-3xl md:border md:shadow-modal",
            "md:data-[state=closed]:zoom-out-95 md:data-[state=open]:zoom-in-95 md:data-[state=closed]:slide-out-to-bottom-0 md:data-[state=open]:slide-in-from-bottom-0",
            className
          )}
        >
          <span className="sr-only">
            <DialogPrimitive.Title>{ariaLabel}</DialogPrimitive.Title>
          </span>

          {/* Top Drag Handle (Mobile Only) */}
          <div className="pt-3 pb-1 flex justify-center shrink-0 md:hidden" aria-hidden="true">
            <div className="w-12 h-1.5 rounded-full bg-charcoal/20" />
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-5 pb-8 pt-2 md:p-8">
            {children}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

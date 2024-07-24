"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Cross2Icon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "ae-fixed ae-inset-0 ae-z-50 ae-bg-black/80 ae- data-[state=open]:ae-animate-in data-[state=closed]:ae-animate-out data-[state=closed]:ae-fade-out-0 data-[state=open]:ae-fade-in-0",
      className
    )}
    {...props}
  />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "ae-fixed ae-left-[50%] ae-top-[50%] ae-z-50 ae-grid ae-w-full ae-max-w-lg ae-translate-x-[-50%] ae-translate-y-[-50%] ae-gap-4 ae-border ae-bg-background ae-p-6 ae-shadow-lg ae-duration-200 data-[state=open]:ae-animate-in data-[state=closed]:ae-animate-out data-[state=closed]:ae-fade-out-0 data-[state=open]:ae-fade-in-0 data-[state=closed]:ae-zoom-out-95 data-[state=open]:ae-zoom-in-95 data-[state=closed]:ae-slide-out-to-left-1/2 data-[state=closed]:ae-slide-out-to-top-[48%] data-[state=open]:ae-slide-in-from-left-1/2 data-[state=open]:ae-slide-in-from-top-[48%] sm:ae-rounded-lg",
        className
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="ae-absolute ae-right-4 ae-top-4 ae-rounded-sm ae-opacity-70 ae-ring-offset-background ae-transition-opacity hover:ae-opacity-100 focus:ae-outline-none focus:ae-ring-2 focus:ae-ring-ring focus:ae-ring-offset-2 disabled:ae-pointer-events-none data-[state=open]:ae-bg-accent data-[state=open]:ae-text-muted-foreground">
        <Cross2Icon className="ae-h-4 ae-w-4" />
        <span className="ae-sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "ae-flex ae-flex-col ae-space-y-1.5 ae-text-center sm:ae-text-left",
      className
    )}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "ae-flex ae-flex-col-reverse sm:ae-flex-row sm:ae-justify-end sm:ae-space-x-2",
      className
    )}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "ae-text-lg ae-font-semibold ae-leading-none ae-tracking-tight",
      className
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("ae-text-sm ae-text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}

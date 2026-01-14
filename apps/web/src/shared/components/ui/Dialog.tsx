'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { forwardRef, ComponentPropsWithoutRef, ReactNode } from 'react'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogPortal = DialogPrimitive.Portal
export const DialogClose = DialogPrimitive.Close

export const DialogOverlay = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>((props, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      zIndex: 50,
    }}
    {...props}
  />
))
DialogOverlay.displayName = 'DialogOverlay'

export const DialogContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      style={{
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '24px',
        width: '100%',
        maxWidth: '425px',
        maxHeight: '85vh',
        overflow: 'auto',
        zIndex: 50,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      }}
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = 'DialogContent'

export const DialogHeader = ({ children }: { children: ReactNode }) => (
  <div style={{ marginBottom: '16px' }}>{children}</div>
)
DialogHeader.displayName = 'DialogHeader'

export const DialogFooter = ({ children }: { children: ReactNode }) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '8px',
      marginTop: '24px',
    }}
  >
    {children}
  </div>
)
DialogFooter.displayName = 'DialogFooter'

export const DialogTitle = forwardRef<
  HTMLHeadingElement,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>((props, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    style={{
      fontSize: '18px',
      fontWeight: 600,
      marginBottom: '8px',
    }}
    {...props}
  />
))
DialogTitle.displayName = 'DialogTitle'

export const DialogDescription = forwardRef<
  HTMLParagraphElement,
  ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>((props, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    style={{
      fontSize: '14px',
      color: '#6b7280',
    }}
    {...props}
  />
))
DialogDescription.displayName = 'DialogDescription'

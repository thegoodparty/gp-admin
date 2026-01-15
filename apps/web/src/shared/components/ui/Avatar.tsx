'use client'

import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { forwardRef, ComponentPropsWithoutRef } from 'react'

type AvatarSize = 'xSmall' | 'small' | 'medium' | 'large'

const sizeClasses: Record<AvatarSize, string> = {
  xSmall: 'h-8 w-8',
  small: 'h-10 w-10',
  medium: 'h-12 w-12',
  large: 'h-16 w-16',
}

interface AvatarProps extends ComponentPropsWithoutRef<
  typeof AvatarPrimitive.Root
> {
  size?: AvatarSize
}

const AvatarRoot = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ size = 'medium', className, ...props }, ref) => (
    <AvatarPrimitive.Root
      ref={ref}
      className={[
        'inline-flex items-center justify-center align-middle overflow-hidden rounded-full bg-zinc-200 select-none',
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  )
)
AvatarRoot.displayName = 'Avatar'

const AvatarImage = forwardRef<
  HTMLImageElement,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={['h-full w-full rounded-full object-cover', className]
      .filter(Boolean)
      .join(' ')}
    {...props}
  />
))
AvatarImage.displayName = 'AvatarImage'

const AvatarFallback = forwardRef<
  HTMLSpanElement,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    delayMs={600}
    className={[
      'flex h-full w-full items-center justify-center rounded-full bg-blue-500 text-sm font-medium text-white',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...props}
  />
))
AvatarFallback.displayName = 'AvatarFallback'

// Create compound component
export const Avatar = Object.assign(AvatarRoot, {
  Image: AvatarImage,
  Fallback: AvatarFallback,
})

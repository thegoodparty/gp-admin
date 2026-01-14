'use client'

import * as AvatarPrimitive from '@radix-ui/react-avatar'
import { forwardRef, ComponentPropsWithoutRef } from 'react'

type AvatarSize = 'xSmall' | 'small' | 'medium' | 'large'

const sizeMap: Record<AvatarSize, string> = {
  xSmall: '32px',
  small: '40px',
  medium: '48px',
  large: '64px',
}

interface AvatarProps extends ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  size?: AvatarSize
}

const AvatarRoot = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ size = 'medium', style, ...props }, ref) => (
    <AvatarPrimitive.Root
      ref={ref}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        verticalAlign: 'middle',
        overflow: 'hidden',
        userSelect: 'none',
        width: sizeMap[size],
        height: sizeMap[size],
        borderRadius: '50%',
        backgroundColor: '#e4e4e7',
        ...style,
      }}
      {...props}
    />
  )
)
AvatarRoot.displayName = 'Avatar'

const AvatarImage = forwardRef<
  HTMLImageElement,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ style, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    style={{
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: 'inherit',
      ...style,
    }}
    {...props}
  />
))
AvatarImage.displayName = 'AvatarImage'

const AvatarFallback = forwardRef<
  HTMLSpanElement,
  ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ style, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    delayMs={600}
    style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#3b82f6',
      color: 'white',
      fontSize: '14px',
      fontWeight: 500,
      ...style,
    }}
    {...props}
  />
))
AvatarFallback.displayName = 'AvatarFallback'

// Create compound component
export const Avatar = Object.assign(AvatarRoot, {
  Image: AvatarImage,
  Fallback: AvatarFallback,
})

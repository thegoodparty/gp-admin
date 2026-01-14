'use client'

import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'
import { forwardRef, ComponentPropsWithoutRef } from 'react'

export const DropdownMenu = DropdownMenuPrimitive.Root
export const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger
export const DropdownMenuGroup = DropdownMenuPrimitive.Group
export const DropdownMenuPortal = DropdownMenuPrimitive.Portal
export const DropdownMenuSub = DropdownMenuPrimitive.Sub
export const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

export const DropdownMenuContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ style, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={4}
      style={{
        minWidth: '160px',
        backgroundColor: 'white',
        borderRadius: '6px',
        padding: '4px',
        boxShadow:
          '0 10px 38px -10px rgba(22, 23, 24, 0.35), 0 10px 20px -15px rgba(22, 23, 24, 0.2)',
        zIndex: 50,
        ...style,
      }}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = 'DropdownMenuContent'

interface DropdownMenuItemProps
  extends ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> {
  variant?: 'default' | 'destructive'
}

export const DropdownMenuItem = forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  ({ variant = 'default', style, ...props }, ref) => (
    <DropdownMenuPrimitive.Item
      ref={ref}
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 12px',
        fontSize: '14px',
        borderRadius: '4px',
        cursor: 'pointer',
        outline: 'none',
        color: variant === 'destructive' ? '#ef4444' : '#18181b',
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = '#f4f4f5'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent'
      }}
      {...props}
    />
  )
)
DropdownMenuItem.displayName = 'DropdownMenuItem'

export const DropdownMenuLabel = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label>
>(({ style, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    style={{
      padding: '8px 12px',
      fontSize: '12px',
      fontWeight: 600,
      color: '#6b7280',
      ...style,
    }}
    {...props}
  />
))
DropdownMenuLabel.displayName = 'DropdownMenuLabel'

export const DropdownMenuSeparator = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ style, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    style={{
      height: '1px',
      backgroundColor: '#e4e4e7',
      margin: '4px 0',
      ...style,
    }}
    {...props}
  />
))
DropdownMenuSeparator.displayName = 'DropdownMenuSeparator'

export const DropdownMenuCheckboxItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ children, style, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    style={{
      display: 'flex',
      alignItems: 'center',
      padding: '8px 12px',
      paddingLeft: '32px',
      fontSize: '14px',
      borderRadius: '4px',
      cursor: 'pointer',
      outline: 'none',
      ...style,
    }}
    {...props}
  >
    <DropdownMenuPrimitive.ItemIndicator
      style={{
        position: 'absolute',
        left: '8px',
        width: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      ✓
    </DropdownMenuPrimitive.ItemIndicator>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName = 'DropdownMenuCheckboxItem'

export const DropdownMenuRadioItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ children, style, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    style={{
      display: 'flex',
      alignItems: 'center',
      padding: '8px 12px',
      paddingLeft: '32px',
      fontSize: '14px',
      borderRadius: '4px',
      cursor: 'pointer',
      outline: 'none',
      ...style,
    }}
    {...props}
  >
    <DropdownMenuPrimitive.ItemIndicator
      style={{
        position: 'absolute',
        left: '8px',
        width: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      ●
    </DropdownMenuPrimitive.ItemIndicator>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = 'DropdownMenuRadioItem'

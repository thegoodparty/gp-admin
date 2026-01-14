'use client'

import * as SelectPrimitive from '@radix-ui/react-select'
import { forwardRef, ComponentPropsWithoutRef } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export const Select = SelectPrimitive.Root
export const SelectGroup = SelectPrimitive.Group
export const SelectValue = SelectPrimitive.Value

export const SelectTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ children, style, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '8px 12px',
      fontSize: '14px',
      backgroundColor: 'white',
      border: '1px solid #e4e4e7',
      borderRadius: '6px',
      cursor: 'pointer',
      outline: 'none',
      minWidth: '150px',
      ...style,
    }}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon>
      <ChevronDown size={16} style={{ color: '#6b7280' }} />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = 'SelectTrigger'

export const SelectContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ children, style, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position="popper"
      sideOffset={4}
      style={{
        backgroundColor: 'white',
        borderRadius: '6px',
        padding: '4px',
        boxShadow:
          '0 10px 38px -10px rgba(22, 23, 24, 0.35), 0 10px 20px -15px rgba(22, 23, 24, 0.2)',
        zIndex: 50,
        minWidth: 'var(--radix-select-trigger-width)',
        maxHeight: 'var(--radix-select-content-available-height)',
        overflow: 'hidden',
        ...style,
      }}
      {...props}
    >
      <SelectPrimitive.Viewport style={{ padding: '4px' }}>
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = 'SelectContent'

export const SelectItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ children, style, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    style={{
      display: 'flex',
      alignItems: 'center',
      padding: '8px 12px',
      paddingRight: '32px',
      fontSize: '14px',
      borderRadius: '4px',
      cursor: 'pointer',
      outline: 'none',
      position: 'relative',
      ...style,
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = '#f4f4f5'
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = 'transparent'
    }}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <SelectPrimitive.ItemIndicator
      style={{
        position: 'absolute',
        right: '8px',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Check size={16} />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
))
SelectItem.displayName = 'SelectItem'

export const SelectLabel = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ style, ...props }, ref) => (
  <SelectPrimitive.Label
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
SelectLabel.displayName = 'SelectLabel'

export const SelectSeparator = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ style, ...props }, ref) => (
  <SelectPrimitive.Separator
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
SelectSeparator.displayName = 'SelectSeparator'

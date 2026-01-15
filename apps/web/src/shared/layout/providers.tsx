'use client'

import '@radix-ui/themes/styles.css'
import { Theme } from '@radix-ui/themes'
import { ClerkProvider } from '@clerk/nextjs'
import { JSX, ReactNode } from 'react'
import { SidebarProvider } from './Sidebar'

export function Providers({ children }: { children: ReactNode }): JSX.Element {
  return (
    <ClerkProvider>
      <Theme accentColor="blue" grayColor="slate" radius="medium">
        <SidebarProvider>{children}</SidebarProvider>
      </Theme>
    </ClerkProvider>
  )
}

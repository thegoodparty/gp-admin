import type { Metadata } from 'next'
import Providers from '@/components/layout/providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'GP Admin',
  description: 'GP Admin Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}


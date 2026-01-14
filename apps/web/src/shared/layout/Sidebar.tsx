'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createContext, useContext, useState, ReactNode } from 'react'
import { HiUsers, HiStar, HiMenu, HiUserGroup } from 'react-icons/hi'
import { RequireRole } from '../components/RequireRole'
import { ROLES } from '../lib/roles'

const navItems = [
  {
    title: 'Users',
    href: '/dashboard/users',
    icon: HiUsers,
  },
  {
    title: 'Campaigns',
    href: '/dashboard/campaigns',
    icon: HiStar,
  },
]

const adminNavItems = [
  {
    title: 'Team',
    href: '/dashboard/team',
    icon: HiUserGroup,
  },
]

type SidebarContextType = {
  isOpen: boolean
  toggle: () => void
}

const SidebarContext = createContext<SidebarContextType | null>(null)

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within SidebarProvider')
  }
  return context
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(true)
  const toggle = () => setIsOpen((prev) => !prev)

  return (
    <SidebarContext.Provider value={{ isOpen, toggle }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function SidebarTrigger() {
  const { toggle } = useSidebar()

  return (
    <button
      onClick={toggle}
      className="p-2 rounded-md hover:bg-sidebar-accent transition-colors"
      aria-label="Toggle Sidebar"
    >
      <HiMenu className="size-5" />
    </button>
  )
}

interface NavItemProps {
  item: {
    title: string
    href: string
    icon: React.ComponentType<{ className?: string }>
  }
  isActive: boolean
  isOpen: boolean
}

function NavItem({ item, isActive, isOpen }: NavItemProps) {
  return (
    <li>
      <Link
        href={item.href}
        className={`
          flex items-center gap-3 px-3 py-2 rounded-md
          transition-colors duration-200
          ${
            isActive
              ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
              : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
          }
          ${isOpen ? '' : 'justify-center'}
        `}
        title={!isOpen ? item.title : undefined}
      >
        <item.icon className="size-5 shrink-0" />
        <span
          className={`
            transition-all duration-300 overflow-hidden whitespace-nowrap
            ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}
          `}
        >
          {item.title}
        </span>
      </Link>
    </li>
  )
}

export default function Sidebar() {
  const pathname = usePathname()
  const { isOpen } = useSidebar()

  return (
    <aside
      className={`
        bg-sidebar border-r border-sidebar-border
        min-h-[calc(100vh-64px)] flex flex-col
        transition-all duration-300 ease-in-out
        bg-gray-100
        ${isOpen ? 'w-64' : 'w-16'}
      `}
    >
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <NavItem
              key={item.href}
              item={item}
              isActive={pathname.startsWith(item.href)}
              isOpen={isOpen}
            />
          ))}
          <RequireRole role={ROLES.ADMIN}>
            {adminNavItems.map((item) => (
              <NavItem
                key={item.href}
                item={item}
                isActive={pathname.startsWith(item.href)}
                isOpen={isOpen}
              />
            ))}
          </RequireRole>
        </ul>
      </nav>
    </aside>
  )
}

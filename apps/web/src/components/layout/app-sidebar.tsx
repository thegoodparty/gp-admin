'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SignOutButton, useUser } from '@clerk/nextjs';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { UserAvatar } from '@/components/user-avatar';
import { navItems } from '@/config/nav';
import { ChevronDown, LogOut, User } from 'lucide-react';
import Image from 'next/image';

export default function AppSidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  return (
    <Sidebar collapsible='icon'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size='lg' asChild>
              <Link href='/dashboard'>
                <div className='flex aspect-square size-8 items-center justify-center rounded-lg  text-sidebar-primary-foreground'>
                  <Image src='https://assets.goodparty.org/logo.svg' alt='GP Admin' width={32} height={32} />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-semibold'>GP Admin</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className='overflow-x-hidden'>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.href}
                  >
                    <Link href={item.href}>
                      {Icon && <Icon />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size='lg'
                  className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
                >
                  {user && <UserAvatar user={user} className='h-8 w-8' />}
                  <div className='grid flex-1 text-left text-sm leading-tight'>
                    <span className='truncate font-semibold'>
                      {user?.fullName || 'User'}
                    </span>
                    <span className='truncate text-xs'>
                      {user?.emailAddresses[0]?.emailAddress}
                    </span>
                  </div>
                  <ChevronDown className='ml-auto size-4' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
                side='bottom'
                align='end'
                sideOffset={4}
              >
                <DropdownMenuLabel className='p-0 font-normal'>
                  <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
                    {user && <UserAvatar user={user} className='h-8 w-8' />}
                    <div className='grid flex-1 text-left text-sm leading-tight'>
                      <span className='truncate font-semibold'>
                        {user?.fullName || 'User'}
                      </span>
                      <span className='truncate text-xs'>
                        {user?.emailAddresses[0]?.emailAddress}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link href='/dashboard/profile'>
                      <User className='mr-2 h-4 w-4' />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className='mr-2 h-4 w-4' />
                  <SignOutButton redirectUrl='/auth/sign-in' />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

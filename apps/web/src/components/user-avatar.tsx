'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { User } from '@clerk/nextjs/server';

interface UserAvatarProps {
  user: User;
  className?: string;
}

export function UserAvatar({ user, className }: UserAvatarProps) {
  const initials =
    user.firstName && user.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`
      : user.emailAddresses[0]?.emailAddress[0]?.toUpperCase() || '?';

  return (
    <Avatar className={className}>
      <AvatarImage src={user.imageUrl} alt={user.fullName || 'User'} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
}

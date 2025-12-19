import { SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { UserNav } from './user-nav';
import { ThemeToggle } from '@/components/theme/theme-toggle';

export default function Header() {
  return (
    <header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
      <SidebarTrigger className='-ml-1' />
      <Separator orientation='vertical' className='mr-2 h-4' />
      <div className='flex-1' />
      <div className='flex items-center gap-2'>
        <ThemeToggle />
        <UserNav />
      </div>
    </header>
  );
}

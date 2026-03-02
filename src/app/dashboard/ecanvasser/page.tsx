import { canAccess } from '@/lib/auth'
import { PERMISSIONS } from '@/lib/permissions'
import { EcanvasserPage } from './components/EcanvasserPage'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ecanvasser | GP Admin',
  description: 'Manage ecanvasser integrations',
}

export default async function Page() {
  await canAccess(PERMISSIONS.MANAGE_ECANVASSER)

  return <EcanvasserPage />
}

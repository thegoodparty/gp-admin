import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { InviteUserForm } from '@/components/users/invite-user-form';
import { USER_ROLES, ROLE_LABELS, type UserRole } from '@/types/roles';

// Mock data for demonstration
const mockUsers = [
  {
    id: '1',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    role: USER_ROLES.ADMIN,
    status: 'active',
    invitedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    email: 'sales@example.com',
    firstName: 'Sales',
    lastName: 'Rep',
    role: USER_ROLES.SALES,
    status: 'active',
    invitedAt: new Date('2024-02-01')
  },
  {
    id: '3',
    email: 'viewer@example.com',
    firstName: 'John',
    lastName: 'Viewer',
    role: USER_ROLES.READ_ONLY,
    status: 'pending',
    invitedAt: new Date('2024-03-10')
  }
];

function getRoleBadgeVariant(role: UserRole): 'default' | 'secondary' | 'outline' {
  switch (role) {
    case USER_ROLES.ADMIN:
      return 'default';
    case USER_ROLES.SALES:
      return 'secondary';
    case USER_ROLES.READ_ONLY:
      return 'outline';
    default:
      return 'outline';
  }
}

function getStatusBadgeVariant(status: string): 'default' | 'secondary' | 'outline' {
  switch (status) {
    case 'active':
      return 'default';
    case 'pending':
      return 'secondary';
    default:
      return 'outline';
  }
}

export default function UsersPage() {
  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>Users</h1>
        <p className='text-muted-foreground'>
          Manage user invitations and roles
        </p>
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        {/* Invite User Form */}
        <Card>
          <CardHeader>
            <CardTitle>Invite New User</CardTitle>
            <CardDescription>
              Send an invitation email to add a new user to your team
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InviteUserForm />
          </CardContent>
        </Card>

        {/* User List */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              {mockUsers.length} {mockUsers.length === 1 ? 'member' : 'members'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {mockUsers.map((user) => (
                <div
                  key={user.id}
                  className='flex items-center justify-between rounded-lg border p-4'
                >
                  <div className='space-y-1'>
                    <p className='text-sm font-medium leading-none'>
                      {user.firstName} {user.lastName}
                    </p>
                    <p className='text-sm text-muted-foreground'>
                      {user.email}
                    </p>
                    <div className='flex items-center gap-2 pt-1'>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {ROLE_LABELS[user.role]}
                      </Badge>
                      <Badge variant={getStatusBadgeVariant(user.status)}>
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Descriptions */}
      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>
            Understanding what each role can do
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4 md:grid-cols-3'>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <Badge variant='default'>Admin</Badge>
              </div>
              <p className='text-sm text-muted-foreground'>
                Full access to all features including user management, settings,
                and data operations.
              </p>
            </div>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <Badge variant='secondary'>Sales</Badge>
              </div>
              <p className='text-sm text-muted-foreground'>
                Access to sales features, customer management, and data editing.
                Cannot manage users or system settings.
              </p>
            </div>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <Badge variant='outline'>Read Only</Badge>
              </div>
              <p className='text-sm text-muted-foreground'>
                View-only access to data and reports. Cannot edit or delete any
                information.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

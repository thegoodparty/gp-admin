'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { USER_ROLES, ROLE_LABELS, ROLE_DESCRIPTIONS, type UserRole } from '@/types/roles';
import { Badge } from '@/components/ui/badge';

const inviteUserSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  role: z.enum([USER_ROLES.ADMIN, USER_ROLES.SALES, USER_ROLES.READ_ONLY], {
    required_error: 'Please select a role'
  }),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters')
});

type InviteUserFormData = z.infer<typeof inviteUserSchema>;

interface InviteUserFormProps {
  onSuccess?: () => void;
}

export function InviteUserForm({ onSuccess }: InviteUserFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InviteUserFormData>({
    resolver: zodResolver(inviteUserSchema),
    defaultValues: {
      email: '',
      role: USER_ROLES.READ_ONLY,
      firstName: '',
      lastName: ''
    }
  });

  async function onSubmit(data: InviteUserFormData) {
    setIsSubmitting(true);
    try {
      // TODO: Implement actual invitation logic
      // This would typically call an API endpoint to send an invitation email
      console.log('Inviting user:', data);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      alert(`User invitation sent to ${data.email} with role: ${ROLE_LABELS[data.role]}`);
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error('Failed to invite user:', error);
      alert('Failed to send invitation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectedRole = form.watch('role') as UserRole | undefined;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid gap-4 md:grid-cols-2'>
          <FormField
            control={form.control}
            name='firstName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder='John' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='lastName'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder='Doe' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type='email'
                  placeholder='john.doe@example.com'
                  {...field}
                />
              </FormControl>
              <FormDescription>
                An invitation email will be sent to this address
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='role'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a role' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(USER_ROLES).map(([key, value]) => (
                    <SelectItem key={value} value={value}>
                      <div className='flex items-center gap-2'>
                        {ROLE_LABELS[value as UserRole]}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedRole && (
                <FormDescription>
                  {ROLE_DESCRIPTIONS[selectedRole]}
                </FormDescription>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className='flex justify-end gap-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => form.reset()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Sending invitation...' : 'Send Invitation'}
          </Button>
        </div>
      </form>
    </Form>
  );
}

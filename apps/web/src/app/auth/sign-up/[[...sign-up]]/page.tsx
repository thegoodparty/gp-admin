import { SignUp } from '@clerk/nextjs'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign Up | GP Admin',
  description: 'Create your GP Admin account via invitation',
}

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-lg flex flex-col items-center justify-center p-8">
        <SignUp />
      </div>
    </div>
  )
}

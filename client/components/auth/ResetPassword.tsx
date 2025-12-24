'use client'

import { resetPasswordActions } from '@/actions/authActions'
import { useEffect } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { SubmitButton } from '../common/SubmitButton'
import { useFormState } from 'react-dom'
import { toast } from 'sonner'
import { useRouter, useSearchParams } from 'next/navigation'

export default function ResetPassword() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const token = searchParams.get('token');
  const initialState = {
    status: 0,
    message: '',
    errors: {}
  }
  const [state, formAction] = useFormState(resetPasswordActions, initialState)

  useEffect(() => {
    if (state!.status === 500) {
      toast.error(state!.message)
    }
    if (state!.status === 422) {
      toast.error(state!.message)
    }
    if (state!.status === 400) {
      toast.error(state!.message)
    }
    if (state!.status === 200) {
      toast.success(state!.message)
      setTimeout(() => {
        router.replace("/login")
      }, 1000);
    }
  }, [state])

  return (
    <form action={formAction} className='w-full'>
      <input type="hidden" name="token" value={token ?? ""} />
      <div className='my-4'>
        <Label htmlFor="email" className='mb-2'>Email</Label>
        <Input id="email" type="email" name="email" placeholder='Enter your email' readOnly value={email ?? ""} />
        <span className='text-red-500'>{state!.errors?.email}</span>
      </div>
      <div className='my-4'>
        <Label htmlFor="password" className='mb-2'>Password</Label>
        <Input id="password" type="password" name="password" placeholder='Enter your password' />
        <span className='text-red-500'>{state!.errors?.password}</span>
      </div>
      <div className='my-4'>
        <Label htmlFor="confirmPassword" className='mb-2'>Confirm Password</Label>
        <Input id="confirmPassword" type="password" name="confirmPassword" placeholder='Enter your confirm password' />
        <span className='text-red-500'>{state!.errors?.confirmPassword}</span>
      </div>
      <SubmitButton />
    </form>
  )
}

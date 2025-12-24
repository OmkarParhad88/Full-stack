"use client"

import { useEffect } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { SubmitButton } from '../common/SubmitButton'
import { toast } from 'sonner'
import { useFormState } from 'react-dom'
import { forgetPasswordActions } from '@/actions/authActions'

export default function ForgetPassword() {
  const initialState = {
    status: 0,
    message: '',
    errors: {},
  }
  const [state, formAction] = useFormState(forgetPasswordActions, initialState)

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

    }
  }, [state])
  return (
    <form action={formAction} className='w-full'>
      <div className='my-4'>
        <Label htmlFor="email" className='mb-2'>Email</Label>
        <Input id="email" type="email" name="email" placeholder='Enter your email' />
        <span className='text-red-500'>{state!.errors?.email}</span>
      </div>
      <SubmitButton />
    </form>
  )
}

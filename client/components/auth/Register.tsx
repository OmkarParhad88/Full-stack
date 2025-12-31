'use client'

import { registerActions } from '@/actions/authActions'
import React, { useEffect } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { SubmitButton } from '../common/SubmitButton'
import { useActionState } from 'react';
import { toast } from 'sonner'

export default function Register() {
  const initialState = {
    status: 0,
    message: '',
    errors: {}
  }
  const [state, formAction] = useActionState(registerActions, initialState)

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
        <Label htmlFor="name" className='mb-2'>Name</Label>
        <Input id="name" type="text" name="name" placeholder='Enter your name' />
        <span className='text-red-500'>{state!.errors?.name}</span>
      </div>
      <div className='my-4'>
        <Label htmlFor="email" className='mb-2'>Email</Label>
        <Input id="email" type="email" name="email" placeholder='Enter your email' />
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

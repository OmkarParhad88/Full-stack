"use client"

import { useEffect } from 'react'
import Link from 'next/link'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { SubmitButton } from '../common/SubmitButton'
import { toast } from 'sonner'
import { useActionState } from 'react';
import { loginActions } from '@/actions/authActions'
import { signIn } from 'next-auth/react'


export default function Login() {
  const initialState = {
    status: 0,
    message: '',
    errors: {},
    data: {}
  }
  const [state, formAction] = useActionState(loginActions, initialState)

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
      signIn("credentials", {
        email: state!.data.email,
        password: state!.data.password,
        redirect: true,
        callbackUrl: "/dashboard"
      })
    }
  }, [state])
  return (
    <form action={formAction} className='w-full'>
      <div className='my-4'>
        <Label htmlFor="email" className='mb-2'>Email</Label>
        <Input id="email" type="email" name="email" placeholder='Enter your email' />
        <span className='text-red-500'>{state!.errors?.email}</span>
      </div>
      <div className='my-4'>
        <Label htmlFor="password" className='mb-2'>Password</Label>
        <Input id="password" type="password" name="password" placeholder='Enter your password' />
        <span className='text-red-500'>{state!.errors?.password}</span>
        <div className='w-full text-right my-2'>
          <Link href="/forget-password" >Forgot Password?</Link>
        </div>
      </div>
      <SubmitButton />
    </form>
  )
}

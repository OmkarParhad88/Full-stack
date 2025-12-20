import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export default function login() {
  return (
    <div className='flex justify-center items-center h-screen w-full flex-col'>
      <div className='w-3xl bg-white p-6 rounded-md shadow-lg flex flex-row items-center justify-between'>
        <Image src="/Tablet login-cuate.svg" alt="Vercel Logo" width={400} height={600} />
        <div className='w-2xl h-full flex flex-col justify-center items-start p-1'>
          <h1 className='text-2xl font-bold'>Login</h1>
          <p>Sign in to your account</p>
          <form action="" className='w-full'>
            <div className='my-4'>
              <Label htmlFor="email" className='mb-2'>Email</Label>
              <Input id="email" type="email" placeholder='Enter your email' />
            </div>
            <div className='my-4'>
              <Label htmlFor="password" className='mb-2'>Password</Label>
              <Input id="password" type="password" placeholder='Enter your password' />
              <div className='w-full text-right my-2'>
                <Link href="/forgot-password" >Forgot Password?</Link>
              </div>
            </div>
            <Button type="submit">Login</Button>
          </form>
        </div>
      </div>
      <div className='w-full text-center my-2'>
        Don't have an account? <Link href="/register">Register</Link>
      </div>
    </div>
  )
}

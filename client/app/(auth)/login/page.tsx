import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Login from '@/components/auth/Login'

export default function login() {
  return (
    <div className='flex justify-center items-center h-screen w-full flex-col'>
      <div className='w-3xl bg-white p-6 rounded-md shadow-lg flex flex-row items-center justify-between'>
        <Image src="/Tablet login-cuate.svg" alt="Vercel Logo" width={400} height={600} />
        <div className='w-2xl h-full flex flex-col justify-center items-start p-1'>
          <h1 className='text-2xl font-bold'>Login</h1>
          <p>Sign in to your account</p>
          <Login />
        </div>
      </div>
      <div className='w-full text-center my-2'>
        Don't have an account? <Link href="/register">Register</Link>
      </div>
    </div>
  )
}

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'

export default function register() {
  return (
    <div className='flex justify-center items-center h-screen w-full flex-col'>
      <div className='w-3xl bg-white p-6 rounded-md shadow-lg flex flex-row items-center justify-between'>
        <Image src="/Sign up-cuate.svg" alt="Vercel Logo" width={400} height={600} />
        <div className='w-2xl h-full flex flex-col justify-center items-start p-1'>
          <h1 className='text-2xl font-bold'>Register</h1>
          <p>Sign in to your account</p>
          <form action="" className='w-full'>
            <div className='my-4'>
              <Label htmlFor="name" className='mb-2'>Name</Label>
              <Input id="name" type="text" placeholder='Enter your name' />
            </div>
            <div className='my-4'>
              <Label htmlFor="email" className='mb-2'>Email</Label>
              <Input id="email" type="email" placeholder='Enter your email' />
            </div>
            <div className='my-4'>
              <Label htmlFor="password" className='mb-2'>Password</Label>
              <Input id="password" type="password" placeholder='Enter your password' />
            </div>
            <Button type="submit">Register</Button>
          </form>
        </div>
      </div>
      <div className='w-full text-center my-2'>
        Already have an account? <Link href="/login">Login</Link>
      </div>
    </div>
  )
}

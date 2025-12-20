import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from '@/components/ui/button'

function MainSection() {
  return (
    <div className='flex justify-center items-center h-screen w-full flex-col'>
      <div className='bg-white p-6 rounded-lg shadow-lg'>
        <Image src="/Alone-cuate.svg" alt="Vercel Logo" width={300} height={600} />
        <div className='flex justify-center items-center gap-4'>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
          <Link href="/register">
            <Button>Sign Up</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default MainSection
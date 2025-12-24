import Image from 'next/image'
import Link from 'next/link'
import ResetPassword from '@/components/auth/ResetPassword'

export default function resetPassword() {
  return (
    <div className='flex justify-center items-center h-screen w-full flex-col'>
      <div className='w-3xl bg-white p-6 rounded-md shadow-lg flex flex-row items-center justify-between'>
        <Image src="/Forgot password-cuate.svg" alt="Vercel Logo" width={400} height={600} />
        <div className='w-2xl h-full flex flex-col justify-center items-start p-1'>
          <h1 className='text-2xl font-bold'>Reset Password</h1>
          <p>Reset Password to your account</p>
          <ResetPassword />
        </div>
      </div>
      <div className='w-full text-center my-2'>
        I know my password? <Link href="/login">Login</Link>
      </div>
    </div>
  )
}

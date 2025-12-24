import Image from 'next/image'
import Link from 'next/link'
import ForgetPassword from '@/components/auth/ForgetPassword'

export default function forgetPassword() {
  return (
    <div className='flex justify-center items-center h-screen w-full flex-col'>
      <div className='w-3xl bg-white p-6 rounded-md shadow-lg flex flex-row items-center justify-between'>
        <Image src="/Forgot password-cuate.svg" alt="Vercel Logo" width={400} height={600} />
        <div className='w-2xl h-full flex flex-col justify-center items-start p-1'>
          <h1 className='text-2xl font-bold'>Forget Password</h1>
          <p>Forget Password to your account</p>
          <ForgetPassword />
        </div>
      </div>
      <div className='w-full text-center my-2'>
        I know my password? <Link href="/login">Login</Link>
      </div>
    </div>
  )
}

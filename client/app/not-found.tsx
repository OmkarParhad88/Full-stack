import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
  return (
    <div className='flex justify-center items-center h-screen w-full flex-col'>
      <Image src="/404.svg" alt="404" width={400} height={600} />
      <h2 className='text-2xl font-bold'> Page Not Found</h2>
      <p className='text-gray-500'>Could not find requested resource</p>
      <Link href="/" className='text-blue-500'>Return Home</Link>
    </div>
  )
}
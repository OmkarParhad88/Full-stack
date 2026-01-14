

import NavBar from '@/components/base/NavBar'
import { getFightById } from '@/fetch/fight'
import { FightCardProps } from '@/types';
import Fighting from '@/components/fight/Fighting';

export default async function fight({ params }: { params: Promise<{ id: string }> }) {

  const { id } = await params;
  const numericId = parseInt(id);
  const data = await getFightById(numericId);
  if (!data.status || data.status !== 200) {
    return (
      <div className='container mx-auto p-4'>
        <NavBar />
        <div className='mt-4'>
          <h1 className='text-2xl lg:text-4xl font-extrabold'>Fight Not Found</h1>
          <p className='text-gray-600 text-sm lg:text-base'>The fight you are looking for does not exist.</p>
        </div>
      </div>
    )
  }

  let fight: FightCardProps = data.fight;
  return (
    <div className='container mx-auto p-4'>
      <NavBar />
      <div className='mt-4'>
        <h1 className='text-2xl lg:text-4xl font-extrabold'>{data.fight.title}</h1>
        <p className='text-gray-600 text-sm lg:text-base'>{data.fight.description}</p>
      </div>
      {fight && <Fighting fight={fight} />}

    </div>
  )
}

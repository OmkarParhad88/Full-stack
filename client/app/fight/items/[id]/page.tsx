import NavBar from '@/components/base/NavBar'
import React from 'react'
import { getFightById } from '@/fetch/fight'
import { getServerSession } from "next-auth";
import AddFightItem from '@/components/fight/AddFightItem';
import { authOptions } from '@/app/api/auth/[...nextauth]/options';
import { FightCardProps } from '@/types';
import ViewFightItem from '@/components/fight/ViewFightItem';

export default async function fightItems({
  params
}: {
  params: Promise<{ id: string }>
}) {

  const session = await getServerSession(authOptions)
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
      {fight.fight_items && fight.fight_items.length > 0 ?
        <ViewFightItem fightItems={fight.fight_items} />
        :
        <AddFightItem fightId={String(fight.id)} token={session?.user?.token || ""} />
      }
    </div>
  )
}

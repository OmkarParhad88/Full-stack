
'use client'
import { FightItem } from "@/types";
import { Fragment } from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";

export default function ViewFightItem({ fightItems }: { fightItems: FightItem[] }) {
  return (
    <div className="mt-4">
      <div className="flex flex-wrap lg:flex-nowrap items-center justify-between">
        {fightItems.map((item, index) => (
          <Fragment key={index}>
            <div className='w-full flex lg:w-[500px] justify-between items-center flex-col'>
              <div className='w-full flex justify-center items-center rounded-md border border-dashed p-2 h-[300px]'>
                {item.image ? <Image src={getImageUrl(item.image)} alt="" width={500} height={500} className="w-full h-full object-cover" /> : <div className="flex flex-col items-center">
                </div>}
              </div>
            </div>

            {index % 2 === 0 && (
              <div className="w-full flex lg:w-auto justify-center items-center">
                <h1 className="text-2xl font-bold text-gray-600 lg:text-4xl ">vs</h1>
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  )
}

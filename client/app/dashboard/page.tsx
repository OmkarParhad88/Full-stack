import NavBar from "@/components/base/NavBar";
import AddFight from "@/components/fight/AddFight";
import { getFightList } from "@/fetch/fight";
import FightCard from "@/components/fight/FightCard";
import { FightCardProps } from "@/types";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
export default async function page() {
  const session = await getServerSession(authOptions)
  const data = await getFightList()
  if (data.status === 401) {
    return <div>Unauthorized</div>
  }

  return (
    <div className="container">
      <NavBar />
      <div className="text-end m-10">
        <AddFight />

      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.status === 200 ? (data.fightes?.length > 0 ? data.fightes.map((fight: FightCardProps) => (
          <FightCard
            key={fight.id}
            fight={fight}
            token={session?.user?.token || ""}
          />
        )) : <div>No fights found</div>) : <div>{data.message}</div>}
      </div>
    </div>
  )
}

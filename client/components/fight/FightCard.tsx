import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { getImageUrl } from "@/lib/utils";
import Image from "next/image"
import { FightCardProps } from "@/types";
import FightCardMenu from "./FightCardMenu";

export default function FightCard({ fight, token }: { fight: FightCardProps, token: string }) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="flex justify-between items-center">
        <CardTitle>{fight.title}</CardTitle>
        <FightCardMenu fight={fight} token={token} />
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <CardDescription>
          {fight.description}
        </CardDescription>
        {fight.image && <Image src={getImageUrl(fight.image)} alt={fight.image} width={500} height={500} className="w-full h-[250px] object-contain rounded-md " />}
        <p>Created at: {new Date(fight.created_at).toLocaleDateString()}</p>
        <p>Expire at: {new Date(fight.expire_at).toLocaleDateString()}</p>
      </CardContent>
    </Card>
  );
}
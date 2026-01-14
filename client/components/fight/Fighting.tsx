'use client'

import { FightCardProps, FightComment, FightItem } from "@/types";
import { Fragment, useState, useEffect } from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import CountUp from "react-countup";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { ThumbsUp } from "lucide-react";
import socket from "@/lib/socket";
import { toast } from "sonner";


export default function Fighting({ fight }: { fight: FightCardProps }) {

  const [fightItems, setFightItems] = useState<FightItem[]>(fight.fight_items)
  const [fightComments, setFightComments] = useState<FightComment[]>(fight.fight_comments)
  const [comment, setComment] = useState<string>("")
  const [hideVote, setHideVote] = useState(false)

  useEffect(() => {
    const eventName = `fighting-${fight.id}`;
    const commentEventName = `fighting_comment-${fight.id}`;

    socket.on(eventName, (data: { fightId: number, fightItemsId: number }) => {
      console.log("Socket update received", data);
      updateCounter(data.fightItemsId);
    });
    socket.on(commentEventName, (data: FightComment) => {
      console.log("Socket comment update received", data);
      updateComment(data);
    });
  }, [fight.id]);


  const handleVote = (id: number) => {
    if (fightItems && fightItems.length > 0) {
      setHideVote(true);
      updateCounter(id);

      //socket
      socket.emit(`fighting-${fight.id}`, {
        fightId: fight.id,
        fightItemsId: id
      })
    }
  }

  const handleSubmitComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (comment.length > 2) {
      const payload = {
        fightId: fight.id,
        comment: comment,
        created_at: new Date().toISOString(),
      }
      socket.emit(`fighting_comment-${fight.id}`, payload)
      updateComment(payload)
    } else {
      toast.warning("Comment must be at least 3 characters long")
      setComment("")
    }


  }

  const updateCounter = (id: number) => {
    setFightItems((prevItems) => {
      const items = [...prevItems];
      const findIndex = items.findIndex((item) => item.id === id);
      if (findIndex !== -1) {
        items[findIndex] = {
          ...items[findIndex],
          count: items[findIndex].count + 1,
        };
      }
      return items;
    });
  };

  const updateComment = (comment: FightComment) => {
    setFightComments((prevComments) => {
      const comments = [...prevComments, comment];
      return comments;
    });
  };
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

              {hideVote ? <CountUp start={0} end={item.count} duration={0.5} className="text-5xl font-extrabold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent" />
                :
                <Button onClick={() => handleVote(item.id)}>
                  <span>Vote </span> <ThumbsUp />
                </Button>}


            </div>

            {index % 2 === 0 && (
              <div className="w-full flex lg:w-auto justify-center items-center">
                <h1 className="text-2xl font-bold text-gray-600 lg:text-4xl ">vs</h1>
              </div>
            )}
          </Fragment>
        ))}
      </div>
      <form onSubmit={handleSubmitComment} className="mt-4 w-full">
        <Textarea placeholder="Type comment here....." value={comment} onChange={(e) => setComment(e.target.value)} />
        <Button type="submit" className="mt-4 w-full">Add Comment</Button>
      </form>


      <div className="mt-4">
        {fightComments && fightComments.length > 0 && fightComments.map((comment, index) => {
          return (
            <div key={index} className="w-full md:w-[500px] rounded-lg p-4 bg-muted mb-4">
              <p className="font-bold">{comment.comment}</p>
              <p>{new Date(comment.created_at).toLocaleString()}</p>
            </div>
          )
        })

        }

      </div>
    </div>
  )
}

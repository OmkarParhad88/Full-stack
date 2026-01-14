
import type { Server } from "socket.io";
import { votingQueue, votingQueueName } from "../jobs/votingJob";
import { commentQueue, commentQueueName } from "../jobs/CommetJob";

export function setupSocket(io: Server) {
  io.on("connection", (client) => {
    console.log("Client connected : ", client.id);

    client.onAny(async (eventName: string, data: any) => {
      if (eventName.startsWith("fighting-")) {
        console.log(data)
        await votingQueue.add(votingQueueName, data)
        client.broadcast.emit(`fighting-${data.fightId}`, data)
      }

      if (eventName.startsWith("fighting_comment-")) {
        console.log(data)
        await commentQueue.add(commentQueueName, data)
        client.broadcast.emit(`fighting_comment-${data.fightId}`, data)
      }
    })
  })
}
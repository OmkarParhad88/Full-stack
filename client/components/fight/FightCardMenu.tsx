'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EllipsisVerticalIcon } from "lucide-react"
import dynamic from "next/dynamic"
import { Suspense, useState } from "react"
const EditFight = dynamic(() => import("./EditFight"))
import { FightCardProps } from "@/types"
import DeleteFight from "./DeleteFight"
import { toast } from "sonner"
import { Env } from "@/lib/env"

export default function FightCardMenu({ fight, token }: { fight: FightCardProps, token: string }) {
  const [open, setOpen] = useState(false)
  const [openDelete, setOpenDelete] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(`${Env.APP_URL}/fight/${fight.id}`)
    toast.success("Link copied to clipboard")
  }

  return (
    <>
      {open && (<Suspense fallback={<div>Loading...</div>}>
        <EditFight fight={fight} open={open} setOpen={setOpen} />
      </Suspense>)}
      {openDelete && (<Suspense fallback={<div>Loading...</div>}>
        <DeleteFight open={openDelete} setOpen={setOpenDelete} id={fight.id} token={token} />
      </Suspense>)}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <EllipsisVerticalIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuItem onClick={() => setOpen(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopy}>
            Copy Link
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpenDelete(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

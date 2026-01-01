"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dispatch, SetStateAction, useActionState, useEffect, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { clearCacheFight, updateFightActions } from "@/actions/fightActions"

import { ChevronDownIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { SubmitButton } from "../common/SubmitButton"
import { toast } from "sonner"
import { FightCardProps } from "@/types"

const EditFight = ({ fight, open, setOpen }: { fight: FightCardProps, open: boolean, setOpen: Dispatch<SetStateAction<boolean>> }) => {

  const [openDate, setOpenDate] = useState(false)
  const [date, setDate] = useState<Date | undefined>(new Date(fight.expire_at))

  const initialState = {
    status: 0,
    message: '',
    errors: {}
  }
  const [state, formAction] = useActionState(updateFightActions, initialState)

  useEffect(() => {
    if (state?.status === 200) {
      toast.success(state?.message)
      clearCacheFight("dashboard")

      setOpen(false)
      return
    } else if (state?.status === 500) {
      clearCacheFight("dashboard")
      toast.error(state?.message)
    }

  }, [state])

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Add Fight</Button>
        </DialogTrigger>
        <DialogContent onInteractOutside={e => e.preventDefault()} className="sm:max-w-[425px]">
          <form action={formAction}>
            <input type="hidden" name="id" value={fight.id} />
            <DialogHeader>
              <DialogTitle>Edit Fight</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="title">Title</Label>
                <Input id="title" placeholder="Type your title here." name="title" defaultValue={fight.title} />
                <span className='text-red-500'>{state!.errors?.title}</span>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" placeholder="Type your description here." name="description" defaultValue={fight.description} />
                <span className='text-red-500'>{state!.errors?.description}</span>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="image">Image</Label>
                <Input id="image" name="image" type="file" />
                <span className='text-gray-700'>{fight.image}</span>
                <span className='text-red-500'>{state!.errors?.image}</span>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="image">Expiere at</Label>
                <input type="hidden" name="expire_at" value={date?.toISOString() ?? ""} />
                <Popover open={openDate} onOpenChange={setOpenDate}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      id="date"
                      className="w-48 justify-between font-normal"
                    >
                      {date ? date.toLocaleDateString() : "Select date"}
                      <ChevronDownIcon />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      captionLayout="dropdown"
                      onSelect={(date) => {
                        setDate(date)
                        setOpenDate(false)
                      }}
                    />
                  </PopoverContent>
                </Popover>
                <span className='text-red-500'>{state!.errors?.expire_at}</span>
              </div>
            </div>
            <DialogFooter>
              <SubmitButton />
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EditFight


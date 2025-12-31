'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { FIGHT_URL } from "@/lib/apiEndPoints";
import axios from "axios";
import { Dispatch, SetStateAction, useState } from "react";
import { clearCacheFight } from "@/actions/fightActions";
import { toast } from "sonner";
export default function DeleteFight({ open, setOpen, id, token }: { open: boolean; setOpen: Dispatch<SetStateAction<boolean>>; id: number, token: string }) {

  const [loading, setLoading] = useState(false);

  const deleteFight = async () => {
    setLoading(true);
    const response = await axios.delete(`${FIGHT_URL}/${id}`, {
      headers: {
        "Authorization": token || ""
      }
    });
    if (response.status === 200) {
      clearCacheFight("dashboard");
      toast.success("Fight deleted successfully");
    } else {
      toast.error("Fight deleted failed");
    }

    setOpen(false);
    setLoading(false);
  };


  return (
    <div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be logged out from the application.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteFight} disabled={loading}>{loading ? "Deleting..." : "Delete"}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

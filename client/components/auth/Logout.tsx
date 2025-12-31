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
import { Dispatch, SetStateAction } from "react";
import { signOut } from "next-auth/react";

export default function Logout({ open, setOpen }: { open: boolean; setOpen: Dispatch<SetStateAction<boolean>> }) {

  const logout = () => {
    signOut({
      callbackUrl: "/login",
      redirect: true,
    });
  }
  return (
    <div>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be logged out from the application.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => { logout() }}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

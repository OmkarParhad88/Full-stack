'use client'

import { Upload } from "lucide-react"
import Image from "next/image"
import { Button } from "../ui/button"
import { useRef, useState } from "react";
import { FightItemForm } from "@/types";
import { FIGHT_ITEM_URL } from "@/lib/apiEndPoints";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AddFightItem({ fightId, token }: { fightId: string, token: string }) {

  const router = useRouter()

  const [items, setItems] = useState<FightItemForm[]>([{ image: null }, { image: null }])

  const [urls, setUrls] = useState<string[]>(["", ""])

  const [loading, setLoading] = useState(false)


  const imageRefLeft = useRef<HTMLInputElement | null>(null);
  const imageRefRight = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const updatedItems = [...items];
      updatedItems[index].image = file;
      setItems(updatedItems);

      const imageUrl = URL.createObjectURL(file);
      const updatedUrl = [...urls];
      updatedUrl[index] = imageUrl;
      setUrls(updatedUrl);
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("fight_id", fightId);
      items.map((item, index) => {
        formData.append(`images[]`, item.image as File);
      })

      if (formData.get("images[]")) {
        setLoading(true)
        const { data } = await axios.post(FIGHT_ITEM_URL, formData, {
          headers: {
            "Authorization": token,
          }
        })
        console.log(data)
        setLoading(false)
        if (data.status === 200) {
          toast.success(data.message)
          setTimeout(() => {
            router.push(`/dashboard`)
          }, 1000);
        }
        return
      }
      toast.warning("Please select an image")
    } catch (error) {
      console.log(error);
      if (error instanceof AxiosError) {
        let status = error.status
        if (status === 401 || status === 403 || status === 404 || status === 500) {
          toast.error(error.response?.data.message)
          return
        }
        if (status === 422) {
          let errors: string[] = error.response?.data.errors
          errors.map((error) => {
            toast.error(error)
          })
          return
        }

        toast.error("Something went wrong")
      }
      setLoading(false)
    }
  };

  return (
    <div className='mt-10'>
      <div className='flex flex-wrap lg:flex-nowrap items-center justify-between'>
        <div className='w-full flex lg:w-[500px] justify-between items-center flex-col' onClick={() => imageRefLeft.current?.click()}>
          <input type="file" name="image" className="hidden" onChange={(e) => handleChange(e, 0)} ref={imageRefLeft} />
          <div className='w-full flex justify-center items-center rounded-md border border-dashed p-2 h-[300px]'>
            {urls[0] ? <Image src={urls[0]} alt="" width={500} height={500} className="w-full h-full object-cover" /> : <div className="flex flex-col items-center"><Upload /> <span>Upload Image</span></div>}
          </div>
        </div>

        <div className="w-full flex lg:w-auto justify-center items-center">
          <h1 className="text-2xl font-bold text-gray-600 lg:text-4xl ">vs</h1>
        </div>

        <div className='w-full flex lg:w-[500px] justify-between items-center flex-col' onClick={() => imageRefRight.current?.click()}>
          <input type="file" name="image" className="hidden" onChange={(e) => handleChange(e, 1)} ref={imageRefRight} />
          <div className='w-full flex justify-center items-center rounded-md border border-dashed p-2 h-[300px]'>
            {urls[1] ? <Image src={urls[1]} alt="" width={500} height={500} className="w-full h-full object-cover" /> : <div className="flex flex-col items-center"><Upload /> <span>Upload Image</span></div>}
          </div>
        </div>
      </div>

      <div className="w-full flex lg:w-auto justify-center items-center mt-10">
        <Button className="w-52" onClick={handleSubmit} disabled={loading}>{loading ? "Loading..." : "Submit"}</Button>
      </div>
    </div>
  )
}

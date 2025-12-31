'use server'

import axios, { AxiosError } from "axios";
import { FIGHT_URL } from "@/lib/apiEndPoints";
import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/options";
import { revalidatePath, revalidateTag } from "next/cache";

export async function clearCacheFight(tag: string) {
  revalidateTag(tag, 'page')
}

export const createFightActions = async (prevState: any, formData: FormData) => {
  const session = await getServerSession(authOptions)
  try {
    const data = await axios.post(FIGHT_URL, formData, {
      headers: {
        "Authorization": session?.user?.token
      },
    });
    if (data.status === 200) {
      return {
        status: 200,
        message: data.data?.message,
        errors: data.data?.errors,
      }
    }
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      console.log(error);
      return {
        status: error.response?.status || 500,
        message: error.message,
        errors: error.response?.data.errors,
      }
    } else {
      return {
        status: 500,
        message: "Internal Server Error",
        errors: error,
      }
    }
  }
}

export const updateFightActions = async (prevState: any, formData: FormData) => {
  const session = await getServerSession(authOptions);

  const image = formData.get("image") as File;

  const payload = new FormData();

  payload.append("title", formData.get("title") as string);
  payload.append("description", formData.get("description") as string);
  payload.append("expire_at", formData.get("expire_at") as string);

  if (image && image.size > 0 && image.name !== "undefined") {
    payload.append("image", image);
  }

  try {
    const data = await axios.put(FIGHT_URL + "/" + formData.get('id'), payload, {
      headers: {
        "Authorization": session?.user?.token
      },
    });
    if (data.status === 200) {
      return {
        status: 200,
        message: data.data?.message,
        errors: data.data?.errors,
      }
    }
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError) {
      console.log(error);
      return {
        status: error.response?.status || 500,
        message: error.message,
        errors: error.response?.data.errors,
      }
    } else {
      return {
        status: 500,
        message: "Internal Server Error",
        errors: error,
      }
    }
  }
}
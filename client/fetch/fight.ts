import { FIGHT_URL } from "@/lib/apiEndPoints";
import { getServerSession } from "next-auth";
import { authOptions } from "../app/api/auth/[...nextauth]/options";

export const getFightList = async (): Promise<any> => {
  try {
    const session = await getServerSession(authOptions)
    const response = await fetch(FIGHT_URL, {
      headers: {
        "Authorization": session?.user?.token || ""
      },
      next: {
        revalidate: 0,
        tags: ["dashboard"]
      }
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
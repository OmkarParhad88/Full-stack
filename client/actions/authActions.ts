"use server"

import { REGISTER_URL } from "@/lib/apiEndPoints";
import axios, { AxiosError } from "axios";

export const registerActions = async (prevState: any, formData: FormData) => {
  try {
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    // if (!name || !email || !password || !confirmPassword) {
    //   throw new Error("All fields are required");
    // }

    // if (password !== confirmPassword) {
    //   throw new Error("Passwords do not match");
    // }

    // console.log(name, email, password, confirmPassword);


    const user = await axios.post(REGISTER_URL, {
      name,
      email,
      password,
      confirmPassword,
    });

    if (user.status === 200) {
      return {
        status: 200,
        message: user.data?.message,
        errors: user.data?.errors,
      }
    }


  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError)
      return {
        status: error.status,
        message: error.message,
        errors: error.response?.data.errors,
      }
    else
      return {
        status: 500,
        message: "Internal Server Error",
        errors: error,
      }

  }

}

export const loginActions = async (prevState: any, formData: FormData) => {

}

"use server"
import { CHECK_CREDENTIALS_URL, FORGET_PASSWORD_URL, REGISTER_URL, RESET_PASSWORD_URL } from "@/lib/apiEndPoints";
import axios, { AxiosError } from "axios";

export const registerActions = async (prevState: any, formData: FormData) => {
  try {
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

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
        status: error.response?.status || 500,
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
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    const data = await axios.post(CHECK_CREDENTIALS_URL, {
      email,
      password,
    });
    if (data.status === 200) {
      return {
        status: 200,
        message: data.data?.message,
        errors: data.data?.errors,
        data: {
          email: formData.get("email"),
          password: formData.get("password"),
        }
      }
    }
  } catch (error) {
    console.log(error);
    if (error instanceof AxiosError)
      return {
        status: error.response?.status || 500,
        message: error.message,
        errors: error.response?.data.errors,
        data: {}
      }
    else
      return {
        status: 500,
        message: "Internal Server Error",
        errors: error,
        data: {}
      }
  }
}

export const forgetPasswordActions = async (prevState: any, formData: FormData) => {
  try {
    const email = formData.get("email");

    const data = await axios.post(FORGET_PASSWORD_URL, {
      email,
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
    if (error instanceof AxiosError)
      return {
        status: error.response?.status || 500,
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

export const resetPasswordActions = async (prevState: any, formData: FormData) => {
  try {
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");
    const token = formData.get("token");

    const data = await axios.post(RESET_PASSWORD_URL, {
      email,
      password,
      confirmPassword,
      token,
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
    if (error instanceof AxiosError)
      return {
        status: error.response?.status || 500,
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



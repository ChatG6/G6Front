import axios from 'axios';
import URLS from "@/app/config/urls";
import { reCAPTCHA } from '../config/config';
import urls from '@/app/config/urls';
import { commonResponse } from '../config/types';
export const login = async (username: string, password: string) => {
    const response = await axios.post(`${URLS.urls.main}/api/auth/login`,{usr:username,pwd:password});
    return response
};

export const verifyUser = async(token:string,email:string)=>{
    const verifyState = await axios.post(`${URLS.urls.main}/api/auth/verify`,{token,email});
    return verifyState
  };

export const checkReCAPTCHA = async (
  token: string
): Promise<commonResponse> => {
  if (!token)
    return { success: false, message: "ReCAPTCHA token not provided" };
  const captchaURL = new URL(reCAPTCHA.urls.verify_url);
  captchaURL.searchParams.set("secret", reCAPTCHA.credintials.secret_key);
  captchaURL.searchParams.set("response", token);

  try {
    const response = await axios.post(captchaURL.toString());
    const data = response.data;
    console.log(data)
    if (data.success) {
      return { success: true, message: "Human check completed" };
    } else {
      return { success: false, message: data["error-codes"] };
    }
  } catch (error: any) {
    return { success: false, message: error.message };
  }
};
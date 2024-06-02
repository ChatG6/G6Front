import axios from 'axios';
import URLS from "@/app/config/urls";
export const login = async (username: string, password: string) => {
    const response = await axios.post(`${URLS.urls.main}/api/auth/login`,{usr:username,pwd:password});
    return response
};

export const verifyUser = async(token:string,email:string)=>{
    const verifyState = await axios.post(`${URLS.urls.main}/api/auth/verify`,{token,email});
    return verifyState
  };
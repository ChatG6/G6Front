"use client";

import { useEffect, useRef, useState } from "react";
import HeaderPortal from "./HeaderPortal";
import URLS from "@/app/config/urls";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
export default function ResizableIframe({ src }: { src: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { data: session, status } = useSession();
     const [substatus, setsubstatus] = useState('');
         const [up, setup] = useState(false);
         const [canc, setcanc] = useState(false);
         const [res, setres] = useState(false);
         const redirect_url = URLS.urls.main
         useEffect(() => {
             const fetchLR = async ()=> {
               const resp = await axios.post(URLS.endpoints.status);
               console.log(resp.data.statuss)
               console.log(resp.data.quota)
               console.log(resp.data.error)
               console.log(resp.data.error)
               if (resp.data.statuss != 'unknown') {setsubstatus(resp.data.statuss); 
                // console.log(resp.data.error)  
                }
            
               if (resp.data.statuss === 'active') {setcanc(true)}
               else if (resp.data.statuss === 'Free Trial') {setup(true)}
               else {setres(true)}
             }
             fetchLR();
             },[substatus,setsubstatus])
   useEffect(() => {
    const sendSession = () => {
      const msg = {
        type: "APP_SESSION_UPDATE",
        payload: {
          loggedIn: !!session?.user,
          username: session?.user?.name || "",
          status:substatus
        },
      };

      const iframe = document.querySelector("iframe");
      iframe?.contentWindow?.postMessage(msg, "*"); // send message to iframe
    };

    sendSession();
    const interval = setInterval(sendSession, 2000); // periodically
    return () => clearInterval(interval);
  }, [session]);
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "APP_SIGNOUT_REQUEST") {
        // Call your signOut function
        signOut({ redirect: true, callbackUrl: URLS.urls.main });
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);
  useEffect(() => {
    const handleMessage = async(e: MessageEvent) => {
      if (e.data?.type === "APP_SUB_CANCEL_REQUEST") {
          const subscription = false;
               let priceId = '';
               try {
                 const  resp  = await axios.post(URLS.endpoints.stripe_session,
                   { priceId, subscription });
                  if (resp.data.status) {
                      setsubstatus('canceled')
                      setcanc(false);
                      setres(true)
                      
                  }
                // console.log('data', resp.data)
              
               } catch (error) {
                 //console.error('Error during checkout:', error);
          
                 return
               }
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);
  
  return (
    <>
     
      <iframe
        ref={iframeRef}
        className="w-full h-full"
       src={src}
      ></iframe>
    </>
  );
}
'use client'
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js"
import { useEffect, useState } from "react";
import URLS from "@/app/config/urls";
import { Button1 } from "@/components/ui/upg-btn";
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Sub() {
    const [quota, setquota] = useState(50);
    const [quotaplg, setquotaplg] = useState(50);
    const [status, setstatus] = useState('');
    const [up, setup] = useState(false);
    const [canc, setcanc] = useState(false);
    const [res, setres] = useState(false);
    useEffect(() => {
        const fetchLR = async ()=> {
          const resp = await axios.post(URLS.endpoints.status);
          //console.log(resp.data.statuss)
          //console.log(resp.data.quota)
          //console.log(resp.data.error)
          //console.log(resp.data.error)
          if (resp.data.statuss != 'unknown') {setstatus('Your Subscription is:'+resp.data.statuss); 
           // console.log(resp.data.error)  
           }
          if (resp.data.quota != 500) {setquota(resp.data.quota); //console.log(resp.data.error)
          }
          if (resp.data.quotaplg != 500) {setquotaplg(resp.data.quotaplg); //console.log(resp.data.error)
          }
          if (resp.data.statuss === 'active') {setcanc(true)}
          else if (resp.data.statuss === 'Free Trial') {setup(true)}
          else {setres(true)}
        }
        fetchLR();
        },[status,setstatus,quota,setquota])
  const handleCancel = async () => {
 
     const subscription = false;
     let priceId = '';
     try {
       const  resp  = await axios.post(URLS.endpoints.stripe_session,
         { priceId, subscription });
        if (resp.data.status) {
            setstatus('Your Subscription is: canceled')
            setcanc(false);
            setres(true)
            
        }
      // console.log('data', resp.data)
    
     } catch (error) {
       //console.error('Error during checkout:', error);

       return
     }
   };
   const handleupgrade = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/pricing`
    //(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/pricing`)
  };
  return  ( 
  <div>
 {status}<br/>
 {(up||res) &&  <span><p>Your Free Quota is:</p><p>{quota} AI-generated content</p>
 <p>{quotaplg} Plagiarism Checks</p>
 </span>}<br/>
 {canc && <Button1
      onClick={handleCancel}
      //className=" text-sm w-full " 
      style={{
        backgroundColor: '#545CEB',
      }}>
      Cancel
    </Button1>}
    {up && <Button1
      onClick={handleupgrade}
      //className=" text-sm w-full " 
      style={{
        backgroundColor: '#545CEB',
      }}>
      Upgrade
    </Button1>}
    {res && <Button1
      onClick={handleupgrade}
      //className=" text-sm w-full " 
      style={{
        backgroundColor: '#545CEB',
      }}>
      Resume
    </Button1>}
  </div>)
}

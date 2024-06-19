'use client'
import { options } from "../api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js"
import { useEffect, useState } from "react";
import URLS from "../config/urls";
import { Button1 } from "@/components/ui/upg-btn";
import Sub from "@/components/pricing/sub";
export default function Page() {
  //const { data: session, status } = useSession();
 // if (!session) {
   // redirect("/api/auth/signin?callbackUrl=/profile");
 // }
  const handleCheckout = async () => {
 
    // if (!session) {
     //  redirect("/api/auth/signin?callbackUrl=/pricing");
    // }
    // else {
     const subscription = false;
     let priceId = '';
     try {
       const  resp  = await axios.post(URLS.endpoints.stripe_session,
         { priceId, subscription });
 
       console.log('data', resp.data)
    
     } catch (error) {
       console.error('Error during checkout:', error);
       //toast('Error during checkout')
       return
     }//}
   };

  return  ( 
    <><Sub /></>)
}

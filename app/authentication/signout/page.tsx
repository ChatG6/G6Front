"use client";

import React, { useState } from "react";
import { signIn, signOut } from "next-auth/react";

import { options } from "@/app/api/auth/[...nextauth]/options";
import URLS from "@/app/config/urls";
type Props = {
  searchParams?: Record<"callbackUrl" | "error", string>;
};

const SignoutPage = (props: Props) => {
  const redirect_url = URLS.urls.main

  return (
    <>
     <div className="form">
      <h1>Are you sure to sign out?</h1>
      <button onClick={()=> signOut({redirect:true,callbackUrl:redirect_url})}>Sign out</button>
     </div>
    </>
  );
};

export default SignoutPage;

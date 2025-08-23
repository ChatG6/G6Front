import { ReactNode } from "react";
import { Metadata } from "next";
import Header from "@/components/Management/Header";
import AuthProvider from "@/app/context/AuthProvider";
// import '@/app/styles/styles.css'


export const metadata: Metadata = {
  title: "Sign Up",
};

export default function Layout({children}:{children:ReactNode}){
  
  return (
  <><AuthProvider>
      <Header />
    </AuthProvider><section className="layout">{children}</section></>
   
   
  )
}
import { ReactNode } from "react";
import { Metadata } from "next";
import AuthProvider from "@/app/context/AuthProvider";
import Header from "@/components/Management/Header";
// import '@/app/styles/styles.css'

export const metadata: Metadata = {
  title: "Reset Password",
};

export default function Layout({children}:{children:ReactNode}){
  return (
    <><AuthProvider>
      <Header />
    </AuthProvider><section className="layout">{children}</section></>
  )
}
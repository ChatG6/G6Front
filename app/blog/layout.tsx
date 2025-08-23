import { ReactNode } from "react";
import { Metadata } from "next";
import Header from "@/components/Management/Header";
import AuthProvider from "@/app/context/AuthProvider";
export const metadata: Metadata = {
  title: "Blog",
};

export default function Layout({children}:{children:ReactNode}){
  return <><AuthProvider>
        <Header />
      </AuthProvider>{children}</>
}
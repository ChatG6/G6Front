import { PropsWithChildren } from "react";
import AuthProvider from "./context/AuthProvider";
import "@/app/styles/main.css";
import { Metadata } from "next";
import Header from "@/components/Management/Header";
import { ThemeProvider } from "@/components/theme-provider"
import { Inter } from 'next/font/google'
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})
export const metadata: Metadata = {
  title: "ChatG6",
  description: 'Created by G6 Team',
  icons: {
    icon: '/icon.png', // Pointing to the correct icon
  },
};

export default function RootLayout({children}:PropsWithChildren) {
  return (
    <html lang="en" className={inter.className }>
      <body>
      {/* <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          > */}
        <AuthProvider>
          <Header />
        </AuthProvider>
          <main>{children}</main>
          {/* </ThemeProvider> */}
      </body>
    </html>
  );
}

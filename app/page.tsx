import { options } from "./api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
//import Main from "@/components/HomePage/main";
import dynamic from 'next/dynamic';

// Dynamically import the component without SSR
const Main = dynamic(
  () => import('@/components/HomePage/main'),
  { ssr: false }
);
/*
export default async function HomePage() {
  const session = await getServerSession(options);
  return (<Main/>);
}*/
export default function Frame() {

  return <iframe className="w-full h-full" src="/Home/index.html" ></iframe>
}

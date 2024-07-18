// import Editor from "@/components/editor/Editor";
// added dynamic import and disable server rendering to fix document not defined error
// import ChatWindow from "@/components/chatWindow";

// import {Projects} from '@/components/pojects/project'

import { options } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { Inter } from 'next/font/google'
import dynamic from "next/dynamic";
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})
const Editor =dynamic(()=>
	import ("@/components/editor/Editor"),{ssr:false,}
)
const ChatWindow =dynamic(()=>
	import ("@/components/chatWindow"),{ssr:false,}
)
const Projects =dynamic(()=>
	import ("@/components/pojects/project"),{ssr:false,}
)
export default function Lab() {
	

	return (
		<main className="h-full main-editor duration-150 ease-in-out ">
			<div className="projects ">
				<Projects/>
			</div>
			<div className={` w-full flex h-full ${inter.className}`}>
				<Editor/>
			</div>
			<div className=" chat  flex flex-row max-w-5xl space-x-4 h-full overflow-hidden">
				<div className="flex flex-row space-x-4 h-full overflow-hidden window">
        			<ChatWindow className="flex flex-col h-full overflow-hidden" /> 
       			</div>
			</div>
		</main>
	);
}
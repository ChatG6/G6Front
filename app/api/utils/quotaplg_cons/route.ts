import { db } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";
import { message } from "antd";


async function handler(req: Request) {
  try {
  //const now = new Date();
  //const { name} = await req.json();
  const session = await getServerSession(options)
  const username = session?.user?.name
  const email = session?.user?.email
  console.log(`EMAIL:${email}\nNAME:${username}\n`);
 // let selection = { username: username };
  let selection = { name: username };
  let quota,newkey;
  let quotas = await db.user.findMany({
    where: selection,
    select: {
      id:true,
      freequotaplg:true
    },
  });
  if (quotas.length != 0) {
    if (quotas[0].freequotaplg) {
    quota = quotas[0].freequotaplg -1
    newkey = await db.user.update({
        where: {id:quotas[0].id},
        data: {
          freequotaplg:quota
        }
      });}
  }
  else {newkey = null}
   if (newkey) {
   return NextResponse.json({ quotaplg:quota,message:'done' });}
   else {return NextResponse.json({ quotaplg:500,message:'error' });}
} 
    catch(error) {
        return NextResponse.json({quotaplg:500,message:'error' });
      }
    
    }

export { handler as GET, handler as POST };

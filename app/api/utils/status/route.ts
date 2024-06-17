import { db } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";
import { NextResponse } from "next/server";


async function handler(req: Request) {
  try {
  //const now = new Date();
  //const { name} = await req.json();
  const session = await getServerSession(options)
  const username = session?.user?.name
  const email = session?.user?.email
  console.log(`EMAIL:${email}\nNAME:${username}\n`);
  let selection = { username: username };
  let selection2 = { name: username };
  let ids = await db.user.findMany({
    where: selection2,
    select: {
      id:true,
    },
  });
  let selection3 = { user_id: ids[0].id };
  let statussub,quota,quotaplg;
  let keys = await db.subScription.findMany({
    where: selection3,
    select: {
      id:true,
      status:true
    },
  });
  let quotas = await db.user.findMany({
    where: selection2,
    select: {
      id:true,
      freequota:true
    },
  });
  if (quotas.length != 0) {
  quota = quotas[0].freequota
  }
  else {quota = 50}
  if (keys.length != 0) {
    statussub = keys[0].status
  } else {
    statussub = 'Free Trial'
    //return NextResponse.json({ status: 'Free Trial' });
   }
   let quotasplg = await db.user.findMany({
    where: selection2,
    select: {
      id:true,
      freequotaplg:true
    },
  });
  if (quotasplg.length != 0) {
    quotaplg = quotasplg[0].freequotaplg
  }
  else {quotaplg = 50}
   return NextResponse.json({ statuss: statussub,quota:quota,quotaplg:quotaplg});
} 
    catch(error) {
        return NextResponse.json({statuss:'unknown',quota:500,error:error});
      }
    
    }

export { handler as GET, handler as POST };

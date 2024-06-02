import { db } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";

async function handler(req: Request) {
  try {
  const { name} = await req.json();
  const session = await getServerSession(options)
  const username = session?.user?.name
  const email = session?.user?.email
  console.log(`EMAIL:${email}\nNAME:${username}\n`);
  let imports:any = [];
  let res;
  const selection = {email: email,type:'html',name:name };
 imports = await db.document.findMany({
    where: selection,
    select: {
      link:true,
      id:true
    },
  });
  res = await db.document.delete({
    where: {id:imports[0].id},
  });
      return Response.json({key:imports[0].link},{status:200})} catch(error) {
        return Response.json({error},{status:500})
      }
    
    }

export { handler as GET, handler as POST };

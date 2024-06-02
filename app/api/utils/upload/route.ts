import { db } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";

async function handler(req: Request) {
  try {
  const { name} = await req.json();
  //const { date} = await req.json();
  const session = await getServerSession(options)
  const username = session?.user?.name
  const email = session?.user?.email
  console.log(`EMAIL:${email}\nNAME:${username}\n`);
  let imports = [];
  let selection = { username: username, email: email,type:'html',name:name };
      imports = await db.document.findMany({
        where: selection,
        select: {
          type: true,
          name:true,
          link:true,
          id:true
        },
      });
      let newkey;
      const now = new Date()
      const key = username+name+now;
      if (imports.length == 0) {
      newkey = await db.document.create({
        data:{
          email:email,
          username:username,
          type:'html',
          link:key,
          name:name,
          recieveDate:now
        }
      })}
      else {
        newkey = await db.document.update({
          where: {id:imports[0].id},
          data: {
            link: key // Assuming you want to update the 'link' field
          }
        });
      }
    if(key && newkey) 
      {return Response.json({key:key},{status:200})}} catch(error) {
        return Response.json({error},{status:500})
      }
    
    }

export { handler as GET, handler as POST };

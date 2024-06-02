import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { db } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

async function handler(req: Request) {
  const session = await getServerSession(options);
  const username = session?.user?.name
  const email = session?.user?.email
  if(!session){
    return Response.json({message:'Log in first'},{status:200})
  }
  const {link,date,type,status,total_pages,name} = await req.json()
  if(!link || !date || !type || !status || !total_pages || !name){
    console.log(type);
    console.log(name);
    console.log(status);
    console.log(total_pages);
    console.log(link);
    
    return Response.json({message:'Invalid parameters'},{status:400})
  }
  let selection = { username: username, email: email,type:'pdf',name:name,status:status };
  let imports = await db.document.findMany({
    where: selection,
    select: {
      type: true,
      name:true,
      link:true,
      id:true
    },
  });
  let newkey;
      const now = new Date();
      if (imports.length==0 || status=='Chat') {
       newkey = await db.document.create({
        data:{
          email:session.user?.email,
          username:session.user?.name,
          link:link,
          status:status,
          type:type,
          total_pages:total_pages,
          name:name,
          recieveDate:now
        }
      })}
      else {
        newkey = await db.document.update({
          where: {id:imports[0].id},
          data: {
            link: link,
            status:status,
            total_pages:total_pages, 
            recieveDate:now,
          }
        }); 
      }
      console.log(newkey)
      if(newkey)return Response.json({ok:true},{status:200}) 
   
    return Response.json({message:'Invalid request'},{status:300})
    }



export {handler as POST, handler as GET };

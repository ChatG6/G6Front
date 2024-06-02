import { db } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { options } from "../../auth/[...nextauth]/options";


async function handler(req: Request) {
  try {
  const now = new Date();
  const { name} = await req.json();
  const session = await getServerSession(options)
  const username = session?.user?.name
  const email = session?.user?.email
  console.log(`EMAIL:${email}\nNAME:${username}\n`);
  let selection = { username: username, email: email,type:'html',name:name };
  let keys = await db.document.findMany({
    where: selection,
    select: {
      type: true,
      name:true,
      link:true,
      id:true
    },
  });
  let newkey;
  if (keys.length != 0) {
    newkey = await db.document.update({
        where: {id:keys[0].id},
        data: {
          link: username+name+now,
          name:name // Assuming you want to update the 'link' field
        }
      });
  } else {
      const now = new Date()
      const newkey = await db.document.create({
        data:{
          email:email,
          username:username,
          type:'html',
          link:username+name+now,
          name:name,
          recieveDate:now,
          status:'editing'
        }
      })
      console.log(newkey)
    if(newkey) 
     {return Response.json({success:true,date:newkey.recieveDate},{status:200})} 
    else {return Response.json({success:false,date:''},{status:400})}}} 
    catch(error) {
        return Response.json({error},{status:500})
      }
    
    }

export { handler as GET, handler as POST };

import { options } from "./api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";
import Main from "@/components/HomePage/main";

export default async function HomePage() {
  const session = await getServerSession(options);
  return <Main/>;
}

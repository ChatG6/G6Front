//import Main from "@/components/pricing/main";
//import Main from "@/components/HomePage/main";
import dynamic from 'next/dynamic';

// Dynamically import the component without SSR
const Main = dynamic(
  () => import('@/components/pricing/main'),
  { ssr: false }
);
export default async function pricing() {
  return <Main />;
}

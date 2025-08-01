import dynamic from 'next/dynamic';

// Dynamically import the component without SSR
const Main = dynamic(
  () => import('@/components/Emergency/Pricing'),
  { ssr: false }
);
/*
export default async function pricing() {
  return <Main />;
}*/
export default function pricing() {
  return (
    <>
      <iframe className="w-full h-full" src="/temp_pricing/pricing.html"></iframe>
    </>
  );
}


import ResizableIframe from "@/components/ResizeableIframe";

export default function HomePage() {
  return (
    <>
      {/* Your site header comes from layout.tsx */}
      <ResizableIframe src="/temp_home/index.html" />
    </>
  );
}

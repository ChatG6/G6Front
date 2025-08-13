"use client";

import { useEffect, useRef } from "react";

export default function ResizableIframe({ src }: { src: string }) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.iframeHeight && iframeRef.current) {
        iframeRef.current.style.height = event.data.iframeHeight + "px";
     console.log(iframeRef.current.style.height)
      }
     
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src={src}
      style={{
        border: "none",
        width: "100%",
        display: "block",
        marginBottom:"0px",
        paddingBottom:"0px",
        marginTop:"0px",
        paddingTop:"0px",
    
     //  overflow:"visible"
    
      }}
    />
  );
}

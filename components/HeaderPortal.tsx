"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Header from "@/components/Management/Header";

interface HeaderPortalProps {
  iframeRef: React.RefObject<HTMLIFrameElement>;
}

export default function HeaderPortal({ iframeRef }: HeaderPortalProps) {
  const [iframeBody, setIframeBody] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const onLoad = () => {
      // Mount to body of iframe
      setIframeBody(iframe.contentDocument?.body || null);
    };

    iframe.addEventListener("load", onLoad);

    return () => {
      iframe.removeEventListener("load", onLoad);
    };
  }, [iframeRef]);

  if (!iframeBody) return null;

  // Use React Portal to mount the header directly into iframe
  return createPortal(<Header />, iframeBody);
}

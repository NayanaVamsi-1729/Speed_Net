import { useEffect, useRef } from "react";

export default function AdBanner() {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!adRef.current) return;
    if (adRef.current.childNodes.length > 0) return;

    const isMobile = window.innerWidth < 640;

    window.atOptions = {
      key: isMobile
        ? "897417e82599fbcf05def6e9b1493d74" // 320x50
        : "3a7b6d9b40f29b8461d14eae6b91a21e", // 728x90
      format: "iframe",
      height: isMobile ? 50 : 90,
      width: isMobile ? 320 : 728,
      params: {},
    };

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.async = true;
    script.src = `https://www.highperformanceformat.com/${
      window.atOptions.key
    }/invoke.js`;

    adRef.current.appendChild(script);
  }, []);

  return (
    <div
      ref={adRef}
      className="w-full flex justify-center min-h-[50px] sm:min-h-[90px]"
    />
  );
}

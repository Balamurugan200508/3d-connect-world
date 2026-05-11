"use client";

import { useEffect, useState, useRef } from "react";
import ScrollCanvas from "@/components/ScrollCanvas";

export default function Home() {
  const [portfolioFinished, setPortfolioFinished] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === "portfolioEnded") {
        setPortfolioFinished(true);
        // Allow scrolling on body once portfolio is done
        document.body.style.overflow = "auto";
      }
    };

    // Prevent scrolling while portfolio is playing
    document.body.style.overflow = "hidden";
    
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <main className="bg-[#050505] min-h-screen relative">
      {/* The portfolio iframe overlay */}
      <div 
        className={`fixed inset-0 z-50 transition-opacity duration-1000 ease-in-out ${
          portfolioFinished ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <iframe 
          ref={iframeRef}
          src="/portfolio" 
          className="w-full h-full border-none"
          title="Portfolio Experience"
        />
      </div>

      {/* The Bike Scrollytelling Experience */}
      <ScrollCanvas />

    </main>
  );
}

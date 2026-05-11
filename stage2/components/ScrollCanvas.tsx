"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import DashboardOverlay from "@/components/DashboardOverlay";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// Helper component to handle script loading for Visme
const VismeEmbed = ({ url, formId, title }: { url: string; formId: string; title: string }) => {
  useEffect(() => {
    const existingScript = document.querySelector('script[src*="vismeforms-embed.js"]');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.src = 'https://static-bundles.visme.co/forms/vismeforms-embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, [url, formId]);

  return (
    <div 
      className="visme_d" 
      data-title={title} 
      data-url={`${url}?fullPage=true`} 
      data-domain="forms" 
      data-full-page="true" 
      data-min-height="100vh" 
      data-form-id={formId}
    />
  );
};

const FRAME_COUNT = 180;

export default function ScrollCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [imagesLoading, setImagesLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [mgmtModalOpen, setMgmtModalOpen] = useState(false);
  const [techModalOpen, setTechModalOpen] = useState(false);
  
  const imagesRef = useRef<HTMLImageElement[]>([]);
  
  // Element Refs for Text Animation
  const beatARef = useRef<HTMLDivElement>(null);
  const beatBRef = useRef<HTMLDivElement>(null);
  const sign1Ref = useRef<HTMLDivElement>(null);
  const sign2Ref = useRef<HTMLDivElement>(null);
  const sign3Ref = useRef<HTMLDivElement>(null);
  const sign4Ref = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);

  const loadImages = useCallback(async () => {
    let loaded = 0;
    const loadPromises = Array.from({ length: FRAME_COUNT }).map((_, i) => {
      return new Promise<HTMLImageElement>((resolve) => {
        const img = new Image();
        img.src = `/way/sequence/ezgif-frame-${String(i + 1).padStart(3, '0')}.png`;
        img.onload = () => {
          loaded++;
          setLoadProgress(Math.floor((loaded / FRAME_COUNT) * 100));
          imagesRef.current[i] = img;
          resolve(img);
        };
        img.onerror = () => {
          console.error(`Failed to load frame ${i}`);
          loaded++;
          setLoadProgress(Math.floor((loaded / FRAME_COUNT) * 100));
          resolve(img); // Resolve anyway so it doesn't hang
        };
      });
    });

    await Promise.all(loadPromises);
    setImagesLoading(false);
  }, []);

  const drawFrame = useCallback((index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imagesRef.current[index];

    if (!canvas || !ctx || !img) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Cover logic
    const ctxRatio = canvas.width / canvas.height;
    const imgRatio = img.width / img.height;
    
    let drawWidth, drawHeight;
    let offsetX = 0, offsetY = 0;

    if (imgRatio > ctxRatio) {
      drawHeight = canvas.height;
      drawWidth = canvas.height * imgRatio;
      offsetX = (canvas.width - drawWidth) / 2;
    } else {
      drawWidth = canvas.width;
      drawHeight = canvas.width / imgRatio;
      offsetY = (canvas.height - drawHeight) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  }, []);

  useEffect(() => {
    imagesRef.current = new Array(FRAME_COUNT);
    loadImages().then(() => drawFrame(0));
    return () => { imagesRef.current = []; };
  }, [loadImages, drawFrame]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); 
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Use GSAP to synchronize timeline accurately over scroll
  useGSAP(() => {
    if (imagesLoading) return;

    // Headless proxy object to bind 0-119 value
    const playhead = { frame: 0 };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1, // Smooth dampening matching our previous 100 stiffness
        onUpdate: (self) => {
          if (self.progress > 0.995 && !window.location.href.includes('/buildings')) {
            window.location.href = '/buildings';
          }
        }
      }
    });

    // Animate Frames
    tl.to(playhead, {
      frame: FRAME_COUNT - 1,
      snap: "frame",
      ease: "none",
      duration: 1, // The entire timeline acts as 1 full unit of "progress"
      onUpdate: () => drawFrame(playhead.frame)
    }, 0);

    // Scroll Indicator Hide (0 -> 10%)
    tl.to(indicatorRef.current, { opacity: 0, duration: 0.1, ease: "none" }, 0);

    // Beat A (0-20%) -> Fade in 0-5%, Holds 5-15%, Fades out 15-20%
    tl.fromTo(beatARef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.05, ease: "power1.out" }, 0);
    tl.to(beatARef.current, { opacity: 0, y: -20, duration: 0.05, ease: "power1.inOut" }, 0.15);

    // Beat B (Dashboard on Left Side, visible initially, fades out on scroll)
    tl.to(beatBRef.current, { opacity: 0, x: -20, duration: 0.05, ease: "power1.inOut" }, 0);

    // Sign 1 (Management - Left) 22-31%
    tl.fromTo(sign1Ref.current, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.02, ease: "power2.out" }, 0.22);
    tl.to(sign1Ref.current, { opacity: 0, x: -50, duration: 0.02, ease: "power2.in" }, 0.31);

    // Sign 2 (Marketing - Right) 33-42%
    tl.fromTo(sign2Ref.current, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 0.02, ease: "power2.out" }, 0.33);
    tl.to(sign2Ref.current, { opacity: 0, x: 50, duration: 0.02, ease: "power2.in" }, 0.42);

    // Sign 3 (Technical - Left) 44-53%
    tl.fromTo(sign3Ref.current, { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 0.02, ease: "power2.out" }, 0.44);
    tl.to(sign3Ref.current, { opacity: 0, x: -50, duration: 0.02, ease: "power2.in" }, 0.53);

    // Sign 4 (Financial - Right) 55-64%
    tl.fromTo(sign4Ref.current, { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 0.02, ease: "power2.out" }, 0.55);
    tl.to(sign4Ref.current, { opacity: 0, x: 50, duration: 0.02, ease: "power2.in" }, 0.64);


  }, { dependencies: [imagesLoading, drawFrame], scope: containerRef });

  return (
    <div ref={containerRef} className="relative h-[1600vh] bg-[#050505]">
      {imagesLoading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505]">
          <div className="text-white/60 text-sm uppercase tracking-widest mb-4 font-medium">Loading Experience</div>
          <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-300 ease-out" 
              style={{ width: `${loadProgress}%` }}
            />
          </div>
        </div>
      )}
      
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center pointer-events-none">
        <canvas
          ref={canvasRef}
          className="w-full h-full"
        />
        
        {/* Scroll Indicator */}
        <div 
          ref={indicatorRef}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center"
        >
          <div className="text-white/40 text-[10px] uppercase tracking-[0.2em] mb-3 font-medium">Scroll to Explore</div>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
        </div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="sticky top-0 h-screen w-full">
          {/* Beat A */}
          <div 
            ref={beatARef}
            className="absolute inset-0 flex items-center justify-center text-center px-4 opacity-0"
          >
            <div className="max-w-4xl">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tighter text-white/90 drop-shadow-lg mb-6">
                ENTRAIOT SOLUTION
              </h1>
              <p className="text-xl md:text-2xl text-white/60 font-light tracking-tight">
                Empowering innovation through AI, IoT, and intelligent solutions — that’s EntraIoT.
              </p>
            </div>
          </div>

          <div 
            ref={beatBRef}
            className="absolute left-[5vw] top-1/2 -translate-y-1/2 opacity-100 pointer-events-auto z-[60]"
          >
            <DashboardOverlay 
              onOpenMgmt={() => setMgmtModalOpen(true)} 
              onOpenTech={() => setTechModalOpen(true)} 
            />
          </div>

          {/* Sign 1: Management (Left) */}
          <div ref={sign1Ref} className="absolute inset-0 flex items-center justify-start w-full px-8 md:px-24 opacity-0 pointer-events-none">
            <a 
              href="#management-login"
              onClick={(e) => {
                e.preventDefault();
                setMgmtModalOpen(true);
              }}
              className="max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] relative overflow-hidden transition-transform duration-500 hover:scale-105 pointer-events-auto cursor-pointer block no-underline"
            >
              <div className="absolute -inset-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 blur-3xl opacity-50" />
              <div className="relative z-10">
                <div className="text-4xl mb-4 drop-shadow-md">🏢</div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">Management Field</h3>
                <p className="text-white/70 text-sm md:text-base leading-relaxed font-light">
                  Strategizing for the future, optimizing processes, and leading the way towards comprehensive digital transformation.
                </p>
                <div className="mt-6 flex items-center text-blue-400 text-sm font-medium">
                  <span>Access Portal</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </a>
          </div>

          {/* Sign 2: Marketing (Right) */}
          <div ref={sign2Ref} className="absolute inset-0 flex items-center justify-end w-full px-8 md:px-24 opacity-0 pointer-events-none">
            <div className="max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] relative overflow-hidden text-right flex flex-col items-end transition-transform duration-500 hover:scale-105 pointer-events-auto">
              <div className="absolute -inset-20 bg-gradient-to-bl from-orange-500/20 to-pink-500/20 blur-3xl opacity-50" />
              <div className="relative z-10 w-full">
                <div className="text-4xl mb-4 drop-shadow-md">📢</div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">Marketing Field</h3>
                <p className="text-white/70 text-sm md:text-base leading-relaxed font-light">
                  Crafting compelling narratives, engaging audiences, and driving growth through data-backed market intelligence.
                </p>
              </div>
            </div>
          </div>

          {/* Sign 3: Technical (Left) */}
          <div ref={sign3Ref} className="absolute inset-0 flex items-center justify-start w-full px-8 md:px-24 opacity-0 pointer-events-none">
            <a 
              href="#technical-login"
              onClick={(e) => {
                e.preventDefault();
                setTechModalOpen(true);
              }}
              className="max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] relative overflow-hidden transition-transform duration-500 hover:scale-105 pointer-events-auto cursor-pointer block no-underline"
            >
              <div className="absolute -inset-20 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 blur-3xl opacity-50" />
              <div className="relative z-10">
                <div className="text-4xl mb-4 drop-shadow-md">💻</div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">Technical Field</h3>
                <p className="text-white/70 text-sm md:text-base leading-relaxed font-light">
                  Building robust architectures, engineering innovative solutions, and pushing the boundaries of modern technology.
                </p>
                <div className="mt-6 flex items-center text-emerald-400 text-sm font-medium">
                  <span>Access Portal</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </a>
          </div>

          {/* Sign 4: Financial (Right) */}
          <div ref={sign4Ref} className="absolute inset-0 flex items-center justify-end w-full px-8 md:px-24 opacity-0 pointer-events-none">
            <div className="max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] relative overflow-hidden text-right flex flex-col items-end transition-transform duration-500 hover:scale-105 pointer-events-auto">
              <div className="absolute -inset-20 bg-gradient-to-bl from-amber-500/20 to-red-500/20 blur-3xl opacity-50" />
              <div className="relative z-10 w-full">
                <div className="text-4xl mb-4 drop-shadow-md">💰</div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">Financial Field</h3>
                <p className="text-white/70 text-sm md:text-base leading-relaxed font-light">
                  Ensuring sustainable growth, managing resources efficiently, and securing long-term economic stability.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Management Modal */}
      {mgmtModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-[90%] max-w-4xl h-[85vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="flex justify-between items-center bg-[#8b7082] text-white px-6 py-4">
              <span className="font-bold uppercase tracking-widest text-sm">Management Portal</span>
              <button onClick={() => setMgmtModalOpen(false)} className="text-3xl leading-none">&times;</button>
            </div>
            <div className="flex-1 w-full bg-[#fafafa] overflow-auto p-4">
              <VismeEmbed 
                url="6vz8o9k7-club-membership-sign-up-form" 
                formId="177550" 
                title="Management Portal" 
              />
            </div>
          </div>
        </div>
      )}

      {/* Technical Modal */}
      {techModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-[90%] max-w-4xl h-[85vh] bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col">
            <div className="flex justify-between items-center bg-[#8b7082] text-white px-6 py-4">
              <span className="font-bold uppercase tracking-widest text-sm">Technical Portal</span>
              <button onClick={() => setTechModalOpen(false)} className="text-3xl leading-none">&times;</button>
            </div>
            <div className="flex-1 w-full bg-[#fafafa] overflow-auto p-4">
              <VismeEmbed 
                url="koe11w6k-club-membership-sign-up-form" 
                formId="178802" 
                title="Technical Portal" 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

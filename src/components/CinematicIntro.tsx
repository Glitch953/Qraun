"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Volume2, VolumeX, Sparkles } from "lucide-react";
import gsap from "gsap";

// ─────────────────────────────────────────
// Canvas: Floating dust particles
// ─────────────────────────────────────────
function useParticleCanvas(
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    intensity: number
) {
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animId: number;
        const dpr = window.devicePixelRatio || 1;

        const resize = () => {
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = window.innerWidth + "px";
            canvas.style.height = window.innerHeight + "px";
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        window.addEventListener("resize", resize);

        type P = { x: number; y: number; r: number; dx: number; dy: number; o: number; s: number };
        const COUNT = 80;
        const particles: P[] = Array.from({ length: COUNT }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            r: Math.random() * 2.5 + 0.3,
            dx: (Math.random() - 0.5) * 0.25,
            dy: -(Math.random() * 0.3 + 0.08),
            o: Math.random() * 0.5 + 0.1,
            s: Math.random() * 0.4 + 0.15,
        }));

        const draw = () => {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            for (const p of particles) {
                const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
                glow.addColorStop(0, `rgba(255,220,130,${p.o * intensity * 0.8})`);
                glow.addColorStop(1, `rgba(255,200,80,0)`);
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
                ctx.fillStyle = glow;
                ctx.fill();

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,235,180,${p.o * intensity})`;
                ctx.fill();

                p.x += p.dx;
                p.y += p.dy * p.s;
                if (p.y < -10) { p.y = window.innerHeight + 10; p.x = Math.random() * window.innerWidth; }
                if (p.x < -10) p.x = window.innerWidth + 10;
                if (p.x > window.innerWidth + 10) p.x = -10;
            }
            animId = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
        };
    }, [canvasRef, intensity]);
}

// ─────────────────────────────────────────
// Canvas: Volumetric god rays
// ─────────────────────────────────────────
function useVolumetricRays(
    canvasRef: React.RefObject<HTMLCanvasElement | null>,
    doorOpen: boolean
) {
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animId: number;
        const dpr = window.devicePixelRatio || 1;

        const resize = () => {
            canvas.width = window.innerWidth * dpr;
            canvas.height = window.innerHeight * dpr;
            canvas.style.width = window.innerWidth + "px";
            canvas.style.height = window.innerHeight + "px";
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        window.addEventListener("resize", resize);

        let progress = 0;

        const draw = () => {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            if (doorOpen) progress = Math.min(progress + 0.006, 1);

            if (progress > 0) {
                const cx = window.innerWidth / 2;
                const cy = window.innerHeight * 0.42;
                const rayCount = 16;

                for (let i = 0; i < rayCount; i++) {
                    const angle = ((i / rayCount) * Math.PI * 0.7) - (Math.PI * 0.35) + Math.PI / 2;
                    const wave = Math.sin(Date.now() * 0.0008 + i * 1.3) * 0.3 + 0.7;
                    const len = (window.innerHeight * 1.1) * progress * wave;
                    const spread = 20 + Math.sin(Date.now() * 0.001 + i * 2.5) * 12;

                    ctx.save();
                    ctx.globalAlpha = 0.06 * progress * wave;
                    ctx.beginPath();
                    ctx.moveTo(cx, cy);
                    ctx.lineTo(cx + Math.cos(angle - 0.015) * len - spread, cy + Math.sin(angle) * len);
                    ctx.lineTo(cx + Math.cos(angle + 0.015) * len + spread, cy + Math.sin(angle) * len);
                    ctx.closePath();

                    const grad = ctx.createLinearGradient(cx, cy, cx, cy + len);
                    grad.addColorStop(0, "rgba(255,230,130,0.7)");
                    grad.addColorStop(0.3, "rgba(255,200,80,0.3)");
                    grad.addColorStop(0.7, "rgba(255,170,50,0.1)");
                    grad.addColorStop(1, "rgba(255,150,30,0)");
                    ctx.fillStyle = grad;
                    ctx.fill();
                    ctx.restore();
                }
            }
            animId = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
        };
    }, [canvasRef, doorOpen]);
}

// ─────────────────────────────────────────
// Main CinematicIntro Component
// ─────────────────────────────────────────
export function CinematicIntro() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [particleIntensity, setParticleIntensity] = useState(0.3);
    const router = useRouter();
    const hasTriggered = useRef(false);

    const containerRef = useRef<HTMLDivElement>(null);
    const leftDoorRef = useRef<HTMLDivElement>(null);
    const rightDoorRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const interiorRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLParagraphElement>(null);
    const titleRef = useRef<HTMLDivElement>(null);
    const fogRef = useRef<HTMLDivElement>(null);
    const particleCanvasRef = useRef<HTMLCanvasElement>(null);
    const rayCanvasRef = useRef<HTMLCanvasElement>(null);

    // Audio instance refs
    const ambientStopRef = useRef<{ stop: () => void; gainNode: GainNode } | null>(null);
    const toneStopRef = useRef<{ stop: () => void; gainNode: GainNode } | null>(null);

    useParticleCanvas(particleCanvasRef, particleIntensity);
    useVolumetricRays(rayCanvasRef, isOpen);

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            ambientStopRef.current?.stop();
            toneStopRef.current?.stop();
        };
    }, []);

    const toggleMute = useCallback(() => {
        const next = !isMuted;
        setIsMuted(next);

        if (!next) {
            // Unmuting: start ambient sounds
            import("@/lib/audio").then(({ playAmbient }) => {
                if (!ambientStopRef.current) {
                    ambientStopRef.current = playAmbient(0.12);
                }
            });
        } else {
            // Muting: stop all sounds
            ambientStopRef.current?.stop();
            ambientStopRef.current = null;
            toneStopRef.current?.stop();
            toneStopRef.current = null;
        }
    }, [isMuted]);

    const openDoor = useCallback(() => {
        if (hasTriggered.current) return;
        hasTriggered.current = true;
        setIsOpen(true);

        if (!isMuted) {
            import("@/lib/audio").then(({ playDoorOpen, playSpiritualTone }) => {
                playDoorOpen(0.5);
                setTimeout(() => {
                    toneStopRef.current = playSpiritualTone(0.15);
                }, 1200);
            });
        }

        setParticleIntensity(1.2);

        // Fade text & title
        gsap.to(textRef.current, { opacity: 0, y: 20, duration: 0.5, force3D: true });
        gsap.to(titleRef.current, { opacity: 0, y: -30, duration: 0.8, delay: 0.3, force3D: true });

        // Animate fog upward
        gsap.to(fogRef.current, { opacity: 0, y: -100, duration: 3, force3D: true });

        // Left door opening
        gsap.to(leftDoorRef.current, {
            rotateY: -115,
            duration: 4,
            ease: "power2.inOut",
            transformOrigin: "left center",
            force3D: true,
        });

        // Right door opening
        gsap.to(rightDoorRef.current, {
            rotateY: 115,
            duration: 4,
            ease: "power2.inOut",
            transformOrigin: "right center",
            force3D: true,
        });

        // Interior glow reveal
        gsap.to(interiorRef.current, {
            opacity: 1,
            scale: 1.08,
            duration: 3.5,
            delay: 0.8,
            ease: "power2.out",
            force3D: true,
        });

        // Background glow surround
        gsap.to(glowRef.current, {
            opacity: 1,
            scale: 1.5,
            duration: 4,
            ease: "power2.inOut",
            force3D: true,
        });

        // Final cinematic exit
        gsap.to(containerRef.current, {
            opacity: 0,
            scale: 1.12,
            filter: "blur(12px) brightness(1.5)",
            duration: 2,
            delay: 3.5,
            ease: "power2.in",
            force3D: true,
            onComplete: () => router.push("/quran"),
        });
    }, [isMuted, router]);

    // Scroll / wheel / touch listeners
    useEffect(() => {
        const onWheel = (e: WheelEvent) => { if (e.deltaY > 0) openDoor(); };
        const onScroll = () => { if (window.scrollY > 30) openDoor(); };
        const onTouch = () => openDoor();

        window.addEventListener("wheel", onWheel, { passive: true });
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("touchstart", onTouch, { passive: true });

        return () => {
            window.removeEventListener("wheel", onWheel);
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("touchstart", onTouch);
        };
    }, [openDoor]);

    // Pulsing text
    useEffect(() => {
        if (textRef.current && !isOpen) {
            gsap.to(textRef.current, { opacity: 0.3, yoyo: true, repeat: -1, duration: 2, ease: "sine.inOut", force3D: true });
        }
    }, [isOpen]);

    // Title entrance
    useEffect(() => {
        if (titleRef.current) {
            gsap.from(titleRef.current, { opacity: 0, y: 30, duration: 1.5, delay: 0.5, ease: "power3.out", force3D: true });
        }
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-screen overflow-hidden bg-black flex flex-col items-center justify-center select-none"
        >
            {/* ── Background ── */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/courtyard.png"
                    alt="Makkah Grand Mosque (Masjid al-Haram) Courtyard"
                    fill
                    priority
                    quality={100}
                    sizes="100vw"
                    className="object-cover scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#020810]/60 via-transparent to-[#020810]/95" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#041008]/80 via-transparent to-transparent" />
                {/* Enhanced Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]" />
            </div>

            {/* ── Fog layer ── */}
            <div ref={fogRef} className="absolute inset-0 z-[3] pointer-events-none">
                <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-[#0a1a10]/60 via-[#0a1a10]/20 to-transparent" />
                <div className="absolute bottom-[15%] left-[-10%] w-[120%] h-[30%] bg-[#c8b070]/[0.03] blur-[60px] rounded-full" />
            </div>

            {/* ── Lantern glow spots ── */}
            <div className="absolute top-[20%] left-[15%] w-32 h-32 bg-[#ffcc44]/[0.06] rounded-full blur-[50px] pointer-events-none z-[2]" />
            <div className="absolute top-[25%] right-[12%] w-28 h-28 bg-[#ffcc44]/[0.05] rounded-full blur-[45px] pointer-events-none z-[2]" />

            {/* ── Particle Canvas ── */}
            <canvas ref={particleCanvasRef} className="absolute inset-0 z-[5] pointer-events-none" />

            {/* ── Volumetric Rays Canvas ── */}
            <canvas ref={rayCanvasRef} className="absolute inset-0 z-[6] pointer-events-none" />

            {/* ── Mute Button ── */}
            <button
                onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                className="absolute top-6 left-6 z-50 p-3 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-[#d4af37] hover:bg-black/60 transition-colors"
                aria-label="Toggle sound"
            >
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            {/* ── Title at top ── */}
            <div ref={titleRef} className="absolute top-[8%] md:top-[10%] z-20 text-center px-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-arabic text-[#d4af37] drop-shadow-[0_2px_12px_rgba(212,175,55,0.4)] leading-relaxed">
                    القرآن الكريم
                </h1>
                <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#d4af37]/60 to-transparent mx-auto mt-3" />
                <p className="text-[#d4af37]/50 text-xs tracking-[0.3em] uppercase mt-2 font-light">The Noble Quran</p>
            </div>

            {/* ── Door Assembly ── */}
            <div
                className="relative w-[260px] sm:w-[360px] md:w-[440px] h-[420px] sm:h-[540px] md:h-[660px] flex items-center justify-center z-10 mt-8"
                style={{ perspective: "2000px" }}
                onClick={(e) => { e.stopPropagation(); openDoor(); }}
            >
                {/* Warm glow behind doors */}
                <div
                    ref={glowRef}
                    className="absolute inset-[-50%] z-0 pointer-events-none opacity-0"
                    style={{
                        background: "radial-gradient(ellipse at center, rgba(255,200,80,0.5) 0%, rgba(255,160,40,0.15) 40%, transparent 70%)",
                        transform: "scale(0.6)",
                    }}
                />

                {/* Interior Makkah & Kaaba Reveal */}
                <div
                    ref={interiorRef}
                    className="absolute inset-3 rounded-t-[50%] overflow-hidden opacity-0 z-[1] pointer-events-none"
                    style={{ transform: "scale(0.9)" }}
                >
                    <Image
                        src="/interior-glow.png"
                        alt="The Holy Kaaba - Masjid al-Haram Interior"
                        fill
                        quality={100}
                        className="object-cover"
                    />
                    {/* Atmospheric Makkah Interior Wash */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
                    <div className="absolute inset-0 bg-white/5" />
                </div>

                {/* Archway Frame */}
                <div
                    className="absolute inset-0 rounded-t-[50%] z-20 flex overflow-hidden border-[12px] border-transparent"
                    style={{
                        boxShadow: "inset 0 0 40px rgba(0,0,0,0.8), 0 0 60px rgba(0,0,0,0.5)",
                    }}
                >
                    {/* Arch decoration overlay */}
                    <div className="absolute inset-0 rounded-t-[50%] border-[2px] border-[#d4af37]/10 pointer-events-none z-40" />

                    {/* Left Door Half */}
                    <div
                        ref={leftDoorRef}
                        className="absolute inset-0 z-30 w-full h-full pointer-events-none"
                        style={{
                            transformOrigin: "left center",
                            transformStyle: "preserve-3d",
                            backfaceVisibility: "hidden",
                            clipPath: "inset(0 50% 0 0)",
                        }}
                    >
                        <Image
                            src="/door-real.png"
                            alt="Mosque Door Left"
                            fill
                            priority
                            quality={100}
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/10" />
                    </div>

                    {/* Right Door Half */}
                    <div
                        ref={rightDoorRef}
                        className="absolute inset-0 z-30 w-full h-full pointer-events-none"
                        style={{
                            transformOrigin: "right center",
                            transformStyle: "preserve-3d",
                            backfaceVisibility: "hidden",
                            clipPath: "inset(0 0 0 50%)",
                        }}
                    >
                        <Image
                            src="/door-real.png"
                            alt="Mosque Door Right"
                            fill
                            priority
                            quality={100}
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/10" />
                    </div>

                    {/* ── Direct Click Overlay ── */}
                    {!isOpen && (
                        <div
                            className="absolute inset-0 z-40 cursor-pointer hover:bg-white/5 transition-colors group"
                            onClick={(e) => {
                                e.stopPropagation();
                                openDoor();
                            }}
                        >
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-16 h-16 rounded-full bg-quran-gold/10 border border-quran-gold/30 flex items-center justify-center backdrop-blur-sm">
                                    <Sparkles className="w-6 h-6 text-quran-gold animate-pulse" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Scroll Hint ── */}
            {!isOpen && (
                <div
                    className="absolute bottom-[8%] left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 cursor-pointer group"
                    onClick={openDoor}
                >
                    <p className="text-[10px] md:text-xs text-[#d4af37] uppercase tracking-[0.4em] font-bold animate-pulse text-center leading-relaxed">
                        اضغط أو اسحب للدخول<br />
                        <span className="opacity-60 text-[8px] font-medium uppercase font-sans">Click or Scroll to Enter</span>
                    </p>
                    <div className="w-px h-10 bg-gradient-to-b from-[#d4af37] to-transparent animate-bounce mt-4 shadow-[0_0_15px_rgba(212,175,55,0.4)]" />
                </div>
            )}

            {/* ── Mute Toggle (Fixed Positioning) ── */}
            <div className="fixed top-6 left-6 z-[60]">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleMute();
                    }}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-black/40 border border-[#d4af37]/30 flex items-center justify-center text-[#d4af37] backdrop-blur-md hover:bg-black/60 transition-all shadow-2xl active:scale-95 group"
                >
                    {isMuted ? <VolumeX className="w-5 h-5 group-hover:scale-110 transition-transform" /> : <Volume2 className="w-5 h-5 group-hover:scale-110 transition-transform" />}
                </button>
            </div>

            {/* ── WebFinity Branding ── */}
            <div className="absolute bottom-6 right-6 z-50 flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity">
                <div className="text-right">
                    <p className="text-[8px] text-white/40 uppercase tracking-widest leading-tight">Powered by</p>
                    <p className="text-[10px] text-[#d4af37] font-bold tracking-wider leading-tight">WEBFINTY</p>
                </div>
                <div className="w-9 h-9 rounded-xl bg-[#d4af37]/10 backdrop-blur-md border border-[#d4af37]/20 flex items-center justify-center p-2">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-[#d4af37] fill-current shadow-[0_0_10px_rgba(212,175,55,0.3)]">
                        <path d="M20 30 C30 30, 40 70, 50 70 C60 70, 70 30, 80 30" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
                        <path d="M20 70 C30 70, 40 30, 50 30 C60 30, 70 70, 80 70" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" opacity="0.5" />
                    </svg>
                </div>
            </div>

            {/* ── Gradient Vignette ── */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)] z-20" />
        </div>
    );
}

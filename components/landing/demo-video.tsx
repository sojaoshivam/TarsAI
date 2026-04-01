"use client";

import React, { useRef } from "react";
import { Sparkles } from "lucide-react";

export function DemoVideo() {
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleMouseEnter = () => {
        if (videoRef.current) {
            videoRef.current.play().catch((err) => console.log("Video auto-play prevented:", err));
        }
    };

    const handleMouseLeave = () => {
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };

    return (
        <section className="py-32 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none z-0"></div>

            <div className="container px-6 lg:px-8 mx-auto text-center relative z-10">



                <h2 className="text-4xl md:text-6xl font-extrabold text-[#dadada] mb-6 tracking-tight">
                    Introducing TARS AI
                </h2>
                <p className="text-lg md:text-xl text-zinc-400 mb-16 max-w-2xl mx-auto leading-relaxed">
                    A completely new way to interact with your knowledge base. Upload massive PDFs and extract the exact insights you need, instantly.
                </p>

                {/* Video Container */}
                <div className="relative mx-auto max-w-5xl rounded-[2rem] border border-white/10 bg-zinc-900/40 p-3 sm:p-5 shadow-2xl backdrop-blur-xl group hover:border-white/20 transition-all duration-700 ring-1 ring-white/5 hover:ring-white/10 hover:shadow-blue-500/10">
                    <div
                        className="relative overflow-hidden rounded-2xl bg-black aspect-video flex items-center justify-center transform group-hover:scale-[1.01] transition-transform duration-700 ease-out"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        {/* Subtle inner gradient */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent pointer-events-none rounded-2xl z-20"></div>

                        <video
                            ref={videoRef}
                            controls
                            muted
                            loop
                            className="w-full h-full object-cover relative z-10"
                            poster="https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/dashboard-02.png"
                        >
                            <source src="/video.mp4" type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    </div>
                </div>
            </div>
        </section>
    );
}

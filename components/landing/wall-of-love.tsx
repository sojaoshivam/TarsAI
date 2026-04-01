"use client";

import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";

const stats = [
    { id: 1, name: "Monthly Active Users", value: "12,000+" },
    { id: 2, name: "Documents Processed", value: "2.5M+" },
    { id: 3, name: "Hours Saved Globally", value: "850k+" },
];

const testimonials = [
    {
        id: 1,
        quote: "TARS AI completely changed how I handle my academic research. What used to take weeks of reading now takes hours. It's incredibly accurate and saves me so much time.",
        author: {
            name: "Dr. Emily Chen",
            role: "Lead Researcher, Stanford",
            image: "https://i.pravatar.cc/150?u=emily",
        },
    },
    {
        id: 2,
        quote: "As a legal consultant, I have to go through hundreds of pages of contracts daily. TARS AI instantly finds the clauses I need and summarizes the risk points. Absolutely essential tool.",
        author: {
            name: "Marcus Johnson",
            role: "Partner, LegalTech Associates",
            image: "https://i.pravatar.cc/150?u=marcus",
        },
    },
    {
        id: 3,
        quote: "We integrated TARS AI into our team's workflow and the productivity boost was immediate. Onboarding new PMs with our massive product specification docs is a breeze now.",
        author: {
            name: "Sarah Williams",
            role: "Director of Product, Innovate Corp",
            image: "https://i.pravatar.cc/150?u=sarah",
        },
    },
    {
        id: 4,
        quote: "I've tried other 'chat with PDF' tools, and none of them handle large 500+ page financial reports without crashing or Hallucinating. TARS AI is the only one I trust.",
        author: {
            name: "David Kim",
            role: "Financial Analyst",
            image: "https://i.pravatar.cc/150?u=david",
        },
    },
    {
        id: 5,
        quote: "The ability to ask complex questions and get citations pointing directly to the exact paragraph in my source documents is a game-changer for my thesis.",
        author: {
            name: "Maria Garcia",
            role: "PhD Candidate",
            image: "https://i.pravatar.cc/150?u=maria",
        },
    },
    {
        id: 6,
        quote: "Clean UI, lightning-fast processing, and the answers are always spot on. Highly recommend TARS AI for anyone dealing with heavy documentation.",
        author: {
            name: "James Wilson",
            role: "Operations Manager",
            image: "https://i.pravatar.cc/150?u=james",
        },
    },
];

export function WallOfLove() {
    return (
        <section className="py-24 sm:py-32 overflow-hidden">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">

                {/* Stats Row */}
                <div className="mx-auto max-w-2xl lg:max-w-none mb-24">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-semibold tracking-tight text-[#dadada] sm:text-4xl">
                            Trusted by professionals worldwide
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Empowering researchers, lawyers, and teams to move faster.
                        </p>
                    </div>
                    <dl className="grid grid-cols-1 gap-x-8 gap-y-16 text-center lg:grid-cols-3">
                        {stats.map((stat) => (
                            <div key={stat.id} className="mx-auto flex max-w-xs flex-col gap-y-4">
                                <dt className="text-base/7 text-muted-foreground">{stat.name}</dt>
                                <dd className="order-first text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                                    {stat.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>

                {/* Testimonial Grid */}
                <div className="mx-auto max-w-2xl lg:max-w-none">
                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {testimonials.map((testimonial) => (
                            <div
                                key={testimonial.id}
                                className="flex flex-col justify-between rounded-2xl bg-zinc-900/50 border border-white/10 p-8 shadow-sm hover:border-white/20 transition-colors"
                            >
                                <div>
                                    <div className="flex gap-1 mb-6 text-yellow-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="h-4 w-4 fill-current" />
                                        ))}
                                    </div>
                                    <blockquote className="text-lg/8 text-zinc-300">
                                        "{testimonial.quote}"
                                    </blockquote>
                                </div>
                                <div className="mt-8 flex items-center gap-x-4">
                                    <Image
                                        className="h-12 w-12 rounded-full bg-zinc-800 object-cover"
                                        src={testimonial.author.image}
                                        alt={testimonial.author.name}
                                        width={48}
                                        height={48}
                                    />
                                    <div>
                                        <div className="font-semibold text-white">{testimonial.author.name}</div>
                                        <div className="text-sm/6 text-muted-foreground">{testimonial.author.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Trust Badges */}
                <div className="mt-24 flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-12">
                    <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest text-center">
                        Highly rated on
                    </p>
                    <div className="flex gap-12 items-center opacity-70 grayscale hover:grayscale-0 transition-all">
                        {/* Placeholder for G2 Badge */}
                        <div className="flex items-center gap-2 font-bold text-2xl text-white">
                            <span className="bg-red-500 text-white px-2 py-1 rounded">G2</span>
                            High Performer
                        </div>
                        {/* Placeholder for Product Hunt Badge */}
                        <div className="flex items-center gap-2 font-bold text-xl text-white">
                            <span className="text-[#DA552F] border border-[#DA552F] rounded-full w-8 h-8 flex items-center justify-center mr-1">P</span>
                            Product Hunt
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}

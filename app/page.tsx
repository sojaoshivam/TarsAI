
import Casestudies from "@/components/landing/case-studies";
import FAQs from "@/components/landing/faqs-component";
import { Footer7 } from "@/components/shared/Footer";
import Component from "@/components/landing/highlight-card";
import Pricing from "@/components/shared/pricing-component";
import { Testimonial } from "@/components/landing/testimonial";
import { Button } from "@/components/ui/button";
import DisplayCards from "@/components/ui/display-cards";
import { Navbar } from "@/components/shared/navbar";
import { auth } from "@clerk/nextjs/server";
import { MorphingText } from "@/components/ui/morphing-text";
import { RetroGrid } from "@/components/ui/retro-grid";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import FileUpload from "@/components/dashboard/fileupload";
import { FileText, Brain, TextSearch } from "lucide-react";
import Link from "next/link";
import { FadeIn } from "@/components/ui/fade-in";


export default async function Home() {

  const { userId } = await auth();
  const isAuth = !!userId;
  const texts = [
    "TARS",
    "टार्स",
    "ターズ",
    "Тарз",
    "تارس",
    "Ταρς",
    "타스",
    "塔斯",
  ];

  const defaultCards = [
    // ...
    {
      icon: <FileText className="size-4 text-blue-300" />,
      title: "Home Bills",
      description: "How to save money on bills?",
      date: "Yesterday",
      iconClassName: "text-blue-500",
      titleClassName: "text-blue-500",
      className:
        "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <FileText className="size-4 text-blue-300" />,
      title: "Home Work",
      description: "Get your assignments done",
      date: "Today",
      iconClassName: "text-blue-500",
      titleClassName: "text-blue-500",
      // FIX 1: Added 'lg:' prefix to translate classes
      className:
        "[grid-area:stack] lg:translate-x-12 lg:translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      icon: <FileText className="size-4 text-blue-300" />,
      title: "New",
      description: "Upload your doc to Get started",
      date: "Just now",
      iconClassName: "text-blue-500",
      titleClassName: "text-blue-500",
      // FIX 1: Added 'lg:' prefix to translate classes
      className:
        "[grid-area:stack] lg:translate-x-24 lg:translate-y-20 hover:translate-y-10",
    },
  ];

  return (
    <main className="overflow-x-hidden">
      <Navbar />

      <div className="px-6 md:px-12 lg:px-20 flex flex-col">

        {/* Hero Section: No animation, loads instantly */}
        <section className="relative min-h-screen lg:mt-20 flex flex-col justify-center items-center overflow-hidden">
          <RetroGrid className="-z-10" />
          <MorphingText texts={texts} />
          <p className="font-semibold text-[#dadada] font-inter mt-10 text-sm lg:text-xl lg:mt-20">
            Turn Any PDF Into Instant Answers
          </p>
          {isAuth ?
            <FileUpload /> :
            <Link href="/sign-up">
              <ShimmerButton className="mt-24 md:mt-[150px]">
                <span className="whitespace-pre-wrap text-center text-sm p-1 font-medium leading-none tracking-tight text-[#dadada] dark:from-white dark:to-slate-900/10 lg:text-lg">
                  Get Started
                </span>
              </ShimmerButton>
            </Link>}
        </section>


        {/* Highlight Cards: Kept <section> as a wrapper, but animated each item with a delay */}
        <section className="flex flex-col lg:flex-row mt-24 lg:mt-32 gap-8 lg:gap-3 justify-between">
          <FadeIn delay={0}>
            <Component
              title="Chat With Any PDF"
              description={[
                "Upload documents instantly,",
                "ask questions in natural language,",
                "get accurate, contextual answers,",
                "and skip reading hundreds of pages."
              ]}
              icon={<FileText className="w-8 h-8 text-[#dadada]" />}
            />
          </FadeIn>

          <FadeIn delay={0.2}>
            <Component
              title="Instant Summaries"
              description={[
                "Receive clean, concise summaries,",
                "extract key points in seconds,",
                "understand complex sections faster,",
                "and save hours on manual reading."
              ]}
              icon={<TextSearch className="w-8 h-8 text-[#dadada]" />}
            />
          </FadeIn>

          <FadeIn delay={0.4}>
            <Component
              title="Smart Insights"
              description={[
                "Pull insights that matter,",
                "find data, definitions, and references,",
                "navigate long PDFs effortlessly,",
                "and make decisions with clarity."
              ]}
              icon={<Brain className="w-8 h-8 text-[#dadada]" />}
            />
          </FadeIn>
        </section>


        {/* "Just Upload" Section: Replaced <section> with <FadeIn> */}
        <FadeIn className="py-20 md:py-32 mt-28 md:mt-56 flex flex-col lg:flex-row justify-between gap-16">
          <div className="w-full lg:w-[50%] ">
            <h1 className="text-3xl md:text-4xl font-semibold text-[#dadada]">
              Just Upload and <span className="font-extralight italic">ask</span>
            </h1>
            <p className="mt-5 text-[#dadada]">
              Just upload your PDF, and the system instantly prepares it for AI-powered understanding.
              Type any question — from summaries to specific details — and get clear, accurate answers in seconds.
              You can explore insights, extract key points, and navigate complex documents without reading them manually.
            </p>
            <Button className="mt-10 rounded-3xl text-[#dadada] p-5" variant="outline">
              Get Started
            </Button>
          </div>

          <div className="w-full lg:w-[50%]">
            <DisplayCards cards={defaultCards} />
          </div>
        </FadeIn>


        {/* "Don't Just Read" Section: Replaced <section> with <FadeIn> */}
        <FadeIn className="mt-28 md:mt-50">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#dadada]">
            Don’t Just Read PDFs — <span className="font-extralight italic">Talk to Them.</span>
          </h1>
          <Casestudies />
        </FadeIn>

        {/* Pricing Section: Replaced <section> with <FadeIn> */}
        <FadeIn className="py-20 md:py-32">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#dadada]">
            Price and Plannings  </h1>
          <p className="font-extralight italic text-base md:text-lg text-zinc-600 dark:text-zinc-400 s mt-3">Receive unlimited credits when you pay yearly, and save on your plan</p>
          <Pricing />
        </FadeIn>

        {/* Testimonial Section: Replaced <section> with <FadeIn> */}
        <FadeIn className="py-20 md:py-32">
          <Testimonial
            companyLogo="https://assets.rapidui.dev/testimonials/companies/vercel.svg"
            quote="I'm Shivam, an aspiring web developer who built TARS AI to make information effortless. What started as a personal need to organize knowledge has grown into a tool designed to help anyone think faster, work smarter, and stay focused."
            highlightedText="TARS AI"
            authorName="Shivam"
            authorPosition="Founder, TARS AI"
            authorImage="httpshttps://assets.rapidui.dev/testimonials/people/guillermo-rauch.webp"
          />
        </FadeIn>

        {/* FAQs Section: Replaced <section> with <FadeIn> */}
        <FadeIn className="py-20 md:py-32">
          <h1 className="text-3xl md:text-4xl font-semibold text-[#dadada]">
            Frequently Asked <span className="italic font-extralight">Questions </span> </h1>
          <p className="text-muted-foreground mt-4 text-balance text-base md:text-lg">Discover quick and comprehensive answers to common questions about our platform, services, and features.</p>
          <FAQs />
        </FadeIn>
      </div>

      <Footer7 />
    </main>

  )
}
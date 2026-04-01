"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowRight, AlertCircle, Lightbulb, TrendingUp } from "lucide-react";

const CountUp = dynamic(() => import("react-countup"), { ssr: false });

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    setReduced(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

function parseMetricValue(raw: string) {
  const value = (raw ?? "").toString().trim();
  const m = value.match(/^([^\d\-+]*?)\s*([\-+]?\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*([^\d\s]*)$/);
  if (!m) return { prefix: "", end: 0, suffix: value, decimals: 0 };
  const [, prefix, num, suffix] = m;
  const normalized = num.replace(/,/g, "");
  const end = parseFloat(normalized);
  const decimals = (normalized.split(".")[1]?.length ?? 0);
  return { prefix: prefix ?? "", end: isNaN(end) ? 0 : end, suffix: suffix ?? "", decimals };
}

function MetricStat({ value, label, sub, duration = 1.6 }: { value: string; label: string; sub?: string; duration?: number }) {
  const reduceMotion = usePrefersReducedMotion();
  const { prefix, end, suffix, decimals } = parseMetricValue(value);

  return (
    <div className="flex flex-col gap-2 p-6 bg-zinc-900/40 rounded-xl border border-white/5">
      <p className="text-3xl font-semibold text-white">
        {prefix}
        {reduceMotion ? (
          <span>{end.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}</span>
        ) : (
          <CountUp end={end} decimals={decimals} duration={duration} separator="," enableScrollSpy scrollSpyOnce />
        )}
        {suffix}
      </p>
      <p className="font-medium text-zinc-300">{label}</p>
      {sub && <p className="text-sm text-zinc-500">{sub}</p>}
    </div>
  );
}

export default function Casestudies() {
  const caseStudies = [
    {
      id: 1,
      company: "Global Research Institute",
      headline: "Saved 15 hours a week per analyst",
      challenge: "Analysts were spending an average of 20 hours a week manually reading through 80+ page academic journals, creating massive backlogs and delaying critical project insights.",
      solution: "Implemented TARS AI across the research division. Analysts now upload batches of PDFs and query the corpus directly, pulling out cited answers in seconds instead of hours.",
      results: "Research output doubled in the first quarter, with analysts saving up to 15 hours a week each and zero drops in insight accuracy.",
      name: "Aarav Mehta",
      role: "Lead Research Analyst",
      image: "/pic1.png",
      metrics: [
        { value: "15h", label: "Time Saved", sub: "per week per analyst" },
        { value: "2x", label: "Output Increase", sub: "in published reports" },
      ],
    },
    {
      id: 2,
      company: "LegalTech Associates",
      headline: "4x Faster Document Review",
      challenge: "Legal teams were overwhelmed by the volume of case files and contracts in discovery. Finding specific clauses or past precedents involved endless scrolling and keyword searches.",
      solution: "Integrated TARS AI to handle initial document parsing. Lawyers now use natural language to ask questions like 'What are the liability caps in this contract?' and get exact paragraph references.",
      results: "The firm reduced manual review time by 70%, allowing partners to take on more clients and respond to opposing counsel four times faster.",
      name: "Sophia Patel",
      role: "Legal Operations Manager",
      image: "/pic2.png",
      metrics: [
        { value: "4x", label: "Faster Review", sub: "of legal documents" },
        { value: "70%", label: "Reduction", sub: "in manual reading" },
      ],
    },
  ];

  return (
    <section className="bg-transparent py-16" aria-labelledby="case-studies-heading">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="mt-10 flex flex-col gap-24">
          {caseStudies.map((study) => (
            <div key={study.id} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">

              {/* Left Column: Narrative Flow */}
              <div className="lg:col-span-7 flex flex-col gap-8">
                <div>
                  <p className="text-sm font-semibold text-blue-400 uppercase tracking-wider mb-2">{study.company}</p>
                  <h3 className="text-3xl md:text-4xl font-semibold text-[#dadada]">{study.headline}</h3>
                </div>

                <div className="relative border-l-2 border-zinc-800 ml-3 md:ml-4 pl-8 md:pl-10 space-y-10 py-2">

                  {/* Challenge */}
                  <div className="relative">
                    <div className="absolute -left-[45px] md:-left-[53px] bg-black border border-zinc-700 p-2 rounded-full">
                      <AlertCircle className="w-5 h-5 text-red-400" />
                    </div>
                    <h4 className="text-xl font-medium text-white mb-2">The Challenge</h4>
                    <p className="text-zinc-400 leading-relaxed">{study.challenge}</p>
                  </div>

                  {/* Solution */}
                  <div className="relative">
                    <div className="absolute -left-[45px] md:-left-[53px] bg-black border border-zinc-700 p-2 rounded-full">
                      <Lightbulb className="w-5 h-5 text-yellow-400" />
                    </div>
                    <h4 className="text-xl font-medium text-white mb-2">The TARS AI Solution</h4>
                    <p className="text-zinc-400 leading-relaxed">{study.solution}</p>
                  </div>

                  {/* Results */}
                  <div className="relative">
                    <div className="absolute -left-[45px] md:-left-[53px] bg-black border border-zinc-700 p-2 rounded-full">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                    </div>
                    <h4 className="text-xl font-medium text-white mb-2">Measurable Results</h4>
                    <p className="text-zinc-400 leading-relaxed">{study.results}</p>
                  </div>

                </div>
              </div>

              {/* Right Column: Visual & Metrics */}
              <div className="lg:col-span-5 flex flex-col gap-8 rounded-2xl bg-zinc-900/20 p-6 md:p-8 border border-white/5">
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-white/10 group">
                  <Image
                    src={study.image}
                    alt={`${study.company} dashboard`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-left">
                    <p className="text-sm font-medium text-white">"{study.results.split(',')[0]}."</p>
                    <p className="text-xs text-zinc-300 mt-1">— {study.name}, {study.role}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {study.metrics.map((metric, i) => (
                    <MetricStat key={i} value={metric.value} label={metric.label} sub={metric.sub} />
                  ))}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
import React from "react";
import { Linkedin, Twitter, Mail, MapPin } from "lucide-react";
import Link from "next/link";

interface Footer7Props {
  logo?: {
    url: string;
    src: string;
    alt: string;
    title: string;
  };
  sections?: Array<{
    title: string;
    links: Array<{ name: string; href: string }>;
  }>;
  description?: string;
  socialLinks?: Array<{
    icon: React.ReactElement;
    href: string;
    label: string;
  }>;
  copyright?: string;
  legalLinks?: Array<{
    name: string;
    href: string;
  }>;
}

const defaultSections = [
  {
    title: "Product",
    links: [
      { name: "Overview", href: "#overview" },
      { name: "Pricing", href: "#pricing" },
      { name: "Features", href: "#features" },
      { name: "Case Studies", href: "#case-studies" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About TARS AI", href: "#about" },
      { name: "Team", href: "#team" },
      { name: "Blog", href: "#blog" },
      { name: "Careers", href: "#careers" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Help Center", href: "#help" },
      { name: "API Docs", href: "#api" },
      { name: "Security & Privacy", href: "#security" },
      { name: "System Status", href: "#status" },
    ],
  },
];

const defaultSocialLinks = [
  { icon: <Twitter className="w-5 h-5" />, href: "https://twitter.com/sojashivam", label: "Twitter" },
  { icon: <Linkedin className="w-5 h-5" />, href: "https://www.linkedin.com/in/shivammishra-12b097264", label: "LinkedIn" },
];

const defaultLegalLinks = [
  { name: "Terms of Service", href: "#terms" },
  { name: "Privacy Policy", href: "#privacy" },
  { name: "Cookie Policy", href: "#cookies" },
];

export const Footer7 = ({
  logo = {
    url: "/",
    src: "/logo.svg",
    alt: "TARS AI Logo",
    title: "TARS AI",
  },
  sections = defaultSections,
  description = "TARS AI helps you understand any PDF instantly. Upload, ask, and get clear answers without reading the entire document.",
  socialLinks = defaultSocialLinks,
  copyright = "© 2026 TARS AI Inc. All rights reserved.",
  legalLinks = defaultLegalLinks,
}: Footer7Props) => {
  return (
    <footer className="relative mt-32 bg-black pt-20 pb-10">
      {/* Top Gradient Border Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 justify-between">

          {/* Left Column: Brand & Contact */}
          <div className="col-span-1 lg:col-span-4 flex flex-col gap-8">
            <Link href={logo.url} className="inline-block hover:opacity-90 transition-opacity">
              <img src={logo.src} className="w-32 sm:w-40 h-auto" alt={logo.alt} />
            </Link>

            <p className="text-sm leading-relaxed text-zinc-400">
              {description}
            </p>

            {/* Premium Contact Card */}
            <div className="flex flex-col gap-5 p-6 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md shadow-2xl hover:bg-white/[0.05] transition-colors">
              <h4 className="text-xs font-bold text-white uppercase tracking-widest opacity-80">Connect</h4>

              <div className="space-y-4 text-sm text-zinc-400">
                <a
                  href="mailto:iamshivammishra49@gmail.com"
                  className="flex items-center gap-4 hover:text-blue-400 transition-colors group"
                >
                  <div className="p-2 rounded-full bg-blue-500/10 text-blue-400 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all">
                    <Mail className="w-4 h-4" />
                  </div>
                  iamshivammishra49@gmail.com
                </a>

                <div className="flex items-center gap-4 group">
                  <div className="p-2 rounded-full bg-red-500/10 text-red-400 group-hover:bg-red-500/20 group-hover:scale-110 transition-all">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <span>
                    TARS AI Inc.<br />
                    Udaipur, Rajasthan
                  </span>
                </div>
              </div>
            </div>

            {/* Social Links Layout */}
            <div className="flex items-center gap-4 pt-2">
              {socialLinks.map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="p-3 rounded-full bg-zinc-900 border border-white/10 text-zinc-400 hover:bg-blue-600 hover:border-blue-500 hover:text-white hover:-translate-y-1 transition-all duration-300 shadow-lg"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Right Column: Navigation Links */}
          <div className="col-span-1 lg:col-span-7 lg:col-start-6 grid grid-cols-2 md:grid-cols-3 gap-10 mt-4 lg:mt-0">
            {sections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-6 text-xs font-bold text-white tracking-[0.2em] uppercase opacity-70">{section.title}</h3>
                <ul className="space-y-4 text-sm text-zinc-400">
                  {section.links.map((link, linkIdx) => (
                    <li key={linkIdx}>
                      <Link
                        href={link.href}
                        className="hover:text-blue-400 transition-colors relative group inline-block"
                      >
                        {link.name}
                        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-24 flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 pb-4 text-xs font-medium text-zinc-500 md:flex-row">
          <p>{copyright}</p>
          <ul className="flex flex-wrap gap-6">
            {legalLinks.map((link, idx) => (
              <li key={idx}>
                <Link href={link.href} className="hover:text-zinc-300 transition-colors">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

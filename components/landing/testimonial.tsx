"use client";

import * as React from "react";
import { cn } from "@/app/lib/utils";
import Image from "next/image";

interface TestimonialProps extends React.HTMLAttributes<HTMLDivElement> {
  companyLogo?: string;
  quote: string;
  authorName: string;
  authorPosition: string;
  authorImage?: string;
  highlightedText?: string;
}

export const Testimonial = React.forwardRef<HTMLDivElement, TestimonialProps>(
  ({ 
    className, 
    companyLogo,
    quote,
    authorName,
    authorPosition,
    authorImage,
    highlightedText,
    ...props 
  }, ref) => {
    const formattedQuote = highlightedText
      ? quote.replace(
          highlightedText,
          `<strong class="font-semibold">${highlightedText}</strong>`
        )
      : quote;

    return (
      <div
        ref={ref}
        className={cn("py-16", className)}
        {...props}
      >
        <div className="max-w-screen-xl mx-auto px-4 lg:px-8">
          <div className="flex flex-col items-center">
            {companyLogo && (
              <div className="mb-7 relative h-10 w-40">
                <Image
                  src="/logo.svg"
                  alt="Company logo"
                  fill
                  className="object-contain"
                />
              </div>
            )}
            <p 
              className="max-w-8xl text-balance text-center text-xl sm:text-2xl text-foreground"
              dangerouslySetInnerHTML={{ __html: `"${formattedQuote}"` }}
            />
            <h5 className="mt-5 font-medium text-muted-foreground">
              {authorName}
            </h5>
            <p className="mt-0.5 font-medium text-foreground/40">
              {authorPosition}
            </p>
            {authorImage && (
              <div className="mt-3 relative size-12 rounded-full overflow-hidden bg-muted">
                <Image
                  src="/shivam.jpg"
                  alt={authorName}
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

Testimonial.displayName = "Testimonial";
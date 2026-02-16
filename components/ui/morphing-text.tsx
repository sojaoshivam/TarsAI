"use client";

import { useCallback, useEffect, useRef } from "react";

import { cn } from "@/app/lib/utils";

// How long the "morphing" transition between texts takes (in seconds)
const morphTime = 1.5;
// How long to "cooldown" (pause) on a text before morphing to the next one
const cooldownTime = 0.5;

const useMorphingText = (texts: string[]) => {
  const textIndexRef = useRef(0);
  const morphRef = useRef(0);
  const cooldownRef = useRef(0);
  const timeRef = useRef(new Date());

  const text1Ref = useRef<HTMLSpanElement>(null);
  const text2Ref = useRef<HTMLSpanElement>(null);

  // This function applies the blur and opacity styles to create the morph effect
  const setStyles = useCallback(
    (fraction: number) => {
      const [current1, current2] = [text1Ref.current, text2Ref.current];
      if (!current1 || !current2) return;

      // The 'next' text (text2) fades in
      current2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
      current2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

      // The 'current' text (text1) fades out
      const invertedFraction = 1 - fraction;
      current1.style.filter = `blur(${Math.min(
        8 / invertedFraction - 8,
        100,
      )}px)`;
      current1.style.opacity = `${Math.pow(invertedFraction, 0.4) * 100}%`;

      // Update the text content of the two spans
      current1.textContent = texts[textIndexRef.current % texts.length];
      current2.textContent = texts[(textIndexRef.current + 1) % texts.length];
    },
    [texts],
  );

  // This function is called during the "morphing" phase
  const doMorph = useCallback(() => {
    // Subtract any "overshoot" time from the cooldown to start the morph
    morphRef.current -= cooldownRef.current;
    cooldownRef.current = 0;

    let fraction = morphRef.current / morphTime;

    if (fraction > 1) {
      // If morph is complete, start the cooldown
      cooldownRef.current = cooldownTime;
      fraction = 1;
    }

    setStyles(fraction);

    // Increment index only when morph is fully complete (fraction === 1)
    if (fraction === 1) {
      textIndexRef.current++;
    }
  }, [setStyles]);

  // This function is called during the "cooldown" (pause) phase
  const doCooldown = useCallback(() => {
    morphRef.current = 0;
    const [current1, current2] = [text1Ref.current, text2Ref.current];
    if (current1 && current2) {
      // Set styles to the "end" state of the morph:
      // text2 is fully visible, text1 is hidden.
      current2.style.filter = "none";
      current2.style.opacity = "100%";
      current1.style.filter = "none";
      current1.style.opacity = "0%";
    }
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const newTime = new Date();
      // Calculate time elapsed since the last frame in seconds
      const deltaTimeInSeconds =
        (newTime.getTime() - timeRef.current.getTime()) / 1500;
      timeRef.current = newTime;

      cooldownRef.current -= deltaTimeInSeconds;

      if (cooldownRef.current <= 0) {
        // We are in the "morphing" phase
        doMorph();
      } else {
        // We are in the "cooldown" phase
        doCooldown();
      }
    };

    // Start the animation loop
    animate();

    // Clean up the animation frame on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [doMorph, doCooldown]);

  return { text1Ref, text2Ref };
};

// --- Components ---

interface MorphingTextProps {
  className?: string;
  texts: string[];
}

interface TextsProps {
  texts: string[];
}

// Renders the two overlapping <span> elements
const Texts = ({ texts }: TextsProps) => {
  const { text1Ref, text2Ref } = useMorphingText(texts);
  return (
    <>
      <span
        className="absolute inset-x-0 top-0 m-auto inline-block w-full"
        ref={text1Ref}
      />
      <span
        className="absolute inset-x-0 top-0 m-auto inline-block w-full"
        ref={text2Ref}
      />
    </>
  );
};

// Renders the SVG filter that creates the "gooey" morph effect
const SvgFilters = () => (
  <svg id="filters" className="hidden" preserveAspectRatio="xMidYMid slice">
    <defs>
      <filter id="threshold">
        {/* This matrix increases contrast, turning blurred, semi-transparent
            pixels into either fully opaque or fully transparent ones,
            which creates the "merge" effect. */}
        <feColorMatrix
          in="SourceGraphic"
          type="matrix"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 255 -140"
        />
      </filter>
    </defs>
  </svg>
);

// The main component that wraps everything
const MorphingText = ({ texts, className }: MorphingTextProps) => (
  <div
    className={cn(
      // Apply the SVG filter here
      "relative mx-auto h-16 w-full max-w-screen-md text-center font-sans text-[60pt] font-bold leading-none [filter:url(#threshold)] md:h-24 lg:text-[8rem]",
      // Applied the new color
      "dark:text-[#dadada] text-violet-500",
      className,
    )}
  >
    <Texts texts={texts} />
    <SvgFilters />
  </div>
);

export { MorphingText };
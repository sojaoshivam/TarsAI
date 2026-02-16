"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

/**
 * A reusable Framer Motion component that fades in its children 
 * as they scroll into view.
 * * @param {React.ReactNode} children - The content to animate.
 * @param {string} [className] - Optional classes to apply to the wrapper.
 * @param {number} [delay=0] - Optional delay in seconds.
 */
export function FadeIn({ children, className, delay = 0 }: FadeInProps) {
  const ref = useRef(null);
  // 'once: true' ensures the animation only runs once
  const isInView = useInView(ref, { once: true });

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      transition={{ 
        duration: 0.5, 
        delay: delay 
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
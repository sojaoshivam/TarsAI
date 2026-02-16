"use client";

import { cn } from "@/app/lib/utils";
import { Sparkles } from "lucide-react";

interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
}

function DisplayCard({
  className,
  icon = <Sparkles className="size-4 text-blue-300" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  iconClassName = "text-blue-500",
  titleClassName = "text-blue-500",
}: DisplayCardProps) {
  return (
    <div
      className={cn(
        /* * CHANGES:
          * - Made height responsive: 'h-32' -> 'lg:h-36'
          * - Made width responsive: 'w-[18rem]' (288px) -> 'lg:w-[22rem]' (352px)
          * - Removed skew on mobile: '-skew-y-0' -> 'lg:-skew-y-[8deg]'
          * - Made 'after' element width responsive: 'after:w-[16rem]' -> 'lg:after:w-[20rem]'
          */
        "relative flex h-32 w-[18rem] -skew-y-0 select-none flex-col justify-between rounded-xl border-2 bg-muted/70 backdrop-blur-sm px-4 py-3 transition-all duration-700 after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[16rem] after:bg-gradient-to-l after:from-background after:to-transparent after:content-[''] hover:border-white/20 hover:bg-muted [&>*]:flex [&>*]:items-center [&>*]:gap-2 lg:h-36 lg:w-[22rem] lg:-skew-y-[8deg] lg:after:w-[20rem]",
        className
      )}
    >
      <div>
        <span className="relative inline-block rounded-full bg-blue-700 p-1">
          {icon}
        </span>
        {/* CHANGE: Made text size responsive */}
        <p className={cn("text-base font-medium lg:text-lg", titleClassName)}>
          {title}
        </p>
      </div>
      {/* CHANGE: Made text size responsive */}
      <p className="whitespace-nowrap text-base lg:text-lg">{description}</p>
      <p className="text-muted-foreground">{date}</p>
    </div>
  );
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[];
}

export default function DisplayCards({ cards }: DisplayCardsProps) {
  const defaultCards = [
    {
      // FIX: Corrected typo 'duration:700' to 'duration-700'
      className:
        "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      /* * FIX: Added 'lg:' prefix to transforms.
        * - Cards will stack on mobile (no translation).
        * - Cards will fan out on large screens.
        * - Corrected 'duration:700'.
        */
      className:
        "[grid-area:stack] lg:translate-x-16 lg:translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
    },
    {
      // FIX: Added 'lg:' prefix to transforms.
      className:
        "[grid-area:stack] lg:translate-x-32 lg:translate-y-20 hover:translate-y-10",
    },
  ];

  const displayCards = cards || defaultCards;

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center opacity-100 animate-in fade-in-0 duration-700">
      {displayCards.map((cardProps, index) => (
        // We pass 'cardProps' *first* to let the defaultCards array override defaults,
        // then spread the 'defaultProps' from this component's data.
        <DisplayCard
          key={index}
          // Spread the props from the array (like className and translations)
          {...cardProps}
          // Spread the *other* props from the parent (like title, icon)
          // This ensures all cards get the same content if not specified
          title={cardProps.title}
          description={cardProps.description}
          date={cardProps.date}
          icon={cardProps.icon}
        />
      ))}
    </div>
  );
}
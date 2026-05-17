import { cn } from "@/lib/utils";
import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ children, className, hover = false, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "bg-white/40 dark:bg-black/20 backdrop-blur-xl border border-white/40 dark:border-white/10 rounded-3xl shadow-sm",
          hover && "hover:-translate-y-1 hover:shadow-md hover:bg-white/50 dark:hover:bg-black/30 transition-all duration-300 cursor-pointer",
          className
        )}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

GlassCard.displayName = "GlassCard";

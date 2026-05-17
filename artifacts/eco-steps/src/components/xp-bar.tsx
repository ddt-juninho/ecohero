import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface XPBarProps {
  currentXP: number;
  targetXP: number;
  className?: string;
  showLabels?: boolean;
}

export function XPBar({ currentXP, targetXP, className, showLabels = true }: XPBarProps) {
  const percentage = Math.min(100, Math.max(0, (currentXP / targetXP) * 100));

  return (
    <div className={cn("w-full flex flex-col gap-2", className)}>
      {showLabels && (
        <div className="flex justify-between items-center text-sm font-semibold">
          <span className="text-primary">{currentXP} XP</span>
          <span className="text-muted-foreground">{targetXP} XP</span>
        </div>
      )}
      
      <div className="h-4 w-full bg-white/50 dark:bg-black/40 rounded-full overflow-hidden backdrop-blur-sm border border-white/40 shadow-inner">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-accent relative"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, type: "spring", bounce: 0.2 }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        </motion.div>
      </div>
    </div>
  );
}

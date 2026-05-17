import { PageTransition } from "@/components/page-transition";
import { GlassCard } from "@/components/glass-card";
import { LEADERBOARD, LeaderboardEntry } from "@/data/mock-data";
import { useEcoStore } from "@/hooks/use-eco-store";
import { Trophy, Flame, Medal } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Leaderboard() {
  const { profile } = useEcoStore();

  const myEntry: LeaderboardEntry = {
    rank: 4,
    username: profile.username,
    level: profile.level,
    xp: profile.xp,
    ecoScore: profile.ecoScore,
    streak: profile.streak,
    isCurrentUser: true,
  };

  const allEntries: LeaderboardEntry[] = [
    ...LEADERBOARD.slice(0, 3),
    myEntry,
    ...LEADERBOARD.slice(3),
  ].sort((a, b) => a.rank - b.rank);

  const top3 = allEntries.slice(0, 3);
  const rest = allEntries.slice(3);

  return (
    <PageTransition>
      <div className="flex flex-col gap-6">

        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-3">
            <Trophy className="w-8 h-8 text-yellow-500 fill-yellow-500" />
            Ranking Global
          </h1>
          <p className="text-muted-foreground mt-2">Os maiores guerreiros eco do planeta.</p>
        </div>

        {top3.length > 0 && (
          <div className="flex items-end justify-center gap-2 md:gap-6 mb-8 pt-8">
            {top3[1] && <PodiumItem entry={top3[1]} height="h-32" color="bg-gray-300" ring="ring-gray-300" />}
            {top3[0] && <PodiumItem entry={top3[0]} height="h-40" color="bg-yellow-400" ring="ring-yellow-400" isFirst />}
            {top3[2] && <PodiumItem entry={top3[2]} height="h-24" color="bg-amber-600" ring="ring-amber-600" />}
          </div>
        )}

        <div className="flex flex-col gap-3">
          {rest.map((entry: LeaderboardEntry) => (
            <GlassCard
              key={entry.rank}
              className={cn(
                "p-4 flex items-center gap-4 transition-transform",
                entry.isCurrentUser ? "border-primary shadow-lg shadow-primary/10 bg-primary/5 dark:bg-primary/10" : ""
              )}
              data-testid={`row-leaderboard-${entry.rank}`}
            >
              <div className="w-8 text-center font-black text-xl text-muted-foreground">{entry.rank}</div>

              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent p-0.5 shrink-0">
                <div className="w-full h-full rounded-full bg-card flex items-center justify-center text-sm font-bold">
                  {entry.username[0].toUpperCase()}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h3 className={cn("font-bold text-lg truncate", entry.isCurrentUser && "text-primary")}>
                  {entry.username} {entry.isCurrentUser && "(Você)"}
                </h3>
                <p className="text-xs text-muted-foreground font-medium">Nível {entry.level}</p>
              </div>

              <div className="text-right flex items-center gap-4 shrink-0">
                <div className="hidden sm:flex flex-col items-center">
                  <span className="flex items-center gap-1 text-sm font-bold text-orange-500">
                    <Flame className="w-4 h-4 fill-orange-500" />
                    {entry.streak}
                  </span>
                </div>
                <div className="text-right">
                  <span className="block font-black text-lg text-primary">{entry.xp}</span>
                  <span className="block text-[10px] text-muted-foreground uppercase font-bold">XP</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

      </div>
    </PageTransition>
  );
}

function PodiumItem({ entry, height, color, ring, isFirst = false }: { entry: LeaderboardEntry; height: string; color: string; ring: string; isFirst?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center"
    >
      {isFirst ? (
        <Trophy className="w-8 h-8 text-yellow-500 fill-yellow-500 mb-2 drop-shadow-md" />
      ) : (
        <Medal className={`w-6 h-6 mb-2 fill-current opacity-80 ${color.replace("bg-", "text-")}`} />
      )}

      <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full mb-3 p-1 bg-gradient-to-b from-white to-transparent dark:from-black/50 shadow-xl ring-2 ${ring} ring-offset-2 ring-offset-background`}>
        <div className="w-full h-full rounded-full bg-card flex items-center justify-center text-2xl font-black">
          {entry.username[0].toUpperCase()}
        </div>
      </div>

      <div className={cn("w-20 md:w-28 rounded-t-xl flex flex-col items-center justify-end pb-4 shadow-lg backdrop-blur-md border-x border-t border-white/20", color, height)}>
        <span className="font-black text-white text-xl drop-shadow-md">{entry.rank}</span>
      </div>

      <div className="text-center mt-3">
        <h3 className={cn("font-bold text-sm truncate w-20 md:w-28", entry.isCurrentUser && "text-primary")}>{entry.username}</h3>
        <p className="text-xs text-primary font-bold">{entry.xp} XP</p>
      </div>
    </motion.div>
  );
}

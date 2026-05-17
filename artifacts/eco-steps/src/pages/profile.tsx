import { PageTransition } from "@/components/page-transition";
import { GlassCard } from "@/components/glass-card";
import { XPBar } from "@/components/xp-bar";
import { useEcoStore } from "@/hooks/use-eco-store";
import { Flame, Star, Target, Award, Cloud, Droplets, Recycle, Leaf, Trophy, Zap, Bike, Utensils } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/data/mock-data";

const rarityColors: Record<string, string> = {
  common: "border-gray-400 text-gray-500",
  rare: "border-blue-400 text-blue-500 shadow-blue-500/20",
  epic: "border-purple-400 text-purple-500 shadow-purple-500/20",
  legendary: "border-yellow-400 text-yellow-500 shadow-yellow-500/30",
};

const rarityLabels: Record<string, string> = {
  common: "Comum",
  rare: "Raro",
  epic: "Épico",
  legendary: "Lendário",
};

const badgeIcons: Record<number, React.ElementType> = {
  1: Leaf,
  2: Flame,
  3: Droplets,
  4: Bike,
  5: Star,
  6: Trophy,
  7: Trophy,
  8: Recycle,
  9: Zap,
  10: Utensils,
};

export default function Profile() {
  const { profile, stats, badges } = useEcoStore();
  const earnedCount = badges.filter((b: Badge) => b.earned).length;

  return (
    <PageTransition>
      <div className="flex flex-col gap-6">

        <GlassCard className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-accent p-1 shadow-xl">
            <div className="w-full h-full rounded-full bg-card border-4 border-background flex items-center justify-center">
              <span className="text-3xl font-black text-primary">{profile.username[0].toUpperCase()}</span>
            </div>
          </div>

          <div className="flex-1 text-center md:text-left z-10">
            <h1 className="text-3xl font-black">{profile.username}</h1>
            <p className="text-muted-foreground font-medium mb-4">{profile.title}</p>
            <XPBar currentXP={profile.xp} targetXP={profile.xpToNextLevel} />
            <p className="text-xs text-muted-foreground mt-2">{profile.xp} / {profile.xpToNextLevel} XP</p>
          </div>

          <div className="flex gap-4 md:flex-col justify-center w-full md:w-auto">
            <div className="flex flex-col items-center p-3 rounded-2xl bg-white/50 dark:bg-black/30 min-w-[80px]" data-testid="stat-streak">
              <Flame className="w-6 h-6 text-orange-500 fill-orange-500 mb-1" />
              <span className="font-bold">{profile.streak}</span>
              <span className="text-[10px] text-muted-foreground uppercase">Sequência</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-2xl bg-white/50 dark:bg-black/30 min-w-[80px]" data-testid="stat-level">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500 mb-1" />
              <span className="font-bold">Nv {profile.level}</span>
              <span className="text-[10px] text-muted-foreground uppercase">Nível</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-2xl bg-white/50 dark:bg-black/30 min-w-[80px]" data-testid="stat-badges">
              <Award className="w-6 h-6 text-primary mb-1" />
              <span className="font-bold">{earnedCount}</span>
              <span className="text-[10px] text-muted-foreground uppercase">Emblemas</span>
            </div>
          </div>
        </GlassCard>

        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Impacto Acumulado
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox icon={Cloud} value={`${stats.co2Saved}kg`} label="CO₂ Salvo" />
            <StatBox icon={Droplets} value={`${stats.waterSaved}L`} label="Água Poupada" />
            <StatBox icon={Recycle} value={`${stats.plasticAvoided}kg`} label="Plástico Evitado" />
            <StatBox icon={Leaf} value={`${stats.treesEquivalent}`} label="Árvores Eq." />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Conquistas
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {badges.map((badge: Badge) => {
              const Icon = badgeIcons[badge.id] || Trophy;
              return (
                <GlassCard
                  key={badge.id}
                  className={cn("p-4 flex flex-col items-center text-center transition-all duration-500", !badge.earned && "opacity-40 grayscale")}
                  data-testid={`badge-${badge.id}`}
                >
                  <div className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center mb-3 border-4 bg-white/80 dark:bg-black/50",
                    badge.earned ? rarityColors[badge.rarity] : "border-gray-200",
                    badge.earned && "shadow-lg"
                  )}>
                    <Icon className={cn("w-8 h-8", badge.earned ? rarityColors[badge.rarity].split(" ").find(c => c.startsWith("text-")) : "text-gray-400")} />
                  </div>
                  <h3 className="font-bold text-sm leading-tight mb-1">{badge.name}</h3>
                  <p className="text-[10px] text-muted-foreground leading-tight mb-1">{badge.description}</p>
                  {badge.earned && (
                    <span className={cn("text-[9px] font-bold uppercase px-2 py-0.5 rounded-full mt-1", rarityColors[badge.rarity].replace("border-", "bg-").replace("shadow-", "").split(" ")[1], "bg-current/10")}>
                      {rarityLabels[badge.rarity]}
                    </span>
                  )}
                </GlassCard>
              );
            })}
          </div>
        </div>

      </div>
    </PageTransition>
  );
}

function StatBox({ icon: Icon, value, label }: { icon: React.ElementType; value: string; label: string }) {
  return (
    <GlassCard className="p-4 flex flex-col items-center justify-center text-center">
      <Icon className="w-6 h-6 text-primary mb-2 opacity-80" />
      <span className="text-xl font-black">{value}</span>
      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
    </GlassCard>
  );
}

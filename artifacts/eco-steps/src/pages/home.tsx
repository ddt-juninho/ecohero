import { PageTransition } from "@/components/page-transition";
import { GlassCard } from "@/components/glass-card";
import { XPBar } from "@/components/xp-bar";
import { useEcoStore } from "@/hooks/use-eco-store";
import { Flame, Star, Droplets, Zap, Recycle, Car, ShoppingBag, Utensils, Cloud, Leaf, Trophy } from "lucide-react";
import { Link } from "wouter";
import { Challenge } from "@/data/mock-data";

const iconMap: Record<string, React.ElementType> = {
  transport: Car,
  energy: Zap,
  food: Utensils,
  waste: Recycle,
  water: Droplets,
  shopping: ShoppingBag,
};

export default function Home() {
  const { profile, challenges, stats } = useEcoStore();
  const todayChallenges = challenges.filter((c) => !c.completed).slice(0, 3);

  return (
    <PageTransition>
      <div className="flex flex-col gap-6">

        <header className="flex justify-between items-center mt-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Olá, {profile.username}!</h1>
            <p className="text-muted-foreground text-lg">Vamos salvar o planeta hoje.</p>
          </div>
          <div className="flex gap-3">
            <GlassCard className="px-4 py-2 flex items-center gap-2" data-testid="badge-streak">
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
              <span className="font-bold text-lg">{profile.streak}</span>
            </GlassCard>
            <GlassCard className="px-4 py-2 flex items-center gap-2" data-testid="badge-level">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <span className="font-bold text-lg">Nv {profile.level}</span>
            </GlassCard>
          </div>
        </header>

        <GlassCard className="p-6 overflow-hidden relative" data-testid="card-xp-progress">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Star className="w-32 h-32" />
          </div>
          <h3 className="text-lg font-bold mb-4">Jornada para o Nível {profile.level + 1}</h3>
          <XPBar currentXP={profile.xp} targetXP={profile.xpToNextLevel} />
          <p className="text-sm text-muted-foreground mt-3">
            {profile.xpToNextLevel - profile.xp} XP restantes para subir de nível
          </p>
        </GlassCard>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="CO₂ Salvo" value={`${stats.co2Saved}kg`} icon={Cloud} color="text-slate-500" />
          <StatCard title="Água Poupada" value={`${stats.waterSaved}L`} icon={Droplets} color="text-blue-500" />
          <StatCard title="Plástico Evitado" value={`${stats.plasticAvoided}kg`} icon={Recycle} color="text-green-500" />
          <StatCard title="Árvores Eq." value={`${stats.treesEquivalent}`} icon={Leaf} color="text-emerald-500" />
        </div>

        <div className="mt-4">
          <div className="flex justify-between items-end mb-4">
            <h2 className="text-2xl font-bold">Metas de Hoje</h2>
            <Link href="/challenges" className="text-primary font-semibold hover:underline">
              Ver Todas
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {todayChallenges.map((challenge: Challenge) => {
              const Icon = iconMap[challenge.category] || Leaf;
              return (
                <GlassCard key={challenge.id} hover className="p-5 flex flex-col h-full" data-testid={`card-challenge-${challenge.id}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 rounded-2xl bg-white/60 dark:bg-black/40">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-primary/20 text-primary">
                      +{challenge.xpReward} XP
                    </span>
                  </div>
                  <h3 className="font-bold text-lg mb-2">{challenge.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-grow">{challenge.description}</p>
                  <Link
                    href="/challenges"
                    className="w-full py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-center mt-auto hover:bg-primary/90 transition-colors block"
                    data-testid={`link-start-${challenge.id}`}
                  >
                    Começar
                  </Link>
                </GlassCard>
              );
            })}

            {todayChallenges.length === 0 && (
              <GlassCard className="col-span-full p-8 text-center flex flex-col items-center">
                <Trophy className="w-16 h-16 text-yellow-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Tudo em dia!</h3>
                <p className="text-muted-foreground">Você completou todos os desafios de hoje. Parabéns pelo planeta!</p>
              </GlassCard>
            )}
          </div>
        </div>

      </div>
    </PageTransition>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string; value: string; icon: React.ElementType; color: string }) {
  return (
    <GlassCard className="p-4 flex flex-col items-center justify-center text-center">
      <Icon className={`w-8 h-8 mb-2 ${color}`} />
      <span className="text-2xl font-black">{value}</span>
      <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{title}</span>
    </GlassCard>
  );
}

import { PageTransition } from "@/components/page-transition";
import { GlassCard } from "@/components/glass-card";
import { useEcoStore } from "@/hooks/use-eco-store";
import { Leaf, Droplets, Zap, Recycle, Car, ShoppingBag, Utensils, CheckCircle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useState } from "react";
import { Challenge } from "@/data/mock-data";

const iconMap: Record<string, React.ElementType> = {
  transport: Car,
  energy: Zap,
  food: Utensils,
  waste: Recycle,
  water: Droplets,
  shopping: ShoppingBag,
};

const diffColors: Record<string, string> = {
  easy: "bg-green-500/20 text-green-700 dark:text-green-400",
  medium: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
  hard: "bg-red-500/20 text-red-700 dark:text-red-400",
};

const diffLabels: Record<string, string> = {
  easy: "Fácil",
  medium: "Médio",
  hard: "Difícil",
};

const categoryLabels: Record<string, string> = {
  transport: "Transporte",
  energy: "Energia",
  food: "Alimentação",
  waste: "Resíduos",
  water: "Água",
  shopping: "Compras",
};

export default function Challenges() {
  const { challenges, completeChallenge } = useEcoStore();
  const [pending, setPending] = useState<number | null>(null);

  const handleComplete = (id: number) => {
    setPending(id);
    setTimeout(() => {
      const result = completeChallenge(id);
      setPending(null);
      if (result) {
        toast.success(`+${result.xpEarned} XP conquistado!`, {
          description: result.levelUp
            ? `Subiu de nível! Agora você é nível ${result.newLevel}`
            : "Ótimo trabalho cuidando do planeta!",
          icon: <Leaf className="w-5 h-5 text-primary" />,
        });
      }
    }, 600);
  };

  const activeChallenges = challenges.filter((c: Challenge) => !c.completed);
  const completedChallenges = challenges.filter((c: Challenge) => c.completed);

  return (
    <PageTransition>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold">Desafios Diários</h1>
          <p className="text-muted-foreground mt-1">Complete missões para ganhar XP e salvar o planeta.</p>
        </div>

        <div className="flex flex-col gap-4">
          <AnimatePresence>
            {activeChallenges.map((challenge: Challenge) => {
              const Icon = iconMap[challenge.category] || Leaf;
              const isPending = pending === challenge.id;
              return (
                <GlassCard
                  key={challenge.id}
                  className="p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  layout
                >
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-2xl bg-white/60 dark:bg-black/40 shrink-0">
                      <Icon className="w-8 h-8 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${diffColors[challenge.difficulty]}`}>
                          {diffLabels[challenge.difficulty]}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
                          {categoryLabels[challenge.category]}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg">{challenge.title}</h3>
                      <p className="text-sm text-muted-foreground">{challenge.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleComplete(challenge.id)}
                    disabled={isPending}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-70 group whitespace-nowrap shrink-0"
                    data-testid={`button-complete-${challenge.id}`}
                  >
                    {isPending ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.6, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                    ) : (
                      <span className="group-hover:-translate-y-0.5 transition-transform">
                        +{challenge.xpReward} XP
                      </span>
                    )}
                  </button>
                </GlassCard>
              );
            })}
          </AnimatePresence>

          {activeChallenges.length === 0 && (
            <GlassCard className="p-8 text-center flex flex-col items-center">
              <CheckCircle className="w-16 h-16 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">Missão Cumprida!</h3>
              <p className="text-muted-foreground">Você completou todos os desafios ativos. Incrível!</p>
            </GlassCard>
          )}
        </div>

        {completedChallenges.length > 0 && (
          <div className="mt-4">
            <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-muted-foreground" />
              Completados Hoje
            </h2>
            <div className="flex flex-col gap-3 opacity-60">
              {completedChallenges.map((challenge: Challenge) => {
                const Icon = iconMap[challenge.category] || Leaf;
                return (
                  <GlassCard key={challenge.id} className="p-4 flex items-center gap-4" data-testid={`card-done-${challenge.id}`}>
                    <div className="p-2 rounded-xl bg-white/40 dark:bg-black/20">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold">{challenge.title}</h3>
                    </div>
                    <CheckCircle className="w-5 h-5 text-primary" />
                  </GlassCard>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}

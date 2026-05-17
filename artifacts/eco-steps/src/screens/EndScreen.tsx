import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { Lang, TRANSLATIONS } from "@/i18n";

interface Props {
  playerName: string;
  totalPoints: number;
  maxPoints: number;
  lang: Lang;
  onRestart: () => void;
}

function getStars(pts: number, max: number): 1 | 2 | 3 {
  const pct = pts / max;
  if (pct >= 0.85) return 3;
  if (pct >= 0.55) return 2;
  return 1;
}

const CONFETTI = Array.from({ length: 38 }, (_, i) => ({
  color: ["#22c55e", "#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ec4899", "#f97316"][i % 7],
  x: Math.random() * 100,
  delay: Math.random() * 1.4,
  size: 6 + Math.random() * 8,
  duration: 2.2 + Math.random() * 1.8,
}));

export default function EndScreen({ playerName, totalPoints, maxPoints, lang, onRestart }: Props) {
  const [confetti, setConfetti] = useState(true);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "shared">("idle");
  const t = TRANSLATIONS[lang];
  const stars = getStars(totalPoints, maxPoints);
  const bIndex = 3 - stars; // badge array index (0=3stars, 1=2stars, 2=1star)

  useEffect(() => {
    const id = setTimeout(() => setConfetti(false), 4000);
    return () => clearTimeout(id);
  }, []);

  const impactValues = [
    `${totalPoints * 2}L`,
    `${Math.round(totalPoints * 0.5)}Wh`,
    `${Math.min(3, Math.round(totalPoints / 80))}`,
  ];

  const badgeEmoji = ["🏆", "🥈", "🌱"][bIndex];

  // Função robusta de partilha com suporte a mobile e fallback automático para desktop
  const handleShare = useCallback(async () => {
    const pct = Math.round((totalPoints / maxPoints) * 100);
    
    const shareText = lang === "pt"
      ? `🌱 Consegui a insígnia ${badgeEmoji} no EcoSteps! Fiz ${totalPoints} pontos (${pct}% de eficiência ecológica) e poupei mais de ${totalPoints * 2}L de água simulada! Consegues bater o meu recorde? Aceita o desafio aqui: ${window.location.origin}`
      : `🌱 I just earned the ${badgeEmoji} badge in EcoSteps! Scored ${totalPoints} points (${pct}% eco-efficiency) and saved over ${totalPoints * 2}L of simulated water! Can you beat my high score? Take the challenge here: ${window.location.origin}`;

    const shareData = {
      title: "EcoSteps Challenge",
      text: shareText,
      url: window.location.origin,
    };

    // Tenta usar a API nativa de partilha (Telemóveis / Browsers Modernos)
    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        setShareStatus("shared");
        setTimeout(() => setShareStatus("idle"), 3000);
        return;
      } catch (err) {
        // Se o utilizador apenas cancelou a partilha nativa, não fazemos nada
        if ((err as Error).name === "AbortError") return;
      }
    }

    // Fallback: Copiar para o Clipboard se for PC antigo ou não suportado
    try {
      await navigator.clipboard.writeText(shareText);
      setShareStatus("copied");
      setTimeout(() => setShareStatus("idle"), 3000);
    } catch (err) {
      console.error("Falha ao copiar texto", err);
    }
  }, [totalPoints, maxPoints, lang, badgeEmoji]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-x-hidden overflow-y-auto"
      style={{ background: "linear-gradient(145deg,#064e3b 0%,#065f46 30%,#0f766e 65%,#0369a1 100%)", fontFamily: "Outfit, sans-serif" }}>

      {/* Confetti Otimizado */}
      {confetti && CONFETTI.map((c, i) => (
        <motion.div key={i} className="absolute rounded-sm pointer-events-none transform-gpu"
          style={{ left: `${c.x}%`, top: "-4%", width: c.size, height: c.size, backgroundColor: c.color, rotate: Math.random() * 360 }}
          animate={{ y: ["0vh", "110vh"], rotate: [0, 680 * (Math.random() > 0.5 ? 1 : -1)], opacity: [1, 1, 0] }}
          transition={{ duration: c.duration, delay: c.delay, ease: "easeIn" }} />
      ))}

      <motion.div
        initial={{ opacity: 0, y:40, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", bounce: 0.35, delay: 0.05 }}
        className="relative z-10 w-full flex flex-col items-center my-auto"
        style={{ maxWidth: 400 }}
      >
        {/* Badge */}
        <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", bounce: 0.5, delay: 0.3 }}
          style={{ fontSize: "clamp(56px,14vw,76px)", filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.35))" }}
          className="transform-gpu">
          {badgeEmoji}
        </motion.div>

        <h2 className="font-black text-white mt-1 text-center" style={{ fontSize: "clamp(22px,5.5vw,28px)", textShadow: "0 2px 10px rgba(0,0,0,0.35)" }}>
          {t.badge[bIndex]}
        </h2>
        <p className="text-emerald-200 font-semibold text-center mt-0.5 mb-3.5"
          style={{ fontSize: "clamp(13px,3vw,15px)" }}>
          {t.congrats}, <span className="text-white font-black">{playerName}</span>!
        </p>

        {/* Stars */}
        <div className="flex justify-center gap-2.5 mb-3.5">
          {[1, 2, 3].map(s => (
            <motion.span key={s}
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: s <= stars ? 1 : 0.6, rotate: 0, opacity: s <= stars ? 1 : 0.25 }}
              transition={{ delay: 0.4 + s * 0.08, type: "spring", bounce: 0.5 }}
              style={{ fontSize: "clamp(34px,9vw,48px)", filter: s <= stars ? "drop-shadow(0 0 8px rgba(251,191,36,0.6))" : "none" }}
              className="transform-gpu">
              ⭐
            </motion.span>
          ))}
        </div>

        {/* Score card */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.65 }}
          className="w-full rounded-[1.5rem] py-3.5 px-5 mb-3.5 text-center transform-gpu"
          style={{ background: "linear-gradient(135deg,#fbbf24,#f97316)", boxShadow: "0 6px 24px rgba(251,191,36,0.3)" }}>
          <p className="text-white font-black leading-none" style={{ fontSize: "clamp(32px,8vw,44px)" }}>{totalPoints}</p>
          <p className="text-white/80 font-bold mt-1" style={{ fontSize: "clamp(11px,2.5vw,13px)" }}>
            {t.ptsOf(totalPoints, maxPoints)}
          </p>
        </motion.div>

        {/* Impact grid */}
        <div className="grid grid-cols-3 gap-2 w-full mb-3.5">
          {t.impacts.map((item, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 + i * 0.08 }}
              className="rounded-xl flex flex-col items-center py-2.5 px-1 bg-black/20 backdrop-blur-xs border border-white/10">
              <span style={{ fontSize: "clamp(18px,4.5vw,24px)" }}>{item.emoji}</span>
              <span className="font-black text-white mt-0.5" style={{ fontSize: "clamp(12px,3vw,15px)" }}>
                {impactValues[i]}
              </span>
              <span className="text-white/50 text-center leading-tight mt-0.5 px-0.5" style={{ fontSize: "clamp(7.5px,1.6vw,9.5px)" }}>
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Sub badge message */}
        <p className="text-white/50 italic text-center mb-4.5 px-3 font-medium leading-snug"
          style={{ fontSize: "clamp(10px,2.2vw,12px)" }}>
          "{t.badgeSub[bIndex]}"
        </p>

        {/* Grupo de Ações Interativas */}
        <div className="w-full flex flex-col gap-2">
          {/* Botão de Partilhar Redes Sociais */}
          <motion.button
            onClick={handleShare}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-xl font-black text-slate-950 flex items-center justify-center gap-2 cursor-pointer shadow-lg border border-white/20"
            style={{
              padding: "clamp(12px,3.2vw,16px)",
              fontSize: "clamp(13px,3.5vw,15px)",
              background: "linear-gradient(135deg, #38bdf8, #0ea5e9)",
              boxShadow: "0 6px 20px rgba(14,165,233,0.3)"
            }}
          >
            <span>{shareStatus === "copied" ? "📋" : shareStatus === "shared" ? "🎉" : "🔗"}</span>
            <span>
              {shareStatus === "copied"
                ? (lang === "pt" ? "Copiado! Cola nas Redes" : "Copied to Clipboard!")
                : shareStatus === "shared"
                ? (lang === "pt" ? "Partilhado com Sucesso!" : "Shared Successfully!")
                : (lang === "pt" ? "Desafiar Amigos / Partilhar" : "Challenge Friends / Share")}
            </span>
          </motion.button>

          {/* Botão Jogar de Novo */}
          <motion.button
            onClick={onRestart}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-xl font-black text-white cursor-pointer"
            style={{
              padding: "clamp(12px,3.2vw,16px)",
              fontSize: "clamp(13px,3.5vw,15px)",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
            }}
            data-testid="button-restart"
          >
            🔄 {t.playAgain}
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
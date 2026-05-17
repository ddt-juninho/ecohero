import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { TRASH_ITEMS, TrashItem } from "@/data/game-data";
import { Lang, TRANSLATIONS } from "@/i18n";

// Memorizado e isolado para evitar re-renderizações desnecessárias do SVG complexo
const ThrowingChild = React.memo(({ throwing }: { throwing: boolean }) => {
  return (
    <svg viewBox="0 0 64 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" className="will-change-transform transform-gpu">
      <ellipse cx="32" cy="14" rx="16" ry="14" fill="#059669" />
      <circle cx="32" cy="18" r="14" fill="#fbbf24" />
      <circle cx="26" cy="15" r="3" fill="#1e1b4b" />
      <circle cx="38" cy="15" r="3" fill="#1e1b4b" />
      <circle cx="27" cy="14" r="1" fill="white" />
      <circle cx="39" cy="14" r="1" fill="white" />
      <path d="M25 22 Q32 28 39 22" fill="none" stroke="#1e1b4b" strokeWidth="2.2" strokeLinecap="round" />
      <rect x="18" y="32" width="28" height="34" rx="9" fill="#10b981" />
      <line x1="18" y1="42" x2="5" y2="56" stroke="#fbbf24" strokeWidth="9" strokeLinecap="round" />
      {throwing
        ? <line x1="50" y1="36" x2="62" y2="20" stroke="#fbbf24" strokeWidth="9" strokeLinecap="round" />
        : <line x1="50" y1="44" x2="63" y2="58" stroke="#fbbf24" strokeWidth="9" strokeLinecap="round" />}
      <line x1="25" y1="66" x2="20" y2="94" stroke="#059669" strokeWidth="11" strokeLinecap="round" />
      <line x1="39" y1="66" x2="44" y2="94" stroke="#059669" strokeWidth="11" strokeLinecap="round" />
      <ellipse cx="17" cy="97" rx="8" ry="4.5" fill="#1e1b4b" />
      <ellipse cx="47" cy="97" rx="8" ry="4.5" fill="#1e1b4b" />
    </svg>
  );
});
ThrowingChild.displayName = "ThrowingChild";

interface Props {
  onComplete: (points: number, message: string) => void;
  totalPoints: number;
  lang: Lang;
}

export default function TrashScene({ onComplete, totalPoints, lang }: Props) {
  const t = TRANSLATIONS[lang];

  const BINS = useMemo(() => [
    { id: "blue"  as const, bg:"linear-gradient(180deg,#2563eb,#1d4ed8)", lid:"#1e3a8a", ring:"#60a5fa", text:"#dbeafe" },
    { id: "brown" as const, bg:"linear-gradient(180deg,#b45309,#92400e)", lid:"#451a03", ring:"#fbbf24", text:"#fef3c7" },
    { id: "gray"  as const, bg:"linear-gradient(180deg,#4b5563,#374151)", lid:"#111827", ring:"#9ca3af", text:"#f3f4f6" },
  ], []);

  const [items] = useState<TrashItem[]>(() => 
    [...TRASH_ITEMS].sort(() => Math.random() - 0.5).slice(0, 6)
  );
  
  const [idx, setIdx] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [feedback, setFeedback] = useState<{ ok: boolean; msg: string } | null>(null);
  const [throwing, setThrowing] = useState(false);
  const [activeBin, setActiveBin] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Estados locais para acumular a separação e explicações pedagógicas
  const [correctList, setCorrectList] = useState<TrashItem[]>([]);
  const [wrongList, setWrongList] = useState<TrashItem[]>([]);

  const current = items[idx];

  // Limpeza de timeouts ativos para evitar memory leaks em dispositivos lentos
  useEffect(() => {
    return () => {
      for (let i = setTimeout(() => {}, 0); i >= 0; i--) {
        clearTimeout(i);
      }
    };
  }, []);

  const handleBin = useCallback((binId: "blue" | "brown" | "gray") => {
    if (feedback || !current || showSuccess) return;

    const ok = current.bin === binId;
    setThrowing(true); 
    setActiveBin(binId);

    // Salva o item na respetiva lista para o ecrã final de análise
    if (ok) {
      setCorrectList(prev => [...prev, current]);
    } else {
      setWrongList(prev => [...prev, current]);
    }

    // Primeiro Frame de Feedback Visual Rápido
    setTimeout(() => {
      setFeedback({ ok, msg: ok ? t.trashCorrect : t.trashWrong(t.bins[current.bin]) });
    }, 300);

    // Próximo Turno ou Finalização
    setTimeout(() => {
      const nc = correct + (ok ? 1 : 0);
      setFeedback(null); 
      setThrowing(false); 
      setActiveBin(null);
      
      const ni = idx + 1;
      if (ni >= items.length) {
        setCorrect(nc); 
        setShowSuccess(true);
        const pts = Math.round((nc / items.length) * 100);
        
        // Dá tempo ao utilizador para ler o mural pedagógico se houver erros
        const displayTime = wrongList.length > 0 ? 6500 : 2500;
        setTimeout(() => onComplete(pts, t.trashScore(nc, items.length)), displayTime);
      } else { 
        setCorrect(nc); 
        setIdx(ni); 
      }
    }, 1400);
  }, [feedback, current, showSuccess, correct, idx, items.length, t, onComplete, wrongList.length]);

  return (
    <div className="relative w-full h-full flex flex-col overflow-hidden select-none"
      style={{ fontFamily: "Outfit, sans-serif", background: "linear-gradient(180deg,#bfdbfe 0%,#dbeafe 30%,#bbf7d0 60%,#4ade80 100%)" }}>

      {/* Park background (Otimizado com transform-gpu nas nuvens) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute rounded-full" style={{ top: "4%", right: "10%", width: 40, height: 40, background: "radial-gradient(circle,#fef08a,#fbbf24)", boxShadow: "0 0 20px 6px rgba(251,191,36,0.4)" }} />
        {[{ x: 5, y: 6 }, { x: 50, y: 3 }, { x: 72, y: 8 }].map((c, i) => (
          <motion.div key={i} className="absolute transform-gpu will-change-transform" style={{ left: `${c.x}%`, top: `${c.y}%` }}
            animate={{ x: [-4, 4, -4] }} transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "easeInOut" }}>
            <div style={{ width: 56, height: 24, background: "white", borderRadius: "50%", opacity: 0.85 }} />
          </motion.div>
        ))}
        <div className="absolute bottom-0 left-0 right-0 h-[30%]" style={{ background: "linear-gradient(180deg,#4ade80,#16a34a)" }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 rounded-t-3xl" style={{ width: "22%", height: "30%", background: "linear-gradient(180deg,#e2e8f0,#cbd5e1)" }} />
        {[8, 18, 75, 85].map((x, i) => (
          <div key={i} className="absolute" style={{ left: `${x}%`, bottom: "28%", fontSize: "clamp(14px,3vw,20px)" }}>
            {["🌸", "🌻", "🌼", "🌺"][i]}
          </div>
        ))}
      </div>

      {/* HUD */}
      <div className="relative z-20 flex items-center gap-2 px-3 pt-3 pb-1">
        <div className="bg-white/75 backdrop-blur rounded-2xl px-3 py-1 font-black text-green-800 text-sm">{idx}/{items.length}</div>
        <div className="flex-1 bg-white/50 backdrop-blur rounded-full h-3 overflow-hidden">
          <motion.div className="h-full rounded-full transform-gpu" animate={{ width: `${(idx / items.length) * 100}%` }} transition={{ duration: 0.35 }}
            style={{ background: "linear-gradient(90deg,#22c55e,#16a34a)" }} />
        </div>
        <div className="bg-white/75 backdrop-blur rounded-2xl px-3 py-1 font-black text-yellow-600 text-sm">⭐{totalPoints}</div>
      </div>

      {/* Item + child */}
      <div className="relative z-20 flex items-center justify-center gap-3 px-4 py-2" style={{ flex: "1 1 auto" }}>
        <motion.div style={{ width: "clamp(50px,12vw,80px)", height: "clamp(80px,19vw,126px)", flexShrink: 0 }}
          animate={throwing ? { x: 10 } : { x: 0 }} transition={{ duration: 0.2 }}>
          <ThrowingChild throwing={throwing} />
        </motion.div>

        <AnimatePresence mode="wait">
          {current && (
            <motion.div key={current.id}
              initial={{ scale: 0, rotate: -10 }}
              animate={throwing ? { scale: 0.4, x: 120, y: 40, rotate: 20, opacity: 0 } : { scale: 1, rotate: 0, x: 0, y: 0, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.35, duration: throwing ? 0.3 : 0.4 }}
              className="bg-white rounded-[1.8rem] shadow-2xl flex flex-col items-center justify-center gap-2 transform-gpu"
              style={{ padding: "clamp(12px,3vw,22px)", minWidth: "clamp(110px,28vw,160px)" }}>
              <span style={{ fontSize: "clamp(44px,12vw,72px)", lineHeight: 1.1 }}>{current.emoji}</span>
              <span className="font-black text-gray-800 text-center" style={{ fontSize: "clamp(13px,3.2vw,17px)" }}>{current.name}</span>
              <span className="text-gray-400 font-semibold" style={{ fontSize: "clamp(9px,2vw,12px)" }}>{t.trashQuestion}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {feedback && (
            <motion.div initial={{ scale: 0, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0, opacity: 0 }}
              className={`absolute left-1/2 -translate-x-1/2 top-2 px-5 py-2 rounded-2xl font-black text-white text-sm shadow-xl z-40 text-center max-w-[85%] ${feedback.ok ? "bg-green-500" : "bg-red-500"}`}>
              {feedback.msg}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bins */}
      <div className="relative z-20 flex gap-2 px-3 pb-4">
        {BINS.map(bin => {
          const binLabel = t.bins[bin.id];
          const binEx    = t.binExamples[bin.id];
          const isActive = activeBin === bin.id;
          const icons    = { blue: "♻️", brown: "🌿", gray: "🗑️" };
          return (
            <motion.button key={bin.id} onClick={() => handleBin(bin.id)}
              whileTap={{ scale: 0.93 }}
              animate={isActive ? { scale: 0.88, y: 4 } : {}}
              className="flex-1 rounded-[1.4rem] overflow-hidden shadow-xl flex flex-col cursor-pointer focus:outline-none transform-gpu"
              style={{ border: `3px solid ${bin.ring}` }}
              data-testid={`button-bin-${bin.id}`}>
              <motion.div animate={isActive ? { scaleY: 0.25, y: -4 } : { scaleY: 1, y: 0 }}
                style={{ background: bin.lid, transformOrigin: "top" }}
                className="w-full py-2 flex justify-center">
                <div className="rounded-full bg-white/25 h-2" style={{ width: "35%" }} />
              </motion.div>
              <div className="flex-1 flex flex-col items-center justify-center py-2 px-1 gap-0.5" style={{ background: bin.bg }}>
                <span style={{ fontSize: "clamp(20px,5.5vw,30px)" }}>{icons[bin.id]}</span>
                <span className="font-black text-center leading-tight" style={{ color: bin.text, fontSize: "clamp(9px,2.2vw,13px)" }}>{binLabel}</span>
                <span className="text-center leading-tight opacity-70" style={{ color: bin.text, fontSize: "clamp(7px,1.6vw,10px)" }}>{binEx}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Painel Success Completo e Pedagógico (Estilo Canva / Pinterest) */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-xs" style={{ background: "rgba(15,23,42,0.65)" }}>
            <motion.div initial={{ scale: 0.95, y: 10 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", bounce: 0.3 }}
              className="bg-white rounded-[2.2rem] p-6 text-center shadow-2xl max-w-sm w-full flex flex-col max-h-[85vh] overflow-hidden transform-gpu">
              
              <div className="text-5xl mb-2">🌱♻️</div>
              <h3 className="font-black text-green-700 mb-0.5 tracking-tight" style={{ fontSize: "clamp(18px,5vw,22px)" }}>{t.trashSuccess}</h3>
              <p className="text-gray-500 font-bold text-xs uppercase tracking-wider mb-3">{t.trashScore(correct, items.length)}</p>

              {/* Listagens com scroll nativo e performante */}
              <div className="flex-1 overflow-y-auto pr-1 text-left flex flex-col gap-3 custom-review-scroll">
                
                {/* Secção de Acertos Simples */}
                {correctList.length > 0 && (
                  <div className="bg-slate-50 rounded-2xl p-2.5 border border-slate-100">
                    <span className="text-[10px] font-black tracking-wider text-slate-400 uppercase block mb-1.5">
                      {lang === "pt" ? "✓ Acertos:" : "✓ Correct:"}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {correctList.map(item => (
                        <span key={item.id} className="text-lg bg-white px-2 py-1 rounded-xl shadow-2xs border border-slate-100" title={item.name}>
                          {item.emoji}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Secção de Erros + Explicação Dedicada */}
                {wrongList.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-black tracking-wider text-red-400 uppercase block">
                      {lang === "pt" ? "💡 Reaprende e Melhora:" : "💡 Learn for Next Time:"}
                    </span>
                    {wrongList.map(item => {
                      const matchedBin = BINS.find(b => b.id === item.bin);
                      return (
                        <div key={item.id} className="bg-red-50/60 border border-red-100/70 rounded-2xl p-3 flex gap-2.5 items-start">
                          <span className="text-2xl bg-white p-1.5 rounded-xl shadow-3xs shrink-0">{item.emoji}</span>
                          <div className="flex flex-col">
                            <h4 className="font-black text-gray-800 text-xs">
                              {item.name} ➔ <span className="underline" style={{ color: matchedBin?.lid || "#374151" }}>{t.bins[item.bin]}</span>
                            </h4>
                            <p className="text-gray-500 text-[11px] font-medium leading-normal mt-0.5">
                              {item.explanation[lang]}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-3 text-center">
                    <p className="text-xs font-bold text-emerald-800">
                      {lang === "pt" ? "Perfeito! Separaste todos os resíduos sem errar." : "Flawless! You sorted every piece perfectly."}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .custom-review-scroll::-webkit-scrollbar { width: 4px; }
        .custom-review-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-review-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
      `}</style>
    </div>
  );
}
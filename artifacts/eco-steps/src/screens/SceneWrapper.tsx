import { motion, AnimatePresence } from "framer-motion";
import { SceneConfig } from "@/data/game-data";
import { Lang, TRANSLATIONS } from "@/i18n";

interface Props {
  scene: SceneConfig;
  sceneIndex: number;
  totalScenes: number;
  totalPoints: number;
  lang: Lang;
  children: React.ReactNode;
}

export default function SceneWrapper({
  scene, sceneIndex, totalScenes, totalPoints, lang, children,
}: Props) {
  const t = TRANSLATIONS[lang];

  return (
    <div className="flex flex-col w-full h-screen overflow-hidden bg-slate-950" style={{ fontFamily: "Outfit, sans-serif" }}>
      {/* Top bar */}
      <div className={`bg-gradient-to-r ${scene.bgColor} px-4 py-2.5 flex items-center gap-3 shadow-lg z-30 transform-gpu`}>
        <div className="flex-1 min-w-0">
          <p className="text-white/65 font-bold uppercase tracking-wider truncate"
            style={{ fontSize: "clamp(9px,1.8vw,11px)" }}>
            {t.sceneOf(sceneIndex + 1, totalScenes)}
          </p>
          <h2 className="text-white font-black truncate" style={{ fontSize: "clamp(15px,3.8vw,20px)" }}>
            {t.missions[sceneIndex]?.title ?? scene.title}
          </h2>
        </div>
        <motion.div key={totalPoints} initial={{ scale: 1.4 }} animate={{ scale: 1 }}
          className="flex-shrink-0 bg-black/30 backdrop-blur rounded-2xl px-3 py-1.5 border border-white/10">
          <span className="text-yellow-200 font-black" style={{ fontSize: "clamp(11px,2.6vw,14px)" }}>
            ⭐ {totalPoints} {t.points}
          </span>
        </motion.div>
      </div>

      {/* Progress dots */}
      <div className={`bg-gradient-to-r ${scene.bgColor} pb-2 flex justify-center gap-2`}>
        {Array.from({ length: totalScenes }).map((_, i) => (
          <motion.div key={i} className="rounded-full"
            animate={{
              width: i === sceneIndex ? "24px" : "8px",
              height: "8px",
              backgroundColor: i <= sceneIndex ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.28)",
            }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </div>

      {/* Scene content */}
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={scene.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute inset-0">
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
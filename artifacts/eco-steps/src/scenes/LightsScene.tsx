import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Lang, TRANSLATIONS } from "@/i18n";

interface Lamp { id: number; label: string; cx: number; cy: number; r: number; tipIdx: number; }

const LAMPS: Lamp[] = [
  { id:1, label:"Lustre",    cx:50, cy:22, r:1,    tipIdx:0 },
  { id:2, label:"Abajur",   cx:18, cy:62, r:0.82, tipIdx:1 },
  { id:3, label:"Candeeiro", cx:80, cy:55, r:0.82, tipIdx:2 },
  { id:4, label:"Arandela",  cx:82, cy:28, r:0.72, tipIdx:3 },
];
const BASE_SIZE = 62;

function Kid({ happy, pointing }: { happy: boolean; pointing: boolean }) {
  return (
    <svg viewBox="0 0 64 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="14" rx="16" ry="14" fill="#7c3aed" />
      <circle cx="32" cy="18" r="14" fill="#fbbf24" />
      <circle cx="26" cy="15" r={happy?3:2.5} fill="#1e1b4b" />
      <circle cx="38" cy="15" r={happy?3:2.5} fill="#1e1b4b" />
      {happy&&<><circle cx="27" cy="14" r="1" fill="white"/><circle cx="39" cy="14" r="1" fill="white"/></>}
      {happy
        ?<path d="M25 22 Q32 28 39 22" fill="none" stroke="#1e1b4b" strokeWidth="2" strokeLinecap="round"/>
        :<path d="M27 22 Q32 25 37 22" fill="none" stroke="#1e1b4b" strokeWidth="2" strokeLinecap="round"/>}
      <rect x="18" y="32" width="28" height="34" rx="9" fill="#3b82f6" />
      <line x1="18" y1="38" x2="5" y2="52" stroke="#fbbf24" strokeWidth="8" strokeLinecap="round" />
      {pointing
        ?<line x1="46" y1="36" x2="60" y2="18" stroke="#fbbf24" strokeWidth="8" strokeLinecap="round" />
        :<line x1="46" y1="38" x2="59" y2="52" stroke="#fbbf24" strokeWidth="8" strokeLinecap="round" />}
      <line x1="25" y1="66" x2="20" y2="94" stroke="#1d4ed8" strokeWidth="10" strokeLinecap="round" />
      <line x1="39" y1="66" x2="44" y2="94" stroke="#1d4ed8" strokeWidth="10" strokeLinecap="round" />
      <ellipse cx="17" cy="97" rx="8" ry="4.5" fill="#1e1b4b" />
      <ellipse cx="47" cy="97" rx="8" ry="4.5" fill="#1e1b4b" />
    </svg>
  );
}

interface Props {
  onComplete: (points: number, message: string) => void;
  totalPoints: number;
  lang: Lang;
}

export default function LightsScene({ onComplete, totalPoints, lang }: Props) {
  const t = TRANSLATIONS[lang];
  const [off, setOff]           = useState<Set<number>>(new Set());
  const [toast, setToast]       = useState<string | null>(null);
  const [tip, setTip]           = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const allOff     = off.size === LAMPS.length;
  const brightness = Math.max(0.06, 1 - (off.size / LAMPS.length) * 0.9);

  const turnOff = (lamp: Lamp) => {
    if (off.has(lamp.id) || showSuccess) return;
    const next = new Set(off); next.add(lamp.id);
    setOff(next);
    setToast(`✅ ${lamp.label} — ${t.lightOff}!`);
    setTip(t.lightsTips[lamp.tipIdx]);
    setTimeout(() => { setToast(null); setTip(null); }, 2200);
  };

  useEffect(() => {
    if (!allOff) return;
    setShowSuccess(true);
    setTimeout(() => onComplete(80, t.lightsSuccess), 1900);
  }, [allOff]);

  const rV = Math.round(20+brightness*55), gV = Math.round(14+brightness*32), bV = Math.round(60+brightness*90);
  const fR = Math.round(70+brightness*70), fG = Math.round(45+brightness*40), fB = Math.round(22+brightness*20);

  return (
    <div className="relative w-full h-full overflow-hidden select-none transition-colors duration-700"
      style={{ fontFamily:"Outfit, sans-serif", background:`linear-gradient(180deg,rgb(${rV},${gV},${bV}) 0%,rgb(${fR},${fG},${fB}) 100%)` }}>

      {/* Stars */}
      {brightness < 0.6 && [[12,8],[28,5],[45,11],[62,4],[78,9],[88,6],[35,15],[65,13]].map(([x,y],i)=>(
        <motion.div key={i} initial={{opacity:0}} animate={{opacity:(1-brightness)*0.8}}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{left:`${x}%`,top:`${y}%`,width:3,height:3,boxShadow:"0 0 4px 1px white"}} />
      ))}

      {/* Moon */}
      <motion.div className="absolute pointer-events-none" animate={{opacity:Math.max(0,1-brightness*1.8)}}
        style={{right:"8%",top:"6%",width:32,height:32}}>
        <div className="w-full h-full rounded-full" style={{background:"#fef08a",boxShadow:"0 0 12px 4px rgba(254,240,138,0.5)"}} />
      </motion.div>

      {/* Window */}
      <div className="absolute rounded-2xl overflow-hidden"
        style={{left:"60%",top:"8%",width:"clamp(64px,16%,120px)",height:"clamp(64px,16%,100px)",
          background:brightness>0.5?"linear-gradient(180deg,#1e3a8a,#312e81)":"linear-gradient(180deg,#020617,#0a0522)",
          border:"3px solid rgba(255,255,255,0.18)"}}>
        <div className="w-full h-full grid grid-cols-2 grid-rows-2">
          {[0,1,2,3].map(i=><div key={i} style={{border:"1px solid rgba(255,255,255,0.15)"}} />)}
        </div>
      </div>

      {/* Floor */}
      <div className="absolute left-0 right-0 bottom-0 transition-colors duration-700"
        style={{height:"28%",background:`rgb(${fR},${fG},${fB})`}}>
        {[12,25,38,51,64,77,90].map(x=>(
          <div key={x} className="absolute inset-y-0 w-px opacity-20 bg-black" style={{left:`${x}%`}} />
        ))}
      </div>
      <div className="absolute left-0 right-0 h-1 opacity-30 bg-black/30" style={{bottom:"28%"}} />

      {/* Bed */}
      <div className="absolute" style={{left:"4%",bottom:"26%",width:"28%",height:"28%"}}>
        <div className="absolute top-0 left-0 right-0 h-[35%] rounded-t-2xl transition-colors duration-700"
          style={{background:`rgba(${Math.round(110+brightness*55)},${Math.round(68+brightness*28)},${Math.round(32+brightness*14)},0.95)`}} />
        <div className="absolute bottom-0 left-0 right-0 h-[67%] rounded-b-xl transition-colors duration-700"
          style={{background:`rgba(${Math.round(185+brightness*55)},${Math.round(160+brightness*40)},${Math.round(140+brightness*30)},0.9)`}}>
          <div className="absolute top-[22%] left-[8%] w-[30%] h-[32%] rounded-xl"
            style={{background:`rgba(255,255,255,${0.4+brightness*0.4})`}} />
          <div className="absolute top-[22%] left-[46%] w-[30%] h-[32%] rounded-xl"
            style={{background:`rgba(255,255,255,${0.4+brightness*0.4})`}} />
        </div>
      </div>

      {/* Wardrobe */}
      <div className="absolute" style={{right:"2%",bottom:"28%",width:"15%",height:"44%"}}>
        <div className="absolute inset-0 rounded-xl transition-colors duration-700"
          style={{background:`rgba(${Math.round(95+brightness*48)},${Math.round(58+brightness*24)},${Math.round(28+brightness*12)},0.95)`}}>
          <div className="absolute inset-x-[48%] top-[8%] bottom-[8%] w-px bg-white/20" />
          <div className="absolute left-[22%] top-[45%] w-[18%] h-[7%] rounded-full"
            style={{background:`rgba(200,160,80,${0.4+brightness*0.4})`}} />
          <div className="absolute right-[22%] top-[45%] w-[18%] h-[7%] rounded-full"
            style={{background:`rgba(200,160,80,${0.4+brightness*0.4})`}} />
        </div>
      </div>

      {/* Lamps */}
      {LAMPS.map(lamp => {
        const isOff = off.has(lamp.id);
        const sz = BASE_SIZE * lamp.r;
        return (
          <div key={lamp.id} className="absolute z-30"
            style={{left:`calc(${lamp.cx}% - ${sz/2}px)`,top:`calc(${lamp.cy}% - ${sz/2}px)`,width:sz,height:sz}}>
            {!isOff && (
              <div className="pulse-ring-anim absolute inset-0 rounded-full pointer-events-none"
                style={{margin:-6,border:"3px solid rgba(255,220,50,0.75)"}} />
            )}
            {!isOff && (
              <div className="absolute rounded-full pointer-events-none"
                style={{inset:-18,background:"radial-gradient(circle,rgba(255,230,50,0.35) 0%,transparent 70%)",filter:"blur(6px)"}} />
            )}
            <button onClick={()=>turnOff(lamp)}
              className="w-full h-full rounded-full flex items-center justify-center focus:outline-none transition-all duration-400"
              style={{
                background:isOff?"radial-gradient(circle,#1f2937,#111827)":"radial-gradient(circle,#fef9c3 20%,#fde047 55%,#ca8a04 100%)",
                boxShadow:isOff?"none":"0 0 18px 6px rgba(255,215,0,0.55),0 0 40px 14px rgba(255,200,0,0.25)",
                cursor:isOff?"default":"pointer",
                border:isOff?"2px solid rgba(255,255,255,0.08)":"2px solid rgba(255,240,100,0.5)",
                animation:!isOff?"lamp-glow-pulse 1.8s ease-in-out infinite":"none",
              }}
              data-testid={`button-lamp-${lamp.id}`}>
              <span style={{fontSize:sz*0.42,filter:isOff?"grayscale(1) brightness(0.3)":"none"}}>
                {isOff?"🌑":"💡"}
              </span>
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 text-center whitespace-nowrap pointer-events-none"
              style={{top:"100%",marginTop:5}}>
              {isOff
                ?<span className="bg-green-500 text-white rounded-full px-2 py-0.5 font-black shadow text-xs">✓ {t.lightOff}</span>
                :<span className="text-yellow-200 font-black block" style={{fontSize:"clamp(9px,1.8vw,12px)",textShadow:"0 1px 4px rgba(0,0,0,0.9)"}}>
                  👆 {lamp.label}
                </span>}
            </div>
          </div>
        );
      })}

      {/* Child */}
      <div className="absolute z-20 pointer-events-none"
        style={{left:"34%",bottom:"25%",width:"clamp(48px,9vw,78px)",height:"clamp(75px,14vw,120px)"}}>
        <Kid happy={off.size>0} pointing={!allOff} />
        <motion.div key={off.size} initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}}
          className="absolute -top-9 left-1/2 -translate-x-1/2 bg-white rounded-2xl px-2 py-1 shadow-lg font-black whitespace-nowrap"
          style={{fontSize:"clamp(8px,1.7vw,11px)"}}>
          {allOff?"🎉 Muito bem!":off.size===0?t.lightsHint.replace("🌙 ","").split("!")[0]+"!":t.lightsLeft(LAMPS.length-off.size)}
        </motion.div>
      </div>

      {/* HUD */}
      <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-40">
        <div className="bg-black/50 backdrop-blur rounded-2xl px-3 py-1.5">
          <span className="text-white font-black" style={{fontSize:"clamp(10px,2.4vw,14px)"}}>{t.lightsLeft(LAMPS.length-off.size)}</span>
        </div>
        {off.size>0 && (
          <motion.div initial={{opacity:0,x:12}} animate={{opacity:1,x:0}}
            className="bg-green-600/80 backdrop-blur rounded-2xl px-3 py-1.5">
            <span className="text-yellow-300 font-black" style={{fontSize:"clamp(10px,2.4vw,14px)"}}>{t.savedWatts(off.size*14)}</span>
          </motion.div>
        )}
        <div className="bg-black/50 backdrop-blur rounded-2xl px-3 py-1.5">
          <span className="text-yellow-300 font-black" style={{fontSize:"clamp(10px,2.4vw,14px)"}}>⭐ {totalPoints}</span>
        </div>
      </div>

      {/* Bottom hint */}
      <div className="absolute bottom-3 left-3 right-3 z-30">
        <div className="bg-black/50 backdrop-blur rounded-2xl px-4 py-2 text-center">
          <p className="text-white font-bold" style={{fontSize:"clamp(11px,2.5vw,14px)"}}>{t.lightsHint}</p>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div key="t" initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-16}}
            className="absolute z-50 left-1/2 -translate-x-1/2" style={{bottom:"16%"}}>
            <div className="bg-green-500 text-white font-black px-5 py-2 rounded-2xl shadow-xl"
              style={{fontSize:"clamp(12px,2.8vw,15px)"}}>{toast}</div>
            {tip && <div className="mt-1 bg-blue-600 text-white font-semibold px-4 py-1.5 rounded-2xl shadow text-center"
              style={{fontSize:"clamp(10px,2.2vw,13px)"}}>💡 {tip}</div>}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}
            className="absolute inset-0 z-50 flex items-center justify-center" style={{background:"rgba(0,0,0,0.72)"}}>
            <motion.div initial={{scale:0,rotate:-12}} animate={{scale:1,rotate:0}}
              transition={{type:"spring",bounce:0.55}}
              className="bg-white rounded-[2rem] p-8 text-center shadow-2xl max-w-xs w-full mx-4">
              <div className="text-6xl mb-3">🌙⚡✅</div>
              <h3 className="font-black text-indigo-700 mb-2" style={{fontSize:"clamp(17px,4.5vw,24px)"}}>{t.lightsSuccess}</h3>
              <p className="text-gray-400 font-medium text-sm">{t.lightsSub}</p>
              <p className="text-green-600 font-black text-xl mt-2">+80 ⭐</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

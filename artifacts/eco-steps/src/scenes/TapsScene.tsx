import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Lang, TRANSLATIONS } from "@/i18n";

interface Tap { id: number; litersPerMin: number; }
const TAPS: Tap[] = [
  { id:1, litersPerMin:12 },
  { id:2, litersPerMin:15 },
  { id:3, litersPerMin:10 },
];

function WaterKid({ happy }: { happy: boolean }) {
  return (
    <svg viewBox="0 0 64 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="32" cy="14" rx="16" ry="14" fill="#0284c7" />
      <circle cx="32" cy="18" r="14" fill="#fbbf24" />
      <circle cx="26" cy="15" r="3" fill="#1e1b4b" />
      <circle cx="38" cy="15" r="3" fill="#1e1b4b" />
      <circle cx="27" cy="14" r="1" fill="white" />
      <circle cx="39" cy="14" r="1" fill="white" />
      {happy
        ?<path d="M25 22 Q32 28 39 22" fill="none" stroke="#1e1b4b" strokeWidth="2" strokeLinecap="round"/>
        :<path d="M27 22 Q32 25 37 22" fill="none" stroke="#1e1b4b" strokeWidth="2" strokeLinecap="round"/>}
      <rect x="18" y="32" width="28" height="34" rx="9" fill="#0ea5e9" />
      <line x1="18" y1="38" x2="4" y2="24" stroke="#fbbf24" strokeWidth="8" strokeLinecap="round" />
      <circle cx="3" cy="21" r="5" fill="#fbbf24" />
      <line x1="46" y1="38" x2="59" y2="52" stroke="#fbbf24" strokeWidth="8" strokeLinecap="round" />
      <line x1="25" y1="66" x2="20" y2="94" stroke="#0284c7" strokeWidth="10" strokeLinecap="round" />
      <line x1="39" y1="66" x2="44" y2="94" stroke="#0284c7" strokeWidth="10" strokeLinecap="round" />
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

export default function TapsScene({ onComplete, totalPoints, lang }: Props) {
  const t = TRANSLATIONS[lang];
  const [closed, setClosed]     = useState<Set<number>>(new Set());
  const [activeFact, setFact]   = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const allClosed   = closed.size === TAPS.length;
  const litersSaved = TAPS.filter(tp => closed.has(tp.id)).reduce((s,tp) => s+tp.litersPerMin, 0);

  const closeTap = (tap: Tap) => {
    if (closed.has(tap.id) || showSuccess) return;
    const next = new Set(closed); next.add(tap.id);
    setClosed(next);
    setFact(t.tapsMicroFacts[(tap.id-1) % t.tapsMicroFacts.length]);
    setTimeout(()=>setFact(null), 2400);
  };

  useEffect(()=>{
    if (!allClosed) return;
    setShowSuccess(true);
    setTimeout(()=>onComplete(80,t.tapsSuccess), 1900);
  },[allClosed]);

  return (
    <div className="relative w-full h-full overflow-hidden select-none"
      style={{fontFamily:"Outfit, sans-serif",background:"linear-gradient(180deg,#e0f2fe 0%,#bae6fd 45%,#e2e8f0 100%)"}}>

      {/* Tile wall */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute inset-0 w-full h-full" style={{opacity:0.22}}>
          <defs><pattern id="wt" x="0" y="0" width="50" height="50" patternUnits="userSpaceOnUse">
            <rect x="1" y="1" width="46" height="46" fill="none" stroke="#0ea5e9" strokeWidth="1.5" rx="3"/>
          </pattern></defs>
          <rect width="100%" height="70%" fill="url(#wt)" />
        </svg>
        <div className="absolute bottom-0 left-0 right-0 h-[28%]" style={{background:"linear-gradient(180deg,#e2e8f0,#cbd5e1)"}}>
          <svg className="absolute inset-0 w-full h-full opacity-25">
            <defs><pattern id="ft" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <rect x="1" y="1" width="56" height="56" fill="none" stroke="#94a3b8" strokeWidth="1"/>
            </pattern></defs>
            <rect width="100%" height="100%" fill="url(#ft)"/>
          </svg>
        </div>
        <div className="absolute left-0 right-0 h-3 bg-white/60" style={{bottom:"28%"}} />
      </div>

      {/* Mirror */}
      <div className="absolute rounded-2xl overflow-hidden"
        style={{left:"25%",top:"4%",width:"50%",height:"18%",
          background:"linear-gradient(135deg,rgba(186,230,253,0.8),rgba(224,242,254,0.6))",
          border:"4px solid rgba(255,255,255,0.85)",boxShadow:"0 4px 20px rgba(0,0,0,0.1)"}}>
        <div className="absolute inset-0 flex items-center justify-center gap-8 opacity-35 text-2xl">
          {TAPS.map(tp=><span key={tp.id}>{closed.has(tp.id)?"✅":"💧"}</span>)}
        </div>
        <div className="absolute top-2 left-3 text-sm opacity-40">🪞</div>
      </div>

      {/* HUD */}
      <div className="absolute top-3 left-3 right-3 flex justify-between z-40">
        <div className="bg-white/70 backdrop-blur rounded-2xl px-3 py-1.5">
          <span className="font-black text-blue-700" style={{fontSize:"clamp(10px,2.4vw,13px)"}}>{t.tapsOpen(TAPS.length-closed.size)}</span>
        </div>
        <motion.div key={litersSaved} initial={{scale:1.25}} animate={{scale:1}}
          className="bg-white/70 backdrop-blur rounded-2xl px-3 py-1.5">
          <span className="font-black text-cyan-700" style={{fontSize:"clamp(10px,2.4vw,13px)"}}>{t.tapsSaved(litersSaved)}</span>
        </motion.div>
        <div className="bg-white/70 backdrop-blur rounded-2xl px-3 py-1.5">
          <span className="font-black text-yellow-600" style={{fontSize:"clamp(10px,2.4vw,13px)"}}>⭐{totalPoints}</span>
        </div>
      </div>

      {/* Sink counter */}
      <div className="absolute z-10 flex items-stretch gap-2 px-3"
        style={{left:0,right:0,bottom:"26%",height:"44%"}}>
        {TAPS.map(tap=>{
          const isClosed = closed.has(tap.id);
          return (
            <div key={tap.id} className="flex-1 flex flex-col items-center">
              <div className="flex flex-col items-center flex-1 justify-end pb-2">
                <div className="rounded-t-full" style={{width:"clamp(10px,2.8vw,18px)",height:"clamp(20px,5vw,34px)",background:"linear-gradient(180deg,#e2e8f0,#94a3b8)"}} />
                <div className="rounded-full" style={{width:"clamp(14px,4vw,24px)",height:"clamp(8px,2vw,12px)",background:"#64748b"}} />

                {/* Water stream — CSS only */}
                {!isClosed && (
                  <>
                    <div className="water-stream rounded-b-lg"
                      style={{
                        width:"clamp(9px,2.4vw,16px)",
                        height:"clamp(55px,13vw,95px)",
                        backgroundImage:"repeating-linear-gradient(180deg,rgba(96,165,250,1) 0px,rgba(147,197,253,0.75) 7px,rgba(56,189,248,0.95) 14px,rgba(96,165,250,1) 20px)",
                        backgroundSize:"100% 20px",
                        borderRadius:"0 0 8px 8px",
                        filter:"blur(0.5px)",
                        boxShadow:"0 2px 12px 4px rgba(96,165,250,0.55)",
                      }} />
                    <motion.div animate={{scaleX:[0.5,1.15,0.7],opacity:[0.8,0.4,0.8]}} transition={{duration:1.0,repeat:Infinity}}
                      style={{width:"clamp(22px,5.5vw,40px)",height:"clamp(7px,1.8vw,12px)",borderRadius:"50%",background:"rgba(96,165,250,0.45)",filter:"blur(2px)"}} />
                  </>
                )}
              </div>

              {/* Counter */}
              <div className="w-full rounded-t-2xl shadow-lg" style={{height:"clamp(14px,3.5vw,22px)",background:"linear-gradient(180deg,#f8fafc,#e2e8f0)",border:"2px solid #cbd5e1"}} />
              <div className="w-full flex flex-col items-center rounded-b-xl flex-1"
                style={{background:"linear-gradient(180deg,#e2e8f0,#cbd5e1)",border:"2px solid #cbd5e1",borderTop:"none"}}>
                <div className="rounded-b-[40%] overflow-hidden mt-1"
                  style={{width:"80%",aspectRatio:"2/1",background:"linear-gradient(180deg,#f0f9ff,#e0f2fe)",border:"2px solid #bae6fd"}}>
                  {!isClosed && (
                    <motion.div animate={{height:["20%","30%","20%"]}} transition={{duration:1.5,repeat:Infinity}}
                      className="absolute bottom-0 left-0 right-0 rounded-b-[40%]"
                      style={{background:"rgba(96,165,250,0.4)"}} />
                  )}
                </div>

                <motion.button onClick={()=>closeTap(tap)}
                  whileTap={!isClosed?{scale:0.8}:{}} whileHover={!isClosed?{scale:1.08,y:-2}:{}}
                  className="rounded-full flex items-center justify-center font-black shadow-lg focus:outline-none mt-1 mb-1"
                  style={{
                    width:"clamp(36px,9vw,60px)",height:"clamp(36px,9vw,60px)",
                    background:isClosed?"linear-gradient(135deg,#22c55e,#16a34a)":"linear-gradient(135deg,#ef4444,#b91c1c)",
                    border:`3px solid ${isClosed?"#bbf7d0":"#fca5a5"}`,
                    cursor:isClosed?"default":"pointer",
                    fontSize:"clamp(14px,3.5vw,22px)",
                    animation:isClosed?"none":"pulse-ring 1.2s ease-out infinite",
                    boxShadow:isClosed?"0 2px 8px rgba(34,197,94,0.4)":"0 2px 12px rgba(239,68,68,0.5)",
                  }}
                  data-testid={`button-tap-${tap.id}`}>
                  {isClosed?"✓":"🔴"}
                </motion.button>

                <div className="px-1 pb-1 text-center" style={{fontSize:"clamp(7px,1.6vw,10px)"}}>
                  {isClosed
                    ?<span className="text-green-600 font-black">{t.tapClosed}</span>
                    :<span className="text-red-500 font-black">{t.tapClose}</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Child */}
      <motion.div className="absolute z-20 pointer-events-none"
        style={{right:"1%",bottom:"26%",width:"clamp(46px,10vw,76px)",height:"clamp(72px,15vw,118px)"}}
        animate={allClosed?{y:[0,-10,0,-10,0]}:{}}>
        <WaterKid happy={closed.size>0} />
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-white rounded-2xl px-2 py-1 shadow-lg font-black whitespace-nowrap text-center"
          style={{fontSize:"clamp(7px,1.7vw,10px)"}}>
          {allClosed?"🎉!":closed.size===0?t.tapsOpen(TAPS.length):t.tapsOpen(TAPS.length-closed.size)}
        </div>
      </motion.div>

      {/* Fact toast */}
      <AnimatePresence>
        {activeFact && (
          <motion.div key="fact" initial={{opacity:0,y:30}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}}
            className="absolute left-3 right-3 z-50" style={{bottom:"30%"}}>
            <div className="bg-blue-600 text-white rounded-2xl px-4 py-3 shadow-xl text-center">
              <p className="font-black" style={{fontSize:"clamp(10px,2.5vw,14px)"}}>✅ {lang==="pt"?"Torneira fechada!":"Tap closed!"}</p>
              <p className="font-semibold mt-0.5 opacity-90" style={{fontSize:"clamp(9px,2.1vw,12px)"}}>💡 {activeFact}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom hint */}
      <div className="absolute bottom-2 left-3 right-3 z-30">
        <div className="bg-white/65 backdrop-blur rounded-2xl px-4 py-2 text-center">
          <p className="font-bold text-blue-800" style={{fontSize:"clamp(10px,2.3vw,13px)"}}>{t.tapsHint}</p>
        </div>
      </div>

      {/* Success */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}}
            className="absolute inset-0 z-50 flex items-center justify-center" style={{background:"rgba(0,0,0,0.68)"}}>
            <motion.div initial={{scale:0}} animate={{scale:1}} transition={{type:"spring",bounce:0.55}}
              className="bg-white rounded-[2rem] p-8 text-center shadow-2xl max-w-xs w-full mx-4">
              <div className="text-6xl mb-3">💧✅🌊</div>
              <h3 className="font-black text-blue-700 mb-2" style={{fontSize:"clamp(17px,4.5vw,24px)"}}>{t.tapsSuccess}</h3>
              <p className="text-gray-500 font-semibold text-sm mb-1">{t.tapsSub(litersSaved)}</p>
              <p className="text-xs text-gray-400 italic mb-2">{lang==="pt"?"Cada gota conta para o futuro do planeta.":"Every drop counts for the planet's future."}</p>
              <p className="text-green-600 font-black text-xl">+80 ⭐</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

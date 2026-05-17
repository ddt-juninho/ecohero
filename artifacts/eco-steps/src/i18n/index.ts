export type Lang = "pt" | "en";

export interface T {
  /* Start screen */
  tagline: string;
  nameLabel: string;
  namePlaceholder: string;
  playBtn: string;
  quote: string;
  chooseLanguage: string;
  missions: { icon: string; title: string; desc: string }[];
  /* Scene wrapper */
  sceneOf: (cur: number, total: number) => string;
  points: string;
  remaining: string;
  /* Lights */
  lightsHint: string;
  lightOff: string;
  lightsSuccess: string;
  lightsSub: string;
  lightsLeft: (n: number) => string;
  savedWatts: (n: number) => string;
  lightsTips: string[];
  /* Trash */
  trashHint: string;
  trashQuestion: string;
  trashCorrect: string;
  trashWrong: (correct: string) => string;
  trashSuccess: string;
  trashScore: (c: number, t: number) => string;
  bins: { blue: string; brown: string; gray: string };
  binExamples: { blue: string; brown: string; gray: string };
  whyThisMatters: string;
  /* Taps */
  tapsHint: string;
  tapsOpen: (n: number) => string;
  tapsSaved: (l: number) => string;
  tapClosed: string;
  tapClose: string;
  tapFact: string;
  tapsSuccess: string;
  tapsSub: (l: number) => string;
  tapsMicroFacts: string[];
  /* End screen */
  congrats: string;
  playAgain: string;
  ptsOf: (pts: number, max: number) => string;
  badge: [string, string, string]; /* 1-3 stars */
  badgeSub: [string, string, string];
  impacts: { emoji: string; label: string }[];
}

const PT: T = {
  tagline: "Salva o planeta num jogo!",
  nameLabel: "Qual é o teu nome?",
  namePlaceholder: "Escreve aqui...",
  playBtn: "Jogar Agora! 🚀",
  quote: "«Pequenas ações diárias podem salvar o planeta.»",
  chooseLanguage: "Escolhe o idioma",
  missions: [
    { icon: "💡", title: "Apaga as Luzes", desc: "Economiza energia no quarto" },
    { icon: "♻️", title: "Separa o Lixo", desc: "Coloca cada item na lixeira certa" },
    { icon: "💧", title: "Fecha as Torneiras", desc: "Poupa água e protege o planeta" },
  ],
  sceneOf: (c, t) => `Fase ${c} de ${t}`,
  points: "pontos",
  remaining: "restantes",
  lightsHint: "🌙 Toca nas lâmpadas amarelas para as apagar!",
  lightOff: "Apagada",
  lightsSuccess: "Energia economizada!",
  lightsSub: "Muito bem! Continuen a apagar as luzes em casa.",
  lightsLeft: n => `💡 ${n} acesas`,
  savedWatts: n => `⚡ ${n}W poupados`,
  lightsTips: [
    "Apaga quando sais do quarto!",
    "Não deixes ligado ao dormir!",
    "Lâmpadas LED gastam menos!",
    "Cada lâmpada poupa CO₂!",
  ],
  trashHint: "Escolhe a lixeira certa para cada item!",
  trashQuestion: "Para qual lixeira vai?",
  trashCorrect: "✅ Correto! Parabéns!",
  trashWrong: c => `❌ Destino Incorreto! A lixeira correta era: ${c}`,
  trashSuccess: "Separação feita!",
  trashScore: (c, t) => `${c} de ${t} corretos`,
  bins: { blue: "Reciclável", brown: "Orgânico", gray: "Comum" },
  binExamples: {
    blue: "Plástico • Vidro • Metal • Papel",
    brown: "Restos de comida • Cascas • Folhas",
    gray: "Higiene • Embalagens sujas",
  },
  whyThisMatters: "💡 Porquê separar desta forma?",
  tapsHint: "💧 Toca nos botões vermelhos para fechar as torneiras!",
  tapsOpen: n => `💧 ${n} abertas`,
  tapsSaved: l => `🌊 ${l}L/min poupados`,
  tapClosed: "Fechada ✓",
  tapClose: "FECHE! 👆",
  tapFact: "💡",
  tapsSuccess: "Água poupada!",
  tapsSub: l => `Poupaste ${l} litros por minuto!`,
  tapsMicroFacts: [
    "Um banho curto poupa até 70 litros!",
    "Fechar ao escovar os dentes poupa 12L!",
    "Repara fugas — podem desperdiçar 20L/hora!",
  ],
  congrats: "Parabéns",
  playAgain: "Jogar de Novo! 🔄",
  ptsOf: (p, m) => `${p} de ${m} pontos`,
  badge: ["Campeão Ecológico!", "Guardião Verde!", "Eco Iniciante!"],
  badgeSub: [
    "Protegeste o planeta com maestria!",
    "Ótimo trabalho! Continua assim!",
    "Bom começo! Já estás a ajudar!",
  ],
  impacts: [
    { emoji: "💧", label: "água poupada" },
    { emoji: "⚡", label: "energia salva" },
    { emoji: "🌿", label: "missões OK" },
  ],
};

const EN: T = {
  tagline: "Save the planet in a game!",
  nameLabel: "What's your name?",
  namePlaceholder: "Type here...",
  playBtn: "Play Now! 🚀",
  quote: "«Small daily actions can save the planet.»",
  chooseLanguage: "Choose language",
  missions: [
    { icon: "💡", title: "Turn Off Lights", desc: "Save energy in the bedroom" },
    { icon: "♻️", title: "Sort the Trash", desc: "Put each item in the right bin" },
    { icon: "💧", title: "Close the Taps", desc: "Save water and protect the planet" },
  ],
  sceneOf: (c, t) => `Stage ${c} of ${t}`,
  points: "points",
  remaining: "remaining",
  lightsHint: "🌙 Tap the yellow bulbs to turn them off!",
  lightOff: "Off",
  lightsSuccess: "Energy saved!",
  lightsSub: "Great! Keep turning lights off at home.",
  lightsLeft: n => `💡 ${n} on`,
  savedWatts: n => `⚡ ${n}W saved`,
  lightsTips: [
    "Turn off when you leave the room!",
    "Don't leave lights on while sleeping!",
    "LED bulbs use less energy!",
    "Every bulb saves CO₂!",
  ],
  trashHint: "Choose the right bin for each item!",
  trashQuestion: "Which bin does it go to?",
  trashCorrect: "✅ Correct! Well done!",
  trashWrong: c => `❌ Incorrect Destination! The correct bin was: ${c}`,
  trashSuccess: "Sorting done!",
  trashScore: (c, t) => `${c} out of ${t} correct`,
  bins: { blue: "Recyclable", brown: "Organic", gray: "General" },
  binExamples: {
    blue: "Plastic • Glass • Metal • Paper",
    brown: "Food scraps • Peels • Leaves",
    gray: "Hygiene • Dirty packaging",
  },
  whyThisMatters: "💡 Why separate this way?",
  tapsHint: "💧 Tap the red buttons to close the taps!",
  tapsOpen: n => `💧 ${n} open`,
  tapsSaved: l => `🌊 ${l}L/min saved`,
  tapClosed: "Closed ✓",
  tapClose: "CLOSE! 👆",
  tapFact: "💡",
  tapsSuccess: "Water saved!",
  tapsSub: l => `You saved ${l} litres per minute!`,
  tapsMicroFacts: [
    "A short shower saves up to 70 litres!",
    "Closing while brushing saves 12L!",
    "Fix leaks — they waste 20L/hour!",
  ],
  congrats: "Congratulations",
  playAgain: "Play Again! 🔄",
  ptsOf: (p, m) => `${p} out of ${m} points`,
  badge: ["Eco Champion!", "Green Guardian!", "Eco Beginner!"],
  badgeSub: [
    "You protected the planet with skill!",
    "Great job! Keep it up!",
    "Good start! You're already helping!",
  ],
  impacts: [
    { emoji: "💧", label: "water saved" },
    { emoji: "⚡", label: "energy saved" },
    { emoji: "🌿", label: "missions done" },
  ],
};

export const TRANSLATIONS: Record<Lang, T> = { pt: PT, en: EN };
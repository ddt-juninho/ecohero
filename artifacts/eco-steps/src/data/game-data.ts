export type GameScreen = "start" | "scene" | "end";

export type SceneId = "lights" | "trash" | "taps";

export interface SceneConfig {
  id: SceneId;
  title: string;
  objective: string;
  tip: string;
  points: number;
  bgColor: string;
}

export const SCENES: SceneConfig[] = [
  {
    id: "lights",
    title: "Apague as Luzes!",
    objective: "Clique em todas as lâmpadas acesas para apagar e economizar energia.",
    tip: "Apagar luzes desnecessárias reduz o CO₂ e a tua conta de luz!",
    points: 80,
    bgColor: "from-indigo-900 to-purple-900",
  },
  {
    id: "trash",
    title: "Separe o Lixo!",
    objective: "Escolha a lixeira certa para cada item.",
    tip: "Separar o lixo permite que os materiais sejam reciclados!",
    points: 100,
    bgColor: "from-green-600 to-teal-700",
  },
  {
    id: "taps",
    title: "Feche as Torneiras!",
    objective: "Clique nos botões vermelhos para fechar as torneiras abertas.",
    tip: "Uma torneira aberta desperdiça 12 litros de água por minuto!",
    points: 80,
    bgColor: "from-blue-600 to-cyan-700",
  },
];

export interface TrashItem {
  id: number;
  name: string;
  emoji: string;
  bin: "blue" | "brown" | "gray";
  binLabel: string;
  explanation: {
    pt: string;
    en: string;
  };
}

export const TRASH_ITEMS: TrashItem[] = [
  /* ── Reciclável (blue) ── */
  { 
    id: 1, name: "Garrafa de Plástico", emoji: "🥤", bin: "blue", binLabel: "Reciclável",
    explanation: {
      pt: "O plástico demora mais de 450 anos a decompor-se no oceano, ameaçando a vida marinha. Reciclar evita que polua as nossas praias!",
      en: "Plastic takes over 450 years to decompose in the ocean, threatening marine life. Recycling prevents it from polluting our beaches!"
    }
  },
  { 
    id: 2, name: "Jornal / Revista", emoji: "📰", bin: "blue", binLabel: "Reciclável",
    explanation: {
      pt: "Papel e cartão limpos podem ser transformados em novos cadernos, evitando o abate desnecessário de árvores.",
      en: "Clean paper and cardboard can be transformed into new notebooks, avoiding the unnecessary cutting of trees."
    }
  },
  { 
    id: 3, name: "Lata de Alumínio", emoji: "🥫", bin: "blue", binLabel: "Reciclável",
    explanation: {
      pt: "O alumínio pode ser reciclado infinitamente! Reciclar gasta 95% menos energia do que produzir uma lata nova do zero.",
      en: "Aluminum can be recycled infinitely! Recycling uses 95% less energy than manufacturing a brand new can from scratch."
    }
  },
  { 
    id: 4, name: "Caixa de Cartão", emoji: "📦", bin: "blue", binLabel: "Reciclável",
    explanation: {
      pt: "Desmontar as caixas ajuda a poupar espaço no ecoponto. Elas ganham nova vida rapidamente na reciclagem.",
      en: "Flattening boxes helps save space in the recycling bin. They quickly gain a new life through recycling."
    }
  },
  { 
    id: 5, name: "Garrafa de Vidro", emoji: "🍾", bin: "blue", binLabel: "Reciclável",
    explanation: {
      pt: "O vidro nunca se desgasta ao ser reciclado. Uma garrafa velha transforma-se numa nova com total qualidade.",
      en: "Glass never wears out when recycled. An old bottle turns into a new one with zero quality loss."
    }
  },
  { 
    id: 6, name: "Folha de Papel", emoji: "📄", bin: "blue", binLabel: "Reciclável",
    explanation: {
      pt: "Mesmo folhas escritas ou rascunhos servem para reciclagem, desde que não estejam sujas com comida ou óleo.",
      en: "Even written papers or drafts can be recycled, as long as they are not soiled with food or oil."
    }
  },
  /* ── Orgânico (brown) ── */
  { 
    id: 7, name: "Casca de Banana", emoji: "🍌", bin: "brown", binLabel: "Orgânico",
    explanation: {
      pt: "Resíduos orgânicos decompõem-se naturalmente. Podem ser transformados em adubo (compostagem) para alimentar a terra.",
      en: "Organic waste decomposes naturally. It can be transformed into compost to feed and enrich the soil."
    }
  },
  { 
    id: 8, name: "Restos de Comida", emoji: "🍎", bin: "brown", binLabel: "Orgânico",
    explanation: {
      pt: "Restos de fruta, vegetais e comida formam lixo orgânico. Nunca os mistures com recicláveis para não estragar o processo.",
      en: "Fruit, vegetable, and food scraps make up organic waste. Never mix them with recyclables to avoid ruining the process."
    }
  },
  { 
    id: 9, name: "Folhas Secas", emoji: "🍂", bin: "brown", binLabel: "Orgânico",
    explanation: {
      pt: "Folhas e restos de jardim são orgânicos ideais para criar uma camada de proteção e nutrientes para o solo.",
      en: "Leaves and garden waste are ideal organic materials to create a protective and nutrient-rich layer for the soil."
    }
  },
  { 
    id: 10, name: "Casca de Ovo", emoji: "🥚", bin: "brown", binLabel: "Orgânico",
    explanation: {
      pt: "As cascas de ovo são ricas em cálcio! No lixo orgânico, elas ajudam a criar um adubo natural excelente para plantas.",
      en: "Eggshells are rich in calcium! In the organic bin, they help create an excellent natural fertilizer for plants."
    }
  },
  /* ── Comum (gray) ── */
  { 
    id: 11, name: "Saco de Plástico Sujo", emoji: "🛍️", bin: "gray", binLabel: "Comum",
    explanation: {
      pt: "Plásticos contaminados com gordura, óleos ou químicos pesados não podem ser reciclados. O destino deles é o lixo comum.",
      en: "Plastics contaminated with grease, oils, or heavy chemicals cannot be recycled. Their destination is general waste."
    }
  },
  { 
    id: 12, name: "Fralda Usada", emoji: "👶", bin: "gray", binLabel: "Comum",
    explanation: {
      pt: "Devido aos resíduos biológicos e à mistura complexa de materiais, as fraldas têm de ir obrigatoriamente para o lixo comum.",
      en: "Due to biological waste and the complex mix of materials, diapers must strictly go into general waste."
    }
  },
  { 
    id: 13, name: "Guardanapo Usado", emoji: "🧻", bin: "gray", binLabel: "Comum",
    explanation: {
      pt: "Papéis de higiene e guardanapos usados contêm gordura e fluidos que estragam e contaminam a água na reciclagem do papel limpo.",
      en: "Used napkins and tissues contain grease and fluids that ruin and contaminate the water during clean paper recycling."
    }
  },
];
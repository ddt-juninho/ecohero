export type Category = "transport" | "energy" | "food" | "waste" | "water" | "shopping";
export type Difficulty = "easy" | "medium" | "hard";
export type BadgeRarity = "common" | "rare" | "epic" | "legendary";
export type BadgeCategory = "streak" | "challenge" | "eco_score" | "special";

export interface Challenge {
  id: number;
  title: string;
  description: string;
  xpReward: number;
  ecoScore: number;
  category: Category;
  difficulty: Difficulty;
  completed: boolean;
  streak?: number;
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  earned: boolean;
  category: BadgeCategory;
  rarity: BadgeRarity;
  earnedAt?: string;
}

export interface RecyclingItem {
  id: number;
  name: string;
  canRecycle: boolean;
  instructions: string;
  tip: string;
  binColor: string;
}

export interface RecyclingCategory {
  id: number;
  name: string;
  icon: string;
  color: string;
  description: string;
  items: RecyclingItem[];
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  level: number;
  xp: number;
  ecoScore: number;
  streak: number;
  isCurrentUser: boolean;
}

export const INITIAL_CHALLENGES: Challenge[] = [
  { id: 1, title: "Pedalar até o destino", description: "Deixe o carro em casa e use a bicicleta no trajeto de hoje", xpReward: 50, ecoScore: 25, category: "transport", difficulty: "medium", completed: false, streak: 3 },
  { id: 2, title: "Segunda sem carne", description: "Faça refeições 100% vegetais durante o dia todo", xpReward: 40, ecoScore: 20, category: "food", difficulty: "easy", completed: false, streak: 1 },
  { id: 3, title: "Banho de 5 minutos", description: "Reduza o tempo do seu banho para 5 minutos ou menos", xpReward: 30, ecoScore: 15, category: "water", difficulty: "easy", completed: false, streak: 7 },
  { id: 4, title: "Desligar aparelhos", description: "Desplugue carregadores e eletrodomésticos quando não estiver usando", xpReward: 25, ecoScore: 12, category: "energy", difficulty: "easy", completed: false, streak: 2 },
  { id: 5, title: "Sacola reutilizável", description: "Use apenas sacolas reutilizáveis em todas as compras de hoje", xpReward: 20, ecoScore: 10, category: "shopping", difficulty: "easy", completed: false, streak: 5 },
  { id: 6, title: "Reciclar 3 itens", description: "Separe e recicle pelo menos 3 itens corretamente hoje", xpReward: 35, ecoScore: 18, category: "waste", difficulty: "easy", completed: false, streak: 0 },
  { id: 7, title: "Almoço sem embalagem", description: "Traga o almoço sem nenhuma embalagem descartável", xpReward: 45, ecoScore: 22, category: "food", difficulty: "medium", completed: false, streak: 0 },
  { id: 8, title: "Lavar roupa no frio", description: "Use água fria na lavagem — economiza até 90% de energia", xpReward: 30, ecoScore: 15, category: "energy", difficulty: "easy", completed: false, streak: 0 },
  { id: 9, title: "Transporte público", description: "Use ônibus ou metrô em vez de carro particular hoje", xpReward: 55, ecoScore: 30, category: "transport", difficulty: "medium", completed: false, streak: 0 },
];

export const INITIAL_BADGES: Badge[] = [
  { id: 1, name: "Primeiro Passo", description: "Complete seu primeiro desafio ecológico", earned: false, category: "challenge", rarity: "common" },
  { id: 2, name: "Guerreiro da Semana", description: "Mantenha uma sequência de 7 dias", earned: false, category: "streak", rarity: "rare" },
  { id: 3, name: "Poupador de Água", description: "Complete 5 desafios relacionados à água", earned: false, category: "challenge", rarity: "common" },
  { id: 4, name: "Ciclista Verde", description: "Use transporte ecológico 10 vezes", earned: false, category: "challenge", rarity: "rare" },
  { id: 5, name: "Eco Score 100", description: "Alcance uma pontuação ecológica de 100", earned: false, category: "eco_score", rarity: "rare" },
  { id: 6, name: "Protetor do Planeta", description: "Complete 25 desafios no total", earned: false, category: "challenge", rarity: "epic" },
  { id: 7, name: "Sequência Lendária", description: "Mantenha uma sequência de 30 dias", earned: false, category: "streak", rarity: "legendary" },
  { id: 8, name: "Herói do Lixo Zero", description: "Complete todos os desafios de resíduos em uma semana", earned: false, category: "special", rarity: "epic" },
  { id: 9, name: "Mestre da Energia", description: "Economize energia por 14 dias consecutivos", earned: false, category: "challenge", rarity: "rare" },
  { id: 10, name: "Campeão da Comida", description: "Complete 10 desafios de alimentação", earned: false, category: "challenge", rarity: "common" },
];

export const RECYCLING_GUIDE: RecyclingCategory[] = [
  {
    id: 1, name: "Plástico", icon: "recycle", color: "#3B82F6", description: "A maioria dos plásticos pode ser reciclada se estiver limpa e seca",
    items: [
      { id: 1, name: "Garrafas PET", canRecycle: true, instructions: "Enxágue bem, retire a tampa e amasse para poupar espaço. Coloque na lixeira azul.", tip: "Procure o triângulo de reciclagem — números 1 e 2 são os mais aceitos", binColor: "#3B82F6" },
      { id: 2, name: "Sacolas Plásticas", canRecycle: false, instructions: "NÃO coloque na reciclagem doméstica — leve ao ponto de coleta do supermercado.", tip: "Reutilize sacolas limpas como lixinho de carro ou descarte no ponto de coleta", binColor: "#6B7280" },
      { id: 3, name: "Potes de Iogurte", canRecycle: true, instructions: "Enxágue bem, verifique o símbolo de reciclagem e coloque na lixeira azul.", tip: "Mesmo potes pequenos são recicláveis quando estão limpos", binColor: "#3B82F6" },
    ]
  },
  {
    id: 2, name: "Vidro", icon: "wine", color: "#8B5CF6", description: "O vidro é 100% reciclável e pode ser reciclado infinitamente",
    items: [
      { id: 4, name: "Garrafas de Vidro", canRecycle: true, instructions: "Enxágue, retire as tampas e coloque na lixeira verde. Vidros coloridos e claros podem ir juntos.", tip: "Garrafas de vinho e de azeite têm o mesmo destino — lixeira verde", binColor: "#8B5CF6" },
      { id: 5, name: "Vidro Quebrado", canRecycle: false, instructions: "Embrulhe com cuidado em jornal e coloque no lixo comum. Não coloque na reciclagem.", tip: "Vidro quebrado é um risco de segurança nas centrais de triagem", binColor: "#6B7280" },
      { id: 6, name: "Potes de Vidro", canRecycle: true, instructions: "Retire as tampas de metal, enxágue o pote. Pote vai para a verde, tampa para a lixeira amarela.", tip: "Tampas metálicas são muito valiosas para a reciclagem", binColor: "#8B5CF6" },
    ]
  },
  {
    id: 3, name: "Papel", icon: "file-text", color: "#F59E0B", description: "Papel e papelão estão entre os materiais mais reciclados do mundo",
    items: [
      { id: 7, name: "Caixas de Papelão", canRecycle: true, instructions: "Desmonte e achate todas as caixas. Retire fitas adesivas. Mantenha seco. Lixeira azul.", tip: "Papelão molhado ou gorduroso não pode ser reciclado — composte no lugar", binColor: "#F59E0B" },
      { id: 8, name: "Caixa de Pizza", canRecycle: false, instructions: "A parte de baixo com gordura não pode. Rasgue a tampa limpa — ela pode ir para o papel.", tip: "A metade de cima da caixa de pizza normalmente é reciclável", binColor: "#6B7280" },
      { id: 9, name: "Jornais e Revistas", canRecycle: true, instructions: "Junte em um maço ou coloque soltos na lixeira de papel. Mantenha secos.", tip: "Papel picado pode entupir as máquinas de triagem — coloque em saco separado", binColor: "#F59E0B" },
    ]
  },
  {
    id: 4, name: "Metal", icon: "cpu", color: "#6B7280", description: "Alumínio e latas de aço são recicláveis de altíssimo valor",
    items: [
      { id: 10, name: "Latas de Alumínio", canRecycle: true, instructions: "Enxágue as latas, amasse para poupar espaço, coloque na lixeira amarela.", tip: "O alumínio é reciclável infinitamente e muito valioso!", binColor: "#F59E0B" },
      { id: 11, name: "Latas de Aerossol", canRecycle: true, instructions: "Certifique-se de que está completamente vazia, retire a tampa plástica, lixeira amarela.", tip: "Nunca perfure ou queime latas de aerossol", binColor: "#F59E0B" },
    ]
  },
  {
    id: 5, name: "Eletrônicos", icon: "smartphone", color: "#EF4444", description: "O lixo eletrônico precisa de descarte especial em centros certificados",
    items: [
      { id: 12, name: "Celulares Velhos", canRecycle: false, instructions: "Leve a um ponto de coleta de e-lixo ou ao programa de devolução do fabricante.", tip: "Muitas lojas de celular oferecem reciclagem gratuita ou troca", binColor: "#EF4444" },
      { id: 13, name: "Pilhas e Baterias", canRecycle: false, instructions: "Nunca coloque na reciclagem doméstica — leve ao ponto de coleta de pilhas.", tip: "Supermercados e lojas de materiais elétricos têm caixas de coleta de pilhas", binColor: "#EF4444" },
    ]
  },
  {
    id: 6, name: "Orgânicos", icon: "leaf", color: "#10B981", description: "Restos de comida podem virar adubo rico para o jardim",
    items: [
      { id: 14, name: "Restos de Frutas e Verduras", canRecycle: true, instructions: "Adicione ao bin de compostagem ou à lixeira marrom para coleta.", tip: "A compostagem melhora o solo e reduz o metano do aterro", binColor: "#10B981" },
      { id: 15, name: "Borra de Café", canRecycle: true, instructions: "Ótima para compostar ou usar diretamente no jardim como fertilizante.", tip: "A borra de café adiciona nitrogênio à sua composteira", binColor: "#10B981" },
    ]
  },
];

export const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, username: "GreenGuru", level: 12, xp: 5840, ecoScore: 720, streak: 45, isCurrentUser: false },
  { rank: 2, username: "EcoNinja", level: 10, xp: 4920, ecoScore: 610, streak: 38, isCurrentUser: false },
  { rank: 3, username: "PlanetPal", level: 9, xp: 4100, ecoScore: 550, streak: 29, isCurrentUser: false },
  { rank: 5, username: "LeafLover", level: 7, xp: 3200, ecoScore: 420, streak: 22, isCurrentUser: false },
  { rank: 6, username: "CleanQueen", level: 6, xp: 2890, ecoScore: 380, streak: 19, isCurrentUser: false },
  { rank: 7, username: "BikeKing", level: 5, xp: 2400, ecoScore: 310, streak: 15, isCurrentUser: false },
  { rank: 8, username: "ZeroWaste", level: 4, xp: 1850, ecoScore: 240, streak: 11, isCurrentUser: false },
  { rank: 9, username: "SolarSam", level: 4, xp: 1600, ecoScore: 210, streak: 9, isCurrentUser: false },
  { rank: 10, username: "CompostKid", level: 2, xp: 950, ecoScore: 125, streak: 4, isCurrentUser: false },
];

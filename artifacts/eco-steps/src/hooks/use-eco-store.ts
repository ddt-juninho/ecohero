import { useState, useCallback } from "react";
import { INITIAL_CHALLENGES, INITIAL_BADGES, Challenge, Badge } from "@/data/mock-data";

export interface Profile {
  username: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  ecoScore: number;
  streak: number;
  rank: number;
  totalChallengesCompleted: number;
  title: string;
}

export interface EcoStats {
  co2Saved: number;
  waterSaved: number;
  plasticAvoided: number;
  treesEquivalent: number;
  challengesThisWeek: number;
  challengesThisMonth: number;
}

export interface CompletionResult {
  xpEarned: number;
  levelUp: boolean;
  newLevel?: number;
}

const LEVEL_TITLES: Record<number, string> = {
  1: "Eco Iniciante",
  2: "Broto Verde",
  3: "Guerreiro Eco",
  4: "Guardião da Natureza",
  5: "Protetor do Planeta",
  6: "Campeão da Terra",
  7: "Lenda Ecológica",
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

const DEFAULT_PROFILE: Profile = {
  username: "EcoHero",
  level: 1,
  xp: 0,
  xpToNextLevel: 500,
  ecoScore: 0,
  streak: 0,
  rank: 4,
  totalChallengesCompleted: 0,
  title: "Eco Iniciante",
};

export function useEcoStore() {
  const [profile, setProfile] = useState<Profile>(() =>
    loadFromStorage("ecosteps_profile", DEFAULT_PROFILE)
  );
  const [challenges, setChallenges] = useState<Challenge[]>(() =>
    loadFromStorage("ecosteps_challenges", INITIAL_CHALLENGES)
  );
  const [badges, setBadges] = useState<Badge[]>(() =>
    loadFromStorage("ecosteps_badges", INITIAL_BADGES)
  );

  const completeChallenge = useCallback(
    (id: number): CompletionResult | null => {
      const challenge = challenges.find((c) => c.id === id);
      if (!challenge || challenge.completed) return null;

      const updatedChallenges = challenges.map((c) =>
        c.id === id ? { ...c, completed: true } : c
      );
      saveToStorage("ecosteps_challenges", updatedChallenges);
      setChallenges(updatedChallenges);

      const xpEarned = challenge.xpReward;
      const newRawXp = profile.xp + xpEarned;
      const levelUp = newRawXp >= profile.xpToNextLevel;
      const newLevel = levelUp ? profile.level + 1 : profile.level;
      const newXp = levelUp ? newRawXp - profile.xpToNextLevel : newRawXp;
      const newXpToNext = levelUp ? profile.xpToNextLevel + 250 : profile.xpToNextLevel;
      const newEcoScore = profile.ecoScore + challenge.ecoScore;
      const newCompleted = profile.totalChallengesCompleted + 1;

      const newProfile: Profile = {
        ...profile,
        xp: newXp,
        level: newLevel,
        xpToNextLevel: newXpToNext,
        ecoScore: newEcoScore,
        totalChallengesCompleted: newCompleted,
        title: LEVEL_TITLES[newLevel] ?? "Lenda Ecológica",
      };
      saveToStorage("ecosteps_profile", newProfile);
      setProfile(newProfile);

      const updatedBadges = awardBadges(badges, newProfile, updatedChallenges);
      saveToStorage("ecosteps_badges", updatedBadges);
      setBadges(updatedBadges);

      return { xpEarned, levelUp, newLevel: levelUp ? newLevel : undefined };
    },
    [challenges, profile, badges]
  );

  const stats: EcoStats = {
    co2Saved: Math.round(profile.totalChallengesCompleted * 2.4 * 10) / 10,
    waterSaved: Math.round(profile.totalChallengesCompleted * 15.5 * 10) / 10,
    plasticAvoided: Math.round(profile.totalChallengesCompleted * 0.3 * 10) / 10,
    treesEquivalent: Math.max(Math.round((profile.totalChallengesCompleted / 5) * 10) / 10, 0),
    challengesThisWeek: Math.min(profile.totalChallengesCompleted, 7),
    challengesThisMonth: profile.totalChallengesCompleted,
  };

  return { profile, challenges, badges, stats, completeChallenge };
}

function awardBadges(badges: Badge[], profile: Profile, challenges: Challenge[]): Badge[] {
  const completedCount = challenges.filter((c) => c.completed).length;
  const now = new Date().toLocaleDateString("pt-BR");

  return badges.map((badge) => {
    if (badge.earned) return badge;

    let shouldEarn = false;
    if (badge.id === 1 && completedCount >= 1) shouldEarn = true;
    if (badge.id === 2 && profile.streak >= 7) shouldEarn = true;
    if (badge.id === 3 && challenges.filter((c) => c.completed && c.category === "water").length >= 3) shouldEarn = true;
    if (badge.id === 4 && challenges.filter((c) => c.completed && c.category === "transport").length >= 3) shouldEarn = true;
    if (badge.id === 5 && profile.ecoScore >= 100) shouldEarn = true;
    if (badge.id === 6 && completedCount >= 5) shouldEarn = true;
    if (badge.id === 9 && challenges.filter((c) => c.completed && c.category === "energy").length >= 3) shouldEarn = true;
    if (badge.id === 10 && challenges.filter((c) => c.completed && c.category === "food").length >= 2) shouldEarn = true;

    return shouldEarn ? { ...badge, earned: true, earnedAt: now } : badge;
  });
}

import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, challengesTable, profileTable } from "@workspace/db";
import {
  GetChallengesResponse,
  CompleteChallengeParams,
  CompleteChallengeResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/challenges", async (_req, res): Promise<void> => {
  const challenges = await db.select().from(challengesTable).orderBy(challengesTable.id);
  res.json(GetChallengesResponse.parse(challenges));
});

router.post("/challenges/:id/complete", async (req, res): Promise<void> => {
  const params = CompleteChallengeParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [challenge] = await db
    .select()
    .from(challengesTable)
    .where(eq(challengesTable.id, params.data.id));

  if (!challenge) {
    res.status(404).json({ error: "Challenge not found" });
    return;
  }

  if (challenge.completed) {
    res.status(400).json({ error: "Challenge already completed" });
    return;
  }

  await db
    .update(challengesTable)
    .set({ completed: true })
    .where(eq(challengesTable.id, params.data.id));

  const [profile] = await db.select().from(profileTable);
  const currentXp = (profile?.xp ?? 0) + challenge.xpReward;
  const currentLevel = profile?.level ?? 1;
  const xpToNext = profile?.xpToNextLevel ?? 500;
  const levelUp = currentXp >= xpToNext;
  const newLevel = levelUp ? currentLevel + 1 : currentLevel;
  const newXp = levelUp ? currentXp - xpToNext : currentXp;
  const newXpToNext = levelUp ? xpToNext + 250 : xpToNext;
  const newEcoScore = (profile?.ecoScore ?? 0) + challenge.ecoScore;
  const newCompleted = (profile?.totalChallengesCompleted ?? 0) + 1;

  const levelTitles: Record<number, string> = {
    1: "Eco Beginner",
    2: "Green Sprout",
    3: "Eco Warrior",
    4: "Nature Guardian",
    5: "Planet Protector",
    6: "Earth Champion",
    7: "Eco Legend",
  };

  if (profile) {
    await db
      .update(profileTable)
      .set({
        xp: newXp,
        level: newLevel,
        xpToNextLevel: newXpToNext,
        ecoScore: newEcoScore,
        totalChallengesCompleted: newCompleted,
        title: levelTitles[newLevel] ?? "Eco Legend",
      })
      .where(eq(profileTable.id, profile.id));
  }

  const result = CompleteChallengeResponse.parse({
    xpEarned: challenge.xpReward,
    newTotalXp: newXp,
    levelUp,
    newLevel: levelUp ? newLevel : null,
    newBadge: null,
  });

  res.json(result);
});

export default router;

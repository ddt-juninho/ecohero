import { Router, type IRouter } from "express";
import { db, profileTable, challengesTable } from "@workspace/db";
import { count } from "drizzle-orm";
import { GetProfileResponse, GetProfileStatsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/profile", async (_req, res): Promise<void> => {
  const [profile] = await db.select().from(profileTable);
  if (!profile) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }
  res.json(GetProfileResponse.parse(profile));
});

router.get("/profile/stats", async (_req, res): Promise<void> => {
  const [profile] = await db.select().from(profileTable);
  const completedResult = await db
    .select({ count: count() })
    .from(challengesTable);

  const completedCount = Number(completedResult[0]?.count ?? 0);

  const completed = profile?.totalChallengesCompleted ?? 0;
  const stats = {
    co2Saved: Math.round(completed * 2.4 * 10) / 10,
    waterSaved: Math.round(completed * 15.5 * 10) / 10,
    plasticAvoided: Math.round(completed * 0.3 * 10) / 10,
    treesEquivalent: Math.max(Math.round(completed / 5 * 10) / 10, 0.1),
    challengesThisWeek: Math.min(completedCount, 7),
    challengesThisMonth: completedCount,
  };

  res.json(GetProfileStatsResponse.parse(stats));
});

export default router;

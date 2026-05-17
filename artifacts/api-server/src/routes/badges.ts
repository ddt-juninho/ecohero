import { Router, type IRouter } from "express";
import { db, badgesTable } from "@workspace/db";
import { GetBadgesResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/badges", async (_req, res): Promise<void> => {
  const badges = await db.select().from(badgesTable).orderBy(badgesTable.id);
  res.json(GetBadgesResponse.parse(badges));
});

export default router;

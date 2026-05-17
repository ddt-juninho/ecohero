import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, recyclingCategoriesTable, recyclingItemsTable } from "@workspace/db";
import { GetRecyclingGuideResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/recycling", async (_req, res): Promise<void> => {
  const categories = await db.select().from(recyclingCategoriesTable).orderBy(recyclingCategoriesTable.id);

  const result = await Promise.all(
    categories.map(async (cat) => {
      const items = await db
        .select()
        .from(recyclingItemsTable)
        .where(eq(recyclingItemsTable.categoryId, cat.id));
      return { ...cat, items };
    })
  );

  res.json(GetRecyclingGuideResponse.parse(result));
});

export default router;

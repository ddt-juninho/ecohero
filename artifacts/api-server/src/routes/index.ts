import { Router, type IRouter } from "express";
import healthRouter from "./health";
import challengesRouter from "./challenges";
import profileRouter from "./profile";
import badgesRouter from "./badges";
import recyclingRouter from "./recycling";
import leaderboardRouter from "./leaderboard";

const router: IRouter = Router();

router.use(healthRouter);
router.use(challengesRouter);
router.use(profileRouter);
router.use(badgesRouter);
router.use(recyclingRouter);
router.use(leaderboardRouter);

export default router;

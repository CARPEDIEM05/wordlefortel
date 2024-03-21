import express, { Express, Request, Response, Router } from "express";
import userRouter from "./user";
import leaderboardRouter from "./leaderboard";
import gameRouter from "./game";

const app:Express = express();
const router = Router();

router.use("/user",userRouter);
router.use("/game",gameRouter);
router.use("/leaderboard",leaderboardRouter);

export default router;
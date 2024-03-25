import { Hono } from 'hono'


import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { cors } from 'hono/cors';
import { userRouter } from './routes/user';
import { gameRouter } from './routes/game';

const prisma = new PrismaClient();

export const router = new Hono<{
  Bindings:{
    DATABASE_URL:string
  }
}>()

router.use('/*',cors());

router.route("/api/v1/user",userRouter);
router.route("api/v1/game",gameRouter);


export default router;


//DATABASE_URL="prisma://accelerate.prisma-data.net/?api_key=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiZTEzMDFkMjktYThjOC00Yzc4LTgwODktZmIyMmFlMWY1YjU2IiwidGVuYW50X2lkIjoiNTFlNmJiMmIyMzNkOWViM2RiZTA2ZTQzYzFiMDdiZGM2NmVhOWUwYmY2NzJhNGFlM2VlYjhjMDJkZDZkMjE2MCIsImludGVybmFsX3NlY3JldCI6ImZlMzU5MzE0LWY0Y2QtNDBjYi04NWFlLWE5Mzc3NmQxOTVlOSJ9.pKa1QT9eihjqdhcMIa9Ybd32R3pamxY7RkUx7cLg__Y"
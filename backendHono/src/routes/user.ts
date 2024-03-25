import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { jwt, sign } from "hono/jwt";

export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();


/*
model User {
  id Int @id @default(autoincrement())
  email String @unique
  password String 
  name String
  role String?
  score Score?

}
*/


interface User{
    email:string;
    password: string;
    name :string;
    role:string;
}

interface UserSignin{
    email:string;
    password: string;
}

userRouter.post("/signup", async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  try {
    const userDetails: User = await  c.req.json();
    let role: string;

    const createUser = await prisma.user.create({
      data: {
        email: userDetails.email,
        password: userDetails.password,
        name: userDetails.name,
        role: userDetails.role || "user",
      },
    });

    console.log(createUser);
    return c.json({
        msg: "User is created"
    })

  } catch (e) {
    console.log(e);
    return c.status(411);
  }
});

userRouter.post("/signin", async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
    
  try {
    const userDetails: UserSignin = await c.req.json();
    const email = userDetails.email;
    const password = userDetails.password;

    const getUser = await prisma.user.findFirst({
      where: {
        email: email,
        password: password,
      },
    });

    if (!getUser) {
      return c.json({
        msg: "User not found"
      });
    
    }
    const token = await sign({ id:email }, c.env.JWT_SECRET);

    return c.json({
      token: token,
    });
  } catch (e) {
    console.log(e);
    return c.json({
      msg: "Something is not correct with the inputs",
    });
  }
});

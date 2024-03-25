import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { decode, sign, verify } from "hono/jwt";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    name: string;
    date: Date;
  };
}>();

export const gameRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
  };
}>();



let userId: string;

gameRouter.get("/*", async (c,next) => {
  const authHeader = (await c.req.header("authorization")) || "";

console.log("authrhaadfe");
console.log(authHeader);

  try {
    if (authHeader && authHeader.startsWith("Bearer ")) {
        const token = authHeader.split(" ")[1];
      const user = await verify(token, c.env.JWT_SECRET);
      
      if (user) {
        userId = user.email;
        console.log(userId);
        await next();
      } else {
        c.status(411);

        c.json({
            msg: "User not found"
        });
      }
    }
  } catch (e) {
    console.log(e);
    c.json({
        msg: "Something is wrong"
    });
  }
});
function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // getMonth() is zero-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// This will log the current date in DD-MM-YYYY format

gameRouter.post("/word", async (c) => {
  const body = await c.req.json();
  const today = new Date();
  const date = formatDate(today);
  console.log(date);
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const insertWord = await prisma.word.create({
      data: {
        todaysword: body.word,
        description: body.description,
        date: date,
      },
    });
    if (insertWord) {
      return c.json({
        msg: "Word is inserted",
      });
    }
  } catch (e) {
    console.log(e);
    return c.json({
        msg: "Something is wrong with the inputs"
    });
  }
});

gameRouter.get("/length", async (c) => {
    console.log("Inside the length element");
  const today = new Date();
  const date = formatDate(today);
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const word = await prisma.word.findFirst({
      where: {
        date: date,
      },
    });

    return c.json({
      length: word?.todaysword.length,
    });
  } catch (e) {
    console.log(e);
    c.status(411);
    return c.json({
        msg: "Something is wrong"
    })
  }
});

gameRouter.post("/check", async (c) => {
  console.log("check");
  const body = await c.req.json();

  const inputWord: string = body.inputWord;
  console.log(inputWord);
  let result = new Array<string>();
  let sendResult = new String();
  const today = new Date();
  const date = formatDate(today);
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());
  try {
    const word = await prisma.word.findFirst({
      where: {
        date: date,
      },
    });
    const todaysWord = word?.todaysword || "";
    console.log(todaysWord);

    let map = new Map<string, number>();
    for (let i = 0; i < todaysWord.length; i++) {
      if (map.get(todaysWord[i]) != undefined) {
        let value = map.get(todaysWord[i]) || 0;
        value++;
        map.set(todaysWord[i], value);
      } else {
        map.set(todaysWord[i], 1);
      }
    }
    for (let i = 0; i < inputWord.length; i++) {
      result.push("0");
    }
    console.log("result size: " + result.length);

    for (let i = 0; i < inputWord.length; i++) {
      if (inputWord[i] == todaysWord[i]) {
        result[i] = "2";
        let value = map.get(todaysWord[i]) || 0;
        value--;
        if (value == 0) {
          console.log(todaysWord[i] + " letscheck");
          map.delete(todaysWord[i]);
          continue;
        }
        map.set(todaysWord[i], value);
      }
    }
    console.log("map after first iteration: ");
    console.log(map);

    for (let i = 0; i < inputWord.length; i++) {
      if (result[i] == "2") {
        continue;
      } else {
        if (map.get(inputWord[i]) != undefined) {
          result[i] = "1";
          let value = map.get(inputWord[i]) || 0;
          value--;
          if (value == 0) {
            map.delete(inputWord[i]);
            continue;
          }
          map.set(todaysWord[i], value);
        }
      }
    }
    for (let i = 0; i < result.length; i++) {
      console.log(result[i]);
    }

    for (let i = 0; i < result.length; i++) {
      sendResult = sendResult + result[i];
    }
    let checkWord = true;

    for (let i = 0; i < result.length; i++) {
      if (result[i] != "2") {
        checkWord = false;
        break;
      }
    }

    if (checkWord) {
        c.status(200);
      return c.json({
        result: sendResult,
        description: word?.description,
      });
    }

    c.status(200);
    return c.json({
      result: sendResult,
      description: null,
    });
  } catch (e) {
    console.log(e);
    c.status(411);

    c.json({
       msg: "Something is wrong"
    })  
    }
});

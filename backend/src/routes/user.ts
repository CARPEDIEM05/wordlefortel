import express, { Express, Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { sign } from "crypto";
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../config";
const prisma = new PrismaClient();

const app:Express = express();

const router = Router();


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

router.post("/signup",async (req:Request,res:Response)=>{
    try{
        const userDetails:User =  req.body;
        let role:string ;

        const createUser = await prisma.user.create({
            data:{
                email: userDetails.email,
                password:userDetails.password,
                name: userDetails.name,
                role: userDetails.role || "user"
            }
        })
        
        console.log(createUser);
        res.status(200).send("User is created");
        return;

    } catch (e){
        console.log(e);
        res.status(411).send("Something is wrong with the inputs");
    }
})

router.post("/signin", async (req:Request, res:Response)=>{
    try {
        const userDetails: UserSignin= req.body;
        const email = userDetails.email;
        const password = userDetails.password;

        const getUser = await prisma.user.findFirst({
        where: {
            email: email,
            password: password
        },
        });

        if(!getUser){
            res.send("User not found");
            return;
        }
        const token = await jwt.sign({email}, JWT_SECRET);
        res.status(200).json({
            token: token
        })

    } catch (e) {
        console.log(e);
        res.status(411).json({
            msg: "Something is not correct with the inputs"
        })
    }

})


export default router;
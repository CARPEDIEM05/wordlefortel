import { verify } from "crypto";
import express, { Router, Request,Response } from "express";
import { JWT_SECRET } from "../config";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const app = express();

const router = Router();

export default router;

let userId:string;

router.get("/*", async(req:Request,res:Response, next)=>{
    const authHeader = req.headers.authorization;

    console.log(authHeader);
    try{
        if(authHeader){
            const user = jwt.verify(authHeader,JWT_SECRET) as JwtPayload;
            console.log(user);
            if(user){
                userId = user.email;
                console.log(userId);
                next();
            } else {
                res.status(411).send("User not found")
            }
        }
        
    } catch (e){
        console.log(e);
        res.status(411).send("Something is wrong");
    }

})
function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is zero-based
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// This will log the current date in DD-MM-YYYY format


router.post("/word",async (req:Request,res:Response)=>{

    const body = req.body;
    const today = new Date();
    const date = formatDate(today);
    console.log(date);
    try{
        const insertWord = await prisma.word.create({
        data:{
            todaysword: body.word,
            description: body.description,
            date: date
        }
    })
        if(insertWord){
            res.status(200).json({
                msg:"Word is inserted"
            })
        }
    } catch(e){
        console.log(e);
        res.status(411).send("Something is wrong with the inputs");
    }
    
    
})

router.get("/length",async (req:Request,res:Response)=>{
    const today = new Date();
    const date = formatDate(today);
    try{
        const word = await prisma.word.findFirst({
          where: {
            date: date,
          },
        });

        res.status(200).json({
            length:word?.todaysword.length
        })

    } catch(e){
        console.log(e);
        res.status(411).send("Something is wrong");

    }     
})

router.post("/check", async(req:Request,res:Response)=>{
    console.log("check");
    const inputWord:string = req.body.inputWord;
    console.log(inputWord);
    let result = new Array<string>();
    let sendResult = new String();
    const today = new Date();
    const date = formatDate(today);
    try{
        const word = await prisma.word.findFirst({
          where: {
            date: date,
          },
        });
        const todaysWord = word?.todaysword ||"";
        console.log(todaysWord);

        let map = new Map<string, number>();
        for (let i = 0; i < todaysWord.length; i++) {
            if(map.get(todaysWord[i])!=undefined){
                let value = map.get(todaysWord[i])||0;
                value++;
                map.set(todaysWord[i],value);
            } else {
                map.set(todaysWord[i],1);
            }
        }
        for(let i = 0;i<inputWord.length;i++){
            result.push('0');
        }
        console.log("result size: " + result.length);
        
        for(let i=0;i<inputWord.length;i++){
            if(inputWord[i]==todaysWord[i]){
                result[i] = '2';
                let value = map.get(todaysWord[i]) || 0;
                value--;
                if(value==0){
                    console.log(todaysWord[i]+ " letscheck");
                    map.delete(todaysWord[i]);
                    continue;
                }
                map.set(todaysWord[i], value);
            }
        }
        console.log("map after first iteration: ");
        console.log(map);
        
        for(let i =0;i<inputWord.length;i++){
            if(result[i]=='2'){
                continue;
            } else {
                if(map.get(inputWord[i])!=undefined){
                    result[i] = '1';
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
        for(let i = 0;i<result.length;i++){
            console.log(result[i]);
        }

        for(let i = 0;i<result.length;i++){
            sendResult = sendResult + result[i];
        }
        let checkWord = true;

        for(let i =0;i<result.length;i++){
            if(result[i]!='2'){
                checkWord = false;
                break;
            }
        }

        if(checkWord){
            res.status(200).json({
                result:sendResult,
                description:word?.description
            })
            return;
        }

        res.status(200).json({
            result: sendResult,
            description: null
        })        
    } catch (e){
        console.log(e);
        res.status(411).send("Something is wrong");
    }
})
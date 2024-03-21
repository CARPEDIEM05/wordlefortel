import express, { Express,Request, Response, Router } from "express";
import rootRouter  from "./routes/index"
import { json } from "stream/consumers";
import  cors  from "cors"


 
const app:Express = express();
app.use(cors());


app.use(express.json());

app.use("/api/v1", rootRouter);



app.listen(3000);

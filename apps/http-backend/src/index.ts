import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import { authmiddleware } from "./authmiddleware"; 
import { JWT_SECRET } from "@repo/backend-common/config";
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from "@repo/common/types";
import cors from "cors";
const app = express();
app.use(express.json());
app.use(cors());  
import {prismaClient} from "@repo/db/client";

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/signup", async (req, res) => {
    
     const parsedData=CreateUserSchema.safeParse(
         req.body
     );
     if(!parsedData.success){
         res.status(400).json({message:"Invalid data"});
         return;
     }
    try{
        const response=await prismaClient.user.create({
            data:{
                email:parsedData.data?.email, 
                // TODO: password encryption/hashing
                password:parsedData.data.password,
                name:parsedData.data.name
            }
        });
        res.json({userid:response.id});
    }catch(e){
        res.status(403).json({message:"User already exists"});
    }
    // db call
    

});
app.post("/signin", async(req, res) => {
    const parsedData=SigninSchema.safeParse(
        req.body
    );
    if(!parsedData.success){
        res.status(400).json({message:"Invalid data"});
        return;
    }
    const user=null;
    const response=await prismaClient.user.findFirst({
        where:{
            email:parsedData.data.email,
            password:parsedData.data.password
        }
    });
    if(!response){
        res.status(401).json({message:"Invalid email/password"});
        return;
    }
    const token=jwt.sign({userId:response.id},JWT_SECRET);
    res.json({token});  

    // 
    


    // const token=jwt.sign({userid:userid},JWT_SECRET);
    // res.json({token});
});
app.post("/room",authmiddleware,async (req, res) => {
    
    const parsedData=CreateRoomSchema.safeParse(
        req.body
    );
    if(!parsedData.success){
        res.status(400).json({message:"Invalid data"});
        return;
    }
    // @ts-ignore
    const userId=req.userId;

    try{
        const response=await prismaClient.room.create({
            data:{
                slug:parsedData.data.slug,
                adminId:userId
            }
        });
        res.json({roomId:response.id});
        
    }catch(e){
        res.status(403).json({message:"Room already exists"});
        return;
    }
});

app.get("/chat/:roomId",async (req,res)=>{
    const roomId=Number(req.params.roomId);

    try{ 
        const chats=await prismaClient.chat.findMany({
            where:{
            roomId:roomId
            },
            orderBy:{
                id:"desc"
            },
            take:1000

        })
        res.json({chats});
    }
    catch(e){
        res.status(403).json({message:"Room does not exist"});
        return;
    }



});
app.delete("/chat/:roomId", async (req, res) => {
    const roomId=Number(req.params.roomId);
    try {
      await prismaClient.chat.deleteMany({ where:{
        roomId:roomId
        } });
      res.status(200).json({ message: "All shapes cleared." });
    } catch (error) {
      res.status(500).json({ error: "Failed to clear shapes." });
    }
});

app.put("/chat/:roomId", async (req, res) => {
    // console.log("put",req.params.roomId);
    const roomId=Number(req.params.roomId);
  
    const last = await prismaClient.chat.findFirst({
      where: { roomId },
      orderBy: { id: "desc" },
    });
  
    if (!last) res.status(404).json({error:"No shapes found."});
    else{
    //  console.log("last",last);
    await prismaClient.chat.delete({ where: { id: last.id } });
    res.status(200).json({message:last.message});
    // res.status(200).json({ success: true });
    }
});


app.get("/room/:slug",async (req,res)=>{
    const slug= req.params.slug;

    try{
        const room=await prismaClient.room.findFirst({
            where:{
                slug:slug
            }
        })
        res.json({room});
    }
    catch(e){
        res.status(403).json({message:"Room does not exist"});
        return;
    }
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
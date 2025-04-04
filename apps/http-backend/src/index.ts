import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import { authmiddleware } from "./authmiddleware"; 
import { JWT_SECRET } from "@repo/backend-common/config";
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from "@repo/common/types";
const app = express();
app.use(express.json());

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

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
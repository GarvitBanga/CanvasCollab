import express from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import { authmiddleware } from "./authmiddleware"; 
import { JWT_SECRET } from "@repo/backend-common/config";
import { CreateRoomSchema, CreateUserSchema, SigninSchema } from "@repo/common/types";
const app = express();
app.use(express.json());



app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/signup", (req, res) => {
    // db call
     const data=CreateUserSchema.safeParse(
         req.body
     );
     if(!data.success){
         res.status(400).json({message:"Invalid data"});
         return;
     }
    const { userid, password } = req.body;
    res.json({userid});

});
app.post("/signin", (req, res) => {
    const data=SigninSchema.safeParse(
        req.body
    );
    if(!data.success){
        res.status(400).json({message:"Invalid data"});
        return;
    }
    const { userid, password } = req.body;
    // const userid="123";
    const token=jwt.sign({userid:userid},JWT_SECRET);
    res.json({token});
});
app.post("/room",authmiddleware, (req, res) => {
    // db call 
    const data=CreateRoomSchema.safeParse(
        req.body
    );
    if(!data.success){
        res.status(400).json({message:"Invalid data"});
        return;
    }
    const { roomId } = req.body;
    res.json({roomId}); 
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
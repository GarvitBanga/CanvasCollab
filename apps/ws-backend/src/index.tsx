import {WebSocket,WebSocketServer} from "ws";
import axios from "axios";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";

const wss = new WebSocketServer({ port: 8080 });

interface User{
  
  userId:string,
  rooms:string[],
  ws:WebSocket

}
const users:User[]=[]; 

function checkUser(token:string):string| null {
  try{
      const decoded=jwt.verify(token,JWT_SECRET);
      if(typeof decoded=="string"){
          return null;
      } 
      if(!decoded||!decoded.userId){
        return null;
      }
      return decoded.userId;
  }catch(e){
    console.log(e);
    return null;
  }
  return null;
}

wss.on("connection", (ws,request) => {

  const url=request.url;
  if(!url){
      ws.send("Invalid request");
      return;
  }
  const querparams=new URLSearchParams(url.split("?")[1]);
  const token=querparams.get("token")||"";
  const userId=checkUser(token); 
  if(userId==null){
    ws.close();
    return;
  }
  users.push({
    userId,
    rooms:[],
    ws
  })
  

  ws.on("message", async (message) =>  {
   const parsedData=JSON.parse(message as unknown as string);
   if(parsedData.type=="join_room"){
    const user=users.find(x=>x.ws==ws);
    user?.rooms.push(parsedData.roomId);
   }
   if(parsedData.type=="leave_room"){
    const user=users.find(x=>x.ws==ws);
    if(!user){
      return;
    }
    user.rooms=user?.rooms.filter(x=>x==parsedData.roomId); 

   }
   if(parsedData.type=="chat"){
    const response=await prismaClient.chat.create({
      data:{
        roomId:Number(parsedData.roomId),
        message:parsedData.message,
        userId:userId
      } 
    });
    const roomId=parsedData.roomId;
    const message=parsedData.message;
    users.forEach(
      user=>{
         if(user.rooms.includes(roomId)){
            user.ws.send(JSON.stringify(
              {type:"chat",message:message,roomId:roomId}
            ))
         }
      }
    )

   }
  });

});
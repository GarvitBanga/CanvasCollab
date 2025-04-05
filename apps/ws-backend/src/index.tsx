import {WebSocketServer} from "ws";
import axios from "axios";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws,request) => {


  const url=request.url;
  if(!url){
      ws.send("Invalid request");
      return;
  }
  const querparams=new URLSearchParams(url.split("?")[1]);
  const token=querparams.get("token")||"";
  const decoded=jwt.verify(token,JWT_SECRET);
  if(!decoded||!(decoded as JwtPayload).userid){
      // ws.send("Invalid token");
      ws.close();
      return;
  }
  ws.send("Connected");






  ws.on("message", (message) => {
    console.log("received: %s", message);
    ws.send("Hello World!");
  });
  ws.on("error", (error) => {
    console.log("error: ", error);
  });
  ws.on("close", (code, reason) => {
    console.log("close: ", code, reason);
  });
  
});
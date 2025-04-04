import {WebSocketServer} from "ws";
import axios from "axios";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    console.log("received: %s", message);
    ws.send("Hello World!");
  });
});
import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";

export function useSocket(){
     const [loading,setLoading]=useState(false);
     const [socket,setSocket]=useState<WebSocket|null>(null);
     useEffect(()=>{
         const ws=new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJmODY0YjE5Zi00MDRiLTRkNTktOTA3Mi0wM2RlZTg3MDg0M2YiLCJpYXQiOjE3NDM4ODY5OTZ9.zuB2X7M6Jj19_yCEgQ1oEVmuyRF0MaQjmLG8LIskhTg`);
         ws.onopen=()=>{
             setLoading(false);
             setSocket(ws);
         }
     },[])
     return {socket,loading};
}
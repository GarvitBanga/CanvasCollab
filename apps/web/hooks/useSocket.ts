import { useEffect, useState } from "react";
import { WS_URL } from "../app/config";

export function useSocket(){
     const [loading,setLoading]=useState(false);
     const [socket,setSocket]=useState<WebSocket|null>(null);
     useEffect(()=>{
         const ws=new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiZmQ4NjE2MS0xMzU2LTQ4MjAtYmU3Ni02MjY3ZTJiYTE1NjciLCJpYXQiOjE3NDM5NTU0MDJ9.pon3nQrXfbWbVKEbH151cHLfv9iZp_7_8BqK0t929QU`);
         ws.onopen=()=>{
             setLoading(false);
             setSocket(ws);
         }
     },[])
     return {socket,loading};
}
"use client";

import { WS_URL } from "@/config";
import { initdraw } from "@/draw";
import { use, useEffect, useRef, useState } from "react";
import Canvas from "./Canvas";

export function RoomCanvas({roomId}:{roomId:string}) {
    
    const [socket,setSocket]=useState<WebSocket|null>(null);




    useEffect(()=>{
        const ws=new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJiZmQ4NjE2MS0xMzU2LTQ4MjAtYmU3Ni02MjY3ZTJiYTE1NjciLCJpYXQiOjE3NDM5NTU0MDJ9.pon3nQrXfbWbVKEbH151cHLfv9iZp_7_8BqK0t929QU `);

        
        ws.onopen=()=>{
            setSocket(ws); 
            ws.send(JSON.stringify({
                type:"join_room", 
                roomId
            }))
        }
    },[]);


  


    if(!socket){
        return <div>Loading...</div>;
    }

    return <div>

    <Canvas roomId={roomId} socket={socket} />

    </div>; 
}
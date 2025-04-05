"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export default function ChatRoomClient({chats,id}:{chats:any[],id:string}){
    const {socket,loading}=useSocket(); 
    const [currentmessage,setCurrentmessage]=useState("");
    const [msgs,setChats]=useState(chats);
    console.log("chats",chats); 
    useEffect(()=>{
        if(socket &&!loading){
            // alert("connected1");
            // console.log("connected2");



            // console.log(socket);
            socket.send(JSON.stringify({
                type:"join_room",
                roomId:id 
            }));
            // console.log("sent");
            socket.onmessage=(e)=>{
                 const parsedData=JSON.parse(e.data as unknown as string);
                 if(parsedData.type=="chat"){ 
                    setChats(c=>[...c,{message:parsedData.message}]);

                    }
            }
        }



    },[socket,loading,id]);
    return <div>
        {msgs.map(x=><div>{x.message}</div>)}
        <input type="text" value={currentmessage} onChange={(e)=>{setCurrentmessage(e.target.value)}} />
        <button onClick={()=>{
            socket?.send(JSON.stringify({
                type:"chat",
                roomId:id,
                message:currentmessage
            }));
            setCurrentmessage("");
        }}>Send</button>
    
    </div>; 

}
import axios from "axios";
import { BACKEND_URL } from "../app/config";
import ChatRoomClient from "./ChatRoomClient";

async function getChats(roomId:string){
    const response =await axios.get(`${BACKEND_URL}/chat/${roomId}`);
    return response.data.chats;

}

export default async function ChatRoom({id}:{id:string}){
    const messages=await getChats(id); 
    return <ChatRoomClient chats={messages} id={id} />;

}
import { HTTP_BACKEND_URL } from "@/config";
import axios from "axios";

export async function getExistingShapes(roomId:string){
    const res= await axios.get(`${HTTP_BACKEND_URL}/chat/${roomId}`); 
    // console.log("res.data",res.data);
    const chats=res.data.chats;
    const shapes=chats.map((x:{message:string})=>{
        const msgdata=JSON.parse(x.message);
        return msgdata.shape;
    });
    return shapes


} 
export async function clearShapesFromDB(roomId: string) {
    const response=await axios.delete(`${HTTP_BACKEND_URL}/chat/${roomId}`);
    // console.log("response",response);
}

export async function deleteLastShapeFromDB(roomId: string) {
    const res=await axios.put(`${HTTP_BACKEND_URL}/chat/${roomId}`);

    // const chats=res.data.chats;
    // const shapes=chats.map((x:{message:string})=>{
    //     const msgdata=JSON.parse(x.message);
    //     return msgdata.shape;
    // });
    // return shapes
    console.log("response",JSON.parse(res.data.message));
    return JSON.parse(res.data.message).shape;

}

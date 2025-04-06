import { HTTP_BACKEND_URL } from "@/config";
import axios from "axios";

type Shape={
    type:"rect";
    x:number;
    y:number;
    width:number;
    height:number; 
}|{
    type:"circle";
    centerx:number;
    centery:number;
    radius:number;
}


export async function initdraw(canvas:HTMLCanvasElement,roomId:string,socket:WebSocket){
            const ctx=canvas.getContext("2d"); 

            let existingShapes:Shape[]=await getExistingShapes(roomId);


            if(!ctx){
                return;
            }

            socket.onmessage=(e)=>{
                const msg=JSON.parse(e.data as unknown as string);
                if(msg.type=="chat"){
                    const parsedshape=JSON.parse(msg.message as unknown as string);
                    existingShapes.push(parsedshape.shape );
                    clearCanvas(existingShapes,canvas,ctx);
                }
            }




            clearCanvas(existingShapes,canvas,ctx);
            
            let clicked=false;
            let startX=0;
            let startY=0;
            canvas.addEventListener("mousedown",(e)=>{
                clicked=true;
                console.log(e.clientX,e.clientY);
                startX=e.clientX;
                startY=e.clientY;
            }); 
            canvas.addEventListener("mouseup",(e)=>{
                clicked=false;
                console.log(e.clientX,e.clientY);
                const width=e.clientX-startX;
                const height=e.clientY-startY;
                const shape:Shape={
                    type:"rect",
                    x:startX,
                    y:startY,
                    width,
                    height
                }

                existingShapes.push(shape);

                socket.send(JSON.stringify({
                    type:"chat",
                    message:JSON.stringify({
                    shape}),
                    roomId
                })
            );
            });
            canvas.addEventListener("mousemove",(e)=>{
                if(clicked){
                    const width=e.clientX-startX;
                    const height=e.clientY-startY;
                    clearCanvas(existingShapes,canvas,ctx);
                    ctx.strokeStyle="white";
                    ctx.strokeRect(startX,startY,width,height);
                    console.log(e.clientX,e.clientY);
                }
            });








}


function clearCanvas(existingShapes:Shape[],canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D){
     ctx.clearRect(0,0,canvas.width,canvas.height);
     ctx.fillStyle="black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    existingShapes.map(shape=>{
        if(shape.type=="rect"){
            ctx.strokeStyle="white";
            ctx.strokeRect(shape.x,shape.y,shape.width,shape.height); 
        } 
    });
}


async function getExistingShapes(roomId:string){
     const res= await axios.get(`${HTTP_BACKEND_URL}/chat/${roomId}`); 
     console.log("res.data",res.data);
     const chats=res.data.chats;
     const shapes=chats.map((x:{message:string})=>{
         const msgdata=JSON.parse(x.message);
         return msgdata.shape;
     });
     return shapes


}
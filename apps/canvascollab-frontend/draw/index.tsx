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
    centerX:number;
    centerY:number;
    radius:number;
}|{
    type:"pencil";
    startX:number;
    startY:number;
    endX:number;
    endY:number; 
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

                //@ts-ignore
                const selectedShape=window.selectedShape;
                let shape:Shape|null=null;
                if(selectedShape=="rect"){
                    shape={
                        
                        type:selectedShape,
                        x:startX,
                        y:startY,
                        width,
                        height
                    }
                }
                else if(selectedShape=="circle"){
                    const radius=Math.max(width,height)/2;
                    shape={
                        
                        type:selectedShape,
                        radius:radius,
                        centerX:startX+radius,
                        centerY:startY+radius,
                    }
                }
                else if(selectedShape=="pencil"){
                    shape={
                        
                        type:selectedShape,
                        startX,
                        startY,
                        endX:e.clientX,
                        endY:e.clientY
                    }
                }
                if(!shape){
                    return;
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

                    //@ts-ignore
                    const selectedShape=window.selectedShape;
                    console.log(selectedShape);

                    if(selectedShape==="rect"){
                        console.log("drawrect");
                        ctx.strokeRect(startX,startY,width,height);
                     }
                    else if(selectedShape==="circle"){
                        console.log("drawcircle");
                        
                        const radius=Math.max(width,height)/2
                        const centerX=startX+radius;
                        const centerY=startY+radius;
                        ctx.beginPath();
                        ctx.arc(centerX,centerY,radius,0,Math.PI*2); 
                        ctx.stroke(); 
                        ctx.closePath();

                    }
                    else if(selectedShape=="pencil"){

                    }
                      






                    // ctx.strokeRect(startX,startY,width,height);
                    // console.log(e.clientX,e.clientY);
                }
            });








}


function clearCanvas(existingShapes:Shape[],canvas:HTMLCanvasElement,ctx:CanvasRenderingContext2D){
     ctx.clearRect(0,0,canvas.width,canvas.height);
     ctx.fillStyle="black";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    existingShapes.map(shape=>{
        if(shape.type==="rect"){
            ctx.strokeStyle="white";
            ctx.strokeRect(shape.x,shape.y,shape.width,shape.height); 
        } 
        else if(shape.type==="circle"){
            ctx.beginPath();
            ctx.arc(shape.centerX,shape.centerY,shape.radius,0,Math.PI*2); 
            ctx.stroke(); 
            ctx.closePath();
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
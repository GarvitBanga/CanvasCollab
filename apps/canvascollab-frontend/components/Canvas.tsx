import { initdraw } from "@/draw";
import { useEffect, useRef } from "react";

export default function Canvas({roomId,socket}:{roomId:string,socket:WebSocket}) {
    const canvasref=useRef<HTMLCanvasElement>(null);
    useEffect(() => {

        if(canvasref.current){
            const canvas=canvasref.current;
            initdraw(canvas,roomId,socket);
        }

        



    }, [canvasref]);

    return <div>
        <canvas ref={canvasref} width={2000} height={1000}>

</canvas> 
        </div>
}
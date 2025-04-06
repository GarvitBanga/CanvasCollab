import { initdraw } from "@/draw";
import { Circle, Pencil, RectangleHorizontalIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";


type Shape="rect"|"circle"|"pencil"; 
export default function Canvas({roomId,socket}:{roomId:string,socket:WebSocket}) {
    const canvasref=useRef<HTMLCanvasElement>(null);

    const [selectedShape,setSelectedShape]=useState<Shape>("circle");



    useEffect(()=>{
        // @ts-ignore
        window.selectedShape=selectedShape;



    },[selectedShape]);



    useEffect(() => {

        if(canvasref.current){
            const canvas=canvasref.current;
            initdraw(canvas,roomId,socket);
        }

        



    }, [canvasref]);

    return <div style={{
        height:"100vh",
        overflow:"hidden"
    }}>
        <canvas ref={canvasref} width={window.innerWidth} height={window.innerHeight}></canvas>
        <Topbar selectedShape={selectedShape} setSelectedShape={setSelectedShape} />
        </div>
}
function Topbar({selectedShape,setSelectedShape}:{selectedShape:Shape,setSelectedShape:(x:Shape)=>void}) {
     return <div style={{position:"fixed",top:10,left:10}}>
                <div className="flex gap-2">
                    <IconButton icon={<Pencil/>} onClick={()=>{setSelectedShape("pencil")}} activated={selectedShape=="pencil"}  />
                    <IconButton icon={<RectangleHorizontalIcon/>} onClick={()=>{setSelectedShape("rect")}} activated={selectedShape=="rect"}  />
                    <IconButton icon={<Circle />} onClick={()=>{setSelectedShape("circle")}} activated={selectedShape=="circle"}  />
                </div>
            </div>  
}
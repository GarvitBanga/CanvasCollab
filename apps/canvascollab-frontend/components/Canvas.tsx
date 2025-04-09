import { initdraw } from "@/draw";
import { Circle, Pencil, RectangleHorizontalIcon, Eraser } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { IconButton } from "./IconButton";
import { Game } from "@/draw/Game";


export type Tool="rect"|"circle"|"pencil"; 
export default function Canvas({roomId,socket}:{roomId:string,socket:WebSocket}) {
    const canvasref=useRef<HTMLCanvasElement>(null);
    const [game,setGame]=useState<Game|null>(null); 
    const [selectedTool,setSelectedTool]=useState<Tool>("circle");



    useEffect(()=>{
        // // @ts-ignore
        // window.selectedTool=selectedTool;

        game?.setTool(selectedTool); 


 
    },[selectedTool,game]);



    useEffect(() => {

        if(canvasref.current){
            const canvas=canvasref.current;
            const game=new Game(canvas,roomId,socket); 
            setGame(game); 
            // initdraw(canvas,roomId,socket);
            return ()=>{
                game.destroy();
            }
        }

       

        



    }, [canvasref]);



    const handleClearCanvas = () => {
        const confirmed = window.confirm("Are you sure you want to clear the canvas for everyone?");
        if (confirmed) {
          game?.clearSharedCanvas();
        }
      };
    return <div style={{
        height:"100vh",
        overflow:"hidden"
    }}>
        <canvas ref={canvasref} width={window.innerWidth} height={window.innerHeight}></canvas>
        <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} onClearCanvas={handleClearCanvas}/>
        </div>
}
function Topbar({selectedTool,setSelectedTool,onClearCanvas}:{selectedTool:Tool,setSelectedTool:(x:Tool)=>void,onClearCanvas: () => void}) {
     return <div style={{position:"fixed",top:10,left:10}}>
                <div className="flex gap-2">
                    <IconButton icon={<Pencil/>} onClick={()=>{setSelectedTool("pencil")}} activated={selectedTool=="pencil"}  />
                    <IconButton icon={<RectangleHorizontalIcon/>} onClick={()=>{setSelectedTool("rect")}} activated={selectedTool=="rect"}  />
                    <IconButton icon={<Circle />} onClick={()=>{setSelectedTool("circle")}} activated={selectedTool=="circle"}  />
                    <IconButton icon={<Eraser />} onClick={onClearCanvas} activated={false} />
                </div>
            </div>  
}
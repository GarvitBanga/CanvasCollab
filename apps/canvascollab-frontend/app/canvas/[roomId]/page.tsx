"use client";
import { use, useEffect, useRef } from "react";

export default function Canvas() {

    const canvasref=useRef<HTMLCanvasElement>(null);


    useEffect(() => {

        if(canvasref.current){
            const canvas=canvasref.current;
            const ctx=canvas.getContext("2d"); 
            if(!ctx){
                return;
            }
            ctx .strokeRect(25,25,100,100);

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
            });
            canvas.addEventListener("mousemove",(e)=>{
                if(clicked){
                    const width=e.clientX-startX;

                    const height=e.clientY-startY;
                    ctx.clearRect(0,0,canvas.width,canvas.height);
                    ctx.strokeRect(startX,startY,width,height);
                    console.log(e.clientX,e.clientY);
                }
            });








        }

        



    }, [canvasref]);



    return <div>


        <canvas ref={canvasref} width={500} height={500}>

        </canvas>

    </div>;
}

import { Tool } from "@/components/Canvas";
import { getExistingShapes } from "./http";
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

 export class Game {
    private canvas:HTMLCanvasElement; 
    private ctx:CanvasRenderingContext2D;
    private existingShapes:Shape[]=[];
    private roomId:string;
    private clicked:boolean;
    private startX:number=0;
    private startY:number=0;
    private selectedTool:Tool="circle";
     socket:WebSocket;

    constructor(canvas:HTMLCanvasElement,roomId:string,socket:WebSocket){  
        this.canvas=canvas;
        this.ctx=canvas.getContext("2d")!;
        this.existingShapes=[];
        this.roomId=roomId; 
        this.socket=socket;
        this.clicked=false;
        this.init();
        this.initHandlers();
        this.initMouseHandlers();
        

    }
    async init(){
        this.existingShapes=await getExistingShapes(this.roomId);
        this.clearCanvas();
    }

    setTool(tool:"rect"|"circle"|"pencil"){
        this.selectedTool=tool;
    }





    initHandlers(){

        this.socket.onmessage=(e)=>{
            const msg=JSON.parse(e.data as unknown as string);
            if(msg.type=="chat"){
                const parsedshape=JSON.parse(msg.message as unknown as string);
                this.existingShapes.push(parsedshape.shape );
                this.clearCanvas();
            }
        }

    }
    clearCanvas(){
            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
            this.ctx.fillStyle="black";
            this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
            this.existingShapes.map(shape=>{
                if(shape.type==="rect"){
                    this.ctx.strokeStyle="white";
                    this.ctx.strokeRect(shape.x,shape.y,shape.width,shape.height); 
                } 
                else if(shape.type==="circle"){
                    this.ctx.beginPath();
                    this.ctx.arc(shape.centerX,shape.centerY,Math.abs(shape.radius),0,Math.PI*2); 
                    this.ctx.stroke(); 
                    this.ctx.closePath();
                }
            });
    }

     mouseDownHandler=(e:MouseEvent)=>{
         this.clicked=true; 
         this.startX=e.clientX;
         this.startY=e.clientY;
     }
     mouseUpHandler=(e:MouseEvent)=>{
        this.clicked=false;
            console.log(e.clientX,e.clientY);
            const width=e.clientX-this.startX;
            const height=e.clientY-this.startY;

            //@ts-ignore
            const selectedTool=this.selectedTool;
            let shape:Shape|null=null;
            if(selectedTool=="rect"){
                shape={
                    
                    type:selectedTool,
                    x:this.startX,
                    y:this.startY,
                    width,
                    height
                }
            }
            else if(selectedTool=="circle"){
                const radius=Math.max(width,height)/2;
                shape={
                    
                    type:selectedTool,
                    radius:radius,
                    centerX:this.startX+radius,
                    centerY:this.startY+radius,
                }
            }
            else if(selectedTool=="pencil"){
                
            }
            if(!shape){
                return;
            }
            this.existingShapes.push(shape);

            this.socket.send(JSON.stringify({
                type:"chat",
                message:JSON.stringify({
                shape}),
                roomId:this.roomId
            })
        );
     }
     mouseMoveHandler=(e:MouseEvent)=>{
        if(this.clicked){
            const width=e.clientX-this.startX;
            const height=e.clientY-this.startY;
            this.clearCanvas();
            this.ctx.strokeStyle="white";

            //@ts-ignore
            const selectedTool=this.selectedTool;
            console.log(selectedTool);

            if(selectedTool==="rect"){
                console.log("drawrect");
                this.ctx.strokeRect(this.startX,this.startY,width,height);
             }
            else if(selectedTool==="circle"){
                console.log("drawcircle");
                
                const radius=Math.max(width,height)/2
                const centerX=this.startX+radius;
                const centerY=this.startY+radius;
                this.ctx.beginPath();
                this.ctx.arc(centerX,centerY,Math.abs(radius),0,Math.PI*2); 
                this.ctx.stroke(); 
                this.ctx.closePath();

            }
            else if(selectedTool=="pencil"){

            }
              






            // ctx.strokeRect(startX,startY,width,height);
            // console.log(e.clientX,e.clientY);
        }
     } 
    initMouseHandlers(){
        this.canvas.addEventListener("mousedown",this.mouseDownHandler);



        this.canvas.addEventListener("mouseup",this.mouseUpHandler);

        this.canvas.addEventListener("mousemove",this.mouseMoveHandler);



        

    }
    destroy(){
        this.canvas.removeEventListener("mousedown",this.mouseDownHandler);



        this.canvas.removeEventListener("mouseup",this.mouseUpHandler);

        this.canvas.removeEventListener("mousemove",this.mouseMoveHandler);

    } 
}
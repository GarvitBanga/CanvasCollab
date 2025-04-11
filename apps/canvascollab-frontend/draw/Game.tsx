
import { Tool } from "@/components/Canvas";
import { getExistingShapes,clearShapesFromDB,deleteLastShapeFromDB } from "./http";
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
}| {
    type: "pencil";
    points: { x: number; y: number }[];
};

 export class Game {
    private canvas:HTMLCanvasElement; 
    private ctx:CanvasRenderingContext2D;
    private existingShapes:Shape[]=[];
    private roomId:string;
    private clicked:boolean;
    private startX:number=0;
    private startY:number=0;
    private selectedTool:Tool="circle";
    private currentPencilPoints: { x: number; y: number }[] = [];
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
                this.existingShapes.push(parsedshape.shape);
                this.clearCanvas();
            }
            else if (msg.type == "clear") {
                this.existingShapes = [];
                this.clearCanvas();
            }
            else if (msg.type == "undo") {

                const deletedShape=JSON.parse(msg.message as unknown as string);
                this.existingShapes = this.existingShapes.filter(shape => {
                    return JSON.stringify(shape) !== JSON.stringify(deletedShape.deletedShape);
                  });
                this.clearCanvas();
            }
        }

    }

    clearCanvas(){
            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
            this.ctx.fillStyle="black";
            this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
            // console.log("existingShapes",this.existingShapes);
            this.ctx.strokeStyle="red";
            this.existingShapes.map(shape=>{
                if(shape.type==="rect"){
                    this.ctx.strokeRect(shape.x,shape.y,shape.width,shape.height); 
                } 
                else if(shape.type==="circle"){
                    this.ctx.beginPath();
                    this.ctx.arc(shape.centerX,shape.centerY,Math.abs(shape.radius),0,Math.PI*2); 
                    this.ctx.stroke(); 
                    this.ctx.closePath();
                }
                else if (shape.type === "pencil") {
                    this.ctx.beginPath();
                    for (let i = 0; i < shape.points.length - 1; i++) {
                        const p1 = shape.points[i];
                        const p2 = shape.points[i + 1];
                        this.ctx.moveTo(p1.x, p1.y);
                        this.ctx.lineTo(p2.x, p2.y);
                    }
                    this.ctx.stroke();
                    this.ctx.closePath();
                }
            });
    }
     async clearSharedCanvas() {
        this.existingShapes = [];
        this.clearCanvas();
    
        await clearShapesFromDB(this.roomId); // Remove from DB
    
        this.socket.send(
          JSON.stringify({
            type: "clear",
            message: "cleared",
            roomId: this.roomId,
          })
        );
      }

    undo = async () => {
        // console.log("undo",this.existingShapes);
        if (this.existingShapes.length === 0) return;
        // console.log("undo",this.existingShapes);
        // this.existingShapes.pop(); // Remove from frontend
        
      
        const deletedShape=await deleteLastShapeFromDB(this.roomId); // Remove from DB
        // console.log("deletedShape",deletedShape);
        // console.log("existingShapes",this.existingShapes);
        this.existingShapes = this.existingShapes.filter(shape => {
            return JSON.stringify(shape) !== JSON.stringify(deletedShape);
          });
        // console.log("existingShapes",this.existingShapes);
        this.clearCanvas();
      
        this.socket.send(
          JSON.stringify({
            type: "undo",
            message:JSON.stringify({
                deletedShape}),
            roomId: this.roomId,
          })
        );
    };

     mouseDownHandler=(e:MouseEvent)=>{
         this.clicked=true; 
         this.startX=e.clientX;
         this.startY=e.clientY;
         if (this.selectedTool === "pencil") {
            this.currentPencilPoints = [{ x: e.clientX, y: e.clientY }];
        }
     }
     mouseUpHandler=(e:MouseEvent)=>{
        this.clicked=false;
            // console.log(e.clientX,e.clientY);
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
                shape = {
                    type: "pencil",
                    points: [...this.currentPencilPoints]
                };
                this.currentPencilPoints = [];
            }
            if(!shape){
                return;
            }
            this.existingShapes.push(shape);
            // console.log("existingShapes",this.existingShapes);

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
            // console.log("existingShapes",this.existingShapes);
            const width=e.clientX-this.startX;
            const height=e.clientY-this.startY;
            this.clearCanvas();
            this.ctx.strokeStyle="red";

            //@ts-ignore
            const selectedTool=this.selectedTool;
            // console.log(selectedTool);

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
                console.log("drawpencil");
                this.currentPencilPoints.push({ x: e.clientX, y: e.clientY });
                this.ctx.beginPath();
                    for (let i = 0; i < this.currentPencilPoints.length - 1; i++) {
                        const p1 = this.currentPencilPoints[i];
                        const p2 = this.currentPencilPoints[i + 1];
                        this.ctx.moveTo(p1.x, p1.y);
                        this.ctx.lineTo(p2.x, p2.y);
                    }
                    this.ctx.stroke();
                    this.ctx.closePath();
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
export class Game {
    private canvas:HTMLCanvasElement; 
    private ctx:CanvasRenderingContext2D;

    constructor(canvas:HTMLCanvasElement){  
        this.canvas=canvas;
        this.ctx=canvas.getContext("2d")!;
        this.init();

    }
    init(){

    }
}
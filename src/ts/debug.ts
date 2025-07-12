import { vector2D } from "./utils";
import { Camera } from "./camera";
import { Game } from "./game";

export class DebugLine {
    public start: vector2D;
    public end: vector2D;
    public color: string;

    constructor(start: vector2D, end: vector2D, color: string = "red") {
        this.start = start;
        this.end = end;
        this.color = color;
    }

    public draw(context: CanvasRenderingContext2D, camera: Camera) {
        if (!Debug.debugMode) return;

        const screenStart = camera.worldToScreen(this.start);
        const screenEnd = camera.worldToScreen(this.end);

        context.strokeStyle = this.color;
        context.beginPath();
        context.moveTo(screenStart.x, screenStart.y);
        context.lineTo(screenEnd.x, screenEnd.y);
        context.stroke();
    }
}

export class Debug {
    static context: CanvasRenderingContext2D;
    static game: Game;
    static debugMode: boolean = false;
    static queue: DebugLine[] = [];

    static get camera() {
        return this.game.cameras[this.game.selectedCamera];
    }

    static init(context: CanvasRenderingContext2D, game: Game) {
        this.context = context;
        this.game = game;
    }

    static drawLine(start: vector2D, end: vector2D, color: string = "red") {
        if (!this.debugMode) return;

        const line = new DebugLine(start, end, color);
        this.queue.push(line);
    }
}

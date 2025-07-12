import { Entity } from "./entity";
import { InputHandler } from "./input";
import { vector2D } from "./utils";
import { Camera } from "./camera";
import StaticObject from "./statics";

export class Player extends Entity {
    private speed = 200; // pixels per second
    private velocity: vector2D = new vector2D(500, 0);
    private inputHandler: InputHandler;
    public debugposition: vector2D | null = null;

    constructor(position: vector2D) {
        super(position);
        this.inputHandler = new InputHandler();
    }

    public update(delta: number, staticObjects: StaticObject[], camera: Camera) {
        if (this.inputHandler.isKeyDown("ArrowLeft")) this.velocity.x = -this.speed * delta;
        if (this.inputHandler.isKeyDown("ArrowRight")) this.velocity.x = +this.speed * delta;

        const mousePosition = this.inputHandler.getMousePosition();
        const worldMousePosition = mousePosition ? camera.screenToWorld(mousePosition) : null;
        this.velocity = vector2D.subtract(worldMousePosition || new vector2D(0, 0), this.position);

        // this.velocity = vector2D.multiply(this.velocity, 0.9);
        // this.velocity.y = 100 * delta;

        this.debugposition = this.moveAndCollide(this.velocity, staticObjects);
    }

    public render(context: CanvasRenderingContext2D, camera: Camera, debugmode: boolean) {
        context.fillStyle = "#f3ffbcff";
        const worldPosition = camera.worldToScreen(this.position);
        context.fillRect(worldPosition.x, worldPosition.y, 32, 32);

        if (!debugmode) return;

        const endPosition = vector2D.add(worldPosition, this.velocity);
        context.beginPath();
        context.moveTo(worldPosition.x, worldPosition.y);
        context.lineTo(endPosition.x, endPosition.y);
        context.stroke();
        context.closePath();

        context.strokeStyle = "#ff0000";
        context.strokeRect(endPosition.x, endPosition.y, 32, 32);

        if (!this.debugposition) return;

        context.fillStyle = "#00ff00";
        const debugWorldPosition = camera.worldToScreen(this.debugposition);
        context.fillRect(debugWorldPosition.x, debugWorldPosition.y, 32, 32);
    }
}

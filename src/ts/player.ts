import { Entity } from "./entity";
import { InputHandler } from "./input";
import { vector2D, raycast } from "./utils";
import { Camera } from "./camera";
import StaticObject from "./statics";

export class Player extends Entity {
    private speed = 200; // pixels per second
    private velocity: vector2D = new vector2D(0, 0);
    private inputHandler: InputHandler;

    constructor(position: vector2D) {
        super(position);
        this.inputHandler = new InputHandler();
    }

    public isGrounded(staticObjects: StaticObject[]): boolean {
        const start = vector2D.add(this.position, new vector2D(0, this.size.y));
        const end = vector2D.add(start, new vector2D(0, StaticObject.TILE_SIZE / 10));
        const intersection = raycast(start, end, staticObjects);

        return intersection !== null;
    }

    public update(delta: number, staticObjects: StaticObject[]) {
        // Mouvement horizontal
        let moveX = 0;
        if (this.inputHandler.isKeyDown("ArrowLeft")) moveX -= this.speed;
        if (this.inputHandler.isKeyDown("ArrowRight")) moveX += this.speed;
        this.velocity.x = moveX;

        // Gravité
        const gravity = 900; // px/s²
        this.velocity.y += gravity * delta;

        // Saut
        if (this.inputHandler.isKeyDown("ArrowUp") && this.isGrounded(staticObjects)) {
            this.velocity.y = -350; // force du saut
        }

        // Friction horizontale
        this.velocity.x *= 0.9;

        // Déplacement et collision
        this.position = this.moveAndCollide(vector2D.multiply(this.velocity, delta), staticObjects);
    }

    public render(context: CanvasRenderingContext2D, camera: Camera) {
        context.fillStyle = "#f3ffbcff";
        const worldPosition = camera.worldToScreen(this.position);
        context.fillRect(worldPosition.x, worldPosition.y, 32, 32);
    }
}

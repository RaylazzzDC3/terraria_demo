import { vector2D } from "./utils";
import { Camera } from "./camera";

export default class StaticObject {
    public static readonly TILE_SIZE = 32;
    public readonly size: vector2D = new vector2D(StaticObject.TILE_SIZE, StaticObject.TILE_SIZE);
    public position: vector2D;
    public id: string;
    public state: number = 0;

    constructor(position: vector2D, id: string) {
        this.position = position;
        this.id = id;
    }

    public render(context: CanvasRenderingContext2D, camera: Camera, debugmode: boolean) {
        const scaledPosition = vector2D.multiply(this.position, StaticObject.TILE_SIZE);
        const worldPosition = camera.worldToScreen(scaledPosition);

        context.fillStyle = "#a1a1a1ff";
        context.fillRect(worldPosition.x, worldPosition.y, StaticObject.TILE_SIZE, StaticObject.TILE_SIZE);

        if (!debugmode) return;

        context.strokeStyle = "#9000ffff";
        context.strokeRect(
            worldPosition.x - StaticObject.TILE_SIZE,
            worldPosition.y - StaticObject.TILE_SIZE,
            StaticObject.TILE_SIZE * 2,
            StaticObject.TILE_SIZE * 2
        );
    }
}

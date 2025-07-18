import { Entity } from "./entity";
import { Camera } from "./camera";
import StaticObject from "./statics";
import World from "./world";

export class Scene {
    protected entities: Entity[] = [];
    protected staticObjects: StaticObject[] = [];

    constructor(world: World) {
        this.staticObjects = world.items; // Temporarily
    }

    public addEntity(entity: Entity) {
        this.entities.push(entity);
    }

    public update(delta: number) {
        for (const entity of this.entities) {
            entity.update(delta, this.staticObjects);
        }
    }

    public render(context: CanvasRenderingContext2D, camera: Camera) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        context.fillStyle = "#292929ff";
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);

        for (const staticObject of this.staticObjects) {
            staticObject.render(context, camera);
        }

        for (const entity of this.entities) {
            entity.render(context, camera);
        }
    }
}

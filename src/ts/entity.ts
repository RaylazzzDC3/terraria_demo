import { vector2D, Segment, Body } from "./utils";
import { Camera } from "./camera";
import StaticObject from "./statics";

export abstract class Entity {
    public position: vector2D;
    public size: vector2D = new vector2D(32, 32);

    constructor(position: vector2D) {
        this.position = position;
    }

    public moveAndCollide(velocity: vector2D, staticObjects: StaticObject[]): vector2D | null {
        const velocitySegment = new Segment(this.position, vector2D.add(this.position, velocity));
        let intersections: vector2D[] = [];

        for (const staticObject of staticObjects) {
            const scaledPosition = vector2D.multiply(staticObject.position, StaticObject.TILE_SIZE);
            const staticBody = new Body(
                vector2D.subtract(scaledPosition, staticObject.size),
                vector2D.multiply(staticObject.size, 2)
            );
            const localIntersections = velocitySegment.getIntersectionsWithBody(staticBody);

            if (localIntersections == null) continue;

            intersections = intersections.concat(localIntersections);
        }

        const sortedIntersections = intersections.sort((a, b) => {
            const distanceA = vector2D.distance(this.position, a);
            const distanceB = vector2D.distance(this.position, b);
            return distanceA - distanceB;
        });

        if (sortedIntersections.length === 0) {
            return null;
        }

        const closestIntersection = sortedIntersections[0];

        return closestIntersection;
    }

    abstract update(delta: number, staticObject: StaticObject[], camera: Camera): void;
    abstract render(context: CanvasRenderingContext2D, camera: Camera, debugmode: boolean): void;
}

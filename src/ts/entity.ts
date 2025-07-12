import { vector2D, Segment, Body } from "./utils";
import { Camera } from "./camera";
import StaticObject from "./statics";

export abstract class Entity {
    public position: vector2D;
    public size: vector2D = new vector2D(32, 32);

    constructor(position: vector2D) {
        this.position = position;
    }

    private simulateMovement(startPoint: vector2D, velocity: vector2D, staticObjects: StaticObject[]): vector2D {
        const velocitySegment = new Segment(startPoint, vector2D.add(startPoint, velocity));
        let intersections: vector2D[] = [];

        for (const staticObject of staticObjects) {
            const scaledPosition = vector2D.multiply(staticObject.position, StaticObject.TILE_SIZE);
            const staticBody = new Body(
                vector2D.subtract(scaledPosition, staticObject.size),
                vector2D.multiply(staticObject.size, 2)
            );

            let localIntersections = velocitySegment.getIntersectionsWithBody(staticBody);

            if (localIntersections == null) continue;

            localIntersections = localIntersections.filter((point) => {
                const a = point.tag === "top" || point.tag === "bottom";
                const b = point.tag === "left" || point.tag === "right";
                const c = point.x === staticBody.position.x || point.x === staticBody.position.x + staticBody.size.x;
                const d = point.y === staticBody.position.y || point.y === staticBody.position.y + staticBody.size.y;

                if ((a && c) || (b && d)) {
                    return false;
                } else {
                    return true;
                }
            });

            intersections = intersections.concat(localIntersections);
        }

        const sortedIntersections = intersections.sort((a, b) => {
            const distanceA = vector2D.distance(startPoint, a);
            const distanceB = vector2D.distance(startPoint, b);
            return distanceA - distanceB;
        });

        if (sortedIntersections.length === 0) {
            return vector2D.add(startPoint, velocity);
        }

        const closestIntersection = sortedIntersections[0];
        // Décale légèrement le point d'intersection pour éviter d'être collé/piégé
        const epsilon = 0.01;
        let corrected = new vector2D(closestIntersection.x, closestIntersection.y);
        if (closestIntersection.tag === "left") corrected.x -= epsilon;
        if (closestIntersection.tag === "right") corrected.x += epsilon;
        if (closestIntersection.tag === "top") corrected.y -= epsilon;
        if (closestIntersection.tag === "bottom") corrected.y += epsilon;
        corrected.tag = closestIntersection.tag;
        return corrected;
    }

    public moveAndCollide(velocity: vector2D, staticObjects: StaticObject[]): vector2D {
        const supposedEnd = vector2D.add(this.position, velocity);

        const endA = this.simulateMovement(this.position, velocity, staticObjects);

        let newVelocity: vector2D = new vector2D(0, 0);

        if (endA.tag === "top" || endA.tag === "bottom") {
            newVelocity = new vector2D(supposedEnd.x - endA.x, 0);
        } else if (endA.tag === "left" || endA.tag === "right") {
            newVelocity = new vector2D(0, supposedEnd.y - endA.y);
        }

        const endB = this.simulateMovement(endA, newVelocity, staticObjects);

        return endB;
    }

    abstract update(delta: number, staticObject: StaticObject[]): void;
    abstract render(context: CanvasRenderingContext2D, camera: Camera): void;
}

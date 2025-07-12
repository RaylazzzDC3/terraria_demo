import { vector2D } from "./utils";

export class Camera {
    public position: vector2D = new vector2D(0, 0);
    public zoom: number = 1;
    public debugmode: boolean = false;

    public zoomScale(scale: number): number {
        return (this.zoom *= scale);
    }

    public worldToScreen(worldPosition: vector2D): vector2D {
        const screenX = (worldPosition.x - this.position.x) * this.zoom;
        const screenY = (worldPosition.y - this.position.y) * this.zoom;
        return new vector2D(screenX, screenY);
    }

    public screenToWorld(screenPosition: vector2D): vector2D {
        const worldX = screenPosition.x / this.zoom + this.position.x;
        const worldY = screenPosition.y / this.zoom + this.position.y;
        return new vector2D(worldX, worldY);
    }
}

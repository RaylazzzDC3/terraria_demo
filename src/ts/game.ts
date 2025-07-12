import { Scene } from "./scene";
import { Camera } from "./camera";
import { vector2D } from "./utils";
import { Debug } from "./debug";

export class Game {
    private context: CanvasRenderingContext2D;
    private scene: Scene;
    private lastTime: number = 0;
    private running: boolean = false;
    public cameras: Camera[] = [];
    public selectedCamera: number = 0;

    constructor(context: CanvasRenderingContext2D, scene: Scene) {
        this.context = context;
        this.scene = scene;
        this.cameras.push(new Camera());

        this.cameras[0].position = new vector2D(-100, -100);
    }

    public start() {
        this.running = true;
        requestAnimationFrame(this.loop.bind(this));
    }

    public stop() {
        this.running = false;
    }

    private handleCamerasDebugMode(context: CanvasRenderingContext2D): void {
        for (const camera of this.cameras) {
            if (camera.debugmode) {
                context.strokeStyle = "red";
                context.lineWidth = 1;

                const screenPosition = camera.screenToWorld(new vector2D(0, 0));
                const relativeScreenPosition = this.cameras[this.selectedCamera].worldToScreen(screenPosition);
                const width = context.canvas.width * camera.zoom;
                const height = context.canvas.height * camera.zoom;
                context.strokeRect(relativeScreenPosition.x, relativeScreenPosition.y, width, height);
            }
        }
    }

    private loop(time: number) {
        if (!this.running) return;
        const delta = (time - this.lastTime) / 1000;
        this.lastTime = time;

        this.scene.update(delta);
        this.scene.render(this.context, this.cameras[this.selectedCamera]);
        this.handleCamerasDebugMode(this.context);

        Debug.queue.forEach((line) => line.draw(this.context, this.cameras[this.selectedCamera]));
        Debug.queue = [];

        requestAnimationFrame(this.loop.bind(this));
    }
}

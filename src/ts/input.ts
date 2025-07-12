import { vector2D } from "./utils";

export class InputHandler {
    private keys: Set<string> = new Set();
    private mousePosition: vector2D | null = null;

    constructor() {
        window.addEventListener("keydown", (e) => this.keys.add(e.key));
        window.addEventListener("keyup", (e) => this.keys.delete(e.key));
        window.addEventListener("mousemove", (e) => {
            const rect = (e.target as HTMLElement).getBoundingClientRect();

            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            this.mousePosition = new vector2D(mouseX, mouseY);
        });
    }

    public isKeyDown(key: string): boolean {
        return this.keys.has(key);
    }

    public getMousePosition(): vector2D | null {
        return this.mousePosition;
    }
}

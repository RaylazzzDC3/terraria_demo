import { vector2D } from "./utils";
import StaticObject from "./statics";

export default class World {
    // private readonly width: number = 800;
    // private readonly height: number = 400;
    public items: StaticObject[] = [];

    constructor() {
        for (let i = 0; i < 10; i++) {
            const position = new vector2D(2 + i, 10);
            this.items.push(new StaticObject(position, `0000`));
        }
        for (let i = 0; i < 10; i++) {
            const position = new vector2D(12, i);
            this.items.push(new StaticObject(position, `0000`));
        }
        for (let i = 0; i < 10; i++) {
            const position = new vector2D(2 + i, 0);
            this.items.push(new StaticObject(position, `0000`));
        }
        for (let i = 0; i < 10; i++) {
            const position = new vector2D(2, i);
            this.items.push(new StaticObject(position, `0000`));
        }
    }
}

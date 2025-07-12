import "../style.css";
import { Game } from "./game";
import { Scene } from "./scene";
import { Player } from "./player";
import { vector2D } from "./utils";
import World from "./world";

let canvas = document.querySelector("canvas") as HTMLCanvasElement;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("load", resizeCanvas);

const context = canvas.getContext("2d")!;

const world = new World();
const scene = new Scene(world);
const player = new Player(new vector2D(200, 200));
scene.addEntity(player);

const game = new Game(context, scene);
game.start();

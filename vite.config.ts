import { defineConfig } from "vite";

export default defineConfig({
    root: "src",
    build: {
        rollupOptions: {
            input: "ts/main.ts",
        },
    },
});

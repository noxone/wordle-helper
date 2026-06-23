import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        coverage: {
            provider: "v8",
            include: ["src/logic/**/*.ts"],
            reporter: ["text", "html"],
            thresholds: {
                lines: 80,
                branches: 80,
            },
        },
    },
});

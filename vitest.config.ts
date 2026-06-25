import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        environment: "node",
        coverage: {
            provider: "v8",
            include: [
                "src/*.ts",
                "src/browser/**/*.ts",
                "src/components/**/*.ts",
                "src/logic/**/*.ts",
                "src/state/**/*.ts",
            ],
            reporter: ["text", "html"],
            thresholds: {
                lines: 80,
                branches: 80,
            },
        },
    },
});

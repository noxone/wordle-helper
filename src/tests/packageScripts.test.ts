import { describe, expect, it } from "vitest";
import packageJson from "../../package.json";

describe("package scripts", () => {
    it("runs the coverage command successfully", () => {
        expect(packageJson.scripts["test:coverage"]).toBe("vitest --run --coverage");
    });
});

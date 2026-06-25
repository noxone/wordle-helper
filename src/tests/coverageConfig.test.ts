import { describe, expect, it } from "vitest";
import vitestConfig from "../../vitest.config";

describe("coverage configuration", () => {
    const coverageConfig = vitestConfig.test?.coverage;
    const applicationCoverageIncludes = [
        "src/*.ts",
        "src/browser/**/*.ts",
        "src/components/**/*.ts",
        "src/logic/**/*.ts",
        "src/state/**/*.ts",
    ];

    it("reports coverage for all application code under src", () => {
        expect(coverageConfig?.include).toEqual(applicationCoverageIncludes);
    });

    it("enforces at least 80 percent line coverage across src", () => {
        expect(coverageConfig?.thresholds?.lines).toBe(80);
    });

    it("enforces at least 80 percent branch coverage across src", () => {
        expect(coverageConfig?.thresholds?.branches).toBe(80);
    });

    function expectCoverageToInclude(path: string): void {
        expect(coverageConfig?.include).toContain(path);
    }

    it("includes src/logic in the enforced coverage threshold", () => {
        expectCoverageToInclude("src/logic/**/*.ts");
    });

    it("includes src/state in the enforced coverage threshold", () => {
        expectCoverageToInclude("src/state/**/*.ts");
    });

    it("includes src/components in the enforced coverage threshold", () => {
        expectCoverageToInclude("src/components/**/*.ts");
    });
});

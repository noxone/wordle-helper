import { resolve } from "node:path";
import { buildWordLists } from "../src/logic/wordListBuild.ts";

await buildWordLists({
    dataDir: resolve("data"),
    publicDir: resolve("public"),
});

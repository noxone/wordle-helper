import "./style.css";
import { initializeApp } from "./app.ts";

await initializeApp({
    document,
    storage: localStorage,
    browserLocale: navigator.language,
    fetchText: async (path) => {
        const response = await fetch(path);
        return response.text();
    },
});

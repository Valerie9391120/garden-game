import { GardenEngine } from "./garden-engine.js";
import { JsonFileGardenStore } from "./stores/json-file-store.js";
import { createGardenTool } from "./garden-tool.js";

let day="2026-10-20";
const clock={today:()=>day};
const store=new JsonFileGardenStore("./garden-save.json");
const engine=new GardenEngine(store,clock,()=>0.5); // demo RNG: never triggers death
const garden=createGardenTool(engine);

console.log(await garden({action:"open"}));
console.log("\n---\n"+await garden({action:"water"}));
console.log("\n---\n"+await garden({action:"status"}));

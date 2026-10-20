import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import type { GardenState, GardenStore } from "../types.js";

/** Single-process Node adapter for testing / a laptop-only deployment.
 *  For phone + laptop sharing, use a remote DB/backend that implements GardenStore.update atomically.
 */
export class JsonFileGardenStore implements GardenStore {
  private queue=Promise.resolve();
  constructor(private path:string) {}

  async load():Promise<GardenState|null> {
    try { return JSON.parse(await readFile(this.path,"utf8")) as GardenState; }
    catch (e:any) { if (e?.code==="ENOENT") return null; throw e; }
  }

  async update<T>(fn:(state:GardenState|null)=>Promise<[GardenState,T]>|[GardenState,T]):Promise<T> {
    let resolve!: (v:T)=>void, reject!: (e:unknown)=>void;
    const out=new Promise<T>((res,rej)=>{resolve=res;reject=rej;});
    this.queue=this.queue.then(async()=>{
      try {
        const current=await this.load();
        const [next,value]=await fn(current);
        await mkdir(dirname(this.path),{recursive:true});
        const tmp=`${this.path}.tmp`;
        await writeFile(tmp,JSON.stringify(next,null,2),"utf8");
        await rename(tmp,this.path);
        resolve(value);
      } catch(e) { reject(e); }
    });
    return out;
  }
}

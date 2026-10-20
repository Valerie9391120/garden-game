# Claude Garden Engine

一个不碰页面的纯文字园艺引擎，按当前约定实现：

- 首次进入自动获得 `牡丹 · 魏紫`。
- 每个自然日最多一次有效照料：`water` / `loosen` / `prune` 三选一。
- 只有有效照料才让培育进度 +1；漏掉几天不会倒退。
- `admire` 不限次数，也不会推进培育或触发死亡。
- 1–10 个有效照料日：初植 / 萌动。
- 11–20：抽枝展叶。
- 21–29：孕蕾。
- 第 30 次有效照料：自动首次开花，收入《群芳谱》。
- 魏紫完成后可自行选择下一品种。
- 培育期每次有效照料后有 0.02% 概率意外凋谢；同一天不会重复判定。
- 植物栽成后永久可赏，不再受现实花期限制。
- 30 个成就按条件解锁；未解锁时完全不显示名字和条件。

## 重要：手机 + 笔记本共享

`GardenEngine` 不负责存档位置，只依赖 `GardenStore`：

```ts
interface GardenStore {
  load(): Promise<GardenState | null>;
  update<T>(fn: (state: GardenState | null) => Promise<[GardenState, T]> | [GardenState, T]): Promise<T>;
}
```

真正部署时，让手机 PWA 和笔记本上的 Claude 工具都连接同一个后端 / 数据库实现 `GardenStore` 即可。`update()` 应当是原子操作，避免两端同时写造成一天照料两次。

仓库附带的 `JsonFileGardenStore` 只适合本地测试或单机部署，不负责跨设备同步。

## 最小接入

```ts
const engine = new GardenEngine(sharedStore, clock);
const playGarden = createGardenTool(engine);

await playGarden({ action: "water" });
await playGarden({ action: "admire" });
await playGarden({ action: "collection" });
```

`clock.today()` 必须返回用户所在时区的 `YYYY-MM-DD`。不要直接用 UTC 日期，否则午夜附近可能判错“同一天”。

## Tool actions

- `open`
- `status`
- `water`
- `loosen`
- `prune`
- `admire [targetPlantId]`
- `collection`
- `achievements`
- `plants`
- `plant <plantId>`

## 品种 ID

- `peony_weizi`
- `peony_yulouchun`
- `white_plum`
- `xifu_begonia`
- `zhilan`
- `azalea`
- `camellia`
- `osmanthus`
- `rose`
- `narcissus`
- `autumn_chrysanthemum`
- `hibiscus`

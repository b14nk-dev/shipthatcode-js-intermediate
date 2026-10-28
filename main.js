const lines = require("fs").readFileSync(0, "utf-8").split("\n");
const limit = Number(lines[0]);
const durations = (lines[1] || "")
  .split(" ")
  .filter((s) => s !== "")
  .map(Number);

// ---- virtual clock: a job waits one tick per unit of its duration ----
let ticks = 0;
let running = 0;
let peak = 0;
const waiting = [];
const tick = () => new Promise((resolve) => waiting.push(resolve));
const turn = () => new Promise((resolve) => setImmediate(resolve));

async function job(i) {
  running++;
  peak = Math.max(peak, running);
  for (let t = 0; t < durations[i]; t++) await tick();
  running--;
  return i + ":" + durations[i];
}

// Call fn(items[i], i) for every item, at most `limit` unfinished at a time,
// starting the next one as soon as a slot frees. Resolve with results in input order.
async function mapLimit(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const index = next++;
      results[index] = await fn(items[index], index);
    }
  }
  await Promise.all(items.slice(0, limit).map(() => worker()));
  return results;
}

async function main() {
  const ids = durations.map((_, i) => i);
  const done = mapLimit(ids, limit, job);
  await turn();
  while (waiting.length > 0) {
    ticks++;
    waiting.splice(0).forEach((resolve) => resolve());
    await turn();
  }
  const results = await done;
  console.log(results.join(" "));
  console.log("peak: " + peak);
  console.log("ticks: " + ticks);
}
main();

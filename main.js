const lines = require("fs").readFileSync(0, "utf-8").split("\n");
const name = lines[0];
const greeting = lines[1];
const punct = lines[2];
const k = Number(lines[3]);

// Return a function that calls fn with this = thisArg and arguments preset..., then its own.
function myBind(fn, thisArg, ...preset) {
  // TODO
  thisArg.fn = fn;
  return (...args) => thisArg.fn(...preset, ...args);
}

function describe(greeting, punct, extra) {
  return (
    greeting +
    ", " +
    this.name +
    punct +
    (extra === undefined ? "" : " " + extra)
  );
}

const owner = { name: name };
const hello = myBind(describe, owner, greeting);
console.log(hello(punct));
console.log(hello(punct, "again"));
console.log(hello.call({ name: "Other" }, "?"));
console.log(describe.call({ name: "Other" }, greeting, "."));

const counter = {
  n: 0,
  inc() {
    this.n += 1;
    return this.n;
  },
};
const inc = myBind(counter.inc, counter);
for (let i = 0; i < k; i++) inc();
console.log("counter.n: " + counter.n);

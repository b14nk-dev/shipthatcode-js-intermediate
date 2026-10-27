let squareCalls = 0;
let cubeCalls = 0;
const square = (n) => {
  squareCalls++;
  return n * n;
};
const cube = (n) => {
  cubeCalls++;
  return n * n * n;
};

// Return a function that calls fn at most once per distinct argument.
function memoize(fn) {
  // TODO: keep a cache in a variable that only the returned function can see.
  const cache = {};
  return (n) => {
    if (cache[n] !== undefined) return cache[n];
    cache[n] = fn(n);
    return cache[n];
  };
}

const fastSquare = memoize(square);
const fastCube = memoize(cube);

const nums = require("fs")
  .readFileSync(0, "utf-8")
  .trim()
  .split(" ")
  .filter((s) => s !== "")
  .map(Number);
for (const n of nums) {
  console.log(n + " " + fastSquare(n) + " " + fastCube(n));
}
console.log("square calls: " + squareCalls);
console.log("cube calls: " + cubeCalls);

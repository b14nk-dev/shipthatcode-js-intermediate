const cmds = require("fs")
  .readFileSync(0, "utf-8")
  .split("\n")
  .filter((l) => l.trim() !== "");

function execute(cmd) {
  const parts = cmd.trim().split(" ");
  const op = parts[0];
  if (op === "half") {
    const n = Number(parts[1]);
    if (!Number.isInteger(n))
      throw new TypeError("not an integer: " + parts[1]);
    if (n % 2 !== 0) throw new RangeError("odd number: " + n);
    return n / 2;
  }
  if (op === "quit") throw "quit requested";
  if (op === "code") throw 42;
  if (op === "obj") throw { code: 7 };
  throw new Error("unknown command: " + op);
}

let tries = 0;

// Run execute(cmd) and report the outcome as a string (see the exercise).
function attempt(cmd) {
  // TODO: try / catch / finally
  tries++;
  try {
    return "OK " + execute(cmd);
  } catch (err) {
    if (err instanceof RangeError) {
      return "FAIL RangeError: " + err.message;
    } else if (err instanceof TypeError) {
      return "FAIL TypeError: " + err.message;
    } else if (err instanceof Error) {
      throw err;
    } else {
      return `FAIL thrown ${typeof err}: ${err}`;
    }
  }
}

for (const cmd of cmds) {
  try {
    console.log(attempt(cmd));
  } catch (err) {
    console.log("unexpected: " + err.message);
  }
}
console.log("tries: " + tries);

/*
code
obj
*/

const lines = require("fs")
  .readFileSync(0, "utf-8")
  .split("\n")
  .filter((l) => l.trim() !== "");

// All objects from obj up to the end of its prototype chain (stop when there is no prototype).
function chain(obj) {
  const chain = [obj];
  let prototype = Object.getPrototypeOf(obj);
  while (prototype) {
    chain.push(prototype);
    prototype = Object.getPrototypeOf(prototype);
  }
  return chain;
}

// { holder, hops }: the first object in obj's chain that has key as an OWN property, or null.
function owner(obj, key) {
  if (obj[key] === undefined) return null;
  let holder = obj;
  let hops = 0;
  while (holder !== null) {
    if (Object.keys(holder).includes(key)) break;
    holder = Object.getPrototypeOf(holder);
    hops++;
  }
  return holder ? { holder, hops } : null;
}

// True when candidate appears in obj's chain above obj itself.
function isAncestor(obj, candidate) {
  while (obj !== null) {
    obj = Object.getPrototypeOf(obj);
    if (obj === candidate) return true;
  }
  return false;
}

const byName = Object.create(null); // object name -> object
const known = [Object.prototype]; // every object we have named...
const labels = ["Object.prototype"]; // ...and its name, at the same index
const nameOf = (o) => labels[known.indexOf(o)];
for (const line of lines) {
  if (line.includes(":")) {
    const [head, rest] = line.split(":");
    const [name, parentName] = head.split("<").map((s) => s.trim());
    let obj;
    if (parentName === undefined) obj = {};
    else if (parentName === "null") obj = Object.create(null);
    else obj = Object.create(byName[parentName]);
    for (const key of rest.split(" ").filter((k) => k !== "")) obj[key] = true;
    byName[name] = obj;
    known.push(obj);
    labels.push(name);
  } else {
    const parts = line.trim().split(" ");
    if (parts[0] === "chain") {
      console.log(chain(byName[parts[1]]).map(nameOf).join(" > "));
    } else if (parts[0] === "?") {
      const found = owner(byName[parts[1]], parts[2]);
      console.log(
        parts[2] +
          " -> " +
          (found ? nameOf(found.holder) + " (" + found.hops + ")" : "none"),
      );
    } else if (parts[0] === "is") {
      console.log(isAncestor(byName[parts[1]], byName[parts[2]]));
    }
  }
}
/*
Animal: eats
Dog < Animal: barks
Puppy < Dog: plays
chain Puppy
? Puppy eats
*/

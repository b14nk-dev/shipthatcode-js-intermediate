const parts = require('fs').readFileSync(0, 'utf-8').trim().split(' ').map(Number);
const n = parts[0];
const size = parts[1];

// An infinite iterable of 2, 3, 4, ... that counts every value it hands out.
let pulled = 0;
const naturals = {
  [Symbol.iterator]() {
    let k = 2;
    return {
      next() {
        pulled++;
        return { value: k++, done: false };
      },
    };
  },
};

function isPrime(k) {
  for (let d = 2; d * d <= k; d++) {
    if (k % d === 0) return false;
  }
  return k >= 2;
}

// Yield the first `count` items of iterable, pulling no more than that from it.
function* take(iterable, count) {
  let counter = 0;
  while (counter < count) {
    counter++;
    yield iterable.next().value;
  }
}

// Yield only the items for which pred(item) is true.
function* filterGen(iterable, pred) {
  for (let n of iterable) {
    if (pred(n)) yield n;
  }
}

// Yield arrays of `size` items; the last one may be shorter.
function* chunk(iterable, size) {
  let arr = [];
  let val = iterable.next();
  while (!val.done) {
    arr.push(val.value);
    if (arr.length >= size) {
      yield arr;
      arr = [];
    }
    val = iterable.next();
  }

  yield arr;
}

for (const group of chunk(take(filterGen(naturals, isPrime), n), size)) {
  console.log(group.join(' '));
}
console.log('pulled: ' + pulled);

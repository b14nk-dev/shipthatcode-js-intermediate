const lines = require('fs')
  .readFileSync(0, 'utf-8')
  .split('\n')
  .filter((l) => l.trim() !== '');

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map(); // iterates oldest-first: the first key is the least recently used
  }

  sort() {
    this.map = new Map([...this.map.entries()].sort((a, b) => b[1].use - a[1].use));
  }

  // Value for key (or undefined). A hit makes the key the most recently used.
  get(key) {
    let { value, use } = this.map.get(key) || {};
    if (value && use) {
      this.map.set(key, { value, use: use + 1 });
      this.sort();
    }
    return value;
  }

  // Store key -> value as the most recently used; evict the oldest key if a new key does not fit.
  put(key, value) {
    if (this.map.size >= this.capacity) {
      this.map = new Map([...this.map.entries()].slice(0, this.capacity - 1));
    }
    this.map.set(key, { value, use: 1 });
    this.sort();
  }

  keys() {
    return [...this.map.keys()];
  }
}

const cache = new LRUCache(Number(lines[0]));
for (const line of lines.slice(1)) {
  const [cmd, key, value] = line.trim().split(' ');
  if (cmd === 'put') {
    cache.put(key, value);
  } else if (cmd === 'get') {
    const found = cache.get(key);
    console.log(found === undefined ? -1 : found);
  } else if (cmd === 'dump') {
    const keys = cache.keys();
    console.log(keys.length === 0 ? 'empty' : keys.join(' '));
  }
}
/*
2
put a 1
put b 2
get a
put c 3
get b
dump
*/

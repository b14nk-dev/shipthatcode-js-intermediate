const lines = require('fs')
  .readFileSync(0, 'utf-8')
  .split('\n')
  .filter((l) => l.trim() !== '');

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map(); // iterates oldest-first: the first key is the least recently used
  }

  // Value for key (or undefined). A hit makes the key the most recently used.
  get(key) {
    if (this.map.has(key)) {
      let value = this.map.get(key);
      this.map.delete(key);
      this.map.set(key, value);
      return this.map.get(key);
    }
  }

  // Store key -> value as the most recently used; evict the oldest key if a new key does not fit.
  put(key, value) {
    // TODO
    if (this.map.size >= this.capacity) {
      if (this.map.has(key)) this.map.delete(key);
      else this.map = new Map([...this.map.entries()].slice(1));
    }
    this.map.set(key, value);
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

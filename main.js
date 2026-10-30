'use strict';
const pairs = require('fs')
  .readFileSync(0, 'utf-8')
  .trim()
  .split(' ')
  .filter((p) => p !== '');
const base = {};
for (const pair of pairs) {
  const eq = pair.indexOf('=');
  base[pair.slice(0, eq)] = pair.slice(eq + 1);
}

// Return a new, frozen object (see the exercise): copy of base, hidden read-only id, hidden summary getter.
function makeConfig(base, id) {
  // TODO
  let newBase = {};
  for (let [key, value] of Object.entries(base)) {
    Object.defineProperty(newBase, key, {
      value,
      enumerable: true,
    });
  }
  Object.defineProperty(newBase, 'id', {
    configurable: false,
    enumerable: false,
    value: id,
    writable: false,
  });
  Object.defineProperty(newBase, 'summary', {
    enumerable: false,
    get() {
      return Object.entries(this)
        .map(([key, value]) => `${key}=${value}`)
        .join(';');
    },
  });
  Object.freeze(newBase);
  return newBase;
}

function attempt(fn) {
  try {
    fn();
    return 'ok';
  } catch (err) {
    return err.name;
  }
}

const cfg = makeConfig(base, 'cfg-1');
const first = Object.keys(cfg)[0];
console.log('keys: ' + Object.keys(cfg).join(','));
console.log('json: ' + JSON.stringify(cfg));
console.log('id: ' + cfg.id);
console.log('summary: ' + cfg.summary);
console.log(
  'change ' +
    first +
    ': ' +
    attempt(() => {
      cfg[first] = 'changed';
    }),
);
console.log(
  'add: ' +
    attempt(() => {
      cfg.extra = 'x';
    }),
);
console.log(
  'delete: ' +
    attempt(() => {
      delete cfg[first];
    }),
);
console.log(
  'overwrite id: ' +
    attempt(() => {
      cfg.id = 'other';
    }),
);
console.log(
  'change base: ' +
    attempt(() => {
      base.late = 'y';
    }),
);
console.log('late in cfg: ' + ('late' in cfg));
const flags = (d) => (d ? 'w=' + d.writable + ' e=' + d.enumerable + ' c=' + d.configurable : 'missing');
console.log(first + ' flags: ' + flags(Object.getOwnPropertyDescriptor(cfg, first)));
console.log('id flags: ' + flags(Object.getOwnPropertyDescriptor(cfg, 'id')));
const sd = Object.getOwnPropertyDescriptor(cfg, 'summary');
console.log('summary: ' + (sd ? 'get=' + typeof sd.get + ' set=' + typeof sd.set + ' e=' + sd.enumerable : 'missing'));
console.log('frozen: ' + Object.isFrozen(cfg));

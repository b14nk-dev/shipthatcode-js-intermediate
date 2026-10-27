const prices = { apple: 3, pear: 4, melon: 10 };

// Resolves with the unit price after one event-loop turn, or rejects for an unknown name.
function lookup(name) {
  return new Promise((resolve, reject) => {
    setImmediate(() => {
      if (Object.keys(prices).includes(name)) resolve(prices[name]);
      else reject(new Error('unknown item: ' + name));
    });
  });
}

async function checkout(lines) {
  let total = 0;
  for (let line of lines) {
    let [name, quantity] = line.split(' ');
    try {
      let price = await lookup(name);
      console.log(`${name} x${quantity} = ${price * quantity}`);
      total += price * quantity;
    } catch (err) {
      console.log(`skip ${name}: ${err.message}`);
    }
  }
  // TODO: go through the lines in order, await each lookup, survive the ones that fail.
  return total;
}

const lines = require('fs')
  .readFileSync(0, 'utf-8')
  .split('\n')
  .filter((l) => l.trim() !== '');
console.log('checking out');
checkout(lines).then((total) => console.log('total: ' + total));
console.log('waiting');

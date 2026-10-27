const lines = require('fs')
  .readFileSync(0, 'utf-8')
  .split('\n')
  .filter((l) => l.trim() !== '');

const stack = (function (capacity) {
  // TODO: keep the items in a private array and return push, pop, peek, size.
  const stack = [];
  return {
    push(x) {
      if (stack.length >= capacity) return false;
      stack.push(x);
      return true;
    },
    pop() {
      return stack.pop();
    },
    peek() {
      return stack[stack.length - 1];
    },
    size() {
      return stack.length;
    },
  };
})(Number(lines[0]));

for (const line of lines.slice(1)) {
  const [cmd, arg] = line.trim().split(' ');
  if (cmd === 'push') {
    console.log(stack.push(arg) ? 'ok' : 'full');
  } else if (cmd === 'pop' || cmd === 'peek') {
    const item = stack[cmd]();
    console.log(item === undefined ? 'empty' : item);
  } else if (cmd === 'size') {
    console.log(stack.size());
  } else if (cmd === 'api') {
    console.log(Object.keys(stack).join(','));
  }
}

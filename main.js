const text = require('fs').readFileSync(0, 'utf-8');

// One pattern with named groups `user` and `domain`, and the g flag.
const EMAIL = /(?<user>[\w\d\-\_\.\+]+)@(?<domain>[\w\d\-]+(\.[\w\d\-]+)+)/g;

// Return [{ user, domain }, ...] for every address in text, in order.
function findEmails(text) {
  let parsed = [];
  for (let m of text.matchAll(EMAIL)) {
    const { user, domain } = m.groups;
    parsed.push({ user, domain });
  }
  return parsed;
}

const found = findEmails(text);
for (const entry of found) {
  console.log(entry.user + ' at ' + entry.domain);
}
console.log('total: ' + found.length);

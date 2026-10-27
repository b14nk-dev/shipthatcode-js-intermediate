const parts = require('fs').readFileSync(0, 'utf-8').trim().split(' ').map(Number);
const failures = parts[0];
const attempts = parts[1];

let calls = 0;
function flaky() {
  calls++;
  if (calls <= failures) return Promise.reject(new Error('fail #' + calls));
  return Promise.resolve('data');
}

// Call task(); if it rejects, try again, at most maxAttempts calls in total.
function retry(task, maxAttempts) {
  // TODO
  return task().catch((err) => (calls < maxAttempts ? retry(task, maxAttempts) : Promise.reject(err)));
}

console.log('start');
retry(flaky, attempts)
  .then((value) => console.log('ok: ' + value + ' after ' + calls + ' calls'))
  .catch((err) => console.log('gave up: ' + err.message + ' after ' + calls + ' calls'));
console.log('queued');

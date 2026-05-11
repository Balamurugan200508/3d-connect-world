const fs = require('fs');

const f1 = 'c:/entraiot-production-final/entraiot-unified/stage1/assets/Portfolio-CFTaDZT1.js';
const c1 = fs.readFileSync(f1, 'utf8');

const idx = c1.indexOf('projects:[');
if (idx !== -1) {
  console.log('F1 substring:');
  console.log(c1.substring(idx - 50, idx + 200));
} else {
  console.log('Not found in F1');
}

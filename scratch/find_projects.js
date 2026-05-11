const fs = require('fs');
const c = fs.readFileSync('c:/entraiot-production-final/entraiot-unified/stage1/assets/Portfolio-CFTaDZT1.js', 'utf8');

let idx = 0;
while ((idx = c.indexOf('projects', idx)) !== -1) {
  console.log(`Match at ${idx}: ${c.substring(idx, idx + 40)}`);
  idx += 1;
}

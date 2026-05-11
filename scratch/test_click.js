const fs = require('fs');
const c = fs.readFileSync('c:/entraiot-production-final/entraiot-unified/stage1/assets/Portfolio-CFTaDZT1.js', 'utf8');

// Find onClick or events in the file
let idx = 0;
while ((idx = c.indexOf('onClick', idx)) !== -1) {
  console.log(`onClick at ${idx}: ${c.substring(idx - 100, idx + 100)}`);
  idx += 1;
}
while ((idx = c.indexOf('.url', idx)) !== -1) {
  console.log(`.url at ${idx}: ${c.substring(idx - 50, idx + 50)}`);
  idx += 1;
}

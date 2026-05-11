const fs = require('fs');
const file2 = 'c:/entraiot-production-final/entraiot-unified/stage2/public/assets/Portfolio-CFTaDZT1.js';
let content = fs.readFileSync(file2, 'utf8');
const idx = content.indexOf('projects:[');
const endIdx = content.indexOf('}]', idx);
console.log(content.substring(idx, endIdx + 2));

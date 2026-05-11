const fs = require('fs');

const f1 = 'c:/entraiot-production-final/entraiot-unified/stage1/assets/Portfolio-CFTaDZT1.js';
let c1 = fs.readFileSync(f1, 'utf8');

const idx = c1.indexOf('projects:[');
const endIdx = c1.indexOf('}]', idx);
const currentProjectsString = c1.substring(idx, endIdx + 2);
console.log('--- Current projects in file ---');
console.log(currentProjectsString);

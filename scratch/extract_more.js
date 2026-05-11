const fs = require('fs');
const c = fs.readFileSync('c:/entraiot-production-final/entraiot-unified/stage1/assets/Portfolio-CFTaDZT1.js', 'utf8');

console.log(c.substring(20600, 21100));

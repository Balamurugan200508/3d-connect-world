const fs = require('fs');
const file = 'stage1/assets/CountryFrance-BVz2pCNL.js';
let content = fs.readFileSync(file, 'utf8');
content = content.replace('"Gen X" Web Engineer', '"Gen X" World Begins');
fs.writeFileSync(file, content);
console.log('Replacement done.');

const fs = require('fs');
const file = 'c:/entraiot-production-final/entraiot-unified/stage1/assets/CountryFrance-BVz2pCNL.js';
const content = fs.readFileSync(file, 'utf8');
const regex = /F\.jsx\("h1",\{children:"Hi!"\}\)/g;
let match;
while ((match = regex.exec(content)) !== null) {
  console.log(`Match at index ${match.index}`);
  console.log(content.slice(match.index, match.index + 500));
}

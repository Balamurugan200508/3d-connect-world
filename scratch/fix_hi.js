const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'c:/entraiot-production-final/entraiot-unified/stage1/assets/CountryFrance-BVz2pCNL.js',
  'c:/entraiot-production-final/entraiot-unified/stage2/public/assets/CountryFrance-BVz2pCNL.js',
  'c:/entraiot-production-final/repo_check/stage1/assets/CountryFrance-BVz2pCNL.js',
  'c:/entraiot-production-final/repo_check/stage2/public/assets/CountryFrance-BVz2pCNL.js'
];

filesToUpdate.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // replace all occurrences of "Gen X" Web Engineer with "Gen X" World Begins
    const before = content;
    content = content.replaceAll('"Gen X" Web Engineer', '"Gen X" World Begins');
    if (before !== content) {
      fs.writeFileSync(file, content, 'utf8');
      console.log(`Updated file: ${file}`);
    } else {
      console.log(`No change needed in: ${file}`);
    }
  } else {
    console.log(`File not found: ${file}`);
  }
});

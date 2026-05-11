const fs = require('fs');

const file1 = 'c:/entraiot-production-final/entraiot-unified/stage1/assets/Portfolio-CFTaDZT1.js';
const file2 = 'c:/entraiot-production-final/entraiot-unified/stage2/public/assets/Portfolio-CFTaDZT1.js';

[file1, file2].forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    const idx = content.indexOf('projects:[');
    if (idx !== -1) {
      console.log(`Found projects in ${file}:`);
      console.log(content.substring(idx, idx + 500));
    } else {
      console.log(`No projects array found in ${file}`);
    }
  } else {
    console.log(`File not found: ${file}`);
  }
});

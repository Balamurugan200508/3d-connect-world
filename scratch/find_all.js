const fs = require('fs');
const path = require('path');

function searchDir(dir) {
  if (!fs.existsSync(dir)) return;
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    if (fs.statSync(fullPath).isDirectory()) {
      if (item !== 'node_modules' && item !== '.next') {
        searchDir(fullPath);
      }
    } else if (item.endsWith('.js') || item.endsWith('.tsx') || item.endsWith('.FullName')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('World Begins')) {
        console.log(`Found "World Begins" in: ${fullPath}`);
      }
      if (content.includes('Web Engineer')) {
        console.log(`Found "Web Engineer" in: ${fullPath}`);
      }
    }
  }
}

searchDir('c:/entraiot-production-final');

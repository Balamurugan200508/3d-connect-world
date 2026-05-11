const fs = require('fs');

const files = [
  'c:/entraiot-production-final/entraiot-unified/stage1/assets/Portfolio-CFTaDZT1.js',
  'c:/entraiot-production-final/entraiot-unified/stage2/public/assets/Portfolio-CFTaDZT1.js',
  'c:/entraiot-production-final/repo_check/stage1/assets/Portfolio-CFTaDZT1.js',
  'c:/entraiot-production-final/repo_check/stage2/public/assets/Portfolio-CFTaDZT1.js'
];

const target = 'id:"sanrita",reference:"sanrita",title:"Department",desc:"Building robust architectures, engineering innovative solutions, and pushing the boundaries of modern technology.",role:"Technical Department",tech:"Engineering & R&D",url:"#"';
const replacement = 'id:"sanrita",reference:"sanrita",title:"Department",desc:"Building robust architectures, engineering innovative solutions, and pushing the boundaries of modern technology.",role:"Technical Department",tech:"Engineering & R&D",url:"#technical-login"';

files.forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f, 'utf8');
    if (c.includes(target)) {
      c = c.replace(target, replacement);
      fs.writeFileSync(f, c, 'utf8');
      console.log(`Replaced successfully in ${f}`);
    } else {
      console.log(`Target not found in ${f}`);
    }
  }
});

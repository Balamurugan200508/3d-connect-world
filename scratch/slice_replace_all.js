const fs = require('fs');

const files = [
  'c:/entraiot-production-final/repo_check/stage1/assets/Portfolio-CFTaDZT1.js',
  'c:/entraiot-production-final/repo_check/stage2/public/assets/Portfolio-CFTaDZT1.js'
];

files.forEach(f1 => {
  if (!fs.existsSync(f1)) {
    console.log(`File ${f1} does not exist`);
    return;
  }
  let c1 = fs.readFileSync(f1, 'utf8');
  const idx = c1.indexOf('projects:[');
  const endIdx = c1.indexOf('}]', idx);
  if (idx !== -1 && endIdx !== -1) {
    const replacement = 'projects:[{id:"corian-exterior",reference:"corian-exterior",title:"Department",desc:"Strategizing for the future, optimizing processes, and leading the way towards comprehensive digital transformation.",role:"Management Department",tech:"Core Strategy",url:"#"},{id:"dupont-airguard",reference:"dupont-airguard",title:"Department",logoScale:2.5,desc:"Crafting compelling narratives, engaging audiences, and driving growth through data-backed market intelligence.",role:"Marketing Department",tech:"Growth & Outreach",url:"#"},{id:"sanrita",reference:"sanrita",title:"Department",desc:"Building robust architectures, engineering innovative solutions, and pushing the boundaries of modern technology.",role:"Technical Department",tech:"Engineering & R&D",url:"#"},{id:"pixila",reference:"pixila",title:"Department",desc:"Ensuring sustainable growth, managing resources efficiently, and securing long-term economic stability.",role:"Financial Department",tech:"Operations & Finance",url:"#"},{id:"railight",reference:"railight",title:"Portal",desc:"Streamlined communication, dedicated support, and seamless project tracking for our valued partners.",role:"Client Handling Portal",tech:"Support & Success",url:"#"}]';

    c1 = c1.substring(0, idx) + replacement + c1.substring(endIdx + 2);
    fs.writeFileSync(f1, c1, 'utf8');
    console.log(`File ${f1} replaced successfully!`);
  } else {
    console.log(`Target slice not found in file ${f1}`);
  }
});

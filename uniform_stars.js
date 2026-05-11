const fs = require('fs');
const file = 'stage1/assets/Skills-xnsGoM8-.js';
let content = fs.readFileSync(file, 'utf8');

// We need to replace the entire array initialization.
// We will look for h=r.useRef([{key:"star-1" ... hit:!1}])
// Since we previously modified it, it contains 10 items now.

const startX = -9.758477446274412;
const startZ = -26.65999152759884;
const endX = 17.741522553725588;
const endZ = 27.34000847240116;

const texts = [
  "IT Services",
  "Animation Website",
  "AI Automation",
  "IoT Service",
  "Real-Time Monitoring Dashboard",
  "AI-Based Predictive Maintenance",
  "Industrial Automation",
  "Cloud Integration & Data Management",
  "Asset Tracking & Smart Logistics",
  "Smart Energy & Resource Management"
];

let newArrayStr = "[";
for (let i = 0; i < 10; i++) {
  const fraction = i / 9;
  const x = startX + fraction * (endX - startX);
  const z = startZ + fraction * (endZ - startZ);
  
  newArrayStr += `{key:"star-${i+1}",html:"${texts[i]}",position:[${x},0,${z}],hit:!1}`;
  if (i < 9) newArrayStr += ",";
}
newArrayStr += "]";

// Let's use regex to replace the array inside h=r.useRef(...)
content = content.replace(/h=r\.useRef\(\[.*?\]\)/, `h=r.useRef(${newArrayStr})`);

fs.writeFileSync(file, content);
console.log('Array replaced successfully.');

const fs = require('fs');
const file = 'stage1/assets/Skills-xnsGoM8-.js';
let content = fs.readFileSync(file, 'utf8');

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

const points = [
  [-9.758477446274412, -26.65999152759884],  // 1 (Original 1)
  [-7.508477446274412, -18.40999152759884],  // 2 (Mid 1-2)
  [-5.258477446274412, -10.159991527598843], // 3 (Original 2)
  [-3.508477446274412, -2.909991527598842],  // 4 (Mid 2-3)
  [-1.7584774462744122, 4.340008472401157],  // 5 (Original 3)
  [1.241522553725588, 12.090008472401158],   // 6 (Mid 3-4)
  [4.241522553725588, 19.84000847240116],    // 7 (Original 4)
  [10.991522553725588, 23.59000847240116],   // 8 (Mid 4-5)
  [17.741522553725588, 27.34000847240116],   // 9 (Original 5)
  [24.491522553725588, 31.09000847240116]    // 10 (Extrapolated)
];

let newArrayStr = "[";
for (let i = 0; i < 10; i++) {
  newArrayStr += `{key:"star-${i+1}",html:"${texts[i]}",position:[${points[i][0]},0,${points[i][1]}],hit:!1}`;
  if (i < 9) newArrayStr += ",";
}
newArrayStr += "]";

content = content.replace(/h=r\.useRef\(\[.*?\]\)/, `h=r.useRef(${newArrayStr})`);

fs.writeFileSync(file, content);
console.log('Array replaced successfully.');

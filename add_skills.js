const fs = require('fs');
const file = 'stage1/assets/Skills-xnsGoM8-.js';
let content = fs.readFileSync(file, 'utf8');

const newItems = `,{key:"star-6",html:"AI-Based Predictive Maintenance",position:[31.241522553725588,0,34.84000847240116],hit:!1},{key:"star-7",html:"Industrial Automation",position:[44.741522553725588,0,42.34000847240116],hit:!1},{key:"star-8",html:"Cloud Integration & Data Management",position:[58.241522553725588,0,49.84000847240116],hit:!1},{key:"star-9",html:"Asset Tracking & Smart Logistics",position:[71.741522553725588,0,57.34000847240116],hit:!1},{key:"star-10",html:"Smart Energy & Resource Management",position:[85.241522553725588,0,64.84000847240116],hit:!1}`;

content = content.replace('27.34000847240116],hit:!1}', '27.34000847240116],hit:!1}' + newItems);

fs.writeFileSync(file, content);
console.log('New skill stars added successfully.');

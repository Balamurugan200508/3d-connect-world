const fs = require('fs');
const file = 'stage1/assets/Skills-xnsGoM8-.js';
let content = fs.readFileSync(file, 'utf8');

// The array has 10 items. We want to replace the positions of star-6 to star-10 to be close to star-1 to star-5.
content = content.replace('position:[31.241522553725588,0,34.84000847240116]', 'position:[-7.758477446274412,0,-24.65999152759884]');
content = content.replace('position:[44.741522553725588,0,42.34000847240116]', 'position:[-3.258477446274412,0,-8.159991527598843]');
content = content.replace('position:[58.241522553725588,0,49.84000847240116]', 'position:[0.241522553725588,0,6.340008472401157]');
content = content.replace('position:[71.741522553725588,0,57.34000847240116]', 'position:[6.241522553725588,0,21.84000847240116]');
content = content.replace('position:[85.241522553725588,0,64.84000847240116]', 'position:[19.741522553725588,0,29.34000847240116]');

fs.writeFileSync(file, content);
console.log('Skill stars repositioned successfully.');

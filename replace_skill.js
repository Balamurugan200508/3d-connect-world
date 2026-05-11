const fs = require('fs');
const file = 'stage1/assets/Skills-xnsGoM8-.js';
let content = fs.readFileSync(file, 'utf8');
content = content.replace('["The","Skill"]', '["The","Entraiot"]');
fs.writeFileSync(file, content);
console.log('Skill replaced successfully.');

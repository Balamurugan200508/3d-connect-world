const fs = require('fs');
const file = 'stage1/assets/HtmlTitle-NylcntSk.js';
let content = fs.readFileSync(file, 'utf8');
content = content.replace('["creative","web","engineer"]', '["World","Begins"]');
fs.writeFileSync(file, content);
console.log('Title replaced successfully.');

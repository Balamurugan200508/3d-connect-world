const fs = require('fs');
const file = 'stage1/assets/Skills-xnsGoM8-.js';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('"Project Management - IT Services"', '"IT Services"');
content = content.replace('"Web Design - Animation Website"', '"Animation Website"');
content = content.replace('"UI/UX Process - AI Automation"', '"AI Automation"');
content = content.replace('"Front End development - IoT Service"', '"IoT Service"');
content = content.replace('"Back-End Development"', '"Real-Time Monitoring Dashboard"');
content = content.replace('"Back_end Development"', '"Real-Time Monitoring Dashboard"'); // fallback

fs.writeFileSync(file, content);
console.log('Skill texts updated successfully.');

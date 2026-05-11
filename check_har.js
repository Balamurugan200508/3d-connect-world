const fs = require('fs');
const path = require('path');

const harPath = path.join(__dirname, '..', 'localhost.har');
const harData = JSON.parse(fs.readFileSync(harPath, 'utf8'));

let targetEntries = [];

// Look for the specific JS file in the HAR entries
for (const entry of harData.log.entries) {
  if (entry.request.url.includes('index-Do2HjHOR.js')) {
    targetEntries.push(entry);
  }
}

for (const entry of targetEntries) {
  const content = entry.response.content;
  let text = content.text;
  if (content.encoding === 'base64') {
    text = Buffer.from(text, 'base64').toString('utf8');
  }
  console.log(`Found entry for ${entry.request.url} - Size: ${content.size} bytes - Text length: ${text ? Buffer.byteLength(text, 'utf8') : 0} bytes`);
}

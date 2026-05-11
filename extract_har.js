const fs = require('fs');
const path = require('path');

const harPath = path.join(__dirname, '..', 'localhost.har');
const harData = JSON.parse(fs.readFileSync(harPath, 'utf8'));

let targetEntry = null;

// Look for the specific JS file in the HAR entries
for (const entry of harData.log.entries) {
  if (entry.request.url.includes('index-Do2HjHOR.js')) {
    targetEntry = entry;
    break;
  }
}

if (!targetEntry) {
  console.error("Could not find index-Do2HjHOR.js in the HAR file.");
  process.exit(1);
}

const content = targetEntry.response.content;
let text = content.text;

if (!text) {
  console.error("The HAR file contains the request, but no response text was captured.");
  process.exit(1);
}

// If it's base64 encoded
if (content.encoding === 'base64') {
  text = Buffer.from(text, 'base64').toString('utf8');
}

const outPath = path.join(__dirname, 'stage1', 'assets', 'index-Do2HjHOR.js');

console.log(`Original file size: ${fs.existsSync(outPath) ? fs.statSync(outPath).size : 'missing'} bytes`);
console.log(`New file size to write: ${Buffer.byteLength(text, 'utf8')} bytes`);

fs.writeFileSync(outPath, text, 'utf8');

console.log("Successfully extracted and wrote index-Do2HjHOR.js to stage1/assets/");

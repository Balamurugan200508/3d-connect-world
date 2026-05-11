const https = require('https');
const fs = require('fs');

https.get('https://www.sebastien-lempens.com/assets/index-Do2HjHOR.js', (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Content-Length: ${res.headers['content-length']}`);
  
  if (res.statusCode === 200) {
    let data = '';
    let bytes = 0;
    res.on('data', chunk => {
      bytes += chunk.length;
    });
    res.on('end', () => {
      console.log(`Downloaded ${bytes} bytes`);
    });
  }
}).on('error', (e) => {
  console.error(e);
});

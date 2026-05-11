const http = require('http');
const fs = require('fs');

http.get('http://localhost:3000/portfolio/assets/index-Do2HjHOR.js', (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Content-Length: ${res.headers['content-length']}`);
  console.log(`Content-Type: ${res.headers['content-type']}`);
  console.log(`Content-Encoding: ${res.headers['content-encoding']}`);
  
  let data = '';
  res.on('data', chunk => {
    data += chunk.toString('utf8');
  });
  res.on('end', () => {
    console.log(`Received length: ${data.length}`);
    fs.writeFileSync('downloaded.js', data);
  });
}).on('error', (e) => {
  console.error(e);
});

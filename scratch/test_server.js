const http = require('http');

http.get('http://127.0.0.1:3000/portfolio/assets/CountryFrance-BVz2pCNL.js', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (data.includes('To become a global leader')) {
      console.log('SUCCESS: The server is serving the NEW content.');
    } else {
      console.log('FAILURE: The server is serving old content.');
    }
  });
});

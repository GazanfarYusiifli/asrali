const https = require('https');

// A known weekend date or invalid date
const url = 'https://cbar.az/currencies/21.06.2026.xml'; 

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(res.statusCode);
    console.log(data.substring(0, 500));
  });
});

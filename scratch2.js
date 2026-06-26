const https = require('https');

const url = 'https://cbar.az/currencies/26.06.2026.xml'; // Using a recent date

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(data.substring(0, 1000));
  });
});

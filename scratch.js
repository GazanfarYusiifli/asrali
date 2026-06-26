const https = require('https');

const today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0');
const yyyy = today.getFullYear();
const url = `https://cbar.az/currencies/${dd}.${mm}.${yyyy}.xml`;

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    if (res.statusCode !== 200) {
      console.log('Failed to fetch:', res.statusCode);
      return;
    }
    
    const valutes = [];
    const valuteRegex = /<Valute Code="([^"]+)">[\s\S]*?<Nominal>([^<]+)<\/Nominal>[\s\S]*?<Name>([^<]+)<\/Name>[\s\S]*?<Value>([^<]+)<\/Value>/g;
    
    let match;
    while ((match = valuteRegex.exec(data)) !== null) {
      valutes.push({
        code: match[1],
        nominal: match[2],
        name: match[3],
        value: parseFloat(match[4])
      });
    }
    
    console.log(valutes.slice(0, 5));
  });
}).on('error', err => console.error(err));

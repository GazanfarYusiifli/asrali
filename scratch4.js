const https = require('https');

function fetchCbar(dateObj) {
  const dd = String(dateObj.getDate()).padStart(2, '0');
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const yyyy = dateObj.getFullYear();
  const url = `https://cbar.az/currencies/${dd}.${mm}.${yyyy}.xml`;

  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function parseXml(xml) {
  const valutes = [];
  const valuteRegex = /<Valute Code="([^"]+)">[\s\S]*?<Nominal>([^<]+)<\/Nominal>[\s\S]*?<Name>([^<]+)<\/Name>[\s\S]*?<Value>([^<]+)<\/Value>/g;
  let match;
  while ((match = valuteRegex.exec(xml)) !== null) {
    valutes.push({
      code: match[1],
      nominal: match[2],
      name: match[3],
      value: parseFloat(match[4])
    });
  }
  return valutes;
}

async function run() {
  const today = new Date('2026-06-25');
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const [xmlToday, xmlYesterday] = await Promise.all([
    fetchCbar(today),
    fetchCbar(yesterday)
  ]);

  const ratesToday = parseXml(xmlToday);
  const ratesYesterday = parseXml(xmlYesterday);

  const finalRates = ratesToday.map(rt => {
    const ry = ratesYesterday.find(r => r.code === rt.code);
    let diff = 'eq';
    if (ry) {
      if (rt.value > ry.value) diff = 'up';
      else if (rt.value < ry.value) diff = 'down';
    }
    return { ...rt, diff };
  });

  console.log(finalRates.slice(0, 5));
}
run();

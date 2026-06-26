import React from 'react';
import CurrencyCalculator from './CurrencyCalculator';

export const revalidate = 3600; // Cache for 1 hour

async function getRates() {
  const today = new Date();
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const yyyy = today.getFullYear();
  // CBAR format is DD.MM.YYYY
  const url = `https://cbar.az/currencies/${dd}.${mm}.${yyyy}.xml`;

  try {
    const response = await fetch(url, { next: { revalidate: 3600 } });
    if (!response.ok) {
      throw new Error('Failed to fetch from CBAR');
    }
    
    const xmlData = await response.text();
    
    const valutes = [];
    // Base AZN
    valutes.push({
      code: 'AZN',
      nominal: '1',
      name: 'Azərbaycan manatı',
      value: 1.0000
    });

    const valuteRegex = /<Valute Code="([^"]+)">[\s\S]*?<Nominal>([^<]+)<\/Nominal>[\s\S]*?<Name>([^<]+)<\/Name>[\s\S]*?<Value>([^<]+)<\/Value>/g;
    
    let match;
    while ((match = valuteRegex.exec(xmlData)) !== null) {
      valutes.push({
        code: match[1],
        nominal: match[2],
        name: match[3],
        value: parseFloat(match[4])
      });
    }

    return valutes;
  } catch (error) {
    console.error("CBAR fetch error:", error);
    // Fallback data just in case CBAR is down or CORS/fetch fails
    return [
      { code: 'AZN', nominal: '1', name: 'Azərbaycan manatı', value: 1.0000 },
      { code: 'USD', nominal: '1', name: '1 ABŞ dolları', value: 1.7000 },
      { code: 'EUR', nominal: '1', name: '1 Avro', value: 1.8500 },
      { code: 'TRY', nominal: '1', name: '1 Türk lirəsi', value: 0.0520 },
      { code: 'RUB', nominal: '1', name: '1 Rusiya rublu', value: 0.0190 },
      { code: 'GBP', nominal: '1', name: '1 İngilis funt sterlinqi', value: 2.1500 }
    ];
  }
}

export default async function ValyutaPage() {
  const rates = await getRates();

  return (
    <div className="w-full">
      <CurrencyCalculator rates={rates} />
    </div>
  );
}

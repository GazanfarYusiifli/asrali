import React from 'react';
import CurrencyCalculator from './CurrencyCalculator';

export const revalidate = 0; // Dynamic because of searchParams

async function getRates(dateStr?: string) {
  let targetDate = new Date();
  if (dateStr) {
    const parsedDate = new Date(dateStr);
    if (!isNaN(parsedDate.getTime())) {
      targetDate = parsedDate;
    }
  }

  const prevDate = new Date(targetDate);
  prevDate.setDate(targetDate.getDate() - 1);

  const fetchCbar = async (d: Date) => {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    const url = `https://cbar.az/currencies/${dd}.${mm}.${yyyy}.xml`;
    try {
      const res = await fetch(url, { cache: 'no-store' });
      if (!res.ok) return '';
      return await res.text();
    } catch {
      return '';
    }
  };

  const parseXml = (xml: string) => {
    const valutes = [];
    valutes.push({
      code: 'AZN',
      nominal: '1',
      name: 'Azərbaycan manatı',
      value: 1.0000
    });
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
  };

  const [xmlTarget, xmlPrev] = await Promise.all([
    fetchCbar(targetDate),
    fetchCbar(prevDate)
  ]);

  const ratesTarget = parseXml(xmlTarget);
  const ratesPrev = parseXml(xmlPrev);

  const finalRates = ratesTarget.map(rt => {
    const ry = ratesPrev.find(r => r.code === rt.code);
    let diff = 'eq';
    if (ry) {
      if (rt.value > ry.value) diff = 'up';
      else if (rt.value < ry.value) diff = 'down';
    }
    return { ...rt, diff };
  });

  if (finalRates.length <= 1) {
    return [
      { code: 'AZN', nominal: '1', name: 'Azərbaycan manatı', value: 1.0000, diff: 'eq' },
      { code: 'USD', nominal: '1', name: '1 ABŞ dolları', value: 1.7000, diff: 'eq' },
      { code: 'EUR', nominal: '1', name: '1 Avro', value: 1.8500, diff: 'eq' },
      { code: 'TRY', nominal: '1', name: '1 Türk lirəsi', value: 0.0520, diff: 'eq' },
      { code: 'RUB', nominal: '1', name: '1 Rusiya rublu', value: 0.0190, diff: 'eq' },
      { code: 'GBP', nominal: '1', name: '1 İngilis funt sterlinqi', value: 2.1500, diff: 'eq' }
    ];
  }

  return finalRates;
}

export default async function ValyutaPage(props: any) {
  // Safe extraction of searchParams for both Next.js 14 and 15
  const searchParams = await Promise.resolve(props.searchParams || {});
  const dateParam = typeof searchParams.date === 'string' ? searchParams.date : undefined;
  const rates = await getRates(dateParam);
  
  // Format today as YYYY-MM-DD for default
  let defaultDateStr = dateParam;
  if (!defaultDateStr) {
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, '0');
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const yyyy = today.getFullYear();
      defaultDateStr = `${yyyy}-${mm}-${dd}`;
  }

  return (
    <div className="w-full">
      <CurrencyCalculator rates={rates} defaultDate={defaultDateStr} />
    </div>
  );
}

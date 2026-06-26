'use client';

import React, { useState, useMemo } from 'react';
import { ArrowRightLeft, Calculator, TrendingUp } from 'lucide-react';

type Valute = {
  code: string;
  nominal: string;
  name: string;
  value: number;
};

export default function CurrencyCalculator({ rates }: { rates: Valute[] }) {
  const [amount, setAmount] = useState<string>('100');
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('AZN');

  // Find the selected currencies
  const fromRate = rates.find(r => r.code === fromCurrency) || rates[0];
  const toRate = rates.find(r => r.code === toCurrency) || rates[0];

  // The formula for conversion: (Amount * From_Value / From_Nominal) / (To_Value / To_Nominal)
  const convertedAmount = useMemo(() => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) return '0.00';

    const fromVal = fromRate.value / parseFloat(fromRate.nominal.replace(/[^\d.-]/g, '') || '1');
    const toVal = toRate.value / parseFloat(toRate.nominal.replace(/[^\d.-]/g, '') || '1');

    const result = (parsedAmount * fromVal) / toVal;
    return result.toFixed(4);
  }, [amount, fromCurrency, toCurrency, fromRate, toRate]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Calculator className="text-sky-500" />
            Valyuta Kalkulyatoru
          </h1>
          <p className="text-slate-500 text-sm mt-1">Azərbaycan Respublikası Mərkəzi Bankının (ARMB) rəsmi məzənnələrinə əsasən</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calculator Widget */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <div className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-slate-700 mb-2">Məbləğ</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-4 text-xl border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                placeholder="Məbləğ daxil edin"
              />
            </div>

            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-slate-700 mb-2">Bu valyutadan</label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full p-4 text-lg border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all bg-white"
              >
                {rates.map((rate) => (
                  <option key={`from-${rate.code}`} value={rate.code}>
                    {rate.code} - {rate.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center mb-2">
              <button
                onClick={handleSwap}
                className="p-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-all"
                title="Dəyiş"
              >
                <ArrowRightLeft size={24} />
              </button>
            </div>

            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-slate-700 mb-2">Bu valyutaya</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full p-4 text-lg border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all bg-white"
              >
                {rates.map((rate) => (
                  <option key={`to-${rate.code}`} value={rate.code}>
                    {rate.code} - {rate.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8 p-6 bg-slate-50 border border-slate-100 rounded-xl flex flex-col items-center justify-center text-center">
            <span className="text-slate-500 font-medium mb-2">{amount} {fromCurrency} =</span>
            <span className="text-4xl md:text-5xl font-bold text-sky-600 tracking-tight">
              {convertedAmount} <span className="text-2xl text-slate-600">{toCurrency}</span>
            </span>
            <div className="mt-4 text-sm text-slate-400">
              1 {fromCurrency} = {(parseFloat(convertedAmount) / (parseFloat(amount) || 1)).toFixed(4)} {toCurrency}
            </div>
          </div>
        </div>

        {/* Popular Rates Sidebar */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
            <TrendingUp className="text-emerald-500" size={20} />
            Günlük Məzənnələr
          </h3>
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {rates.filter(r => ['USD', 'EUR', 'TRY', 'RUB', 'GBP', 'GEL'].includes(r.code)).map((rate) => (
              <div key={rate.code} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white shadow-sm border border-slate-100 rounded-full flex items-center justify-center font-bold text-slate-700">
                    {rate.code}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{rate.code}</div>
                    <div className="text-xs text-slate-500 line-clamp-1">{rate.name}</div>
                  </div>
                </div>
                <div className="font-bold text-sky-600">
                  {rate.value.toFixed(4)} ₼
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

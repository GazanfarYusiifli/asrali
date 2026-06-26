'use client';

import React, { useState, useMemo } from 'react';
import { ArrowRightLeft, Calculator, TrendingUp, DollarSign, Coins } from 'lucide-react';

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

  // The formula for conversion
  const convertedAmount = useMemo(() => {
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) return '0.00';

    const fromVal = fromRate.value / parseFloat(fromRate.nominal.replace(/[^\d.-]/g, '') || '1');
    const toVal = toRate.value / parseFloat(toRate.nominal.replace(/[^\d.-]/g, '') || '1');

    const result = (parsedAmount * fromVal) / toVal;
    return result.toFixed(2);
  }, [amount, fromCurrency, toCurrency, fromRate, toRate]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Calculator className="text-white" size={24} />
          </div>
          Valyuta Kalkulyatoru
        </h1>
        <p className="text-slate-500 mt-2 font-medium">Azərbaycan Respublikası Mərkəzi Bankının (ARMB) rəsmi məzənnələri əsasında canlı hesablanma</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Main Calculator */}
        <div className="xl:col-span-2 flex flex-col gap-8">
          <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 relative overflow-hidden">
            {/* Decorative background blur */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-sky-200/30 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="flex flex-col md:flex-row gap-6 items-center z-10">
              
              {/* Amount Input */}
              <div className="flex-1 w-full relative group">
                <label className="block text-sm font-semibold text-slate-600 mb-3 ml-1 uppercase tracking-wider">Məbləğ</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 text-2xl font-bold text-slate-800 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-0 focus:border-sky-500 focus:bg-white outline-none transition-all shadow-inner"
                    placeholder="0.00"
                  />
                </div>
              </div>

              {/* From Currency */}
              <div className="flex-1 w-full">
                <label className="block text-sm font-semibold text-slate-600 mb-3 ml-1 uppercase tracking-wider">Bu valyutadan</label>
                <div className="relative">
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="w-full px-4 py-4 text-lg font-bold text-slate-700 bg-slate-50 border-2 border-slate-100 rounded-2xl appearance-none focus:ring-0 focus:border-sky-500 focus:bg-white outline-none transition-all cursor-pointer shadow-inner"
                  >
                    {rates.map((rate) => (
                      <option key={`from-${rate.code}`} value={rate.code}>
                        {rate.code} - {rate.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex items-center justify-center pt-8">
                <button
                  onClick={handleSwap}
                  className="w-14 h-14 bg-slate-800 hover:bg-sky-500 text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-lg shadow-slate-800/20 hover:shadow-sky-500/40 hover:-translate-y-1 hover:rotate-180 active:scale-95"
                  title="Dəyiş"
                >
                  <ArrowRightLeft size={20} />
                </button>
              </div>

              {/* To Currency */}
              <div className="flex-1 w-full">
                <label className="block text-sm font-semibold text-slate-600 mb-3 ml-1 uppercase tracking-wider">Bu valyutaya</label>
                <div className="relative">
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="w-full px-4 py-4 text-lg font-bold text-slate-700 bg-slate-50 border-2 border-slate-100 rounded-2xl appearance-none focus:ring-0 focus:border-sky-500 focus:bg-white outline-none transition-all cursor-pointer shadow-inner"
                  >
                    {rates.map((rate) => (
                      <option key={`to-${rate.code}`} value={rate.code}>
                        {rate.code} - {rate.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Result Card */}
          <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900 rounded-[2rem] p-8 text-white shadow-2xl overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 opacity-10">
              <Coins size={250} />
            </div>
            
            <div className="relative z-10">
              <p className="text-sky-300 font-medium text-lg mb-2 opacity-90">{amount} {fromCurrency} bərabərdir</p>
              <div className="flex items-baseline gap-4 flex-wrap">
                <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight">
                  {convertedAmount}
                </h2>
                <span className="text-3xl md:text-4xl font-bold text-sky-400">{toCurrency}</span>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="bg-white/10 backdrop-blur-md rounded-xl px-5 py-3 font-mono text-sm tracking-wide">
                  1 {fromCurrency} = {(parseFloat(convertedAmount) / (parseFloat(amount) || 1)).toFixed(4)} {toCurrency}
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-xl px-5 py-3 font-mono text-sm tracking-wide">
                  1 {toCurrency} = {((parseFloat(amount) || 1) / parseFloat(convertedAmount)).toFixed(4)} {fromCurrency}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Rates Sidebar */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 p-8 flex flex-col max-h-[600px]">
          <h3 className="font-extrabold text-xl text-slate-800 flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600">
              <TrendingUp size={20} />
            </div>
            Günlük Məzənnələr
          </h3>
          
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
            {rates.filter(r => ['USD', 'EUR', 'TRY', 'RUB', 'GBP', 'GEL'].includes(r.code)).map((rate) => {
               // Normalizing the nominal value (e.g. "100 Rusiya rublu" -> 100)
               const nominalVal = parseFloat(rate.nominal.replace(/[^\d.-]/g, '') || '1');
               const oneUnitValue = rate.value / nominalVal;

               return (
                <div key={rate.code} className="group flex items-center justify-between p-4 bg-slate-50 hover:bg-sky-50 rounded-2xl transition-all duration-300 border border-transparent hover:border-sky-100 cursor-default">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white shadow-sm border border-slate-100 rounded-xl flex items-center justify-center font-bold text-slate-700 text-lg group-hover:text-sky-600 group-hover:scale-110 transition-all duration-300">
                      {rate.code}
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 group-hover:text-sky-900 transition-colors">{rate.code}</div>
                      <div className="text-xs text-slate-500 font-medium truncate max-w-[120px]">{rate.name.replace(/^\d+\s+/, '')}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-lg text-slate-800 group-hover:text-sky-600 transition-colors">
                      {oneUnitValue.toFixed(4)}
                    </div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      AZN
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

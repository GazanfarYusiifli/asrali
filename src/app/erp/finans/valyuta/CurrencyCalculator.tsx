'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRightLeft, Calculator, TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react';

type Valute = {
  code: string;
  nominal: string;
  name: string;
  value: number;
  diff?: 'up' | 'down' | 'eq';
};

export default function CurrencyCalculator({ rates, defaultDate }: { rates: Valute[], defaultDate: string }) {
  const router = useRouter();
  const [amount, setAmount] = useState<string>('1');
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
    return result.toFixed(4);
  }, [amount, fromCurrency, toCurrency, fromRate, toRate]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value;
    router.push(`?date=${newDate}`);
  };

  const renderDiffIcon = (diff: string | undefined) => {
    if (diff === 'up') return <TrendingUp color="#10b981" size={16} title="Qalxıb" />;
    if (diff === 'down') return <TrendingDown color="#ef4444" size={16} title="Düşüb" />;
    return <Minus color="#94a3b8" size={16} title="Dəyişməyib" />;
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
            <div style={{ backgroundColor: '#0ea5e9', padding: '0.5rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calculator color="white" size={24} />
            </div>
            Valyuta Kalkulyatoru
          </h1>
          <p style={{ color: '#64748b', marginTop: '0.5rem', fontSize: '1rem' }}>
            Azərbaycan Respublikası Mərkəzi Bankının (ARMB) rəsmi məzənnələri
          </p>
        </div>

        {/* Date Picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#ffffff', padding: '0.5rem 1rem', borderRadius: '1rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <Calendar color="#64748b" size={20} />
          <input 
            type="date" 
            value={defaultDate}
            onChange={handleDateChange}
            style={{ border: 'none', outline: 'none', fontSize: '1rem', fontWeight: '600', color: '#334155', cursor: 'pointer', backgroundColor: 'transparent' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Calculator Section */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '1.5rem', 
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)', 
          border: '1px solid #e2e8f0',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem'
        }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Məbləğ</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{
                width: '100%', padding: '1rem 1.25rem', fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a',
                backgroundColor: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '1rem',
                outline: 'none', transition: 'border-color 0.2s', boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#0ea5e9'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 120px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bu valyutadan</label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                style={{
                  width: '100%', padding: '1rem', fontSize: '1.125rem', fontWeight: 'bold', color: '#334155',
                  backgroundColor: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '1rem',
                  outline: 'none', appearance: 'none', cursor: 'pointer', boxSizing: 'border-box'
                }}
              >
                {rates.map((rate) => (
                  <option key={`from-${rate.code}`} value={rate.code}>{rate.code} - {rate.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSwap}
              style={{
                padding: '1rem', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '1rem',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'transform 0.2s, background-color 0.2s', alignSelf: 'flex-end', marginBottom: '2px'
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0ea5e9'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#0f172a'}
            >
              <ArrowRightLeft size={24} />
            </button>

            <div style={{ flex: '1 1 120px' }}>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#475569', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Bu valyutaya</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                style={{
                  width: '100%', padding: '1rem', fontSize: '1.125rem', fontWeight: 'bold', color: '#334155',
                  backgroundColor: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: '1rem',
                  outline: 'none', appearance: 'none', cursor: 'pointer', boxSizing: 'border-box'
                }}
              >
                {rates.map((rate) => (
                  <option key={`to-${rate.code}`} value={rate.code}>{rate.code} - {rate.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{
            marginTop: '1rem',
            padding: '2rem',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            borderRadius: '1.25rem',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <p style={{ color: '#94a3b8', fontSize: '1.125rem', marginBottom: '0.5rem', margin: 0 }}>
              {amount} {fromCurrency} =
            </p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '3.5rem', fontWeight: '800', lineHeight: '1', color: '#38bdf8', wordBreak: 'break-all' }}>{convertedAmount}</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#cbd5e1' }}>{toCurrency}</span>
            </div>
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', fontSize: '0.875rem', color: '#94a3b8', display: 'flex', gap: '1rem' }}>
              <span>1 {fromCurrency} = {(parseFloat(convertedAmount) / (parseFloat(amount) || 1)).toFixed(4)} {toCurrency}</span>
            </div>
          </div>
        </div>

        {/* Full List Section */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '1.5rem', 
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05)', 
          border: '1px solid #e2e8f0',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 1.5rem 0' }}>
            <TrendingUp color="#10b981" size={24} />
            AZN məzənnələrinin tam siyahısı
          </h3>

          <div style={{ flex: 1, overflowY: 'auto', maxHeight: '500px', paddingRight: '0.5rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr>
                  <th style={{ padding: '1rem 0.5rem', borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.875rem', fontWeight: '700' }}>Valyuta</th>
                  <th style={{ padding: '1rem 0.5rem', borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.875rem', fontWeight: '700' }}>Kod</th>
                  <th style={{ padding: '1rem 0.5rem', borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.875rem', fontWeight: '700', textAlign: 'right' }}>Kurs (AZN)</th>
                </tr>
              </thead>
              <tbody>
                {rates.map((rate, index) => {
                  if(rate.code === 'AZN') return null;
                  
                  const diffColor = rate.diff === 'up' ? '#10b981' : rate.diff === 'down' ? '#ef4444' : '#0f172a';
                  
                  return (
                    <tr key={index} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td style={{ padding: '1rem 0.5rem', color: '#334155', fontWeight: '600' }}>{rate.nominal} {rate.name}</td>
                      <td style={{ padding: '1rem 0.5rem' }}>
                        <span style={{ backgroundColor: '#e0f2fe', color: '#0284c7', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: '700' }}>{rate.code}</span>
                      </td>
                      <td style={{ padding: '1rem 0.5rem', textAlign: 'right', fontWeight: '800', color: diffColor, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        {rate.value.toFixed(4)}
                        {renderDiffIcon(rate.diff)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

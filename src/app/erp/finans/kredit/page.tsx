'use client';
import React, { useState } from 'react';
import { useI18n } from '../../../context/I18nContext';
import { Calculator, Wallet, Percent, Calendar, FileText } from 'lucide-react';

export default function CreditCalculatorPage() {
  const { t } = useI18n();
  
  const [amount, setAmount] = useState<number>(3000);
  const [downPayment, setDownPayment] = useState<number>(200);
  const [interest, setInterest] = useState<number>(12);
  const [months, setMonths] = useState<number>(12);

  // Results
  const [results, setResults] = useState<{
    principal: number;
    monthlyPayment: number;
    totalPayment: number;
    totalInterest: number;
    schedule: Array<{
      month: number;
      payment: number;
      principalPaid: number;
      interestPaid: number;
      balance: number;
    }>;
  } | null>(null);

  const calculateLoan = () => {
    const P = amount - downPayment;
    if (P <= 0 || interest <= 0 || months <= 0) {
      setResults(null);
      return;
    }

    const r = (interest / 100) / 12; // monthly interest rate
    const n = months;

    // Annuity formula
    const monthlyPayment = P * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = monthlyPayment * n;
    const totalInterest = totalPayment - P;

    const schedule = [];
    let balance = P;

    for (let i = 1; i <= n; i++) {
      const interestPaid = balance * r;
      const principalPaid = monthlyPayment - interestPaid;
      balance -= principalPaid;
      
      schedule.push({
        month: i,
        payment: monthlyPayment,
        principalPaid: principalPaid,
        interestPaid: interestPaid,
        balance: Math.max(0, balance)
      });
    }

    setResults({
      principal: P,
      monthlyPayment,
      totalPayment,
      totalInterest,
      schedule
    });
  };

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Calculator size={28} color="#3b82f6" />
          {t('calc_title')}
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>
          {t('calc_desc')}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem', alignItems: 'start' }}>
        
        {/* Input Form */}
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.7)', 
          backdropFilter: 'blur(10px)', 
          borderRadius: '16px', 
          padding: '1.5rem', 
          border: '1px solid rgba(255,255,255,0.8)',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
                <Wallet size={16} /> {t('calc_loan_amount')}
              </label>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(Number(e.target.value))}
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', fontWeight: 600, color: '#1e293b', transition: 'all 0.2s', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                onBlur={e => e.target.style.borderColor = '#cbd5e1'}
              />
            </div>
            
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
                <Wallet size={16} /> {t('calc_down_payment')}
              </label>
              <input 
                type="number" 
                value={downPayment} 
                onChange={(e) => setDownPayment(Number(e.target.value))}
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', fontWeight: 600, color: '#1e293b', transition: 'all 0.2s', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                onBlur={e => e.target.style.borderColor = '#cbd5e1'}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
                <Percent size={16} /> {t('calc_interest')}
              </label>
              <input 
                type="number" 
                value={interest} 
                onChange={(e) => setInterest(Number(e.target.value))}
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', fontWeight: 600, color: '#1e293b', transition: 'all 0.2s', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                onBlur={e => e.target.style.borderColor = '#cbd5e1'}
              />
            </div>

            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.5rem' }}>
                <Calendar size={16} /> {t('calc_months')}
              </label>
              <input 
                type="number" 
                value={months} 
                onChange={(e) => setMonths(Number(e.target.value))}
                style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', fontWeight: 600, color: '#1e293b', transition: 'all 0.2s', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#3b82f6'}
                onBlur={e => e.target.style.borderColor = '#cbd5e1'}
              />
            </div>

            <button 
              onClick={calculateLoan}
              style={{
                width: '100%',
                padding: '0.85rem',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                border: 'none',
                fontSize: '1rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 6px -1px rgba(59,130,246,0.3)',
                transition: 'all 0.2s ease',
                marginTop: '0.5rem'
              }}
              onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {t('calc_btn')}
            </button>
          </div>
        </div>

        {/* Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {results ? (
            <>
              {/* Summary Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem' }}>{t('calc_principal')}</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>{results.principal.toLocaleString('az-AZ', { maximumFractionDigits: 2 })} ₼</div>
                </div>
                <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem' }}>{t('calc_monthly_payment')}</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#3b82f6' }}>{results.monthlyPayment.toLocaleString('az-AZ', { maximumFractionDigits: 2 })} ₼</div>
                </div>
                <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem' }}>{t('calc_total_interest')}</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b' }}>{results.totalInterest.toLocaleString('az-AZ', { maximumFractionDigits: 2 })} ₼</div>
                </div>
                <div style={{ background: 'white', borderRadius: '12px', padding: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', marginBottom: '0.5rem' }}>{t('calc_total_payment')}</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981' }}>{results.totalPayment.toLocaleString('az-AZ', { maximumFractionDigits: 2 })} ₼</div>
                </div>
              </div>

              {/* Schedule Table */}
              <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={18} color="#64748b" />
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>{t('calc_schedule')}</h3>
                </div>
                <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '0' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ position: 'sticky', top: 0, background: 'white', zIndex: 10 }}>
                      <tr style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, borderBottom: '2px solid #e2e8f0' }}>
                        <th style={{ padding: '1rem 1.5rem' }}>{t('calc_month')}</th>
                        <th style={{ padding: '1rem 1.5rem' }}>{t('calc_payment')}</th>
                        <th style={{ padding: '1rem 1.5rem' }}>{t('calc_principal_paid')}</th>
                        <th style={{ padding: '1rem 1.5rem' }}>{t('calc_interest_paid')}</th>
                        <th style={{ padding: '1rem 1.5rem' }}>{t('calc_balance')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.schedule.map((row) => (
                        <tr key={row.month} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>{row.month}</td>
                          <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: '#1e293b' }}>{row.payment.toLocaleString('az-AZ', { maximumFractionDigits: 2 })} ₼</td>
                          <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: '#10b981' }}>{row.principalPaid.toLocaleString('az-AZ', { maximumFractionDigits: 2 })} ₼</td>
                          <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: '#f59e0b' }}>{row.interestPaid.toLocaleString('az-AZ', { maximumFractionDigits: 2 })} ₼</td>
                          <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>{row.balance.toLocaleString('az-AZ', { maximumFractionDigits: 2 })} ₼</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.5)', 
              borderRadius: '16px', 
              border: '2px dashed #cbd5e1', 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '300px',
              color: '#94a3b8'
            }}>
              <Calculator size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p style={{ fontSize: '1rem', fontWeight: 500 }}>Nəticələri görmək üçün məlumatları daxil edib <b>{t('calc_btn')}</b> düyməsinə klikləyin.</p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

'use client'
import React, { useState, useEffect } from 'react';
import { getPostings, getBalanceActive, getBalancePassive, getTurnover } from '../../utils/accounting';

export default function BalanceSheetPage() {
  const [metrics, setMetrics] = useState({
    assets: { cash: 0, bank: 0, inventory: 0, receivables: 0, total: 0 },
    liabilities: { payables: 0, total: 0 },
    equity: { retainedEarnings: 0, total: 0 }
  });

  useEffect(() => {
    const postings = getPostings();
    
    // AKTİVLƏR (Assets)
    const cash = getBalanceActive(postings, '221');
    const bank = getBalanceActive(postings, '223');
    const inventory = getBalanceActive(postings, '201') + getBalanceActive(postings, '205');
    const receivables = getBalanceActive(postings, '211');
    const totalAssets = cash + bank + inventory + receivables;

    // PASSİVLƏR (Liabilities)
    const payables = getBalancePassive(postings, '531');
    const totalLiabilities = payables;

    // KAPİTAL VƏ MƏNFƏƏT (Equity)
    const totalIncome = getTurnover(postings, '60', 'ct') + getTurnover(postings, '61', 'ct');
    const totalExpense = getTurnover(postings, '70', 'dt') + getTurnover(postings, '71', 'dt');
    const retainedEarnings = totalIncome - totalExpense; // Bölüşdürülməmiş mənfəət
    const totalEquity = retainedEarnings; // (Əslində nizamnamə kapitalı da olmalıdır)

    setMetrics({
      assets: { cash, bank, inventory, receivables, total: totalAssets },
      liabilities: { payables, total: totalLiabilities },
      equity: { retainedEarnings, total: totalEquity }
    });
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-color)', marginBottom: '0.5rem' }}>Mühasibat Balansı (Forma №1)</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Müəssisənin aktivləri, öhdəlikləri və kapitalı haqqında yekun hesabat.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* AKTİVLƏR */}
        <div style={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ backgroundColor: 'var(--bg-color)', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', fontWeight: 700, fontSize: '1.2rem', color: '#3b82f6' }}>
            AKTİVLƏR (Assets)
          </div>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px dashed var(--border-color)' }}>
              <span>201 - Material ehtiyatları (Anbar)</span>
              <strong>{metrics.assets.inventory.toLocaleString('az-AZ')} ₼</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px dashed var(--border-color)' }}>
              <span>211 - Debitor borclar (Alacaqlar)</span>
              <strong>{metrics.assets.receivables.toLocaleString('az-AZ')} ₼</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px dashed var(--border-color)' }}>
              <span>221 - Kassa (Nağd)</span>
              <strong>{metrics.assets.cash.toLocaleString('az-AZ')} ₼</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px dashed var(--border-color)' }}>
              <span>223 - Bank hesabları (Nağdsız)</span>
              <strong>{metrics.assets.bank.toLocaleString('az-AZ')} ₼</strong>
            </div>
          </div>
          <div style={{ backgroundColor: 'rgba(59,130,246,0.1)', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.2rem', color: '#1e40af' }}>
            <span>CƏMİ AKTİVLƏR</span>
            <span>{metrics.assets.total.toLocaleString('az-AZ')} ₼</span>
          </div>
        </div>

        {/* PASSİVLƏR VƏ KAPİTAL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ backgroundColor: 'var(--bg-color)', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', fontWeight: 700, fontSize: '1.2rem', color: '#f59e0b' }}>
              ÖHDƏLİKLƏR (Liabilities)
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px dashed var(--border-color)' }}>
                <span>531 - Kreditor borclar (Malsatanlar)</span>
                <strong>{metrics.liabilities.payables.toLocaleString('az-AZ')} ₼</strong>
              </div>
            </div>
            <div style={{ backgroundColor: 'rgba(245,158,11,0.1)', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', color: '#b45309' }}>
              <span>CƏMİ ÖHDƏLİKLƏR</span>
              <span>{metrics.liabilities.total.toLocaleString('az-AZ')} ₼</span>
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden' }}>
            <div style={{ backgroundColor: 'var(--bg-color)', padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', fontWeight: 700, fontSize: '1.2rem', color: '#8b5cf6' }}>
              KAPİTAL (Equity)
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '1px dashed var(--border-color)' }}>
                <span>801 - Bölüşdürülməmiş Mənfəət</span>
                <strong>{metrics.equity.retainedEarnings.toLocaleString('az-AZ')} ₼</strong>
              </div>
            </div>
            <div style={{ backgroundColor: 'rgba(139,92,246,0.1)', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', color: '#5b21b6' }}>
              <span>CƏMİ KAPİTAL</span>
              <span>{metrics.equity.total.toLocaleString('az-AZ')} ₼</span>
            </div>
          </div>

          {/* PASSIVLER CEMI */}
          <div style={{ backgroundColor: 'rgba(16,185,129,0.1)', border: '1px solid #10b981', borderRadius: '16px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.2rem', color: '#047857' }}>
            <span>CƏMİ PASSİVLƏR (Öhdəlik + Kapital)</span>
            <span>{(metrics.liabilities.total + metrics.equity.total).toLocaleString('az-AZ')} ₼</span>
          </div>

        </div>
      </div>
      
      {/* Balans Check */}
      <div style={{ marginTop: '2rem', textAlign: 'center', fontWeight: 700, color: metrics.assets.total === (metrics.liabilities.total + metrics.equity.total) ? '#10b981' : '#ef4444' }}>
        {metrics.assets.total === (metrics.liabilities.total + metrics.equity.total) 
          ? '✅ Balans Bərabərdir (Aktivlər = Passivlər + Kapital)' 
          : '❌ Balans Bərabər Deyil (Mühasibat xətası var)'}
      </div>
    </div>
  );
}

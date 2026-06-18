'use client'
import React, { useState, useEffect } from 'react';
import { PieChart, TrendingUp, Wallet, HandCoins } from 'lucide-react';
import { getPostings, getTurnover, getBalanceActive, getBalancePassive } from '../../utils/accounting';

export default function GeneralOverviewPage() {
  const [metrics, setMetrics] = useState({
    income: 0, expense: 0, profit: 0,
    assets: 0, liabilities: 0, equity: 0
  });

  useEffect(() => {
    const postings = getPostings();
    
    // Mənfəət və Zərər
    const totalIncome = getTurnover(postings, '60', 'ct');
    const totalExpense = getTurnover(postings, '70', 'dt') + getTurnover(postings, '71', 'dt');
    const profit = totalIncome - totalExpense;

    // Aktivlər: 201 (Anbar), 211 (Debitor), 221 (Kassa), 223 (Bank)
    const assets = getBalanceActive(postings, '201') + getBalanceActive(postings, '211') + getBalanceActive(postings, '221') + getBalanceActive(postings, '223');
    
    // Passivlər (Öhdəliklər): 531 (Kreditor)
    const liabilities = getBalancePassive(postings, '531');

    // Kapital = Aktivlər - Öhdəliklər
    const equity = assets - liabilities;

    setMetrics({ income: totalIncome, expense: totalExpense, profit, assets, liabilities, equity });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-color)', marginBottom: '0.5rem' }}>Ümumi Maliyyə İcmalı (Bütün Qalıqlar)</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Aktivlər, Passivlər, Kapital və Mənfəət/Zərər balansı (1C İkili yazılışlarına əsasən).</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        {/* P&L */}
        <div style={{ backgroundColor: 'var(--surface-color)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
            <TrendingUp /> <span style={{ fontWeight: 600 }}>Mənfəət və Zərər (P&L)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span>Ümumi Gəlirlər (60X, 61X)</span>
            <span style={{ fontWeight: 600, color: '#10b981' }}>{metrics.income.toLocaleString('az-AZ')} ₼</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span>Ümumi Xərclər (70X, 71X)</span>
            <span style={{ fontWeight: 600, color: '#ef4444' }}>{metrics.expense.toLocaleString('az-AZ')} ₼</span>
          </div>
          <div style={{ borderTop: '1px solid var(--border-color)', margin: '1rem 0' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem' }}>
            <span style={{ fontWeight: 600 }}>Net Mənfəət / Zərər</span>
            <span style={{ fontWeight: 800, color: metrics.profit >= 0 ? '#10b981' : '#ef4444' }}>{metrics.profit.toLocaleString('az-AZ')} ₼</span>
          </div>
        </div>

        {/* Balance Sheet */}
        <div style={{ backgroundColor: 'var(--surface-color)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
            <Wallet /> <span style={{ fontWeight: 600 }}>Mühasibat Balansı (Balance Sheet)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span>Aktivlər (Nağd, Bank, Anbar, Debitor)</span>
            <span style={{ fontWeight: 600, color: '#3b82f6' }}>{metrics.assets.toLocaleString('az-AZ')} ₼</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <span>Öhdəliklər (Kreditor)</span>
            <span style={{ fontWeight: 600, color: '#f59e0b' }}>{metrics.liabilities.toLocaleString('az-AZ')} ₼</span>
          </div>
          <div style={{ borderTop: '1px solid var(--border-color)', margin: '1rem 0' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem' }}>
            <span style={{ fontWeight: 600 }}>Xalis Kapital</span>
            <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{metrics.equity.toLocaleString('az-AZ')} ₼</span>
          </div>
        </div>
      </div>
    </div>
  );
}

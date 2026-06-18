'use client'
import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { getPostings, getTurnover, Posting } from '../../utils/accounting';

export default function DailyIncomeExpensePage() {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  useEffect(() => {
    const postings = getPostings();
    
    // Gəlirlər: 601 (Satış), 611 (Sair) hesablarının krediti
    const totalIncome = getTurnover(postings, '601', 'ct') + getTurnover(postings, '611', 'ct');
    
    // Xərclər: 701 (Maya dəyəri), 711 (İnzibati xərc) hesablarının debeti
    const totalExpense = getTurnover(postings, '701', 'dt') + getTurnover(postings, '711', 'dt');

    setIncome(totalIncome);
    setExpense(totalExpense);
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-color)', marginBottom: '0.5rem' }}>Günlük gəlir / xərc</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>1C Uçot məntiqi ilə 601/611 və 701/711 hesabları üzrə dövriyyə (Mənfəət/Zərər elementləri).</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ backgroundColor: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', padding: '2rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '16px', backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TrendingUp size={32}/></div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>601, 611 Hesablarının Kredit Dövriyyəsi</div>
            <div style={{ color: '#10b981', fontSize: '2rem', fontWeight: 800 }}>{income.toLocaleString('az-AZ')} ₼</div>
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', padding: '2rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '16px', backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><TrendingDown size={32}/></div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>701, 711 Hesablarının Debet Dövriyyəsi</div>
            <div style={{ color: '#ef4444', fontSize: '2rem', fontWeight: 800 }}>{expense.toLocaleString('az-AZ')} ₼</div>
          </div>
        </div>
      </div>
    </div>
  );
}

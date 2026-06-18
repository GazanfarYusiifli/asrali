'use client'
import React, { useState, useEffect } from 'react';
import { HandCoins, Receipt } from 'lucide-react';
import { getPostings, getBalanceActive, getBalancePassive } from '../../utils/accounting';

export default function DebtsPage() {
  const [debitor, setDebitor] = useState(0);
  const [creditor, setCreditor] = useState(0);

  useEffect(() => {
    const postings = getPostings();
    
    // Debitor borc (Bizə verəcəklər): 211 hesabı (Aktiv)
    const debitorBal = getBalanceActive(postings, '211');
    setDebitor(debitorBal);

    // Kreditor borc (Biz verəcəyik): 531 hesabı (Passiv)
    const creditorBal = getBalancePassive(postings, '531');
    setCreditor(creditorBal);
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-color)', marginBottom: '0.5rem' }}>Borclar (Debitor / Kreditor)</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>1C: 211 (Alacaqlar) və 531 (Ödənəcəklər) hesablarının qalıqları.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        <div style={{ backgroundColor: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', padding: '2rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '16px', backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><HandCoins size={32}/></div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>Debitor Borclar (211) - Alacaqlarımız</div>
            <div style={{ color: '#10b981', fontSize: '2rem', fontWeight: 800 }}>{debitor.toLocaleString('az-AZ')} ₼</div>
          </div>
        </div>

        <div style={{ backgroundColor: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', padding: '2rem', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '16px', backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Receipt size={32}/></div>
          <div>
            <div style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.9rem' }}>Kreditor Borclar (531) - Ödənəcəklər</div>
            <div style={{ color: '#ef4444', fontSize: '2rem', fontWeight: 800 }}>{creditor.toLocaleString('az-AZ')} ₼</div>
          </div>
        </div>
      </div>
    </div>
  );
}

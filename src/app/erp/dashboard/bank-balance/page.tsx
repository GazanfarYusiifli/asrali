'use client'
import React, { useState, useEffect } from 'react';
import { Landmark } from 'lucide-react';
import { getPostings, getBalanceActive } from '../../utils/accounting';

export default function BankBalancePage() {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const postings = getPostings();
    
    // Bank: 223 hesabı (Aktiv hesab, qalıq = Debet - Kredit)
    const bankBalance = getBalanceActive(postings, '223');
    setBalance(bankBalance);
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-color)', marginBottom: '0.5rem' }}>Bank balansı</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>1C: 223 (Bank hesablaşmaları) hesabının aktiv qalığı.</p>

      <div style={{ 
        background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(59,130,246,0.02) 100%)',
        border: '1px solid rgba(59,130,246,0.3)',
        padding: '3rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'
      }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 10px 30px rgba(59,130,246,0.3)' }}>
          <Landmark size={40} />
        </div>
        <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.5rem' }}>
          Nağdsız Qalıq (223 Hesabı)
        </div>
        <div style={{ fontSize: '4rem', fontWeight: 900, color: '#3b82f6', letterSpacing: '-1px' }}>
          {balance.toLocaleString('az-AZ')} ₼
        </div>
      </div>
    </div>
  );
}

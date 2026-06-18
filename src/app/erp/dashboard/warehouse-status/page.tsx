'use client'
import React, { useState, useEffect } from 'react';
import { PackageOpen } from 'lucide-react';
import { getPostings, getBalanceActive } from '../../utils/accounting';

export default function WarehouseStatusPage() {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const postings = getPostings();
    
    // Anbar/Mallar: 201 və ya 205 hesabı (Aktiv hesab, qalıq = Debet - Kredit)
    const whBalance = getBalanceActive(postings, '201') + getBalanceActive(postings, '205');
    setBalance(whBalance);
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-color)', marginBottom: '0.5rem' }}>Anbar vəziyyəti</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>1C: 201 (Materiallar) hesabının ümumi aktiv qalığı (maya dəyəri ilə).</p>

      <div style={{ 
        background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(245,158,11,0.02) 100%)',
        border: '1px solid rgba(245,158,11,0.3)',
        padding: '3rem', borderRadius: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center'
      }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f59e0b', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 10px 30px rgba(245,158,11,0.3)' }}>
          <PackageOpen size={40} />
        </div>
        <div style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.5rem' }}>
          Stok Dəyəri (201 Hesabı)
        </div>
        <div style={{ fontSize: '4rem', fontWeight: 900, color: '#f59e0b', letterSpacing: '-1px' }}>
          {balance.toLocaleString('az-AZ')} ₼
        </div>
      </div>
    </div>
  );
}

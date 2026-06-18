'use client'
import React, { useState } from 'react';
import { Search, ListTree, Filter } from 'lucide-react';

const CHART_OF_ACCOUNTS = [
  { code: '201', name: 'Material ehtiyatları (Anbar)', type: 'Aktiv' },
  { code: '211', name: 'Alıcıların debitor borcları (Bizə olan borclar)', type: 'Aktiv' },
  { code: '221', name: 'Kassa (Nağd vəsaitlər)', type: 'Aktiv' },
  { code: '223', name: 'Bank hesablaşma hesabları (Nağdsız)', type: 'Aktiv' },
  { code: '531', name: 'Malsatanlara kreditor borclar (Ödəməli olduqlarımız)', type: 'Passiv' },
  { code: '545', name: 'Qısamüddətli kreditor borcları (Maaş)', type: 'Passiv' },
  { code: '601', name: 'Satış (Xidmət gəlirləri)', type: 'Passiv' },
  { code: '611', name: 'Sair əməliyyat gəlirləri', type: 'Passiv' },
  { code: '701', name: 'Satışın maya dəyəri (Sərf olunan materiallar)', type: 'Aktiv' },
  { code: '711', name: 'İnzibati xərclər (Maaş, icarə və s.)', type: 'Aktiv' },
];

export default function ChartOfAccountsPage() {
  const [search, setSearch] = useState('');

  const filtered = CHART_OF_ACCOUNTS.filter(a => 
    a.code.includes(search) || a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-color)', marginBottom: '0.5rem' }}>Hesablar planı (Chart of Accounts)</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Mühasibat uçotu hesablarının işçi planı (Yeni AR standartı).</p>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '20px', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
            <input 
              type="text" 
              placeholder="Hesab kodu və ya adı ilə axtar..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '0.95rem' }}
            />
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}>
            <Filter size={18} />
            Filtrlər
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Hesab Kodu</th>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Hesabın Adı</th>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Növü (Aktiv/Passiv)</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((acc, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--primary-color)' }}>{acc.code}</td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{acc.name}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 600,
                      backgroundColor: acc.type === 'Aktiv' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                      color: acc.type === 'Aktiv' ? '#10b981' : '#ef4444'
                    }}>
                      {acc.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

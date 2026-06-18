'use client';
import React from 'react';
import { ArrowLeft, LineChart, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PerformansPage() {
  const router = useRouter();
  return (
    <div style={{ padding: '2rem', height: '100%', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontWeight: 600 }}>
        <ArrowLeft size={20} /> Geri Qayıt
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <LineChart size={28} color="#0ea5e9" />
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Satış Performansı</h1>
      </div>

      <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>İl (Yıl)</label>
          <select style={inputStyle}><option>2026</option></select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Dövr (Dönem)</label>
          <select style={inputStyle}><option>İyun</option></select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Valyuta</label>
          <select style={inputStyle}><option>AZN</option></select>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', marginLeft: 'auto' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Axtar:</label>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }}/>
            <input type="text" style={{...inputStyle, paddingLeft: '2rem'}} />
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={thStyle}>Sıra</th>
              <th style={thStyle}>Adı Soyadı</th>
              <th style={{...thStyle, textAlign: 'center'}}>Satış Sayı (Adəti)</th>
              <th style={{...thStyle, textAlign: 'right'}}>Toplam Satış Məbləği</th>
              <th style={thStyle}>Valyuta</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>1</td>
              <td style={{...tdStyle, fontWeight: 700}}>GAZANFAR YUSİFLİ</td>
              <td style={{...tdStyle, textAlign: 'center'}}>3</td>
              <td style={{...tdStyle, textAlign: 'right', fontWeight: 800, color: '#10b981'}}>11,992.00</td>
              <td style={tdStyle}>AZN</td>
            </tr>
          </tbody>
        </table>
        <div style={{ padding: '1rem', color: '#64748b', fontSize: '0.85rem', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
          Göstərilir 1 - 1, Toplam 1 Qeyd
        </div>
      </div>
    </div>
  );
}

const inputStyle = { padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none' };
const thStyle: React.CSSProperties = { padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: 700, fontSize: '0.85rem' };
const tdStyle: React.CSSProperties = { padding: '1rem', color: '#334155', fontSize: '0.95rem' };

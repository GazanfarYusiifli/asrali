'use client';
import React, { useState } from 'react';
import { ArrowLeft, Award, Printer, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SatishPrimiPage() {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState('İyun');
  const months = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];

  return (
    <div style={{ padding: '2rem', height: '100%', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontWeight: 600 }}>
        <ArrowLeft size={20} /> Geri Qayıt
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.6rem', color: '#1e293b', margin: 0, fontWeight: 800 }}>
          <Award size={28} color="#f43f5e" /> Satış Primi
        </h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={btnStyle}><Printer size={16}/> Səhifəni Çap Et</button>
          <button style={btnStyle}><Download size={16}/> Excel Kimi Yüklə</button>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', display: 'flex', gap: '0.2rem', overflowX: 'auto', borderBottom: '2px solid #e2e8f0' }}>
        {months.map(m => (
          <button 
            key={m} 
            onClick={() => setSelectedMonth(m)}
            style={{ 
              padding: '1rem 1.5rem', 
              background: selectedMonth === m ? '#ffe4e6' : 'transparent', 
              border: 'none', 
              borderBottom: selectedMonth === m ? '3px solid #f43f5e' : '3px solid transparent',
              color: selectedMonth === m ? '#e11d48' : '#64748b',
              fontWeight: selectedMonth === m ? 800 : 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {m}
          </button>
        ))}
      </div>

      <h3 style={{ color: '#475569', fontSize: '1.1rem', margin: '0.5rem 0' }}>01.06.2026 - 30.06.2026 Hərəkətləri</h3>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={thStyle}>Adı Soyadı</th>
              <th style={{...thStyle, textAlign: 'center'}}>Satış Sayı (Adəti)</th>
              <th style={{...thStyle, textAlign: 'right'}}>Toplam Satış</th>
              <th style={{...thStyle, textAlign: 'center'}}>İadə (Qaytarma) Sayı</th>
              <th style={{...thStyle, textAlign: 'right'}}>Toplam İadə</th>
              <th style={{...thStyle, textAlign: 'right', color: '#f43f5e'}}>Qazandığı Prim</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
              <td style={{...tdStyle, fontWeight: 700}}>GAZANFAR YUSİFLİ</td>
              <td style={{...tdStyle, textAlign: 'center'}}>0</td>
              <td style={{...tdStyle, textAlign: 'right', fontWeight: 600}}>0.00 AZN</td>
              <td style={{...tdStyle, textAlign: 'center'}}>0</td>
              <td style={{...tdStyle, textAlign: 'right', fontWeight: 600}}>0.00 AZN</td>
              <td style={{...tdStyle, textAlign: 'right', fontWeight: 800, color: '#f43f5e', fontSize: '1.1rem'}}>0 AZN</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 600, color: '#475569', cursor: 'pointer' };
const thStyle: React.CSSProperties = { padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: 700, fontSize: '0.85rem' };
const tdStyle: React.CSSProperties = { padding: '1rem', color: '#334155', fontSize: '0.95rem' };

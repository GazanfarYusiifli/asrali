'use client';
import React, { useState } from 'react';
import { ArrowLeft, Coins, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TopluMaasPage() {
  const router = useRouter();
  const [data, setData] = useState([
    { id: 1, selected: false, vezife: 'Satış Təmsilçisi', ad: 'Əhməd Həsənov', maas: 800, rapor: 0, icaze: 0, aciqlama: '', net: 800 },
    { id: 2, selected: false, vezife: 'Mühasib', ad: 'Aygün Məmmədova', maas: 1200, rapor: 0, icaze: 0, aciqlama: '', net: 1200 }
  ]);

  const toggleSelect = (id: number) => {
    setData(data.map(d => d.id === id ? { ...d, selected: !d.selected } : d));
  }

  const handleAll = (e: any) => {
    setData(data.map(d => ({ ...d, selected: e.target.checked })));
  }

  const toplam = data.filter(d => d.selected).reduce((acc, curr) => acc + curr.net, 0);

  return (
    <div style={{ padding: '2rem', height: '100%', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontWeight: 600 }}>
        <ArrowLeft size={20} /> Geri Qayıt
      </button>

      <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Coins size={32} color="#10b981" />
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Toplu Maaş Daxil Et</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <span style={{ fontWeight: 600, color: '#64748b' }}>Maaş Veriləcək Dövr:</span>
              <input type="month" defaultValue="2026-06" style={{ padding: '0.4rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}/>
            </div>
          </div>
        </div>
        <button style={{ padding: '0.8rem 1.5rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
          <Save size={18} style={{ display: 'inline', marginRight: '6px' }}/> Seçilənləri Təsdiqlə
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={thStyle}><input type="checkbox" onChange={handleAll}/> SEÇ</th>
              <th style={thStyle}>Vəzifəsi</th>
              <th style={thStyle}>Adı Soyadı</th>
              <th style={thStyle}>Maaş</th>
              <th style={thStyle}>Rapor (Xəstəlik)</th>
              <th style={thStyle}>Ödənişsiz İcazə</th>
              <th style={thStyle}>Açıqlama</th>
              <th style={thStyle}>Xalis Maaş (Net)</th>
            </tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={tdStyle}><input type="checkbox" checked={row.selected} onChange={() => toggleSelect(row.id)}/></td>
                <td style={tdStyle}>{row.vezife}</td>
                <td style={{...tdStyle, fontWeight: 600}}>{row.ad}</td>
                <td style={tdStyle}>{row.maas} AZN</td>
                <td style={tdStyle}><input type="number" defaultValue={row.rapor} style={tinyInput}/></td>
                <td style={tdStyle}><input type="number" defaultValue={row.icaze} style={tinyInput}/></td>
                <td style={tdStyle}><input type="text" defaultValue={row.aciqlama} style={{...tinyInput, width: '120px'}}/></td>
                <td style={{...tdStyle, fontWeight: 700, color: '#10b981'}}>{row.net} AZN</td>
              </tr>
            ))}
            <tr style={{ backgroundColor: '#f8fafc' }}>
              <td colSpan={7} style={{...tdStyle, textAlign: 'right', fontWeight: 800}}>Toplam Seçilən Maaş:</td>
              <td style={{...tdStyle, fontWeight: 800, color: '#10b981', fontSize: '1.2rem'}}>{toplam.toLocaleString('az-AZ')} AZN</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

const tinyInput = { width: '60px', padding: '0.3rem', border: '1px solid #cbd5e1', borderRadius: '4px' };
const thStyle: React.CSSProperties = { padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: 700, fontSize: '0.85rem' };
const tdStyle: React.CSSProperties = { padding: '1rem', color: '#334155', fontSize: '0.95rem' };

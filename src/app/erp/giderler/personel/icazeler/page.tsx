'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, CalendarDays, Printer, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';

export default function IcazelerPage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const localData = JSON.parse(getAppStorage('erp_personnel') || '[]');
    setData(localData);
  }, []);
  return (
    <div style={{ padding: '2rem', height: '100%', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontWeight: 600 }}>
        <ArrowLeft size={20} /> Geri Qayıt
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.6rem', color: '#1e293b', margin: 0, fontWeight: 800 }}>
          <CalendarDays size={28} color="#f59e0b" /> İcazə Vəziyyətləri
        </h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={btnStyle}><Printer size={16}/> Səhifəni Çap Et</button>
          <button style={btnStyle}><Download size={16}/> Excel Kimi Yüklə</button>
        </div>
      </div>

      <div style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.8rem', minWidth: '1200px' }}>
          <thead>
            <tr>
              <th style={thStyle}>Durum</th>
              <th style={thStyle}>No</th>
              <th style={thStyle}>Adı Soyadı</th>
              <th style={thStyle}>İşə Başlama</th>
              <th style={thStyle}>Çalışma İli</th>
              <th style={thStyle}>İllik İcazə Toplam Haqqı</th>
              <th style={thStyle}>İstifadə Etdiyi İllik İcazə</th>
              <th style={thStyle}>Qalan İllik İcazə</th>
              <th style={thStyle}>Ödənişsiz İcazələr</th>
              <th style={thStyle}>Digər (Xəstəlik, Doğum)</th>
              <th style={thStyle}>İcazə Tarixçəsi (Detallı)</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={11} style={{ textAlign: 'center', padding: '3rem', backgroundColor: 'white', borderRadius: '16px', color: '#94a3b8', fontWeight: 600 }}>Sistemdə işçi yoxdur.</td></tr>
            ) : data.map((row, index) => {
              
              // Calculate service years
              const baslamaDate = new Date(row.baslama);
              const now = new Date();
              const diffTime = now.getTime() - baslamaDate.getTime();
              const diffYears = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25)));

              // Total rights based on laws
              let toplamHaqq = 0;
              if (diffYears >= 1 && diffYears < 5) toplamHaqq = 14;
              else if (diffYears >= 5 && diffYears < 15) toplamHaqq = 20;
              else if (diffYears >= 15) toplamHaqq = 26;

              // Calculate used leaves
              let istifadeIllik = 0;
              let istifadeOdenissiz = 0;
              let istifadeDiger = 0;
              
              const detallar: React.ReactNode[] = [];

              if (row.icazeler) {
                row.icazeler.forEach((icaze: any, i: number) => {
                  const start = new Date(icaze.baslama);
                  const end = new Date(icaze.bitis);
                  const days = Math.max(0, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
                  
                  if (icaze.nov === '1 İllik' || icaze.nov === 'Ödənişli') {
                    istifadeIllik += days;
                  } else if (icaze.nov === 'Ödənişsiz') {
                    istifadeOdenissiz += days;
                  } else {
                    istifadeDiger += days;
                  }

                  let dotColor = '#4f46e5';
                  if (icaze.nov === 'Xəstəlik') dotColor = '#ef4444';
                  else if (icaze.nov === 'Doğum') dotColor = '#ec4899';
                  else if (icaze.nov === 'Ödənişsiz') dotColor = '#f59e0b';
                  else if (icaze.nov === 'Ölüm') dotColor = '#1e293b';

                  const startDateStr = start.toLocaleDateString('az-AZ');
                  const endDateStr = end.toLocaleDateString('az-AZ');

                  detallar.push(
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem 1rem 1rem 1.5rem', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', position: 'relative', overflow: 'hidden' }}>
                      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '6px', backgroundColor: dotColor }}></div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 800, color: '#1e293b' }}>{icaze.nov}</span>
                        <span style={{ backgroundColor: dotColor + '15', color: dotColor, padding: '4px 10px', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem' }}>{days} Gün</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>
                        <CalendarDays size={14}/> {startDateStr} - {endDateStr}
                      </div>
                      {icaze.aciqlama && (
                        <div style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px dashed #e2e8f0', color: '#475569', fontSize: '0.85rem', fontStyle: 'italic' }}>
                          "{icaze.aciqlama}"
                        </div>
                      )}
                    </div>
                  );
                });
              }

              const qalan = toplamHaqq - istifadeIllik;

              // Dynamic Status
              let currentVeziyyet = row.veziyyet;
              if (currentVeziyyet === 'İşləyir' && row.icazeler) {
                const todayStr = new Date().toISOString().split('T')[0];
                const isCurrentlyOnLeave = row.icazeler.some((icaze: any) => icaze.baslama <= todayStr && icaze.bitis >= todayStr);
                if (isCurrentlyOnLeave) {
                  currentVeziyyet = 'Məzuniyyətdə';
                }
              }

              let badgeBg = '#fee2e2';
              let badgeColor = '#991b1b';
              if (currentVeziyyet === 'İşləyir') { badgeBg = '#dcfce7'; badgeColor = '#166534'; }
              else if (currentVeziyyet === 'Məzuniyyətdə') { badgeBg = '#fef3c7'; badgeColor = '#b45309'; }

              return (
                <React.Fragment key={row.id}>
                  <tr style={{ backgroundColor: 'white', boxShadow: expandedRows[row.id] ? 'none' : '0 4px 6px -1px rgba(0,0,0,0.03)', transition: 'transform 0.2s' }} onMouseOver={e=>{if(!expandedRows[row.id]) e.currentTarget.style.transform='scale(1.002)'}} onMouseOut={e=>e.currentTarget.style.transform='scale(1)'}>
                    <td style={{...tdStyle, borderTopLeftRadius: expandedRows[row.id] ? '16px' : '16px', borderBottomLeftRadius: expandedRows[row.id] ? '0' : '16px', borderLeft: '1px solid #e2e8f0', borderTop: '1px solid #e2e8f0', borderBottom: expandedRows[row.id] ? 'none' : '1px solid #e2e8f0'}}>
                      <span style={{ display: 'inline-block', backgroundColor: badgeBg, color: badgeColor, padding: '6px 12px', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem' }}>
                        {currentVeziyyet}
                      </span>
                    </td>
                    <td style={{...tdStyle, borderTop: '1px solid #e2e8f0', borderBottom: expandedRows[row.id] ? 'none' : '1px solid #e2e8f0', color: '#94a3b8', fontWeight: 700}}>{index + 1}</td>
                    <td style={{...tdStyle, borderTop: '1px solid #e2e8f0', borderBottom: expandedRows[row.id] ? 'none' : '1px solid #e2e8f0', fontWeight: 800, color: '#1e293b'}}>{row.ad}</td>
                    <td style={{...tdStyle, borderTop: '1px solid #e2e8f0', borderBottom: expandedRows[row.id] ? 'none' : '1px solid #e2e8f0', color: '#475569', fontWeight: 600}}>{row.baslama ? new Date(row.baslama).toLocaleDateString('az-AZ') : '-'}</td>
                    <td style={{...tdStyle, borderTop: '1px solid #e2e8f0', borderBottom: expandedRows[row.id] ? 'none' : '1px solid #e2e8f0', color: '#64748b'}}>{diffYears} il</td>
                    <td style={{...tdStyle, borderTop: '1px solid #e2e8f0', borderBottom: expandedRows[row.id] ? 'none' : '1px solid #e2e8f0', color: '#64748b'}}>{toplamHaqq} Gün</td>
                    <td style={{...tdStyle, borderTop: '1px solid #e2e8f0', borderBottom: expandedRows[row.id] ? 'none' : '1px solid #e2e8f0', color: '#64748b'}}>{istifadeIllik} Gün</td>
                    <td style={{...tdStyle, borderTop: '1px solid #e2e8f0', borderBottom: expandedRows[row.id] ? 'none' : '1px solid #e2e8f0', fontWeight: 800, color: qalan < 0 ? '#ef4444' : '#10b981', fontSize: '1.1rem'}}>{qalan} Gün</td>
                    <td style={{...tdStyle, borderTop: '1px solid #e2e8f0', borderBottom: expandedRows[row.id] ? 'none' : '1px solid #e2e8f0', color: '#64748b'}}>{istifadeOdenissiz} Gün</td>
                    <td style={{...tdStyle, borderTop: '1px solid #e2e8f0', borderBottom: expandedRows[row.id] ? 'none' : '1px solid #e2e8f0', color: '#64748b'}}>{istifadeDiger} Gün</td>
                    <td style={{...tdStyle, borderTopRightRadius: expandedRows[row.id] ? '16px' : '16px', borderBottomRightRadius: expandedRows[row.id] ? '0' : '16px', borderRight: '1px solid #e2e8f0', borderTop: '1px solid #e2e8f0', borderBottom: expandedRows[row.id] ? 'none' : '1px solid #e2e8f0', minWidth: '150px', padding: '1rem'}}>
                      <button onClick={() => toggleRow(row.id)} style={{ padding: '0.6rem 1rem', backgroundColor: expandedRows[row.id] ? '#f1f5f9' : '#e0e7ff', color: expandedRows[row.id] ? '#64748b' : '#4f46e5', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', width: '100%', transition: 'all 0.2s' }}>
                        {expandedRows[row.id] ? 'Gizlət' : 'Detallar'}
                      </button>
                    </td>
                  </tr>
                  
                  {expandedRows[row.id] && (
                    <tr style={{ backgroundColor: '#f8fafc', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.03)' }}>
                      <td colSpan={11} style={{ padding: '1.5rem', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', borderTop: '1px dashed #cbd5e1' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                          {detallar.length > 0 ? detallar : <div style={{ color: '#94a3b8', fontStyle: 'italic', fontWeight: 600, padding: '1rem' }}>Bu işçiyə aid heç bir icazə qeydə alınmayıb.</div>}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ backgroundColor: '#fffbeb', padding: '1.5rem', borderRadius: '8px', border: '1px solid #fde68a', fontSize: '0.85rem', color: '#92400e', lineHeight: '1.6' }}>
        <strong>Məlumat:</strong> İş Qanunvericiliyinə əsasən, iş yerində işə başladığı tarixdən etibarən sınaq müddəti də daxil olmaqla, ən az bir il işləmiş işçilərə illik ödənişli məzuniyyət verilməlidir. Bu hüquqdan imtina etmək mümkün deyil.<br/><br/>
        İşçilərə veriləcək illik ödənişli məzuniyyət müddəti xidmət müddətinə görə:<br/>
        a) 1 ildən 5 ilə qədər olanlara 14 gündən,<br/>
        b) 5 ildən 15 ilə qədər olanlara 20 gündən,<br/>
        c) 15 il və daha çox olanlara 26 gündən az ola bilməz.
      </div>
    </div>
  );
}

const btnStyle: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', background: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', fontWeight: 600, color: '#475569', cursor: 'pointer' };
const thStyle: React.CSSProperties = { padding: '0 1rem 1rem 1rem', textAlign: 'left', color: '#64748b', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' };
const tdStyle: React.CSSProperties = { padding: '1.2rem 1rem', color: '#334155', fontSize: '0.95rem' };

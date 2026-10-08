'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, CalendarDays, Printer, Download } from 'lucide-react';
import { useRouter } from 'next/navigation';
import PageHeaderBanner from '@/components/PageHeaderBanner';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';

export default function IcazelerPage() {
  const router = useRouter();
  const [data, setData] = useState<any[]>([]);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    const raw = getAppStorage('erp_personnel');
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure existing items have fallback baslama if missing so NaN il doesn't occur
      const withDates = parsed.map((item: any, idx: number) => {
        if (!item.baslama) {
          const fallbackDates = ['2023-01-15', '2021-05-10', '2024-02-01'];
          return { ...item, baslama: fallbackDates[idx % fallbackDates.length] };
        }
        return item;
      });
      setData(withDates);
    } else {
      const defaultData = [
        { id: 1, ad: 'Əhməd Həsənov', veziyyet: 'İşləyir', vezife: 'Satış Təmsilçisi', filial: 'Mərkəz Filial', baslama: '2023-01-15', maas: 800 },
        { id: 2, ad: 'Aygün Məmmədova', veziyyet: 'İşləyir', vezife: 'Mühasib', filial: 'Mərkəz Filial', baslama: '2021-05-10', maas: 1200 },
        { id: 3, ad: 'Rəşad Əliyev', veziyyet: 'İşdən Çıxıb', vezife: 'Anbardar', filial: 'Depo 1', baslama: '2024-02-01', maas: 600 }
      ];
      setData(defaultData);
      setAppStorage('erp_personnel', JSON.stringify(defaultData));
    }
  }, []);

  // Compute KPI aggregates
  let totalEmployees = data.length;
  let activeEmployees = 0;
  let onLeaveEmployees = 0;
  let totalEntitledDays = 0;
  let totalUsedDays = 0;

  data.forEach((row: any) => {
    const baslamaDate = row.baslama ? new Date(row.baslama) : new Date();
    const now = new Date();
    const diffTime = Math.max(0, now.getTime() - baslamaDate.getTime());
    const diffYears = isNaN(diffTime) ? 0 : Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));

    let toplamHaqq = 0;
    if (diffYears >= 1 && diffYears < 5) toplamHaqq = 14;
    else if (diffYears >= 5 && diffYears < 15) toplamHaqq = 20;
    else if (diffYears >= 15) toplamHaqq = 26;

    totalEntitledDays += toplamHaqq;

    let istifadeIllik = 0;
    if (row.icazeler) {
      row.icazeler.forEach((icaze: any) => {
        const start = new Date(icaze.baslama);
        const end = new Date(icaze.bitis);
        const days = Math.max(0, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
        if (icaze.nov === '1 İllik' || icaze.nov === 'Ödənişli') {
          istifadeIllik += days;
        }
      });
    }
    totalUsedDays += istifadeIllik;

    const todayStr = new Date().toISOString().split('T')[0];
    const isCurrentlyOnLeave = row.icazeler?.some((icaze: any) => icaze.baslama <= todayStr && icaze.bitis >= todayStr);
    if (isCurrentlyOnLeave) onLeaveEmployees++;
    else if (row.veziyyet === 'İşləyir') activeEmployees++;
  });

  return (
    <div style={{ padding: '2rem', minHeight: '100%', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1.75rem', fontFamily: 'inherit' }}>
      
      {/* Back button */}
      <div>
        <button 
          onClick={() => router.back()} 
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'white', border: '1px solid #e2e8f0', padding: '0.55rem 1rem', borderRadius: '10px', cursor: 'pointer', color: '#475569', fontWeight: 700, fontSize: '0.9rem', boxShadow: '0 1px 3px rgba(0,0,0,0.03)', transition: 'all 0.2s' }}
          onMouseOver={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
          onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}
        >
          <ArrowLeft size={18} /> Geri Qayıt
        </button>
      </div>

      {/* Page Header Banner */}
      <PageHeaderBanner
        title="İcazə və Məzuniyyət Vəziyyətləri"
        description="Əməkdaşların illik əsas, ödənişsiz, xəstəlik və sosial məzuniyyət qalıqlarının qanunvericilik üzrə avtomatik uçotu."
        icon={CalendarDays}
        theme="emerald"
        badge="İnsan Resursları • Məzuniyyət"
        primaryAction={{
          label: "Excel Kimi Yüklə",
          onClick: () => alert("Excel formatında icazə hesabatı hazırlanır..."),
          icon: Download
        }}
        secondaryAction={{
          label: "Səhifəni Çap Et",
          onClick: () => window.print(),
          icon: Printer
        }}
      />

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div style={kpiCardStyle}>
          <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>Ümumi İşçi Sayı</div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#1e293b', marginTop: '0.4rem' }}>{totalEmployees} <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>nəfər</span></div>
          <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 600, marginTop: '0.35rem' }}>{activeEmployees} fəal işləyən</div>
        </div>

        <div style={kpiCardStyle}>
          <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>Hazırda Məzuniyyətdə</div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: onLeaveEmployees > 0 ? '#f59e0b' : '#1e293b', marginTop: '0.4rem' }}>{onLeaveEmployees} <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>nəfər</span></div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginTop: '0.35rem' }}>Aktiv icazədə olanlar</div>
        </div>

        <div style={kpiCardStyle}>
          <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>Toplam İllik Məzuniyyət Fondu</div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#059669', marginTop: '0.4rem' }}>{totalEntitledDays} <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>gün</span></div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginTop: '0.35rem' }}>Qanunvericilik üzrə qazanılan</div>
        </div>

        <div style={kpiCardStyle}>
          <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 700 }}>Qalan İllik İcazə Qalığı</div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#0284c7', marginTop: '0.4rem' }}>{totalEntitledDays - totalUsedDays} <span style={{ fontSize: '0.9rem', color: '#94a3b8', fontWeight: 600 }}>gün</span></div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600, marginTop: '0.35rem' }}>İstifadə edilən: {totalUsedDays} gün</div>
        </div>
      </div>

      {/* Main Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fafbfc' }}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>İşçilər üzrə İcazə Cədvəli</h2>
            <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.85rem' }}>İş stajı və məzuniyyət balansının avtomatik hesablanması</p>
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669', backgroundColor: '#ecfdf5', padding: '0.35rem 0.85rem', borderRadius: '20px', border: '1px solid #a7f3d0' }}>
            {data.length} Qeyd
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1200px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={thStyle}>Durum</th>
                <th style={{ ...thStyle, width: '50px', textAlign: 'center' }}>No</th>
                <th style={thStyle}>Adı Soyadı</th>
                <th style={thStyle}>İşə Başlama</th>
                <th style={thStyle}>Çalışma İli</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>İllik İcazə Toplamı</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>İstifadə Etdiyi</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Qalan İllik İcazə</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Ödənişsiz İcazə</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Digər (Xəstəlik, Doğum)</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Tarixçə</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr>
                  <td colSpan={11} style={{ textAlign: 'center', padding: '3.5rem', color: '#94a3b8', fontWeight: 600 }}>
                    Sistemdə heç bir işçi tapılmadı.
                  </td>
                </tr>
              ) : data.map((row, index) => {
                
                // Calculate service years safely (protecting from NaN)
                const hasValidDate = row.baslama && !isNaN(new Date(row.baslama).getTime());
                const baslamaDate = hasValidDate ? new Date(row.baslama) : null;
                const now = new Date();
                
                let diffYears = 0;
                let calismaIliText = '-';

                if (baslamaDate) {
                  const diffTime = Math.max(0, now.getTime() - baslamaDate.getTime());
                  diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
                  calismaIliText = `${diffYears} il`;
                }

                // Total rights based on Azerbaijani labor law
                let toplamHaqq = 0;
                if (diffYears >= 1 && diffYears < 5) toplamHaqq = 14;
                else if (diffYears >= 5 && diffYears < 15) toplamHaqq = 20;
                else if (diffYears >= 15) toplamHaqq = 26;

                // Calculate used leaves
                let istifadeIllik = 0;
                let istifadeOdenissiz = 0;
                let istifadeDiger = 0;
                
                const detallar: React.ReactNode[] = [];

                if (row.icazeler && Array.isArray(row.icazeler)) {
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

                    let dotColor = '#059669';
                    if (icaze.nov === 'Xəstəlik') dotColor = '#ef4444';
                    else if (icaze.nov === 'Doğum') dotColor = '#ec4899';
                    else if (icaze.nov === 'Ödənişsiz') dotColor = '#f59e0b';
                    else if (icaze.nov === 'Ölüm') dotColor = '#1e293b';

                    const startDateStr = !isNaN(start.getTime()) ? start.toLocaleDateString('az-AZ') : '-';
                    const endDateStr = !isNaN(end.getTime()) ? end.toLocaleDateString('az-AZ') : '-';

                    detallar.push(
                      <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', padding: '1rem', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '4px', backgroundColor: dotColor }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 800, color: '#1e293b', fontSize: '0.9rem' }}>{icaze.nov}</span>
                          <span style={{ backgroundColor: dotColor + '15', color: dotColor, padding: '3px 8px', borderRadius: '6px', fontWeight: 800, fontSize: '0.75rem' }}>{days} Gün</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 500 }}>
                          <CalendarDays size={13}/> {startDateStr} - {endDateStr}
                        </div>
                        {icaze.aciqlama && (
                          <div style={{ marginTop: '0.3rem', paddingTop: '0.4rem', borderTop: '1px dashed #e2e8f0', color: '#475569', fontSize: '0.8rem', fontStyle: 'italic' }}>
                            "{icaze.aciqlama}"
                          </div>
                        )}
                      </div>
                    );
                  });
                }

                const qalan = toplamHaqq - istifadeIllik;

                // Dynamic Status
                let currentVeziyyet = row.veziyyet || 'İşləyir';
                if (currentVeziyyet === 'İşləyir' && row.icazeler) {
                  const todayStr = new Date().toISOString().split('T')[0];
                  const isCurrentlyOnLeave = row.icazeler.some((icaze: any) => icaze.baslama <= todayStr && icaze.bitis >= todayStr);
                  if (isCurrentlyOnLeave) {
                    currentVeziyyet = 'Məzuniyyətdə';
                  }
                }

                let badgeBg = '#fee2e2';
                let badgeColor = '#991b1b';
                if (currentVeziyyet === 'İşləyir') { badgeBg = '#ecfdf5'; badgeColor = '#059669'; }
                else if (currentVeziyyet === 'Məzuniyyətdə') { badgeBg = '#fef3c7'; badgeColor = '#b45309'; }

                const isExpanded = !!expandedRows[row.id];

                return (
                  <React.Fragment key={row.id || index}>
                    <tr style={{ borderBottom: isExpanded ? 'none' : '1px solid #f1f5f9', backgroundColor: isExpanded ? '#fafbfc' : 'white', transition: 'background-color 0.15s' }}>
                      <td style={tdStyle}>
                        <span style={{ display: 'inline-block', backgroundColor: badgeBg, color: badgeColor, padding: '5px 10px', borderRadius: '6px', fontWeight: 700, fontSize: '0.78rem', border: `1px solid ${badgeColor}25` }}>
                          {currentVeziyyet}
                        </span>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center', color: '#94a3b8', fontWeight: 700 }}>{index + 1}</td>
                      <td style={{ ...tdStyle, fontWeight: 800, color: '#1e293b' }}>
                        <div>{row.ad}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 500 }}>{row.vezife || row.filial || ''}</div>
                      </td>
                      <td style={{ ...tdStyle, color: '#475569', fontWeight: 600 }}>
                        {baslamaDate ? baslamaDate.toLocaleDateString('az-AZ') : '-'}
                      </td>
                      <td style={{ ...tdStyle, color: '#1e293b', fontWeight: 700 }}>
                        {calismaIliText}
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center', color: '#475569', fontWeight: 600 }}>
                        <span style={{ backgroundColor: '#f1f5f9', padding: '3px 8px', borderRadius: '6px' }}>{toplamHaqq} Gün</span>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center', color: '#475569', fontWeight: 600 }}>
                        {istifadeIllik} Gün
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 800 }}>
                        <span style={{ backgroundColor: qalan < 0 ? '#fee2e2' : '#ecfdf5', color: qalan < 0 ? '#b91c1c' : '#059669', padding: '4px 10px', borderRadius: '8px', fontSize: '0.95rem' }}>
                          {qalan} Gün
                        </span>
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center', color: '#64748b' }}>
                        {istifadeOdenissiz > 0 ? <span style={{ color: '#d97706', fontWeight: 700 }}>{istifadeOdenissiz} Gün</span> : '0 Gün'}
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center', color: '#64748b' }}>
                        {istifadeDiger > 0 ? <span style={{ color: '#0284c7', fontWeight: 700 }}>{istifadeDiger} Gün</span> : '0 Gün'}
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <button 
                          onClick={() => toggleRow(row.id)} 
                          style={{ padding: '0.45rem 0.95rem', backgroundColor: isExpanded ? '#14141c' : '#ecfdf5', color: isExpanded ? 'white' : '#059669', border: isExpanded ? '1px solid #14141c' : '1px solid #a7f3d0', borderRadius: '8px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s' }}
                        >
                          {isExpanded ? 'Gizlət' : 'Detallar'}
                        </button>
                      </td>
                    </tr>
                    
                    {isExpanded && (
                      <tr style={{ backgroundColor: '#fafbfc', borderBottom: '1px solid #e2e8f0' }}>
                        <td colSpan={11} style={{ padding: '1.25rem 1.5rem', backgroundColor: '#f8fafc' }}>
                          <div style={{ marginBottom: '0.75rem', fontWeight: 700, fontSize: '0.85rem', color: '#475569' }}>
                            "{row.ad}" üçün qeydə alınmış icazə tarixçəsi:
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                            {detallar.length > 0 ? detallar : <div style={{ color: '#94a3b8', fontStyle: 'italic', fontWeight: 500, padding: '0.5rem 0' }}>Bu əməkdaşa aid heç bir icazə və ya məzuniyyət qeydə alınmayıb.</div>}
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
      </div>

      {/* Modern Legislation & Law Reference Card */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        
        {/* Card 1: Əsas Hüquqi Məlumat */}
        <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669', fontWeight: 800 }}>
              §
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>Əmək Qanunvericiliyi Üzrə Qayda</h3>
          </div>
          <p style={{ margin: 0, color: '#59535f', fontSize: '0.88rem', lineHeight: '1.6' }}>
            İş yerində işə başladığı tarixdən etibarən sınaq müddəti də daxil olmaqla, ən azı <strong>bir il</strong> işləmiş işçilərə illik ödənişli əsas məzuniyyət verilməlidir. Bu hüquq qanunla təmin edilir və imtina edilə bilməz.
          </p>
        </div>

        {/* Card 2: Xidmət Müddəti Cədvəli */}
        <div style={{ backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7', fontWeight: 800 }}>
              📅
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>İllik Ödənişli Məzuniyyət Müddətləri</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0.75rem', backgroundColor: '#fafbfc', borderRadius: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: '#475569', fontWeight: 600 }}>1 ildən 5 ilə qədər olanlara:</span>
              <strong style={{ color: '#059669' }}>14 gündən az ola bilməz</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0.75rem', backgroundColor: '#fafbfc', borderRadius: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: '#475569', fontWeight: 600 }}>5 ildən 15 ilə qədər olanlara:</span>
              <strong style={{ color: '#059669' }}>20 gündən az ola bilməz</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.45rem 0.75rem', backgroundColor: '#fafbfc', borderRadius: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: '#475569', fontWeight: 600 }}>15 il və daha çox olanlara:</span>
              <strong style={{ color: '#059669' }}>26 gündən az ola bilməz</strong>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

const kpiCardStyle: React.CSSProperties = {
  backgroundColor: 'white',
  padding: '1.4rem',
  borderRadius: '14px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
};

const thStyle: React.CSSProperties = {
  padding: '0.9rem 1rem',
  textAlign: 'left',
  color: '#64748b',
  fontWeight: 700,
  fontSize: '0.8rem',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const tdStyle: React.CSSProperties = {
  padding: '1rem',
  color: '#334155',
  fontSize: '0.9rem'
};

'use client';
import React, { useState, useEffect } from 'react';
import { RefreshCw, Plus, Edit, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';

const MONTHS = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'İyun', 'İyul', 'Avqust', 'Sentyabr', 'Oktyabr', 'Noyabr', 'Dekabr'];

export default function TekrarlayanXerclerListesiPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [paymentModalData, setPaymentModalData] = useState<any>(null); // For the Odeme Yap modal
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    setIsMounted(true);
    const existing = getAppStorage('erp_recurring_expenses');
    if (existing) {
      setData(JSON.parse(existing));
    } else {
      const defaultData = [
        { id: 1, veziyyet: 'Ödənilib', tarix: '2026-06-15', kateqoriya: 'İcarə (Arenda)', tekrarla: 'Hər Ay', aciqlama: 'Ofis İcarəsi', mebleg: 300, valyuta: 'AZN' },
        { id: 2, veziyyet: 'Ödənilməyib', tarix: '2026-07-05', kateqoriya: 'Kommunal', tekrarla: 'Hər Ay', aciqlama: 'İşıq Pulu', mebleg: 500, valyuta: 'AZN' },
        { id: 3, veziyyet: 'Ödənilib', tarix: '2026-08-10', kateqoriya: 'Maaş', tekrarla: 'Hər Ay', aciqlama: 'İşçi Maaşı', mebleg: 400, valyuta: 'AZN' }
      ];
      setData(defaultData);
      setAppStorage('erp_recurring_expenses', JSON.stringify(defaultData));
    }
  }, []);

  if (!isMounted) return null;

  const handleToggleStatus = (id: number) => {
    const itemToToggle = data.find(item => item.id === id);
    if (!itemToToggle) return;

    if (itemToToggle.veziyyet === 'Ödənilib') {
      // Revert to unpaid directly
      const newData = data.map(item => item.id === id ? { ...item, veziyyet: 'Ödənilməyib' } : item);
      setData(newData);
      setAppStorage('erp_recurring_expenses', JSON.stringify(newData));
    } else {
      // Open Payment Modal
      setPaymentModalData({
        id: id,
        hesap: 'Əsas Bank Hesabı',
        tarix: new Date().toISOString().split('T')[0],
        aciqlama: itemToToggle.aciqlama,
        mebleg: itemToToggle.mebleg,
        valyuta: itemToToggle.valyuta
      });
    }
  };

  const submitPayment = () => {
    if (!paymentModalData) return;
    const newData = data.map(item => item.id === paymentModalData.id ? { ...item, veziyyet: 'Ödənilib' } : item);
    setData(newData);
    setAppStorage('erp_recurring_expenses', JSON.stringify(newData));
    setPaymentModalData(null);
    alert('Ödəniş uğurla edildi!');
  };

  const handleDelete = (id: number) => {
    if(confirm('Bu təkrarlanan xərci silmək istədiyinizə əminsiniz?')) {
      const newData = data.filter(item => item.id !== id);
      setData(newData);
      setAppStorage('erp_recurring_expenses', JSON.stringify(newData));
    }
  };

  // Mock calculation for month tabs based on start date and recurrence
  const getMonthTotal = (monthIndex: number) => {
    let total = 0;
    data.forEach(item => {
      const itemMonth = new Date(item.tarix).getMonth();
      // If it repeats every month, count it for all months >= itemMonth
      if (item.tekrarla === 'Hər Ay' && monthIndex >= itemMonth) {
        total += Number(item.mebleg || 0);
      } else if (item.tekrarla === 'Hər İl' && monthIndex === itemMonth) {
        total += Number(item.mebleg || 0);
      } else if (itemMonth === monthIndex) {
        total += Number(item.mebleg || 0);
      }
    });
    return total;
  };

  // Filter data for the selected month
  const filteredData = data.filter(item => {
    const itemMonth = new Date(item.tarix).getMonth();
    if (item.tekrarla === 'Hər Ay' && selectedMonth >= itemMonth) return true;
    if (item.tekrarla === 'Hər İl' && selectedMonth === itemMonth) return true;
    if (selectedMonth === itemMonth) return true;
    return false;
  });

  const toplamOdenen = filteredData.filter(d => d.veziyyet === 'Ödənilib').reduce((acc, curr) => acc + Number(curr.mebleg || 0), 0);
  const toplamGozleyen = filteredData.filter(d => d.veziyyet !== 'Ödənilib').reduce((acc, curr) => acc + Number(curr.mebleg || 0), 0);
  const genelToplam = toplamOdenen + toplamGozleyen;

  return (
    <div style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: '#f8fafc' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ backgroundColor: '#ffedd5', padding: '0.5rem', borderRadius: '8px', color: '#f97316' }}>
            <RefreshCw size={24} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b' }}>Təkrarlanan Xərclər</h1>
        </div>
        <button 
          onClick={() => router.push('/erp/giderler/tekrarlayan/yeni')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', backgroundColor: '#f97316', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(249, 115, 22, 0.2)' }} 
        >
          <Plus size={18} /> Yeni Təkrarlanan Xərc
        </button>
      </div>

      {/* Months Toolbar */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', overflowX: 'auto', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        {MONTHS.map((month, idx) => {
          const total = getMonthTotal(idx);
          const isSelected = selectedMonth === idx;
          return (
            <button 
              key={month}
              onClick={() => setSelectedMonth(idx)}
              style={{
                flex: '1 0 auto',
                padding: '1rem',
                border: 'none',
                backgroundColor: isSelected ? '#fff7ed' : 'transparent',
                borderBottom: isSelected ? '3px solid #f97316' : '3px solid transparent',
                borderRight: '1px solid #f1f5f9',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.2rem',
                transition: 'all 0.2s'
              }}
            >
              <span style={{ fontWeight: isSelected ? 800 : 600, color: isSelected ? '#ea580c' : '#64748b', fontSize: '0.9rem' }}>{month}</span>
              <span style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.85rem' }}>{total.toLocaleString('az-AZ')} AZN</span>
            </button>
          )
        })}
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        
        <div style={{ padding: '1.2rem 1.5rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#334155', margin: 0 }}>
            {currentYear} {MONTHS[selectedMonth]} Ayındakı Ödənişlər
          </h2>
        </div>

        <div style={{ overflowX: 'auto', flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
            <thead>
              <tr style={{ backgroundColor: '#fff', borderBottom: '2px solid #e2e8f0' }}>
                <th style={thStyle}>Vəziyyət</th>
                <th style={thStyle}>Təkrarla</th>
                <th style={thStyle}>Tarix</th>
                <th style={thStyle}>Gecikmə/Qalıq</th>
                <th style={thStyle}>Ödəniş Növü</th>
                <th style={thStyle}>Açıqlama</th>
                <th style={{...thStyle, textAlign: 'right'}}>Məbləğ</th>
                <th style={{...thStyle, textAlign: 'center', width: '100px'}}>Əməliyyat</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontWeight: 500 }}>
                    Bu ay üçün heç bir xərc tapılmadı.
                  </td>
                </tr>
              ) : filteredData.map((row) => {
                const rowDate = new Date(row.tarix);
                const today = new Date();
                // Strip time
                rowDate.setHours(0,0,0,0);
                today.setHours(0,0,0,0);
                const diffTime = rowDate.getTime() - today.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                
                let delayBadge = null;
                if (row.veziyyet === 'Ödənilib') {
                  delayBadge = <span style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: '#f1f5f9', color: '#64748b', fontSize: '0.75rem', fontWeight: 700 }}>Bağlanıb</span>;
                } else if (diffDays < 0) {
                  delayBadge = <span style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: '#fee2e2', color: '#dc2626', fontSize: '0.75rem', fontWeight: 700 }}>{Math.abs(diffDays)} gün gecikir</span>;
                } else if (diffDays === 0) {
                  delayBadge = <span style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: '#ffedd5', color: '#ea580c', fontSize: '0.75rem', fontWeight: 700 }}>0 gün gecikir (Bugün)</span>;
                } else {
                  delayBadge = <span style={{ padding: '4px 10px', borderRadius: '6px', backgroundColor: '#e0f2fe', color: '#0284c7', fontSize: '0.75rem', fontWeight: 700 }}>{diffDays} gün qaldı</span>;
                }

                return (
                  <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={tdStyle}>
                      {row.veziyyet === 'Ödənilib' 
                        ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '99px', backgroundColor: '#dcfce7', color: '#166534', fontSize: '0.8rem', fontWeight: 600 }}><CheckCircle2 size={14}/> Ödənilib</span>
                        : <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '99px', backgroundColor: '#fee2e2', color: '#991b1b', fontSize: '0.8rem', fontWeight: 600 }}><Clock size={14}/> Gözləyir</span>
                      }
                    </td>
                    <td style={{...tdStyle, color: '#f97316', fontWeight: 600}}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <RefreshCw size={14} /> {row.tekrarla}
                      </div>
                    </td>
                    <td style={{...tdStyle, fontWeight: 500}}>{row.tarix}</td>
                    <td style={tdStyle}>{delayBadge}</td>
                    <td style={{...tdStyle, fontWeight: 700, color: '#0f172a'}}>{row.kateqoriya}</td>
                    <td style={{...tdStyle, maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis'}} title={row.aciqlama}>{row.aciqlama}</td>
                    <td style={{...tdStyle, textAlign: 'right', fontWeight: 800, color: '#ef4444'}}>
                      {Number(row.mebleg).toLocaleString('az-AZ', { minimumFractionDigits: 2 })} {row.valyuta}
                    </td>
                    <td style={{...tdStyle, textAlign: 'center'}}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                        <button onClick={() => handleToggleStatus(row.id)} title={row.veziyyet === 'Ödənilib' ? "Gözləyir et" : "Ödənilib et"} style={{ background: 'white', border: '1px solid #cbd5e1', cursor: 'pointer', padding: '0.4rem', borderRadius: '6px', color: row.veziyyet === 'Ödənilib' ? '#ef4444' : '#10b981', display: 'flex', alignItems: 'center' }}>
                          {row.veziyyet === 'Ödənilib' ? <Clock size={16} /> : <CheckCircle2 size={16} />}
                        </button>
                        <button onClick={() => router.push(`/erp/giderler/tekrarlayan/yeni?id=${row.id}`)} title="Düzəliş Et" style={{ background: 'white', border: '1px solid #cbd5e1', cursor: 'pointer', padding: '0.4rem', borderRadius: '6px', color: '#3b82f6', display: 'flex', alignItems: 'center' }}>
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDelete(row.id)} title="Sil" style={{ background: 'white', border: '1px solid #cbd5e1', cursor: 'pointer', padding: '0.4rem', borderRadius: '6px', color: '#64748b', display: 'flex', alignItems: 'center' }}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {/* Footer Totals */}
        <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', gap: '2rem' }}>
          <div style={{ flex: 1, backgroundColor: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>TOPLAM ÖDƏNƏN</span>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>{toplamOdenen.toLocaleString('az-AZ', { minimumFractionDigits: 2 })} AZN</span>
          </div>
          <div style={{ flex: 1, backgroundColor: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>TOPLAM GÖZLƏYƏN</span>
            <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ef4444' }}>{toplamGozleyen.toLocaleString('az-AZ', { minimumFractionDigits: 2 })} AZN</span>
          </div>
          <div style={{ flex: 1, backgroundColor: '#ffedd5', padding: '1rem', borderRadius: '8px', border: '1px solid #fed7aa', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#c2410c' }}>ÜMUMİ TOPLAM</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ea580c' }}>{genelToplam.toLocaleString('az-AZ', { minimumFractionDigits: 2 })} AZN</span>
          </div>
        </div>

      </div>

      {/* Payment Modal */}
      {paymentModalData && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '450px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem', fontWeight: 800, color: '#1e293b', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.8rem' }}>Ödəniş Et</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Hesab (Kassa/Banka)</label>
                <select value={paymentModalData.hesap} onChange={(e) => setPaymentModalData({...paymentModalData, hesap: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#f8fafc', fontWeight: 500 }}>
                  <option value="Əsas Bank Hesabı">Əsas Bank Hesabı</option>
                  <option value="Nəğd Kassa">Nəğd Kassa</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Tarix</label>
                <input type="date" value={paymentModalData.tarix} onChange={(e) => setPaymentModalData({...paymentModalData, tarix: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#f8fafc', fontWeight: 500 }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Açıqlama</label>
                <input type="text" value={paymentModalData.aciqlama} onChange={(e) => setPaymentModalData({...paymentModalData, aciqlama: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#f8fafc', fontWeight: 500 }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Məbləğ</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="number" value={paymentModalData.mebleg} onChange={(e) => setPaymentModalData({...paymentModalData, mebleg: e.target.value})} style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#f8fafc', fontWeight: 700, fontSize: '1.1rem' }} />
                  <div style={{ padding: '0.8rem', backgroundColor: '#e2e8f0', borderRadius: '8px', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center' }}>{paymentModalData.valyuta}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button onClick={() => setPaymentModalData(null)} style={{ flex: 1, padding: '0.8rem', backgroundColor: 'transparent', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>İmtina</button>
              <button onClick={submitPayment} style={{ flex: 2, padding: '0.8rem', backgroundColor: '#10b981', border: 'none', borderRadius: '8px', fontWeight: 700, color: 'white', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)' }}>Ödəniş Et</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const thStyle: React.CSSProperties = { padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' };
const tdStyle: React.CSSProperties = { padding: '1rem', color: '#334155', fontSize: '0.95rem', whiteSpace: 'nowrap' };

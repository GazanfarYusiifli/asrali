'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Search, FileText, Trash2, ShieldCheck, Banknote, Edit } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';

export default function SmmListesi() {
  const router = useRouter();
  const [smmList, setSmmList] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = JSON.parse(getAppStorage('erp_smm_list') || '[]');
    setSmmList(saved);
  }, []);

  if (!isMounted) return null;

  const filteredList = smmList.filter(item => 
    item.accountData?.hesabAdi?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.smmData?.xidmetAciklamasi?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteSmm = (id: number) => {
    if (confirm("Bu SMM qəbzini silmək istədiyinizə əminsiniz?")) {
      const newList = smmList.filter(item => item.id !== id);
      setSmmList(newList);
      setAppStorage('erp_smm_list', JSON.stringify(newList));
    }
  };

  const getStatusColor = (status: string) => {
    if (status.includes('Ödənildi')) return { bg: '#dcfce7', text: '#16a34a' };
    if (status.includes('Ödənilmədi')) return { bg: '#fee2e2', text: '#ef4444' };
    return { bg: '#fef3c7', text: '#d97706' }; // Açıq Hesap
  };

  return (
    <div style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ backgroundColor: '#e0e7ff', padding: '0.5rem', borderRadius: '8px', color: '#4f46e5' }}>
              <ShieldCheck size={24} />
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b' }}>
              SMM Siyahısı (Sərbəst Peşə Qəbzləri)
            </h1>
          </div>
          <p style={{ color: '#64748b' }}>Bütün kəsilmiş Sərbəst Peşə Qəbzlərini (SPQ) buradan izləyin.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/erp/satislar/smm/yeni" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', backgroundColor: '#4f46e5', color: 'white', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Plus size={18} /> Yeni Yarat
          </Link>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', flex: 1, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        
        {/* Toolbar */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', width: '350px' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={20} />
            <input 
              type="text" 
              placeholder="Hesab adı və ya Açıqlama axtar..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 3rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', transition: 'all 0.2s' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#4f46e5'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.boxShadow = 'none' }}
            />
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#475569', fontWeight: 700, fontSize: '0.9rem' }}>Tarix</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#475569', fontWeight: 700, fontSize: '0.9rem' }}>Hesab / Müştəri</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#475569', fontWeight: 700, fontSize: '0.9rem' }}>Açıqlama</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'center', color: '#475569', fontWeight: 700, fontSize: '0.9rem' }}>Vəziyyət</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'right', color: '#475569', fontWeight: 700, fontSize: '0.9rem' }}>Cəmi Məbləğ</th>
                <th style={{ padding: '1rem 1.5rem', textAlign: 'center', color: '#475569', fontWeight: 700, fontSize: '0.9rem' }}>İdarəetmə</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.length > 0 ? filteredList.map(item => {
                const colors = getStatusColor(item.smmData.tahsilatDurumu);
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <td style={{ padding: '1rem 1.5rem', color: '#334155' }}>
                      {item.smmData.tarix.split('-').reverse().join('.')}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: '#3b82f6', fontWeight: 600 }}>
                      {item.accountData.hesabAdi || 'Adsız Hesab'}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: '#475569', fontSize: '0.9rem' }}>
                      {item.smmData.xidmetAciklamasi.length > 30 ? item.smmData.xidmetAciklamasi.substring(0,30) + '...' : item.smmData.xidmetAciklamasi || '-'}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                      <span style={{ backgroundColor: colors.bg, color: colors.text, padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>
                        {item.smmData.tahsilatDurumu}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: '#0f172a', fontWeight: 800, textAlign: 'right' }}>
                      {Number(item.calc.totalPayable).toLocaleString('az-AZ', { minimumFractionDigits: 2 })} ₼
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                      <button onClick={() => router.push(`/erp/satislar/smm/yeni?id=${item.id}`)} style={{ padding: '0.5rem', backgroundColor: '#e0f2fe', color: '#0ea5e9', borderRadius: '6px', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#bae6fd'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e0f2fe'} title="Düzəliş Et">
                        <Edit size={18} />
                      </button>
                      <button onClick={() => deleteSmm(item.id)} style={{ padding: '0.5rem', backgroundColor: '#fee2e2', color: '#ef4444', borderRadius: '6px', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fca5a5'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'} title="Sil">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={6} style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
                    <FileText size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                    <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Heç bir SMM qəbzi tapılmadı.</div>
                    <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Yeni yaratmaq üçün "Yeni Yarat" düyməsindən istifadə edin.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

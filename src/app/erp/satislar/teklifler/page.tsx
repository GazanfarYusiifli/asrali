'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Search, FileText, Trash2, Printer, Eye, Edit } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';

export default function TekliflerListesi() {
  const router = useRouter();
  const [quotes, setQuotes] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const saved = JSON.parse(getAppStorage('erp_quotes') || '[]');
    setQuotes(saved);
  }, []);

  if (!isMounted) return null;

  const filteredQuotes = quotes.filter(q => 
    q.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    q.docNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const deleteQuote = (id: number) => {
    if (confirm("Bu təklifi silmək istədiyinizə əminsiniz?")) {
      const newQuotes = quotes.filter(q => q.id !== id);
      setQuotes(newQuotes);
      setAppStorage('erp_quotes', JSON.stringify(newQuotes));
    }
  };

  return (
    <div style={{ padding: '2rem', height: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ backgroundColor: '#dcfce7', padding: '0.5rem', borderRadius: '8px', color: '#10b981' }}>
              <FileText size={24} />
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b' }}>
              Qiymət Təklifləri Siyahısı
            </h1>
          </div>
          <p style={{ color: '#64748b' }}>Bütün hazırladığınız qiymət təkliflərini buradan izləyin və idarə edin.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/erp/satislar/teklifler/yeni" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', backgroundColor: '#10b981', color: 'white', borderRadius: '8px', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Plus size={18} /> Yeni Yarat
          </Link>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', width: '350px' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={20} />
            <input 
              type="text" 
              placeholder="Firma adı və ya Sənəd No ilə axtar..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 3rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', transition: 'all 0.2s' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.boxShadow = 'none' }}
            />
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#475569', fontWeight: 700, fontSize: '0.9rem' }}>Tarix</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#475569', fontWeight: 700, fontSize: '0.9rem' }}>Sənəd No</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'left', color: '#475569', fontWeight: 700, fontSize: '0.9rem' }}>Firma / Müştəri</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'right', color: '#475569', fontWeight: 700, fontSize: '0.9rem' }}>Məbləğ</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'center', color: '#475569', fontWeight: 700, fontSize: '0.9rem' }}>Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {filteredQuotes.length > 0 ? filteredQuotes.map(quote => (
              <tr key={quote.id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background-color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <td style={{ padding: '1rem 1.5rem', color: '#334155' }}>{quote.date.split('-').reverse().join('.')}</td>
                <td style={{ padding: '1rem 1.5rem', color: '#3b82f6', fontWeight: 600 }}>{quote.docNo}</td>
                <td style={{ padding: '1rem 1.5rem', color: '#334155', fontWeight: 500 }}>{quote.companyName}</td>
                <td style={{ padding: '1rem 1.5rem', color: '#1e293b', fontWeight: 700, textAlign: 'right' }}>
                  {Number(quote.grandTotal).toLocaleString('az-AZ', { minimumFractionDigits: 2 })} ₼
                </td>
                <td style={{ padding: '1rem 1.5rem', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                  <button onClick={() => router.push(`/erp/satislar/teklifler/yeni?id=${quote.id}`)} style={{ padding: '0.5rem', backgroundColor: '#e0f2fe', color: '#0ea5e9', borderRadius: '6px', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#bae6fd'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e0f2fe'} title="Düzəliş Et">
                    <Edit size={18} />
                  </button>
                  <button onClick={() => deleteQuote(quote.id)} style={{ padding: '0.5rem', backgroundColor: '#fee2e2', color: '#ef4444', borderRadius: '6px', border: 'none', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fca5a5'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'} title="Sil">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                  <FileText size={48} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                  <div style={{ fontSize: '1.1rem', fontWeight: 600 }}>Heç bir təklif tapılmadı.</div>
                  <div style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Yeni təklif yaratmaq üçün yuxarıdakı "Yeni Yarat" düyməsinə klikləyin.</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

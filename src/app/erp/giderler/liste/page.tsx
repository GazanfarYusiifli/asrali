'use client';
import React, { useState, useEffect } from 'react';
import { TrendingDown, Plus, Search, Filter, Edit, Trash2, CheckCircle2, Clock, Copy, Banknote } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';
import { createClient } from '@/utils/supabase/client';

export default function XercSiyahisiPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [expenseData, setExpenseData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Hamısı');

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    const fetchExpenses = async () => {
      setIsLoading(true);
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('erp_expenses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Supabase fetch error (erp_expenses):", error);
        setExpenseData([]);
      } else if (data) {
        const formattedData = data.map(item => ({
          id: item.id,
          tarix: item.tarix,
          kateqoriya: item.kateqoriya,
          kassaBanka: item.kassa_banka,
          aciqlama: item.aciqlama,
          mebleg: Number(item.mebleg),
          valyuta: item.valyuta || 'AZN',
          veziyyet: item.veziyyet,
          tekrarla: item.tekrarla
        }));
        setExpenseData(formattedData);
      }
      setIsLoading(false);
    };

    fetchExpenses();
  }, []);

  if (!isMounted) return null;

  const handleToggleStatus = async (id: string | number) => {
    const item = expenseData.find(i => i.id === id);
    if (!item) return;

    const newStatus = item.veziyyet === 'Ödənilib' ? 'Ödənilməyib' : 'Ödənilib';
    const supabase = createClient();
    
    const { error } = await supabase
      .from('erp_expenses')
      .update({ veziyyet: newStatus })
      .eq('id', id);

    if (!error) {
      const newData = expenseData.map(i => i.id === id ? { ...i, veziyyet: newStatus } : i);
      setExpenseData(newData);
    } else {
      alert("Status yenilənərkən xəta baş verdi.");
    }
  };

  const handleDelete = async (id: string | number) => {
    if(confirm('Bu xərci silmək istədiyinizə əminsiniz?')) {
      const supabase = createClient();
      const { error } = await supabase.from('erp_expenses').delete().eq('id', id);
      
      if (!error) {
        const newData = expenseData.filter(item => item.id !== id);
        setExpenseData(newData);
      } else {
        alert("Silinərkən xəta baş verdi.");
      }
    }
  };

  const filteredData = expenseData.filter(item => {
    if (filterStatus !== 'Hamısı' && item.veziyyet !== filterStatus) return false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        item.kateqoriya?.toLowerCase().includes(search) ||
        item.kassaBanka?.toLowerCase().includes(search) ||
        item.aciqlama?.toLowerCase().includes(search)
      );
    }
    return true;
  });

  const grandTotal = filteredData.reduce((acc, curr) => acc + (Number(curr.mebleg) || 0), 0);

  return (
    <div style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ backgroundColor: '#ffedd5', padding: '0.5rem', borderRadius: '8px', color: '#f97316' }}>
            <TrendingDown size={24} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b' }}>Xərc Siyahısı</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => router.push('/erp/giderler/yeni')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', backgroundColor: '#f97316', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(249, 115, 22, 0.2)' }} 
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} 
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Plus size={18} /> Yeni Xərc
          </button>
        </div>
      </div>

      {/* Toolbar & Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
          <input 
            type="text" 
            placeholder="Kateqoriya, kassa, açıqlama axtar..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem', transition: 'all 0.2s' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#f97316'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.1)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.boxShadow = 'none' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['Hamısı', 'Ödənilib', 'Ödənilməyib'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                border: filterStatus === status ? '1px solid #f97316' : '1px solid #e2e8f0',
                backgroundColor: filterStatus === status ? '#fff7ed' : 'white',
                color: filterStatus === status ? '#f97316' : '#64748b'
              }}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={thStyle}>Tarix</th>
                <th style={thStyle}>Kateqoriya</th>
                <th style={thStyle}>Kassa / Banka</th>
                <th style={thStyle}>Təkrarla</th>
                <th style={thStyle}>Açıqlama</th>
                <th style={{...thStyle, textAlign: 'right'}}>Məbləğ</th>
                <th style={{...thStyle, textAlign: 'center'}}>Valyuta</th>
                <th style={thStyle}>Vəziyyət</th>
                <th style={{...thStyle, textAlign: 'center', width: '120px'}}>Əməliyyat</th>
              </tr>
            </thead>
            {isLoading ? (
              <tr>
                <td colSpan={9} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                  <div style={{ display: 'inline-block', width: '24px', height: '24px', border: '3px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  <div style={{ marginTop: '0.5rem' }}>Məlumatlar Buluddan (Supabase) Yüklənir...</div>
                </td>
              </tr>
            ) : (
            <tbody>
              {filteredData.length > 0 ? filteredData.map((row) => (
                <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={tdStyle}>{row.tarix}</td>
                  <td style={{...tdStyle, fontWeight: 600, color: '#0f172a'}}>{row.kateqoriya}</td>
                  <td style={{...tdStyle, display: 'flex', alignItems: 'center', gap: '0.5rem'}}><Banknote size={16} color="#64748b"/> {row.kassaBanka}</td>
                  <td style={{...tdStyle, fontWeight: 600, color: row.tekrarla && row.tekrarla !== 'Təkrarlanmır' ? '#f97316' : '#94a3b8'}}>{row.tekrarla || 'Təkrarlanmır'}</td>
                  <td style={{...tdStyle, maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis'}} title={row.aciqlama}>{row.aciqlama || '-'}</td>
                  <td style={{...tdStyle, textAlign: 'right', fontWeight: 700, color: '#ef4444'}}>{Number(row.mebleg || 0).toLocaleString('az-AZ', { minimumFractionDigits: 2 })}</td>
                  <td style={{...tdStyle, textAlign: 'center', fontWeight: 600, color: '#64748b'}}>{row.valyuta || 'AZN'}</td>
                  <td style={tdStyle}>
                    {row.veziyyet === 'Ödənilib' 
                      ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '99px', backgroundColor: '#dcfce7', color: '#166534', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' }}><CheckCircle2 size={14}/> Ödənilib</span>
                      : <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '99px', backgroundColor: '#fee2e2', color: '#991b1b', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' }}><Clock size={14}/> Ödənilməyib</span>
                    }
                  </td>
                  <td style={{...tdStyle, textAlign: 'center'}}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                      <button 
                        onClick={() => handleToggleStatus(row.id)}
                        title={row.veziyyet === 'Ödənilib' ? "Ödənilməyib et" : "Ödənilib et"}
                        style={{ background: 'white', border: '1px solid #cbd5e1', cursor: 'pointer', padding: '0.4rem', borderRadius: '6px', color: row.veziyyet === 'Ödənilib' ? '#ef4444' : '#10b981', display: 'flex', alignItems: 'center', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                        onMouseOver={e => { e.currentTarget.style.borderColor = row.veziyyet === 'Ödənilib' ? '#ef4444' : '#10b981'; e.currentTarget.style.backgroundColor = row.veziyyet === 'Ödənilib' ? '#fef2f2' : '#ecfdf5' }}
                        onMouseOut={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.backgroundColor = 'white' }}
                      >
                        {row.veziyyet === 'Ödənilib' ? <Clock size={16} /> : <CheckCircle2 size={16} />}
                      </button>
                      <button 
                        onClick={() => router.push(`/erp/giderler/yeni?id=${row.id}`)}
                        title="Düzəliş Et"
                        style={{ background: 'white', border: '1px solid #cbd5e1', cursor: 'pointer', padding: '0.4rem', borderRadius: '6px', color: '#3b82f6', display: 'flex', alignItems: 'center', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                        onMouseOver={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.backgroundColor = '#eff6ff' }}
                        onMouseOut={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.backgroundColor = 'white' }}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(row.id)}
                        title="Sil"
                        style={{ background: 'white', border: '1px solid #cbd5e1', cursor: 'pointer', padding: '0.4rem', borderRadius: '6px', color: '#64748b', display: 'flex', alignItems: 'center', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                        onMouseOver={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.backgroundColor = '#fef2f2' }}
                        onMouseOut={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.backgroundColor = 'white' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={9} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                    Axtarışınıza uyğun qeyd tapılmadı.
                  </td>
                </tr>
              )}
            </tbody>
            )}
            
            {/* Table Footer - Totals */}
            <tfoot>
              <tr style={{ backgroundColor: '#f8fafc', borderTop: '2px solid #e2e8f0', borderBottom: '2px solid #e2e8f0' }}>
                <td colSpan={5} style={{ padding: '1.2rem', textAlign: 'right', fontWeight: 800, color: '#334155', fontSize: '1.1rem' }}>Ümumi Toplam:</td>
                <td style={{ padding: '1.2rem', textAlign: 'right', fontWeight: 800, color: '#ef4444', fontSize: '1.2rem' }}>
                  {grandTotal.toLocaleString('az-AZ', { minimumFractionDigits: 2 })}
                </td>
                <td style={{ padding: '1.2rem', textAlign: 'center', fontWeight: 800, color: '#64748b' }}>AZN</td>
                <td colSpan={2}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = { padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' };
const tdStyle: React.CSSProperties = { padding: '1rem', color: '#334155', fontSize: '0.95rem', whiteSpace: 'nowrap' };

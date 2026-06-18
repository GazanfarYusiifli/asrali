'use client';
import React, { useState, useEffect, useRef } from 'react';
import { FileText, MoreHorizontal, FileOutput, Printer, Mail, Layers, Search, Plus, Filter, Copy, Edit, Trash2, CheckCircle2, Clock, Package } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';

export default function AlisSiyahisiPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [purchaseData, setPurchaseData] = useState<any[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Hamısı');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const existing = getAppStorage('erp_purchases');
    if (existing) {
      setPurchaseData(JSON.parse(existing));
    } else {
      const defaultData = [
        { id: 1, tarih: '2026-06-17', evrakNo: 'EVR-P001', faturaNo: 'INV-P1001', hesapAdi: 'Topdan Satış Mərkəzi', aciklama: 'Kompüter ehtiyat hissələri', teslimDurumu: 'Təslim Edildi', miktar: 5400.00 },
        { id: 2, tarih: '2026-06-16', evrakNo: 'EVR-P002', faturaNo: 'INV-P1002', hesapAdi: 'Baku Electronics MMC', aciklama: 'Monitorlar', teslimDurumu: 'Təslim Edilməyib', miktar: 2200.50 }
      ];
      setPurchaseData(defaultData);
      setAppStorage('erp_purchases', JSON.stringify(defaultData));
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isMounted) return null;

  const handleCopy = (row: any) => {
    const newPurchase = { 
      ...row, 
      id: Date.now(), 
      evrakNo: row.evrakNo + ' (Kopya)', 
      faturaNo: row.faturaNo ? row.faturaNo + ' (Kopya)' : '-' 
    };
    const newData = [newPurchase, ...purchaseData];
    setPurchaseData(newData);
    setAppStorage('erp_purchases', JSON.stringify(newData));
    setActiveDropdown(null);
    alert('Alış qeydi uğurla kopyalandı!');
  };

  const handleToggleStatus = (id: number) => {
    const newData = purchaseData.map(item => {
      if (item.id === id) {
        return {
          ...item,
          teslimDurumu: item.teslimDurumu === 'Təslim Edildi' ? 'Təslim Edilməyib' : 'Təslim Edildi'
        };
      }
      return item;
    });
    setPurchaseData(newData);
    setAppStorage('erp_purchases', JSON.stringify(newData));
    setActiveDropdown(null);
  };

  const handleDelete = (id: number) => {
    if(confirm('Bu alış qeydini silmək istədiyinizə əminsiniz?')) {
      const newData = purchaseData.filter(item => item.id !== id);
      setPurchaseData(newData);
      setAppStorage('erp_purchases', JSON.stringify(newData));
      setActiveDropdown(null);
    }
  };

  const handleAlert = (msg: string) => {
    setActiveDropdown(null);
    alert(msg);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Təslim Edildi':
        return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '99px', backgroundColor: '#dcfce7', color: '#166534', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' }}><CheckCircle2 size={14}/> {status}</span>;
      case 'Təslim Edilməyib':
        return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '99px', backgroundColor: '#fee2e2', color: '#991b1b', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' }}><Clock size={14}/> {status}</span>;
      default:
        return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '99px', backgroundColor: '#fee2e2', color: '#991b1b', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' }}><Clock size={14}/> Təslim Edilməyib</span>;
    }
  };

  const filteredData = purchaseData.filter(item => {
    if (filterStatus !== 'Hamısı' && item.teslimDurumu !== filterStatus) return false;
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return (
        item.hesapAdi.toLowerCase().includes(search) ||
        item.evrakNo.toLowerCase().includes(search) ||
        item.faturaNo?.toLowerCase().includes(search) ||
        item.aciklama.toLowerCase().includes(search)
      );
    }
    return true;
  });

  return (
    <div style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ backgroundColor: '#fee2e2', padding: '0.5rem', borderRadius: '8px', color: '#ef4444' }}>
            <FileText size={24} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b' }}>Alış Siyahısı</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => router.push('/erp/alislar/yeni')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.2)' }} 
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} 
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Plus size={18} /> Yeni Alış
          </button>
        </div>
      </div>

      {/* Toolbar & Filter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ position: 'relative', width: '300px' }}>
          <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
          <input 
            type="text" 
            placeholder="Təchizatçı, sənəd no və s. üzrə axtar..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem', transition: 'all 0.2s' }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)' }}
            onBlur={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.boxShadow = 'none' }}
          />
        </div>
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', color: '#475569', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}
            onMouseOut={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
          >
            <Filter size={18} /> {filterStatus}
          </button>
          
          {isFilterOpen && (
            <div style={{ position: 'absolute', right: '0', top: '40px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', width: '200px', zIndex: 50, overflow: 'hidden' }}>
              <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Təslim Vəziyyəti</div>
              {['Hamısı', 'Təslim Edildi', 'Təslim Edilməyib'].map(status => (
                <button 
                  key={status}
                  onClick={() => { setFilterStatus(status); setIsFilterOpen(false); }}
                  style={{ width: '100%', padding: '0.75rem 1rem', textAlign: 'left', backgroundColor: 'white', border: 'none', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', fontSize: '0.9rem', color: '#334155', transition: 'all 0.1s' }}
                  onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={thStyle}>Tarix</th>
                <th style={thStyle}>Sənəd No</th>
                <th style={thStyle}>Faktura No</th>
                <th style={thStyle}>Hesab Adı (Təchizatçı)</th>
                <th style={thStyle}>Açıqlama</th>
                <th style={thStyle}>Təslim Vəziyyəti</th>
                <th style={{...thStyle, textAlign: 'right'}}>Məbləğ</th>
                <th style={{...thStyle, width: '120px', textAlign: 'center'}}>Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row) => (
                <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <td style={tdStyle}>{row.tarih}</td>
                  <td style={{...tdStyle, fontWeight: 600}}>{row.evrakNo}</td>
                  <td style={tdStyle}>{row.faturaNo}</td>
                  <td style={{...tdStyle, color: '#ef4444', fontWeight: 600}}>{row.hesapAdi}</td>
                  <td style={tdStyle}>{row.aciklama}</td>
                  <td style={tdStyle}>{getStatusBadge(row.teslimDurumu)}</td>
                  <td style={{...tdStyle, textAlign: 'right', fontWeight: 700}}>{Number(row.miktar).toLocaleString('az-AZ', { minimumFractionDigits: 2 })} ₼</td>
                  <td style={{...tdStyle, textAlign: 'center'}}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleToggleStatus(row.id); }}
                        title={row.teslimDurumu === 'Təslim Edildi' ? "Təslim Edilməyib olaraq işarələ" : "Təslim Edildi olaraq işarələ"}
                        style={{ background: 'white', border: '1px solid #cbd5e1', cursor: 'pointer', padding: '0.4rem', borderRadius: '6px', color: row.teslimDurumu === 'Təslim Edildi' ? '#ef4444' : '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                        onMouseOver={e => { e.currentTarget.style.borderColor = row.teslimDurumu === 'Təslim Edildi' ? '#ef4444' : '#10b981'; e.currentTarget.style.backgroundColor = row.teslimDurumu === 'Təslim Edildi' ? '#fef2f2' : '#ecfdf5' }}
                        onMouseOut={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.backgroundColor = 'white' }}
                      >
                        {row.teslimDurumu === 'Təslim Edildi' ? <Clock size={16} /> : <CheckCircle2 size={16} />}
                      </button>
                      
                      <button 
                        onClick={(e) => { e.stopPropagation(); router.push(`/erp/alislar/yeni?id=${row.id}`); }}
                        title="Düzəliş Et"
                        style={{ background: 'white', border: '1px solid #cbd5e1', cursor: 'pointer', padding: '0.4rem', borderRadius: '6px', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                        onMouseOver={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.backgroundColor = '#eff6ff' }}
                        onMouseOut={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.backgroundColor = 'white' }}
                      >
                        <Edit size={16} />
                      </button>

                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }}
                        title="Sənədi Sil"
                        style={{ background: 'white', border: '1px solid #cbd5e1', cursor: 'pointer', padding: '0.4rem', borderRadius: '6px', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                        onMouseOver={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.backgroundColor = '#fef2f2' }}
                        onMouseOut={e => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#64748b'; e.currentTarget.style.backgroundColor = 'white' }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                    Axtarışınıza uyğun alış qeydi tapılmadı.
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

function DropdownItem({ icon, label, onClick }: { icon: React.ReactNode, label: React.ReactNode, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      style={{ width: '100%', padding: '0.6rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: '#475569', transition: 'background-color 0.15s' }}
      onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8fafc'}
      onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      {icon} {label}
    </button>
  );
}

const thStyle: React.CSSProperties = { padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' };
const tdStyle: React.CSSProperties = { padding: '1rem', color: '#334155', fontSize: '0.95rem', whiteSpace: 'nowrap' };

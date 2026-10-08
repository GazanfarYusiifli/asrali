'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Filter, Download, MoreHorizontal, FileText, CheckCircle2, Clock, Package, Edit, Trash2, Copy, FileOutput, History, FileImage, Layers } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';
import { createClient } from '@/utils/supabase/client';

export default function SatisListesiPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [salesData, setSalesData] = useState<any[]>([]);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('Hamısı');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  // Initialize data from Supabase
  useEffect(() => {
    setIsMounted(true);
    
    const fetchSales = async () => {
      setIsLoading(true);
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('erp_sales')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Supabase fetch error (erp_sales):", error);
        // Fallback or empty if table doesn't exist yet
        setSalesData([]);
      } else if (data) {
        // Map database fields back to camelCase used in UI if needed
        const formattedData = data.map(item => ({
          id: item.id,
          tarih: item.tarih,
          evrakNo: item.evrak_no,
          faturaNo: item.fatura_no,
          hesapAdi: item.hesap_adi,
          aciklama: item.aciklama,
          teslimDurumu: item.teslim_durumu,
          miktar: Number(item.miktar)
        }));
        setSalesData(formattedData);
      }
      setIsLoading(false);
    };

    fetchSales();
  }, []);

  // Close dropdown when clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  if (!isMounted) return null;

  const handleDelete = async (id: string | number) => {
    if (confirm('Bu satışı silmək istədiyinizə əminsiniz?')) {
      const supabase = createClient();
      const { error } = await supabase.from('erp_sales').delete().eq('id', id);
      
      if (!error) {
        const newData = salesData.filter(item => item.id !== id);
        setSalesData(newData);
      } else {
        alert("Silinərkən xəta baş verdi. Verilənlər bazası bağlantısını yoxlayın.");
      }
      setActiveDropdown(null);
    }
  };

  const handleCopy = async (row: any) => {
    const supabase = createClient();
    
    // Get currently logged in user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("İstifadəçi tapılmadı, zəhmət olmasa yenidən daxil olun.");
      return;
    }

    const newSale = { 
      user_id: user.id,
      tarih: row.tarih,
      evrak_no: row.evrakNo + ' (Kopya)',
      fatura_no: row.faturaNo ? row.faturaNo + ' (Kopya)' : '-',
      hesap_adi: row.hesapAdi,
      aciklama: row.aciklama,
      teslim_durumu: row.teslimDurumu,
      miktar: row.miktar
    };

    const { data, error } = await supabase.from('erp_sales').insert([newSale]).select();

    if (!error && data) {
      const formattedSale = {
        id: data[0].id,
        tarih: data[0].tarih,
        evrakNo: data[0].evrak_no,
        faturaNo: data[0].fatura_no,
        hesapAdi: data[0].hesap_adi,
        aciklama: data[0].aciklama,
        teslimDurumu: data[0].teslim_durumu,
        miktar: data[0].miktar
      };
      setSalesData([formattedSale, ...salesData]);
      alert('Satış qeydi uğurla kopyalandı!');
    } else {
      alert("Kopyalanarkən xəta baş verdi.");
    }
    setActiveDropdown(null);
  };

  const handleToggleStatus = async (id: string | number) => {
    const item = salesData.find(i => i.id === id);
    if (!item) return;

    const newStatus = item.teslimDurumu === 'Təslim Edildi' ? 'Təslim Edilməyib' : 'Təslim Edildi';
    const supabase = createClient();
    
    const { error } = await supabase
      .from('erp_sales')
      .update({ teslim_durumu: newStatus })
      .eq('id', id);

    if (!error) {
      const newData = salesData.map(i => i.id === id ? { ...i, teslimDurumu: newStatus } : i);
      setSalesData(newData);
    } else {
      alert("Status yenilənərkən xəta baş verdi.");
    }
    setActiveDropdown(null);
  };

  const handleAlert = (msg: string) => {
    setActiveDropdown(null);
    alert(msg);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'Təslim Edildi':
        return (
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '6px', 
            padding: '5px 12px', 
            borderRadius: '9999px', 
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.08) 100%)', 
            border: '1px solid rgba(16, 185, 129, 0.28)', 
            color: '#047857', 
            fontSize: '0.8rem', 
            fontWeight: 650, 
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 6px rgba(16, 185, 129, 0.08)'
          }}>
            <CheckCircle2 size={13} strokeWidth={2.6} style={{ color: '#10b981' }} />
            <span>{status}</span>
          </span>
        );
      case 'Təslim Edilməyib':
        return (
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '6px', 
            padding: '5px 12px', 
            borderRadius: '9999px', 
            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.08) 0%, rgba(220, 38, 38, 0.04) 100%)', 
            border: '1px solid rgba(239, 68, 68, 0.22)', 
            color: '#b91c1c', 
            fontSize: '0.8rem', 
            fontWeight: 600, 
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 6px rgba(239, 68, 68, 0.06)'
          }}>
            <Clock size={13} strokeWidth={2.4} style={{ color: '#ef4444' }} />
            <span>{status}</span>
          </span>
        );
      default:
        return (
          <span style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '6px', 
            padding: '5px 12px', 
            borderRadius: '9999px', 
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(217, 119, 6, 0.04) 100%)', 
            border: '1px solid rgba(245, 158, 11, 0.22)', 
            color: '#b45309', 
            fontSize: '0.8rem', 
            fontWeight: 600, 
            whiteSpace: 'nowrap'
          }}>
            <Clock size={13} strokeWidth={2.4} style={{ color: '#f59e0b' }} />
            <span>Təslim Edilməyib</span>
          </span>
        );
    }
  };

  const filteredData = salesData.filter(item => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      (String(item.hesapAdi || '')).toLowerCase().includes(searchLower) || 
      (String(item.evrakNo || '')).toLowerCase().includes(searchLower) || 
      (String(item.faturaNo || '')).toLowerCase().includes(searchLower) ||
      (String(item.aciklama || '')).toLowerCase().includes(searchLower);
      
    const matchesFilter = filterStatus === 'Hamısı' ? true : item.teslimDurumu === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const handleExport = () => {
    if (filteredData.length === 0) {
      alert("Eksport etmək üçün məlumat yoxdur.");
      return;
    }
    const headers = ['Tarix', 'Sənəd No', 'Faktura No', 'Hesab Adı', 'Açıqlama', 'Təslim Vəziyyəti', 'Məbləğ (AZN)'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(row => [
        row.tarih, 
        row.evrakNo, 
        row.faturaNo, 
        `"${row.hesapAdi}"`, 
        `"${row.aciklama}"`, 
        row.teslimDurumu, 
        row.miktar
      ].join(','))
    ].join('\n');

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' }); // \uFEFF for Excel UTF-8 BOM
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Satis_Siyahisi_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
              padding: '0.6rem', 
              borderRadius: '12px', 
              color: 'white',
              boxShadow: '0 6px 16px -2px rgba(16, 185, 129, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={22} />
            </div>
            Satış Siyahısı
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.92rem', marginTop: '0.25rem' }}>Bütün satış qaimələrini, müqavilə və fakturalarını buradan real vaxtda izləyin.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button 
            onClick={handleExport} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              padding: '0.65rem 1.25rem', 
              backgroundColor: '#ffffff', 
              border: '1px solid #e2e8f0', 
              borderRadius: '10px', 
              color: '#334155', 
              fontWeight: 600, 
              fontSize: '0.88rem',
              cursor: 'pointer', 
              boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)' 
            }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <Download size={17} style={{ color: '#64748b' }} />
            Eksport
          </button>
          
          <button 
            onClick={() => router.push('/erp/satislar/yeni')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              padding: '0.65rem 1.35rem', 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
              border: 'none', 
              borderRadius: '10px', 
              color: 'white', 
              fontWeight: 600, 
              fontSize: '0.88rem',
              cursor: 'pointer', 
              boxShadow: '0 8px 20px -3px rgba(16, 185, 129, 0.38)', 
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)' 
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 24px -3px rgba(16, 185, 129, 0.45)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 20px -3px rgba(16, 185, 129, 0.38)'; }}
          >
            <Plus size={18} strokeWidth={2.4} />
            Yeni Satış
          </button>
        </div>
      </div>

      {/* Main Container Card */}
      <div style={{ 
        backgroundColor: '#ffffff', 
        borderRadius: '16px', 
        border: '1px solid rgba(226, 232, 240, 0.8)', 
        overflow: 'hidden', 
        boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.04), 0 2px 6px -1px rgba(15, 23, 42, 0.02)', 
        minHeight: '600px',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {/* Toolbar */}
        <div style={{ 
          padding: '1.15rem 1.75rem', 
          borderBottom: '1px solid #f1f5f9', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          backgroundColor: '#fafbfc',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ position: 'relative', width: '380px', maxWidth: '100%' }}>
            <Search size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Hesab adı, Sənəd No, Faktura, Açıqlama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.65rem 1rem 0.65rem 2.6rem', 
                borderRadius: '10px', 
                border: '1px solid #e2e8f0', 
                outline: 'none', 
                fontSize: '0.88rem', 
                color: '#0f172a',
                backgroundColor: '#ffffff',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
              }}
              onFocus={(e) => { 
                e.currentTarget.style.borderColor = '#10b981'; 
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.12)';
              }}
              onBlur={(e) => { 
                e.currentTarget.style.borderColor = '#e2e8f0'; 
                e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)';
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                padding: '0.6rem 1.15rem', 
                backgroundColor: filterStatus !== 'Hamısı' ? 'rgba(16, 185, 129, 0.08)' : '#ffffff', 
                border: filterStatus !== 'Hamısı' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid #e2e8f0', 
                borderRadius: '10px', 
                color: filterStatus !== 'Hamısı' ? '#059669' : '#475569', 
                fontSize: '0.88rem', 
                cursor: 'pointer', 
                fontWeight: 600,
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                if (filterStatus === 'Hamısı') e.currentTarget.style.backgroundColor = '#f8fafc';
              }}
              onMouseOut={(e) => {
                if (filterStatus === 'Hamısı') e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              <Filter size={15} style={{ color: filterStatus !== 'Hamısı' ? '#059669' : '#64748b' }} /> 
              <span>Filterlər:</span>
              <span style={{ color: filterStatus !== 'Hamısı' ? '#059669' : '#0f172a', fontWeight: 700 }}>{filterStatus}</span>
            </button>
            
            {isFilterOpen && (
              <div style={{ 
                position: 'absolute', 
                right: '0', 
                top: '46px', 
                backgroundColor: '#ffffff', 
                borderRadius: '12px', 
                border: '1px solid #e2e8f0', 
                boxShadow: '0 14px 28px -4px rgba(15, 23, 42, 0.12), 0 4px 10px -2px rgba(15, 23, 42, 0.04)', 
                width: '210px', 
                zIndex: 50, 
                overflow: 'hidden' 
              }}>
                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #f1f5f9', backgroundColor: '#fafbfc', fontSize: '0.74rem', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                  Təslim Vəziyyəti
                </div>
                {['Hamısı', 'Təslim Edildi', 'Təslim Edilməyib'].map(status => (
                  <button 
                    key={status}
                    onClick={() => { setFilterStatus(status); setIsFilterOpen(false); }}
                    style={{ 
                      width: '100%', 
                      padding: '0.65rem 1rem', 
                      textAlign: 'left', 
                      background: filterStatus === status ? 'rgba(16, 185, 129, 0.08)' : '#ffffff', 
                      border: 'none', 
                      cursor: 'pointer', 
                      fontSize: '0.88rem', 
                      color: filterStatus === status ? '#059669' : '#334155', 
                      fontWeight: filterStatus === status ? 600 : 500, 
                      borderBottom: '1px solid #f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseOver={(e) => { if(filterStatus !== status) e.currentTarget.style.backgroundColor = '#f8fafc' }}
                    onMouseOut={(e) => { if(filterStatus !== status) e.currentTarget.style.backgroundColor = '#ffffff' }}
                  >
                    <span>{status}</span>
                    {filterStatus === status && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table Container */}
        <div style={{ overflowX: 'auto', flex: 1, paddingBottom: '80px' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '0.9rem 1.5rem', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0' }}>Tarix</th>
                <th style={{ padding: '0.9rem 1.5rem', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0' }}>Sənəd No</th>
                <th style={{ padding: '0.9rem 1.5rem', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0' }}>Faktura No</th>
                <th style={{ padding: '0.9rem 1.5rem', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0' }}>Hesab Adı</th>
                <th style={{ padding: '0.9rem 1.5rem', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0' }}>Açıqlama</th>
                <th style={{ padding: '0.9rem 1.5rem', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0' }}>Təslim Vəziyyəti</th>
                <th style={{ padding: '0.9rem 1.5rem', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right', borderBottom: '1px solid #e2e8f0' }}>Məbləğ</th>
                <th style={{ padding: '0.9rem 1.5rem', width: '56px', borderBottom: '1px solid #e2e8f0' }}></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} style={{ padding: '4rem 2rem', textAlign: 'center', color: '#64748b' }}>
                    <div style={{ display: 'inline-block', width: '28px', height: '28px', border: '3px solid #e2e8f0', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
                    <div style={{ marginTop: '0.85rem', fontWeight: 600, color: '#475569', fontSize: '0.92rem' }}>Məlumatlar Buluddan (Supabase) Yüklənir...</div>
                  </td>
                </tr>
              ) : (
                <>
                  {filteredData.map((row) => (
                    <tr 
                      key={row.id} 
                      className="hover-row"
                      style={{ 
                        borderBottom: '1px solid #f1f5f9', 
                        transition: 'background-color 0.15s ease' 
                      }}
                    >
                      <td style={{ padding: '1.05rem 1.5rem', fontSize: '0.88rem', color: '#475569', fontWeight: 500, whiteSpace: 'nowrap' }}>
                        {row.tarih}
                      </td>
                      <td style={{ padding: '1.05rem 1.5rem', whiteSpace: 'nowrap' }}>
                        <span style={{ 
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          backgroundColor: '#ecfdf5',
                          color: '#059669',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          fontFamily: 'monospace',
                          letterSpacing: '0.02em',
                          border: '1px solid rgba(16, 185, 129, 0.2)'
                        }}>
                          {row.evrakNo}
                        </span>
                      </td>
                      <td style={{ padding: '1.05rem 1.5rem', fontSize: '0.88rem', color: '#64748b', fontFamily: 'monospace' }}>
                        {row.faturaNo}
                      </td>
                      <td style={{ padding: '1.05rem 1.5rem', fontSize: '0.92rem', color: '#0f172a', fontWeight: 600 }}>
                        {row.hesapAdi}
                      </td>
                      <td style={{ padding: '1.05rem 1.5rem', fontSize: '0.86rem', color: '#64748b', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {row.aciklama || '—'}
                      </td>
                      <td style={{ padding: '1.05rem 1.5rem' }}>
                        {getStatusBadge(row.teslimDurumu)}
                      </td>
                      <td style={{ padding: '1.05rem 1.5rem', fontSize: '1rem', color: '#0f172a', fontWeight: 700, textAlign: 'right', whiteSpace: 'nowrap' }}>
                        {Number(row.miktar || 0).toLocaleString('az-AZ', { style: 'currency', currency: 'AZN' })}
                      </td>
                      <td style={{ padding: '1.05rem 1.5rem', position: 'relative', textAlign: 'center' }}>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === row.id ? null : row.id); }}
                          style={{ 
                            background: 'transparent', 
                            border: '1px solid transparent', 
                            borderRadius: '8px', 
                            color: '#94a3b8', 
                            cursor: 'pointer', 
                            padding: '0.35rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; e.currentTarget.style.color = '#334155'; }}
                          onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#94a3b8'; }}
                        >
                          <MoreHorizontal size={18}/>
                        </button>
                        
                        {/* Action Dropdown Menu */}
                        {activeDropdown === row.id && (
                          <div 
                            ref={dropdownRef} 
                            style={{ 
                              position: 'absolute', 
                              right: '48px', 
                              top: '24px', 
                              backgroundColor: '#ffffff', 
                              borderRadius: '12px', 
                              border: '1px solid #e2e8f0', 
                              boxShadow: '0 16px 32px -4px rgba(15, 23, 42, 0.16), 0 4px 12px -2px rgba(15, 23, 42, 0.06)', 
                              width: '224px', 
                              zIndex: 60, 
                              overflow: 'hidden' 
                            }}
                          >
                            
                            <div style={{ padding: '0.4rem 0', borderBottom: '1px solid #f1f5f9' }}>
                              <DropdownItem icon={<Edit size={15} />} label="Düzəliş Et" onClick={() => { setActiveDropdown(null); router.push(`/erp/satislar/yeni?id=${row.id}`); }} />
                              <DropdownItem icon={row.teslimDurumu === 'Təslim Edildi' ? <Clock size={15}/> : <CheckCircle2 size={15}/>} label={row.teslimDurumu === 'Təslim Edildi' ? "Təslim Edilməyib Et" : "Təslim Edildi Et"} onClick={() => handleToggleStatus(row.id)} />
                              <DropdownItem icon={<Copy size={15} />} label="Kopyala" onClick={() => handleCopy(row)} />
                              <DropdownItem icon={<FileOutput size={15} />} label="Böl" onClick={() => handleAlert('Sənəd bölmə funksiyası aktivləşdirilir...')} />
                              <DropdownItem icon={<Layers size={15} />} label="Birləşdir" onClick={() => handleAlert('Birdən çox sənədi birləşdirmək üçün siyahıdan seçin.')} />
                            </div>
                            
                            <div style={{ padding: '0.4rem 0', borderBottom: '1px solid #f1f5f9' }}>
                              <DropdownItem icon={<FileText size={15} />} label="Faktura Çapı" onClick={() => { setActiveDropdown(null); window.print(); }} />
                              <DropdownItem icon={<FileText size={15} />} label="Təhvil Qaiməsi" onClick={() => handleAlert('Təhvil qaiməsi PDF formatında formalaşdırılır...')} />
                              <DropdownItem icon={<FileText size={15} />} label="Satış Müqaviləsi" onClick={() => handleAlert('Satış müqaviləsi PDF formatında formalaşdırılır...')} />
                              <DropdownItem icon={<Download size={15} />} label="Excel Yüklə" onClick={() => handleAlert('Bu sənədin məlumatları Excel (XLSX) olaraq yüklənir...')} />
                            </div>
                            
                            <div style={{ padding: '0.4rem 0', borderBottom: '1px solid #f1f5f9' }}>
                              <DropdownItem icon={<Plus size={15} />} label="Satışı Təkrarla" onClick={() => { setActiveDropdown(null); router.push('/erp/satislar/yeni'); }} />
                              <DropdownItem icon={<FileImage size={15} />} label="Şəkil Yüklə" onClick={() => handleAlert('Sənədə aid şəkil və ya fayl yükləmək modulu açılır...')} />
                              <DropdownItem icon={<History size={15} />} label="Dəyişiklik Tarixçəsi" onClick={() => handleAlert('Bu sənəd üzərindəki bütün dəyişikliklərin tarixçəsi...')} />
                            </div>
    
                            <div style={{ padding: '0.4rem 0' }}>
                              <DropdownItem icon={<Trash2 size={15} color="#ef4444" />} label="Sil" textColor="#ef4444" onClick={() => handleDelete(row.id)} />
                            </div>
    
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredData.length === 0 && (
                    <tr>
                      <td colSpan={8} style={{ padding: '4rem 2rem', textAlign: 'center', color: '#94a3b8' }}>
                        <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>📄</div>
                        <div style={{ fontWeight: 600, color: '#64748b', fontSize: '0.95rem' }}>Heç bir satış qeydi tapılmadı</div>
                        <div style={{ fontSize: '0.82rem', color: '#94a3b8', marginTop: '0.2rem' }}>Axtarış meyarlarını dəyişin və ya yeni satış əlavə edin.</div>
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Modern Pagination Footer */}
        <div style={{ 
          padding: '1rem 1.75rem', 
          borderTop: '1px solid #f1f5f9', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          backgroundColor: '#fafbfc',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ fontSize: '0.86rem', color: '#64748b', fontWeight: 500 }}>
            Cəmi <span style={{ fontWeight: 700, color: '#0f172a' }}>{filteredData.length}</span> qeyd tapıldı
          </div>
          <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
            <button 
              style={{ 
                padding: '0.45rem 0.9rem', 
                backgroundColor: '#ffffff', 
                border: '1px solid #e2e8f0', 
                borderRadius: '8px', 
                fontSize: '0.82rem', 
                cursor: 'not-allowed', 
                color: '#cbd5e1',
                fontWeight: 600
              }} 
              disabled
            >
              Əvvəlki
            </button>
            <button 
              style={{ 
                padding: '0.45rem 0.95rem', 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                border: 'none', 
                borderRadius: '8px', 
                fontSize: '0.82rem', 
                cursor: 'pointer', 
                color: '#ffffff', 
                fontWeight: 700, 
                boxShadow: '0 3px 8px rgba(16, 185, 129, 0.3)' 
              }}
            >
              1
            </button>
            <button 
              style={{ 
                padding: '0.45rem 0.9rem', 
                backgroundColor: '#ffffff', 
                border: '1px solid #e2e8f0', 
                borderRadius: '8px', 
                fontSize: '0.82rem', 
                cursor: 'pointer', 
                color: '#475569',
                fontWeight: 600,
                transition: 'all 0.15s ease'
              }}
              onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
              onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#ffffff'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
            >
              Sonrakı
            </button>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hover-row:hover {
          background-color: #f8fafc !important;
        }
      `}} />
    </div>
  );
}

function DropdownItem({ icon, label, onClick, textColor = '#475569' }: { icon: React.ReactNode, label: string, onClick?: () => void, textColor?: string }) {
  return (
    <button 
      onClick={onClick}
      style={{ 
        width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', 
        padding: '0.55rem 1.25rem', backgroundColor: 'transparent', border: 'none', 
        color: textColor, fontSize: '0.84rem', fontWeight: 500, cursor: 'pointer',
        textAlign: 'left',
        transition: 'background-color 0.15s ease'
      }}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      {icon}
      {label}
    </button>
  );
}


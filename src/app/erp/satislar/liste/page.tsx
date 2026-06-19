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
        return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '99px', backgroundColor: '#dcfce7', color: '#166534', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' }}><CheckCircle2 size={14}/> {status}</span>;
      case 'Təslim Edilməyib':
        return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '99px', backgroundColor: '#fee2e2', color: '#991b1b', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' }}><Clock size={14}/> {status}</span>;
      default:
        return <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', borderRadius: '99px', backgroundColor: '#fee2e2', color: '#991b1b', fontSize: '0.8rem', fontWeight: 600, whiteSpace: 'nowrap' }}><Clock size={14}/> Təslim Edilməyib</span>;
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
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ backgroundColor: '#dcfce7', padding: '0.5rem', borderRadius: '8px', color: '#10b981' }}>
              <FileText size={24} />
            </div>
            Satış Siyahısı
          </h1>
          <p style={{ color: '#64748b' }}>Bütün satış qaimələrini və fakturalarını buradan izləyin.</p>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#475569', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
          >
            <Download size={18} />
            Eksport
          </button>
          <button 
            onClick={() => router.push('/erp/satislar/yeni')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)', transition: 'transform 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Plus size={18} />
            Yeni Satış
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', minHeight: '600px' }}>
        
        {/* Toolbar */}
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
          <div style={{ position: 'relative', width: '350px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Hesab adı, Sənəd No, Faktura, Açıqlama..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem', color: '#0f172a' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.boxShadow = 'none' }}
            />
          </div>
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: filterStatus !== 'Hamısı' ? '#ecfdf5' : 'white', border: filterStatus !== 'Hamısı' ? '1px solid #10b981' : '1px solid #cbd5e1', borderRadius: '8px', color: filterStatus !== 'Hamısı' ? '#059669' : '#475569', fontSize: '0.9rem', cursor: 'pointer', fontWeight: filterStatus !== 'Hamısı' ? 600 : 500 }}
            >
              <Filter size={16} /> Filterlər: {filterStatus}
            </button>
            
            {isFilterOpen && (
              <div style={{ position: 'absolute', right: '0', top: '40px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', width: '200px', zIndex: 50, overflow: 'hidden' }}>
                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Təslim Vəziyyəti</div>
                {['Hamısı', 'Təslim Edildi', 'Təslim Edilməyib'].map(status => (
                  <button 
                    key={status}
                    onClick={() => { setFilterStatus(status); setIsFilterOpen(false); }}
                    style={{ width: '100%', padding: '0.6rem 1rem', textAlign: 'left', background: filterStatus === status ? '#ecfdf5' : 'white', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: filterStatus === status ? '#10b981' : '#334155', fontWeight: filterStatus === status ? 600 : 400, borderBottom: '1px solid #f1f5f9' }}
                    onMouseOver={(e) => { if(filterStatus !== status) e.currentTarget.style.backgroundColor = '#f8fafc' }}
                    onMouseOut={(e) => { if(filterStatus !== status) e.currentTarget.style.backgroundColor = 'white' }}
                  >
                    {status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'visible', paddingBottom: '100px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Tarix</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Sənəd No</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Faktura No</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Hesab Adı</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Açıqlama</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Təslim Vəziyyəti</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 700, color: '#475569', textAlign: 'right' }}>Məbləğ</th>
                <th style={{ padding: '1rem 1.5rem', width: '50px' }}></th>
              </tr>
            </thead>
            {isLoading ? (
              <tr>
                <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                  <div style={{ display: 'inline-block', width: '24px', height: '24px', border: '3px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  <div style={{ marginTop: '0.5rem' }}>Məlumatlar Buluddan (Supabase) Yüklənir...</div>
                </td>
              </tr>
            ) : (
            <tbody>
              {filteredData.map((row) => (
                <tr key={row.id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background-color 0.15s' }} className="hover-row">
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: '#334155', fontWeight: 500 }}>{row.tarih}</td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: '#10b981', fontWeight: 700 }}>{row.evrakNo}</td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: '#64748b' }}>{row.faturaNo}</td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: '#1e293b', fontWeight: 600 }}>{row.hesapAdi}</td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: '#64748b' }}>{row.aciklama}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>{getStatusBadge(row.teslimDurumu)}</td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '1rem', color: '#0f172a', fontWeight: 700, textAlign: 'right' }}>
                    {Number(row.miktar || 0).toLocaleString('az-AZ', { style: 'currency', currency: 'AZN' })}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', position: 'relative' }}>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveDropdown(activeDropdown === row.id ? null : row.id); }}
                      style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.2rem' }}
                    >
                      <MoreHorizontal size={20}/>
                    </button>
                    
                    {/* Action Dropdown Menu */}
                    {activeDropdown === row.id && (
                      <div ref={dropdownRef} style={{ position: 'absolute', right: '40px', top: '20px', backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', width: '220px', zIndex: 50, overflow: 'hidden' }}>
                        
                        <div style={{ padding: '0.5rem 0', borderBottom: '1px solid #e2e8f0' }}>
                          <DropdownItem icon={<Edit size={16} />} label="Düzəliş Et" onClick={() => { setActiveDropdown(null); router.push(`/erp/satislar/yeni?id=${row.id}`); }} />
                          <DropdownItem icon={row.teslimDurumu === 'Təslim Edildi' ? <Clock size={16}/> : <CheckCircle2 size={16}/>} label={row.teslimDurumu === 'Təslim Edildi' ? "Təslim Edilməyib Et" : "Təslim Edildi Et"} onClick={() => handleToggleStatus(row.id)} />
                          <DropdownItem icon={<Copy size={16} />} label="Kopyala" onClick={() => handleCopy(row)} />
                          <DropdownItem icon={<FileOutput size={16} />} label="Böl" onClick={() => handleAlert('Sənəd bölmə funksiyası aktivləşdirilir...')} />
                          <DropdownItem icon={<Layers size={16} />} label="Birləşdir" onClick={() => handleAlert('Birdən çox sənədi birləşdirmək üçün siyahıdan seçin.')} />
                        </div>
                        
                        <div style={{ padding: '0.5rem 0', borderBottom: '1px solid #e2e8f0' }}>
                          <DropdownItem icon={<FileText size={16} />} label="Faktura Çapı" onClick={() => { setActiveDropdown(null); window.print(); }} />
                          <DropdownItem icon={<FileText size={16} />} label="Təhvil Qaiməsi" onClick={() => handleAlert('Təhvil qaiməsi PDF formatında formalaşdırılır...')} />
                          <DropdownItem icon={<FileText size={16} />} label="Satış Müqaviləsi" onClick={() => handleAlert('Satış müqaviləsi PDF formatında formalaşdırılır...')} />
                          <DropdownItem icon={<Download size={16} />} label="Excel Yüklə" onClick={() => handleAlert('Bu sənədin məlumatları Excel (XLSX) olaraq yüklənir...')} />
                        </div>
                        
                        <div style={{ padding: '0.5rem 0', borderBottom: '1px solid #e2e8f0' }}>
                          <DropdownItem icon={<Plus size={16} />} label="Satışı Təkrarla" onClick={() => { setActiveDropdown(null); router.push('/erp/satislar/yeni'); }} />
                          <DropdownItem icon={<FileImage size={16} />} label="Şəkil Yüklə" onClick={() => handleAlert('Sənədə aid şəkil və ya fayl yükləmək modulu açılır...')} />
                          <DropdownItem icon={<History size={16} />} label="Dəyişiklik Tarixçəsi" onClick={() => handleAlert('Bu sənəd üzərindəki bütün dəyişikliklərin tarixçəsi...')} />
                        </div>

                        <div style={{ padding: '0.5rem 0' }}>
                          <DropdownItem icon={<Trash2 size={16} color="#ef4444" />} label="Sil" textColor="#ef4444" onClick={() => handleDelete(row.id)} />
                        </div>

                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>Heç bir satış tapılmadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
          <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Cəmi {filteredData.length} qeyd tapıldı</div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button style={{ padding: '0.4rem 0.8rem', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', color: '#94a3b8' }} disabled>Əvvəlki</button>
            <button style={{ padding: '0.4rem 0.8rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', color: 'white', fontWeight: 600, boxShadow: '0 2px 4px rgba(16,185,129,0.2)' }}>1</button>
            <button style={{ padding: '0.4rem 0.8rem', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.85rem', cursor: 'pointer', color: '#475569' }}>Sonrakı</button>
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
        padding: '0.5rem 1.25rem', backgroundColor: 'transparent', border: 'none', 
        color: textColor, fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer',
        textAlign: 'left'
      }}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f1f5f9'}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      {icon}
      {label}
    </button>
  );
}

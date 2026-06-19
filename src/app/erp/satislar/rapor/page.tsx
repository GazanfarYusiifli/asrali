'use client';
import React, { useState, useEffect } from 'react';
import { BarChart3, Calendar, Hash, Banknote, DollarSign, Filter, Download, FileText, Search, X } from 'lucide-react';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';

export default function SatisRaporuPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [salesRecords, setSalesRecords] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter States
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    customer: '',
    branch: 'Bütün Filiallar',
    currency: 'Bütün Valyutalar',
    status: 'Hamısı',
    ecommerce: 'Hamısını Göstər',
    tag: 'Etiket seçin...'
  });

  useEffect(() => {
    setIsMounted(true);
    // Fetch SMM records
    let smmData = [];
    try {
      smmData = JSON.parse(getAppStorage('erp_smm_list') || '[]');
    } catch (e) {
      smmData = [];
    }
    const formattedSmm = smmData.map((item: any) => {
      const dateObj = new Date(item.id);
      return {
        id: `smm-${item.id}`,
        timestamp: item.id,
        tarix: item.smmData?.tarix?.includes('-') ? item.smmData.tarix.split('-').reverse().join('.') : (item.smmData?.tarix || '-'),
        saat: dateObj.toLocaleTimeString('az-AZ', { hour: '2-digit', minute: '2-digit' }),
        nov: 'SMM (Qəbz)',
        fakturaNo: '-',
        senedNo: `SPQ-${item.id?.toString().slice(-5) || ''}`,
        hesabKodu: item.accountData?.hesabKodu || '-',
        musteriAdi: item.accountData?.hesabAdi || 'Adsız',
        aciqlama: item.smmData?.xidmetAciklamasi || '-',
        mebleg: Number(item.calc?.totalPayable) || 0,
        valyuta: item.accountData?.valyuta || 'AZN'
      };
    });

    // Fetch Satış Siyahısı records
    let satisData = [];
    try {
      satisData = JSON.parse(getAppStorage('erp_sales') || '[]');
    } catch (e) {
      satisData = [];
    }
    const formattedSales = satisData.map((item: any) => {
      // Mock timestamp if not exists, prioritizing id for sorting
      const ts = item.id > 1000000000000 ? item.id : new Date(item.tarih).getTime();
      return {
        id: `satis-${item.id}`,
        timestamp: ts,
        tarix: item.tarih?.includes('-') ? item.tarih.split('-').reverse().join('.') : (item.tarih || '-'),
        saat: '12:00', // Mock time for old static records
        nov: 'Satış Fakturası',
        fakturaNo: item.faturaNo || '-',
        senedNo: item.evrakNo || '-',
        hesabKodu: '-',
        musteriAdi: item.hesapAdi || 'Adsız',
        aciqlama: item.aciklama || '-',
        mebleg: Number(item.miktar) || 0,
        valyuta: 'AZN'
      };
    });

    // Merge and Sort (Newest first)
    const combined = [...formattedSmm, ...formattedSales].sort((a, b) => b.timestamp - a.timestamp);
    setSalesRecords(combined);
  }, []);

  if (!isMounted) return null;

  // Derived Filtered Data
  const filteredRecords = salesRecords.filter(item => {
    // 1. Search Term
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      const matchesSearch = 
        String(item.musteriAdi || '').toLowerCase().includes(lowerSearch) ||
        String(item.senedNo || '').toLowerCase().includes(lowerSearch) ||
        String(item.fakturaNo || '').toLowerCase().includes(lowerSearch) ||
        String(item.aciqlama || '').toLowerCase().includes(lowerSearch);
      if (!matchesSearch) return false;
    }

    // 2. Date Range
    if (filters.startDate) {
      const itemDateParts = item.tarix.split('.'); // DD.MM.YYYY
      if (itemDateParts.length === 3) {
        const itemDate = new Date(`${itemDateParts[2]}-${itemDateParts[1]}-${itemDateParts[0]}`);
        const filterStart = new Date(filters.startDate);
        if (itemDate < filterStart) return false;
      }
    }
    if (filters.endDate) {
      const itemDateParts = item.tarix.split('.');
      if (itemDateParts.length === 3) {
        const itemDate = new Date(`${itemDateParts[2]}-${itemDateParts[1]}-${itemDateParts[0]}`);
        const filterEnd = new Date(filters.endDate);
        if (itemDate > filterEnd) return false;
      }
    }

    // 3. Customer Filter
    if (filters.customer && !item.musteriAdi?.toLowerCase().includes(filters.customer.toLowerCase())) {
      return false;
    }

    // 4. Currency
    if (filters.currency !== 'Bütün Valyutalar' && item.valyuta !== filters.currency) {
      return false;
    }

    // (Status, Branch, Ecommerce, Tags are mock filters for now as we don't have this data in all records)

    return true;
  });

  // Calculate top summary statistics based on FILTERED records
  const islemAdedi = filteredRecords.length;
  const toplamTutar = filteredRecords.reduce((acc, val) => acc + (val.mebleg || 0), 0);
  
  // Date formatting for the current period (e.g. "İyun 2026")
  const currentDate = new Date();
  const aylar = ["Yanvar", "Fevral", "Mart", "Aprel", "May", "İyun", "İyul", "Avqust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"];
  const donem = `${aylar[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

  return (
    <div style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <div style={{ backgroundColor: '#e0e7ff', padding: '0.5rem', borderRadius: '8px', color: '#4f46e5' }}>
              <BarChart3 size={24} />
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b' }}>Satış Hesabatı</h1>
          </div>
          <p style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 500 }}>
            <Calendar size={16} /> {donem} • AZN
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => setIsFilterOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', backgroundColor: 'white', border: '1px solid #cbd5e1', color: '#475569', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }} 
            onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8fafc'} 
            onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}
          >
            <Filter size={18} /> Filtrlər
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(16,185,129,0.2)' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <Download size={18} /> Excel-ə Çıxar
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        
        <div style={cardStyle}>
          <div style={cardIconWrapperStyle('#f0fdf4', '#16a34a')}><Calendar size={20} /></div>
          <div>
            <div style={cardLabelStyle}>DÖVR</div>
            <div style={cardValueStyle}>{donem}</div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={cardIconWrapperStyle('#eff6ff', '#2563eb')}><Hash size={20} /></div>
          <div>
            <div style={cardLabelStyle}>ƏMƏLİYYAT SAYI</div>
            <div style={cardValueStyle}>{islemAdedi}</div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={cardIconWrapperStyle('#fef2f2', '#dc2626')}><Banknote size={20} /></div>
          <div>
            <div style={cardLabelStyle}>ÜMUMİ MƏBLƏĞ</div>
            <div style={cardValueStyle}>{toplamTutar > 0 ? toplamTutar.toLocaleString('az-AZ', { minimumFractionDigits: 2 }) : '-'}</div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={cardIconWrapperStyle('#fefce8', '#ca8a04')}><DollarSign size={20} /></div>
          <div>
            <div style={cardLabelStyle}>VALYUTA</div>
            <div style={cardValueStyle}>AZN</div>
          </div>
        </div>

      </div>

      {/* Table Section */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        
        {/* Table Toolbar */}
        <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', backgroundColor: '#f8fafc' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
            <input 
              type="text" 
              placeholder="Qeydlərdə axtar..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem', transition: 'all 0.2s' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#4f46e5'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.1)' }}
              onBlur={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.boxShadow = 'none' }}
            />
          </div>
        </div>

        {/* Table Content */}
        <div style={{ overflowX: 'auto', flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1200px' }}>
            <thead>
              <tr style={{ backgroundColor: '#ffffff', borderBottom: '2px solid #e2e8f0' }}>
                <th style={thStyle}>SIRA</th>
                <th style={thStyle}>TARİX</th>
                <th style={thStyle}>SAAT</th>
                <th style={thStyle}>NÖV</th>
                <th style={thStyle}>FAKTURA NO</th>
                <th style={thStyle}>SƏNƏD NO</th>
                <th style={thStyle}>HESAB KODU</th>
                <th style={thStyle}>MÜŞTƏRİ ADI</th>
                <th style={thStyle}>AÇIQLAMA</th>
                <th style={{...thStyle, textAlign: 'right'}}>MƏBLƏĞ</th>
                <th style={{...thStyle, textAlign: 'center'}}>VALYUTA</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.length > 0 ? (
                filteredRecords.map((item, idx) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={tdStyle}>{idx + 1}</td>
                    <td style={tdStyle}>{item.tarix}</td>
                    <td style={tdStyle}>{item.saat}</td>
                    <td style={{...tdStyle, color: item.nov.includes('SMM') ? '#8b5cf6' : '#10b981', fontWeight: 600}}>{item.nov}</td>
                    <td style={tdStyle}>{item.fakturaNo}</td>
                    <td style={{...tdStyle, fontWeight: 600}}>{item.senedNo}</td>
                    <td style={tdStyle}>{item.hesabKodu}</td>
                    <td style={tdStyle}>{item.musteriAdi}</td>
                    <td style={tdStyle}>{item.aciqlama}</td>
                    <td style={{...tdStyle, textAlign: 'right', fontWeight: 700}}>{Number(item.mebleg).toLocaleString('az-AZ', { minimumFractionDigits: 2 })}</td>
                    <td style={{...tdStyle, textAlign: 'center'}}>{item.valyuta}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={11} style={{ padding: '5rem 2rem', textAlign: 'center', backgroundColor: '#fafafa' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
                      <div style={{ padding: '1.5rem', backgroundColor: '#f1f5f9', borderRadius: '50%', color: '#94a3b8' }}>
                        <FileText size={48} strokeWidth={1.5} />
                      </div>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#334155', margin: 0 }}>Qeyd tapılmadı</h3>
                      <p style={{ color: '#64748b', margin: 0, maxWidth: '400px', lineHeight: '1.5' }}>
                        Seçdiyiniz filtrlərə uyğun satış qeydi yoxdur. Zəhmət olmasa filtrləri təmizləyin və ya yeni qeyd yaradın.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Filter Modal Backdrop */}
      {isFilterOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', zIndex: 100, display: 'flex', justifyContent: 'center', alignItems: 'center', backdropFilter: 'blur(4px)' }} onClick={() => setIsFilterOpen(false)}>
          {/* Modal content */}
          <div style={{ width: '500px', backgroundColor: 'white', borderRadius: '20px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)', maxHeight: '90vh' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ backgroundColor: '#e0e7ff', padding: '0.5rem', borderRadius: '8px', color: '#4f46e5', display: 'flex' }}><Filter size={18} /></div> 
                Geniş Filtrlər
              </h2>
              <button onClick={() => setIsFilterOpen(false)} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f1f5f9'} onMouseOut={e => e.currentTarget.style.backgroundColor = '#f8fafc'}><X size={18} /></button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.2rem', paddingRight: '0.5rem' }}>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Başlanğıc Tarixi</label>
                  <input type="date" value={filters.startDate} onChange={e => setFilters({...filters, startDate: e.target.value})} style={inputStyle} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Bitiş Tarixi</label>
                  <input type="date" value={filters.endDate} onChange={e => setFilters({...filters, endDate: e.target.value})} style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Hesab Filtri (Müştəri)</label>
                <input type="text" value={filters.customer} onChange={e => setFilters({...filters, customer: e.target.value})} placeholder="Müştəri adı və ya kodu ilə axtar..." style={inputStyle} />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Filial</label>
                  <select value={filters.branch} onChange={e => setFilters({...filters, branch: e.target.value})} style={inputStyle}>
                    <option>Bütün Filiallar</option>
                    <option>Mərkəz Ofis</option>
                  </select>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Valyuta</label>
                  <select value={filters.currency} onChange={e => setFilters({...filters, currency: e.target.value})} style={inputStyle}>
                    <option>Bütün Valyutalar</option>
                    <option>AZN</option>
                    <option>USD</option>
                    <option>EUR</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Faktura Vəziyyəti</label>
                  <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})} style={inputStyle}>
                    <option>Hamısı</option>
                    <option>Ödənildi</option>
                    <option>Ödənilmədi</option>
                    <option>Açıq Hesab</option>
                  </select>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>E-Ticarət</label>
                  <select value={filters.ecommerce} onChange={e => setFilters({...filters, ecommerce: e.target.value})} style={inputStyle}>
                    <option>Hamısını Göstər</option>
                    <option>Yalnız E-Ticarət</option>
                    <option>Xaric Et</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Xüsusi Etiketlər</label>
                <select value={filters.tag} onChange={e => setFilters({...filters, tag: e.target.value})} style={inputStyle}>
                  <option>Etiket seçin...</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
              <button 
                onClick={() => setFilters({ startDate: '', endDate: '', customer: '', branch: 'Bütün Filiallar', currency: 'Bütün Valyutalar', status: 'Hamısı', ecommerce: 'Hamısını Göstər', tag: 'Etiket seçin...' })} 
                style={{ flex: 1, padding: '0.8rem', backgroundColor: 'transparent', border: '2px solid #e2e8f0', borderRadius: '10px', color: '#64748b', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }} 
                onMouseOver={e => {e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#475569'}} 
                onMouseOut={e => {e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.color = '#64748b'}}
              >
                Filtrləri Təmizlə
              </button>
              <button 
                onClick={() => setIsFilterOpen(false)} 
                style={{ flex: 1, padding: '0.8rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)' }} 
                onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} 
                onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Tətbiq Et
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const inputStyle = { padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem', color: '#0f172a', fontWeight: 500, backgroundColor: 'white', width: '100%' };

// Reusable Styles
const cardStyle = { 
  backgroundColor: 'white', 
  padding: '1.5rem', 
  borderRadius: '16px', 
  border: '1px solid #e2e8f0', 
  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
  display: 'flex',
  alignItems: 'center',
  gap: '1.2rem',
  transition: 'transform 0.2s',
  cursor: 'default'
};

const cardIconWrapperStyle = (bg: string, color: string) => ({
  backgroundColor: bg,
  color: color,
  padding: '1rem',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

const cardLabelStyle = {
  fontSize: '0.75rem',
  fontWeight: 700,
  color: '#64748b',
  letterSpacing: '0.05em',
  marginBottom: '0.3rem'
};

const cardValueStyle = {
  fontSize: '1.4rem',
  fontWeight: 800,
  color: '#0f172a'
};

const thStyle: React.CSSProperties = {
  padding: '1rem',
  textAlign: 'left',
  color: '#64748b',
  fontWeight: 700,
  fontSize: '0.8rem',
  letterSpacing: '0.05em',
  whiteSpace: 'nowrap'
};

const tdStyle: React.CSSProperties = {
  padding: '1rem',
  color: '#334155',
  fontSize: '0.9rem',
  whiteSpace: 'nowrap'
};

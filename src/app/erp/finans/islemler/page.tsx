'use client';

import React, { useState, useEffect } from 'react';
import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';
import { CreditCard, Search, Filter, Plus, FileText, 
  ArrowDownRight, ArrowUpRight, CheckCircle, X, Download, Printer
} from 'lucide-react';

export default function FinansIslemlerPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal for new transaction
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allHesablar, setAllHesablar] = useState<any[]>([]);
  const [form, setForm] = useState({
    kassaAdi: '',
    tarih: new Date().toISOString().split('T')[0],
    tur: 'Gəlir',
    kayitTur: 'Nağd',
    kdv: '0',
    miktar: '',
    parabirimi: 'AZN',
    aciklama: '',
    isleyiYapan: 'Admin'
  });
  
  const [showToast, setShowToast] = useState('');

  useEffect(() => {
    // We will aggregate from erp_finans_islemleri and erp_customer_transactions
    const finansTx = JSON.parse(getAppStorage('erp_finans_islemleri') || '[]');
    const cusTx = JSON.parse(getAppStorage('erp_customer_transactions') || '[]');
    
    // Map customer transactions into the unified format
    const mappedCusTx = cusTx.filter((t: any) => t.alinan > 0 || (t.borc > 0 && t.aciklama === 'Etdiyim Ödəniş')).map((t: any) => ({
      id: t.id,
      kassaAdi: t.teslim || 'Kassa',
      tarih: t.tarih,
      tur: t.alinan > 0 ? 'Gəlir' : 'Xərc',
      kayitTur: 'Cari Əməliyyat',
      kdv: '0',
      miktar: t.alinan > 0 ? t.alinan : t.borc,
      parabirimi: 'AZN',
      aciklama: `Cari Əməliyyat: ${t.aciklama}`,
      isleyiYapan: 'Sistem'
    }));

    const combined = [...finansTx, ...mappedCusTx];
    // Sort by date descending
    combined.sort((a: any, b: any) => new Date(b.tarih).getTime() - new Date(a.tarih).getTime());
    
    setTransactions(combined);

    const loadedHesablar = JSON.parse(getAppStorage('erp_hesablar') || '[]');
    setAllHesablar(loadedHesablar);
  }, []);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(''), 3000);
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newTx = { ...form, id: Date.now().toString() };
    
    const finansTx = JSON.parse(getAppStorage('erp_finans_islemleri') || '[]');
    finansTx.push(newTx);
    setAppStorage('erp_finans_islemleri', JSON.stringify(finansTx));
    
    const updated = [newTx, ...transactions];
    updated.sort((a: any, b: any) => new Date(b.tarih).getTime() - new Date(a.tarih).getTime());
    setTransactions(updated);
    
    triggerToast('Yeni kassa/banka əməliyyatı uğurla qeydə alındı!');
  };

  const filteredTx = transactions.filter(t => 
    (t.aciklama || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (t.kassaAdi || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (t.tur || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem', height: '100%', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {showToast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', backgroundColor: '#10b981', color: 'white', padding: '1rem 1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 9999, animation: 'slideIn 0.3s ease-out' }}>
          <CheckCircle size={20}/> {showToast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.8rem', color: '#1e293b', margin: 0, fontWeight: 800, letterSpacing: '-0.5px' }}>
            <CreditCard size={32} color="#0284c7" /> Kassa və ya Bank Əməliyyatları
          </h1>
          <p style={{ margin: '0.4rem 0 0 0', color: '#64748b', fontSize: '0.95rem' }}>
            Bütün giriş-çıxış əməliyyatlarınızın mərkəzləşdirilmiş siyahısı
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1rem', backgroundColor: 'white', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '12px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s' }}>
            <Download size={18}/> Excel-ə Çıxar
          </button>
          <button 
            onClick={() => window.print()} 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', backgroundColor: '#0284c7', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(2, 132, 199, 0.39)', transition: 'transform 0.1s' }}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.96)'}
            onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <Printer size={20}/> Çap Et
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '1rem 1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
          <div style={{ position: 'relative', width: '350px' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input 
              type="text" 
              placeholder="Açıqlama və ya Kassa ilə axtar..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem', color: '#334155' }}
            />
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1rem', backgroundColor: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '10px', color: '#475569', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}>
            <Filter size={16}/> Filtr Tətbiq Et
          </button>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontStyle: 'italic' }}>Filtr tətbiq etməklə daha detallı hesabatlar ala bilərsiniz.</span>
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ overflowX: 'auto', flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
            <thead style={{ backgroundColor: '#f8fafc', position: 'sticky', top: 0, zIndex: 1, borderBottom: '2px solid #e2e8f0' }}>
              <tr>
                <th style={thStyle}>Kassa / Banka Adı</th>
                <th style={thStyle}>Tarix</th>
                <th style={thStyle}>Növ (Tür)</th>
                <th style={thStyle}>Qeyd Növü (Kayıt Tür)</th>
                <th style={thStyle}>ƏDV (KDV)</th>
                <th style={{...thStyle, textAlign: 'right'}}>Məbləğ (Miktar)</th>
                <th style={thStyle}>Valyuta</th>
                <th style={thStyle}>Açıqlama</th>
                <th style={thStyle}>Əməliyyatı Edən</th>
              </tr>
            </thead>
            <tbody>
              {filteredTx.length === 0 ? (
                <tr><td colSpan={9} style={{ textAlign: 'center', padding: '4rem 2rem', color: '#94a3b8', fontWeight: 600, fontStyle: 'italic' }}>
                  <FileText size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto', display: 'block' }} />
                  Kayıt Yok. (Sistemdə heç bir kassa və ya bank əməliyyatı tapılmadı).
                </td></tr>
              ) : filteredTx.map((t, idx) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background-color 0.2s' }} onMouseOver={e=>e.currentTarget.style.backgroundColor='#f8fafc'} onMouseOut={e=>e.currentTarget.style.backgroundColor='white'}>
                  <td style={{...tdStyle, fontWeight: 700, color: '#334155'}}>{t.kassaAdi}</td>
                  <td style={tdStyle}>{new Date(t.tarih).toLocaleDateString('az-AZ')}</td>
                  <td style={tdStyle}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: t.tur === 'Gəlir' ? '#dcfce7' : '#fee2e2', color: t.tur === 'Gəlir' ? '#10b981' : '#ef4444' }}>
                      {t.tur === 'Gəlir' ? <ArrowDownRight size={14}/> : <ArrowUpRight size={14}/>}
                      {t.tur}
                    </span>
                  </td>
                  <td style={tdStyle}>{t.kayitTur}</td>
                  <td style={tdStyle}>%{t.kdv}</td>
                  <td style={{...tdStyle, textAlign: 'right', fontWeight: 800, color: t.tur === 'Gəlir' ? '#10b981' : '#ef4444', fontSize: '1rem'}}>
                    {t.tur === 'Gəlir' ? '+' : '-'}{Number(t.miktar).toLocaleString('az-AZ', {minimumFractionDigits: 2})}
                  </td>
                  <td style={{...tdStyle, fontWeight: 700, color: '#64748b'}}>{t.parabirimi}</td>
                  <td style={{...tdStyle, color: '#475569'}}>{t.aciklama}</td>
                  <td style={{...tdStyle, color: '#94a3b8', fontSize: '0.85rem'}}>{t.isleyiYapan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(4px)', padding: '2rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', width: '100%', maxWidth: '600px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
            
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
              <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.25rem', fontWeight: 800 }}>Yeni Kassa/Bank Əməliyyatı</h2>
              <button type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="#64748b"/></button>
            </div>

            <form onSubmit={handleSave} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={formGroup}>
                  <label style={labelStyle}>Kassa / Banka Adı</label>
                  <select name="kassaAdi" value={form.kassaAdi} onChange={handleInputChange} style={inputStyle} required>
                    <option value="">Hesab seçin...</option>
                    {allHesablar.filter(h => h.type === 'kassa').length > 0 && (
                      <optgroup label="KASSALAR">
                        {allHesablar.filter(h => h.type === 'kassa').map((h: any) => <option key={h.id} value={h.ad}>{h.ad}</option>)}
                      </optgroup>
                    )}
                    {allHesablar.filter(h => h.type === 'banka').length > 0 && (
                      <optgroup label="BANKALAR">
                        {allHesablar.filter(h => h.type === 'banka').map((h: any) => <option key={h.id} value={h.ad}>{h.ad}</option>)}
                      </optgroup>
                    )}
                    {allHesablar.filter(h => h.type === 'kredi_karti').length > 0 && (
                      <optgroup label="KREDİT KARTLARI">
                        {allHesablar.filter(h => h.type === 'kredi_karti').map((h: any) => <option key={h.id} value={h.ad}>{h.ad}</option>)}
                      </optgroup>
                    )}
                    {allHesablar.filter(h => h.type === 'pos').length > 0 && (
                      <optgroup label="POS HESABLARI">
                        {allHesablar.filter(h => h.type === 'pos').map((h: any) => <option key={h.id} value={h.ad}>{h.ad}</option>)}
                      </optgroup>
                    )}
                  </select>
                </div>
                <div style={formGroup}>
                  <label style={labelStyle}>Tarix</label>
                  <input type="date" name="tarih" value={form.tarih} onChange={handleInputChange} style={inputStyle} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={formGroup}>
                  <label style={labelStyle}>Növ (Tür)</label>
                  <select name="tur" value={form.tur} onChange={handleInputChange} style={{...inputStyle, fontWeight: 700, color: form.tur === 'Gəlir' ? '#10b981' : '#ef4444'}}>
                    <option value="Gəlir">Gəlir (Mədaxil)</option>
                    <option value="Xərc">Xərc (Məxaric)</option>
                  </select>
                </div>
                <div style={formGroup}>
                  <label style={labelStyle}>Qeyd Növü (Kayıt Tür)</label>
                  <select name="kayitTur" value={form.kayitTur} onChange={handleInputChange} style={inputStyle}>
                    <option value="Nağd">Nağd</option>
                    <option value="Köçürmə">Köçürmə (Havale/EFT)</option>
                    <option value="POS Terminal">POS Terminal</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                <div style={formGroup}>
                  <label style={labelStyle}>Məbləğ (Miktar)</label>
                  <input type="number" step="any" name="miktar" value={form.miktar} onChange={handleInputChange} style={{...inputStyle, fontWeight: 800, fontSize: '1.1rem'}} required placeholder="0.00" />
                </div>
                <div style={formGroup}>
                  <label style={labelStyle}>Valyuta</label>
                  <select name="parabirimi" value={form.parabirimi} onChange={handleInputChange} style={inputStyle}>
                    <option value="AZN">AZN</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
                <div style={formGroup}>
                  <label style={labelStyle}>ƏDV (%)</label>
                  <select name="kdv" value={form.kdv} onChange={handleInputChange} style={inputStyle}>
                    <option value="0">0%</option>
                    <option value="18">18%</option>
                  </select>
                </div>
              </div>

              <div style={formGroup}>
                <label style={labelStyle}>Açıqlama</label>
                <input type="text" name="aciklama" value={form.aciklama} onChange={handleInputChange} style={inputStyle} required placeholder="Əməliyyatın məqsədi..." />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '1rem', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '12px', color: '#475569', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>İmtina</button>
                <button type="submit" style={{ flex: 2, padding: '1rem', backgroundColor: '#0284c7', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>Yadda Saxla</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// Styles
const thStyle: React.CSSProperties = { padding: '1rem 1.5rem', textAlign: 'left', color: '#64748b', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' };
const tdStyle: React.CSSProperties = { padding: '1rem 1.5rem', color: '#1e293b', fontSize: '0.9rem' };

const formGroup: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '0.5rem' };
const labelStyle: React.CSSProperties = { fontSize: '0.85rem', fontWeight: 700, color: '#475569' };
const inputStyle: React.CSSProperties = { padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', width: '100%', fontSize: '0.95rem', color: '#1e293b' };

'use client';
import React, { useState, useEffect } from 'react';
import { Wrench, Plus, Save, X, Search, FileText, ChevronLeft, Settings, Calendar, Shield, MapPin, Tag, Trash2, Edit2 } from 'lucide-react';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';

export default function TexnikiServisPage() {
  // State
  const [services, setServices] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const defaultForm = {
    fisNo: '',
    evrakTarihi: new Date().toISOString().split('T')[0],
    faturaNo: '',
    aciklama: '',
    marka: '',
    model: '',
    urunAdi: '',
    seriNo: '',
    durum: 'Gözləyir (Beklemede)',
    cikisTarihi: '',
    aksesuar: '',
    garanti: 'Yoxdur (Yok)',
    sikayet: '',
    islemler: [
      { id: Date.now(), ad: '', miktar: 1, kdv: 18, birimFiyat: 0, toplam: 0 }
    ]
  };

  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    const stored = getAppStorage('erp_tech_services');
    if (stored) {
      setServices(JSON.parse(stored));
    }
  }, []);

  const saveToStorage = (data: any[]) => {
    setServices(data);
    setAppStorage('erp_tech_services', JSON.stringify(data));
  };

  const openNewForm = () => {
    setFormData({ ...defaultForm, fisNo: `SRV-${Math.floor(1000 + Math.random() * 9000)}` });
    setEditingId(null);
    setIsFormOpen(true);
  };

  const openEditForm = (srv: any) => {
    setFormData(srv);
    setEditingId(srv.id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Bu texniki servis fişini silmək istədiyinizə əminsiniz?")) {
      saveToStorage(services.filter(s => s.id !== id));
    }
  };

  // İşlemler Logic
  const handleItemChange = (id: number, field: string, value: any) => {
    const updated = formData.islemler.map(item => {
      if (item.id === id) {
        const newItem = { ...item, [field]: value };
        // Calc Toplam
        if (field === 'miktar' || field === 'birimFiyat') {
          newItem.toplam = newItem.miktar * newItem.birimFiyat;
        }
        return newItem;
      }
      return item;
    });
    setFormData({ ...formData, islemler: updated });
  };

  const addIslemRow = () => {
    setFormData({
      ...formData,
      islemler: [...formData.islemler, { id: Date.now(), ad: '', miktar: 1, kdv: 18, birimFiyat: 0, toplam: 0 }]
    });
  };

  const removeIslemRow = (id: number) => {
    setFormData({
      ...formData,
      islemler: formData.islemler.filter(i => i.id !== id)
    });
  };

  // Computations
  const calcAraToplam = () => {
    // Ara toplam in this context: normally sum of (birimFiyat * miktar) without KDV. 
    // But user form says "Birim Fiyat KDV Dahil", "Toplam KDV Dahil".
    // If unit price has VAT included, then Subtotal and Grand Total are the same unless there are discounts.
    return formData.islemler.reduce((sum, item) => sum + (item.miktar * item.birimFiyat), 0);
  };

  const calcGenelToplam = () => {
    return calcAraToplam(); // Since prices are already KDV Dahil per user layout
  };

  const handleSave = () => {
    if (!formData.urunAdi || !formData.sikayet) {
      alert("Zəhmət olmasa Məhsul Adı və Şikayət hissəsini doldurun.");
      return;
    }

    if (editingId) {
      const updated = services.map(s => s.id === editingId ? { ...formData, id: editingId } : s);
      saveToStorage(updated);
    } else {
      saveToStorage([{ ...formData, id: Date.now().toString() }, ...services]);
    }
    setIsFormOpen(false);
  };

  // Views
  if (isFormOpen) {
    return (
      <div style={{ padding: '2rem', height: '100%', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif', overflowY: 'auto' }}>
        
        {/* Top Actions */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={() => setIsFormOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', backgroundColor: 'white', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>
            <ChevronLeft size={18} /> Siyahıya Qayıt
          </button>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 2rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)', transition: 'background-color 0.2s' }} onMouseOver={e=>e.currentTarget.style.backgroundColor='#059669'} onMouseOut={e=>e.currentTarget.style.backgroundColor='#10b981'}>
              <Save size={20}/> Kaydet (Yadda Saxla)
            </button>
          </div>
        </div>

        {/* Fiş Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#d1fae5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wrench size={32} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: '#0f172a', margin: 0, fontWeight: 900, letterSpacing: '-0.5px' }}>Texniki Servis Fişi</h1>
            <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.95rem', fontWeight: 700 }}>Nömrə: <span style={{ color: '#0f172a' }}>{formData.fisNo}</span></p>
          </div>
        </div>

        {/* Form Container */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Section 1: Sənəd Məlumatları */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Sənəd Tarixi</label>
              <input type="date" value={formData.evrakTarihi} onChange={e=>setFormData({...formData, evrakTarihi: e.target.value})} style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Qaimə Nömrəsi</label>
              <input type="text" value={formData.faturaNo} onChange={e=>setFormData({...formData, faturaNo: e.target.value})} placeholder="Fatura No" style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Sənəd Açıqlaması</label>
              <input type="text" value={formData.aciklama} onChange={e=>setFormData({...formData, aciklama: e.target.value})} placeholder="Qısa açıqlama..." style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} />
            </div>
          </div>

          {/* Section 2: Cihaz Məlumatları */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Məhsul Adı <span style={{color:'#ef4444'}}>*</span></label>
              <input type="text" value={formData.urunAdi} onChange={e=>setFormData({...formData, urunAdi: e.target.value})} placeholder="Təmir ediləcək məhsul" style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Marka</label>
              <input type="text" value={formData.marka} onChange={e=>setFormData({...formData, marka: e.target.value})} placeholder="Məs: Apple, HP" style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Model</label>
              <input type="text" value={formData.model} onChange={e=>setFormData({...formData, model: e.target.value})} placeholder="Məs: ProBook 450" style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Seriya Nömrəsi</label>
              <input type="text" value={formData.seriNo} onChange={e=>setFormData({...formData, seriNo: e.target.value})} placeholder="S/N: " style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', fontFamily: 'monospace' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Status</label>
              <select value={formData.durum} onChange={e=>setFormData({...formData, durum: e.target.value})} style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', backgroundColor: '#f8fafc' }}>
                <option>Gözləyir (Beklemede)</option>
                <option>Təmirdə (İşlem Görüyor)</option>
                <option>Tamamlandı</option>
                <option>İptal Edildi</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Çıxış Tarixi</label>
              <input type="date" value={formData.cikisTarihi} onChange={e=>setFormData({...formData, cikisTarihi: e.target.value})} style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Aksesuar</label>
              <input type="text" value={formData.aksesuar} onChange={e=>setFormData({...formData, aksesuar: e.target.value})} placeholder="Batareya, adapter və s." style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Zəmanət Statusu</label>
              <select value={formData.garanti} onChange={e=>setFormData({...formData, garanti: e.target.value})} style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', backgroundColor: '#f8fafc' }}>
                <option>Yoxdur (Yok)</option>
                <option>Davam edir (Devam Ediyor)</option>
                <option>Qarantiya Xarici İşlem</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Müştəri Şikayəti <span style={{color:'#ef4444'}}>*</span></label>
            <textarea value={formData.sikayet} onChange={e=>setFormData({...formData, sikayet: e.target.value})} placeholder="Müştərinin cihazla bağlı şikayəti və problemi tam olaraq bura qeyd edilir..." style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', minHeight: '80px', resize: 'vertical' }} />
          </div>

          {/* Section 3: Yapılan İşlemler Table */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <div style={{ padding: '1rem 1.5rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>Görülən İşlər (Sərf Edilən Ehtiyat Hissələri və Xidmətlər)</h3>
              <button onClick={addIslemRow} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseOver={e=>e.currentTarget.style.backgroundColor='#059669'} onMouseOut={e=>e.currentTarget.style.backgroundColor='#10b981'}>
                <Plus size={16} /> Sətir Əlavə Et
              </button>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'white', borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>Məhsul / Xidmət Adı</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569', width: '100px' }}>Miqdar</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569', width: '100px' }}>ƏDV (%)</th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569', width: '150px' }}>Vahid Qiymət<br/><span style={{fontSize:'0.7rem', color:'#94a3b8'}}>(ƏDV Daxil)</span></th>
                    <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569', width: '150px' }}>Toplam<br/><span style={{fontSize:'0.7rem', color:'#94a3b8'}}>(ƏDV Daxil)</span></th>
                    <th style={{ padding: '1rem 1.5rem', width: '60px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {formData.islemler.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.8rem 1.5rem' }}>
                        <input type="text" value={item.ad} onChange={(e) => handleItemChange(item.id, 'ad', e.target.value)} placeholder="Təmir xidməti, LCD ekran və s." style={{ width: '100%', padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none' }} />
                      </td>
                      <td style={{ padding: '0.8rem 1.5rem' }}>
                        <input type="number" value={item.miktar} onChange={(e) => handleItemChange(item.id, 'miktar', Number(e.target.value))} style={{ width: '100%', padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none' }} />
                      </td>
                      <td style={{ padding: '0.8rem 1.5rem' }}>
                        <input type="number" value={item.kdv} onChange={(e) => handleItemChange(item.id, 'kdv', Number(e.target.value))} style={{ width: '100%', padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none' }} />
                      </td>
                      <td style={{ padding: '0.8rem 1.5rem' }}>
                        <input type="number" value={item.birimFiyat} onChange={(e) => handleItemChange(item.id, 'birimFiyat', Number(e.target.value))} style={{ width: '100%', padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '6px', outline: 'none' }} />
                      </td>
                      <td style={{ padding: '0.8rem 1.5rem', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                        {item.toplam.toFixed(2)}
                      </td>
                      <td style={{ padding: '0.8rem 1.5rem' }}>
                        <button onClick={() => removeIslemRow(item.id)} style={{ padding: '0.4rem', backgroundColor: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Section */}
            <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0' }}>
              <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.5rem', borderBottom: '1px dashed #cbd5e1' }}>
                  <span style={{ fontWeight: 700, color: '#475569' }}>ARA TOPLAM :</span>
                  <span style={{ fontWeight: 800, color: '#0f172a' }}>{calcAraToplam().toFixed(2)} AZN</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a' }}>Yekun Məbləğ :</span>
                  <span style={{ fontWeight: 900, fontSize: '1.2rem', color: '#10b981' }}>{calcGenelToplam().toFixed(2)} AZN</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // List View
  return (
    <div style={{ padding: '2rem', height: '100%', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif', overflowY: 'auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#d1fae5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wrench size={32} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: '#0f172a', margin: 0, fontWeight: 900, letterSpacing: '-0.5px' }}>
              Texniki Servis
            </h1>
            <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.95rem' }}>Təmir və xidmət mərkəzi əməliyyatları</p>
          </div>
        </div>
        
        <button onClick={openNewForm} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)', transition: 'all 0.2s' }} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.backgroundColor='#059669'}} onMouseOut={e=>{e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.backgroundColor='#10b981'}}>
          <Plus size={20}/> Yeni Servis Girişi
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>FİŞ NO</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>TARİX</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>CİHAZ / MƏHSUL</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>DURUM</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>TUTAR</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569', textAlign: 'right' }}>ƏMƏLİYYATLAR</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', fontWeight: 600 }}>Hələ heç bir servis qeydiyyatı yoxdur.</td></tr>
            ) : (
              services.map(srv => {
                const total = srv.islemler.reduce((sum: number, item: any) => sum + (item.miktar * item.birimFiyat), 0);
                
                let statusColor = '#94a3b8';
                let statusBg = '#f1f5f9';
                if(srv.durum.includes('Gözləyir')) { statusColor = '#d97706'; statusBg = '#fef3c7'; }
                else if(srv.durum.includes('Təmirdə')) { statusColor = '#2563eb'; statusBg = '#dbeafe'; }
                else if(srv.durum.includes('Tamamlandı')) { statusColor = '#059669'; statusBg = '#d1fae5'; }

                return (
                  <tr key={srv.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }} onMouseOver={e=>e.currentTarget.style.backgroundColor='#f8fafc'} onMouseOut={e=>e.currentTarget.style.backgroundColor='white'}>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.95rem', fontWeight: 800, color: '#475569' }}>{srv.fisNo}</td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.95rem', color: '#64748b' }}>{srv.evrakTarihi}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{srv.urunAdi}</span>
                        <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{srv.marka} {srv.model}</span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ padding: '0.3rem 0.8rem', borderRadius: '20px', backgroundColor: statusBg, color: statusColor, fontSize: '0.85rem', fontWeight: 800 }}>
                        {srv.durum}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                      {total.toFixed(2)} AZN
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => openEditForm(srv)} style={{ padding: '0.5rem 1rem', backgroundColor: '#f1f5f9', color: '#10b981', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                          Fişə Bax
                        </button>
                        <button onClick={() => handleDelete(srv.id)} style={{ padding: '0.5rem', backgroundColor: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

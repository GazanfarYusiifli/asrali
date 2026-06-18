'use client';
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Plus, Search, Filter, Phone, Mail, MapPin, Building2, 
  CreditCard, Wallet, Edit3, Trash2, X, ChevronRight, CheckCircle, FileText, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';

export default function MusterilerPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Tab state in modal
  const [activeTab, setActiveTab] = useState('hesab');

  // Form State
  const initialFormState = {
    // Hesab
    hesabAdi: '',
    hesabSiyahisi: 'Ümumi',
    valyuta: 'AZN',
    hesabKodu: '',
    onlineIstemler: false,
    ibanNotlar: '',
    
    // Elaqe
    seher: '',
    rayon: '',
    unvan: '',
    mobil: '',
    epoct: '',
    sabitTelefon: '',

    // Maliyye
    hesabNovu: 'Müştəri',
    voen: '',
    vergiDairesi: '',
    odenisVoen: '',
    evvelkiQaliq: 0,
    dovrQaligi: 0,
    dovrQaliqNovu: 'Borc',
    borcIdareetmesi: 'Açıq',
    vadeGun: 0,
    borcLimiti: 0,
    satisQiymeti: 'Pərakəndə',
    sobe: 'Mərkəz',
    isciTeyin: '',

    // Yaxinlari & Zamin
    yaxinlari: '',
    zamin: ''
  };
  
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    const allCustomers = JSON.parse(getAppStorage('erp_customers') || '[]');
    const customersOnly = allCustomers.filter((c: any) => c.hesabNovu === 'Müştəri' || c.hesabNovu === 'Həm Müştəri, Həm Təchizatçı');
    customersOnly.sort((a: any, b: any) => a.hesabAdi.localeCompare(b.hesabAdi));
    setCustomers(customersOnly);
  }, []);

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customers;
    const lower = searchTerm.toLowerCase();
    return customers.filter(c => 
      c.hesabAdi.toLowerCase().includes(lower) || 
      (c.voen && c.voen.includes(lower)) ||
      (c.mobil && c.mobil.includes(lower)) ||
      (c.hesabKodu && c.hesabKodu.toLowerCase().includes(lower))
    );
  }, [customers, searchTerm]);

  const openModal = (customer: any = null) => {
    if (customer) {
      setEditingId(customer.id);
      setFormData(customer);
    } else {
      setEditingId(null);
      setFormData(initialFormState);
    }
    setActiveTab('hesab');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let finalValue: any = value;
    
    if (type === 'checkbox') {
      finalValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number') {
      finalValue = value === '' ? '' : Number(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const allCustomers = JSON.parse(getAppStorage('erp_customers') || '[]');
    let updatedAll = [...allCustomers];
    
    if (editingId) {
      updatedAll = updatedAll.map((c: any) => c.id === editingId ? { ...formData, id: editingId } : c);
    } else {
      updatedAll.push({ ...formData, id: Date.now().toString() });
    }
    
    setAppStorage('erp_customers', JSON.stringify(updatedAll));
    
    const customersOnly = updatedAll.filter((c: any) => c.hesabNovu === 'Müştəri' || c.hesabNovu === 'Həm Müştəri, Həm Təchizatçı');
    customersOnly.sort((a: any, b: any) => a.hesabAdi.localeCompare(b.hesabAdi));
    setCustomers(customersOnly);
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Bu müştərini silmək istədiyinizə əminsiniz?")) {
      const allCustomers = JSON.parse(getAppStorage('erp_customers') || '[]');
      const updatedAll = allCustomers.filter((c: any) => c.id !== id);
      setAppStorage('erp_customers', JSON.stringify(updatedAll));

      const customersOnly = updatedAll.filter((c: any) => c.hesabNovu === 'Müştəri' || c.hesabNovu === 'Həm Müştəri, Həm Təchizatçı');
      customersOnly.sort((a: any, b: any) => a.hesabAdi.localeCompare(b.hesabAdi));
      setCustomers(customersOnly);
    }
  };

  const tabs = [
    { id: 'hesab', label: 'Hesab Tənzimləmələri' },
    { id: 'elaqe', label: 'Əlaqə Məlumatları' },
    { id: 'maliyye', label: 'Maliyyə (Finans)' },
    { id: 'yaxinlari', label: 'Yaxınları' },
    { id: 'zamin', label: 'Zamin (Kefil)' }
  ];

  return (
    <div style={{ padding: '2rem', height: '100%', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.8rem', color: '#1e293b', margin: 0, fontWeight: 800, letterSpacing: '-0.5px' }}>
            <Users size={32} color="#4f46e5" /> Cari Hesablar (Müştərilər)
          </h1>
          <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.95rem' }}>Ümumi müştəri və təchizatçıların mərkəzi bazası</p>
        </div>
        <button 
          onClick={() => openModal()} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.39)', transition: 'transform 0.1s' }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.96)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Plus size={20}/> Yeni Cari Hesab
        </button>
      </div>

      {/* Toolbar (Search & Stats) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '1rem 1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
        <div style={{ position: 'relative', width: '400px' }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Ad, VÖEN, Telefon və ya Kod ilə axtar..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', color: '#334155', transition: 'border-color 0.2s', backgroundColor: '#f8fafc' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Cəmi Tapılan</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>{filteredCustomers.length} <span style={{fontSize:'0.85rem', color:'#94a3b8', fontWeight:600}}>Cari</span></div>
          </div>
          <div style={{ width: '1px', height: '30px', backgroundColor: '#e2e8f0' }}></div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Ümumi Baza</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#4f46e5' }}>{customers.length}</div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ overflowX: 'auto', flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
            <thead style={{ backgroundColor: '#f8fafc', position: 'sticky', top: 0, zIndex: 1, borderBottom: '2px solid #e2e8f0' }}>
              <tr>
                <th style={thStyle}>#</th>
                <th style={thStyle}>Hesab Adı / Kodu</th>
                <th style={thStyle}>Əlaqə Məlumatları</th>
                <th style={thStyle}>VÖEN / Vergi</th>
                <th style={thStyle}>Növü</th>
                <th style={{...thStyle, textAlign: 'right'}}>Cari Qalıq (Dövr)</th>
                <th style={{...thStyle, textAlign: 'right', width: '100px'}}>Əməliyyat</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '4rem 2rem', color: '#94a3b8', fontWeight: 600, fontStyle: 'italic' }}>
                  <Users size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto', display: 'block' }} />
                  Heç bir cari hesab tapılmadı.
                </td></tr>
              ) : filteredCustomers.map((c, idx) => (
                <tr key={c.id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background-color 0.2s' }} onMouseOver={e=>e.currentTarget.style.backgroundColor='#f8fafc'} onMouseOut={e=>e.currentTarget.style.backgroundColor='white'}>
                  <td style={{...tdStyle, color: '#94a3b8', fontWeight: 700}}>{idx + 1}</td>
                  <td style={tdStyle}>
                    <Link href={`/erp/cari/musteriler/${c.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{ fontWeight: 800, color: '#4f46e5', fontSize: '1rem', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        {c.hesabAdi} <ArrowRight size={14} />
                      </div>
                    </Link>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ backgroundColor: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>{c.hesabKodu || 'KODSUZ'}</span>
                      {c.seher && <span>• {c.seher}</span>}
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                      {c.mobil && <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#475569' }}><Phone size={14} color="#94a3b8"/> {c.mobil}</div>}
                      {c.epoct && <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', color: '#475569' }}><Mail size={14} color="#94a3b8"/> {c.epoct}</div>}
                      {!c.mobil && !c.epoct && <span style={{ color: '#cbd5e1', fontSize: '0.85rem', fontStyle: 'italic' }}>Qeyd edilməyib</span>}
                    </div>
                  </td>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 700, color: '#334155', fontSize: '0.9rem' }}>{c.voen || '-'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{c.vergiDairesi}</div>
                  </td>
                  <td style={tdStyle}>
                    <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: c.hesabNovu === 'Müştəri' ? '#dcfce7' : '#e0e7ff', color: c.hesabNovu === 'Müştəri' ? '#10b981' : '#4f46e5' }}>
                      {c.hesabNovu}
                    </span>
                  </td>
                  <td style={{...tdStyle, textAlign: 'right'}}>
                    <div style={{ fontWeight: 800, color: c.dovrQaliqNovu === 'Borc' ? '#ef4444' : '#10b981', fontSize: '1rem' }}>
                      {Number(c.dovrQaligi).toLocaleString('az-AZ', {minimumFractionDigits: 2})} ₼
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{c.dovrQaliqNovu}</div>
                  </td>
                  <td style={{...tdStyle, textAlign: 'right'}}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => openModal(c)} style={iconBtnStyle} title="Redaktə et"><Edit3 size={18} color="#3b82f6"/></button>
                      <button onClick={() => handleDelete(c.id)} style={iconBtnStyle} title="Sil"><Trash2 size={18} color="#ef4444"/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL (YENİ / REDAKTƏ) */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(4px)', padding: '2rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', width: '100%', maxWidth: '900px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
              <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.4rem', fontWeight: 800 }}>
                {editingId ? 'Cari Hesabı Redaktə Et' : 'Yeni Cari Hesab Əlavə Et'}
              </h2>
              <button type="button" onClick={closeModal} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20}/></button>
            </div>

            {/* Tab Navigation */}
            <div style={{ display: 'flex', borderBottom: '2px solid #e2e8f0', padding: '0 2rem', backgroundColor: 'white', gap: '1.5rem', overflowX: 'auto' }}>
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '1.25rem 0',
                    fontSize: '0.95rem',
                    fontWeight: activeTab === tab.id ? 800 : 600,
                    color: activeTab === tab.id ? '#4f46e5' : '#64748b',
                    borderBottom: activeTab === tab.id ? '3px solid #4f46e5' : '3px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap',
                    marginBottom: '-2px'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Form Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '2rem', backgroundColor: '#f8fafc' }}>
              <form id="customerForm" onSubmit={handleSave}>
                
                {/* 1. Hesab Tənzimləmələri */}
                {activeTab === 'hesab' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                      <div style={formGroup}>
                        <label style={labelStyle}>Hesab Adı *</label>
                        <input name="hesabAdi" value={formData.hesabAdi} onChange={handleInputChange} style={inputStyle} required placeholder="Müştəri və ya şirkətin adı" />
                      </div>
                      <div style={formGroup}>
                        <label style={labelStyle}>Hesab Kodu</label>
                        <input name="hesabKodu" value={formData.hesabKodu} onChange={handleInputChange} style={inputStyle} placeholder="Məs: C-1001" />
                      </div>
                      <div style={formGroup}>
                        <label style={labelStyle}>Hesab Siyahısı (Qrup)</label>
                        <select name="hesabSiyahisi" value={formData.hesabSiyahisi} onChange={handleInputChange} style={inputStyle}>
                          <option value="Ümumi">Ümumi</option>
                          <option value="VIP">VIP</option>
                          <option value="Topdancı">Topdancı</option>
                          <option value="Qara Siyahı">Qara Siyahı</option>
                        </select>
                      </div>
                      <div style={formGroup}>
                        <label style={labelStyle}>Hesab Valyutası</label>
                        <select name="valyuta" value={formData.valyuta} onChange={handleInputChange} style={inputStyle}>
                          <option value="AZN">AZN - Azərbaycan Manatı</option>
                          <option value="USD">USD - ABŞ Dolları</option>
                          <option value="EUR">EUR - Avro</option>
                          <option value="TRY">TRY - Türk Lirəsi</option>
                        </select>
                      </div>
                    </div>
                    <div style={{ padding: '1rem', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <input type="checkbox" name="onlineIstemler" checked={formData.onlineIstemler} onChange={handleInputChange} id="onlineOp" style={{ width: '18px', height: '18px' }} />
                      <label htmlFor="onlineOp" style={{ fontWeight: 700, color: '#334155', cursor: 'pointer' }}>Onlayn Əməliyyatlara İcazə Ver</label>
                    </div>
                    <div style={formGroup}>
                      <label style={labelStyle}>İBAN Adresləri və Digər Qeydlər</label>
                      <textarea name="ibanNotlar" value={formData.ibanNotlar} onChange={handleInputChange} style={{...inputStyle, minHeight: '120px'}} placeholder="Müştərinin bank məlumatları, müqavilə şərtləri və s." />
                    </div>
                  </div>
                )}

                {/* 2. Əlaqə */}
                {activeTab === 'elaqe' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={formGroup}>
                      <label style={labelStyle}>Şəhər (İl)</label>
                      <input name="seher" value={formData.seher} onChange={handleInputChange} style={inputStyle} placeholder="Məs: Bakı" />
                    </div>
                    <div style={formGroup}>
                      <label style={labelStyle}>Rayon (İlçe)</label>
                      <input name="rayon" value={formData.rayon} onChange={handleInputChange} style={inputStyle} placeholder="Məs: Nəsimi" />
                    </div>
                    <div style={{...formGroup, gridColumn: 'span 2'}}>
                      <label style={labelStyle}>Ünvan</label>
                      <textarea name="unvan" value={formData.unvan} onChange={handleInputChange} style={{...inputStyle, minHeight: '80px'}} placeholder="Tam ünvan..." />
                    </div>
                    <div style={formGroup}>
                      <label style={labelStyle}>Mobil Nömrə</label>
                      <div style={{ position: 'relative' }}>
                        <Phone size={16} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                        <input name="mobil" value={formData.mobil} onChange={handleInputChange} style={{...inputStyle, paddingLeft: '2.5rem'}} placeholder="+994" />
                      </div>
                    </div>
                    <div style={formGroup}>
                      <label style={labelStyle}>Sabit Telefon</label>
                      <div style={{ position: 'relative' }}>
                        <Phone size={16} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                        <input name="sabitTelefon" value={formData.sabitTelefon} onChange={handleInputChange} style={{...inputStyle, paddingLeft: '2.5rem'}} placeholder="Məs: 012 123 45 67" />
                      </div>
                    </div>
                    <div style={{...formGroup, gridColumn: 'span 2'}}>
                      <label style={labelStyle}>E-Poçt Adresi</label>
                      <div style={{ position: 'relative' }}>
                        <Mail size={16} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                        <input type="email" name="epoct" value={formData.epoct} onChange={handleInputChange} style={{...inputStyle, paddingLeft: '2.5rem'}} placeholder="ad@sirket.com" />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. Maliyye */}
                {activeTab === 'maliyye' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{...formGroup, backgroundColor: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
                      <label style={{...labelStyle, color: '#4f46e5'}}>Hesab Növü</label>
                      <select name="hesabNovu" value={formData.hesabNovu} onChange={handleInputChange} style={{...inputStyle, backgroundColor: '#f8fafc'}}>
                        <option value="Müştəri">Müştəri (Alıcı)</option>
                        <option value="Təchizatçı">Təchizatçı (Satıcı)</option>
                        <option value="Həm Müştəri, Həm Təchizatçı">Həm Müştəri, Həm Təchizatçı</option>
                      </select>
                    </div>
                    <div style={{...formGroup, backgroundColor: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0'}}>
                      <label style={labelStyle}>Vergi Nömrəsi (VÖEN)</label>
                      <input name="voen" value={formData.voen} onChange={handleInputChange} style={inputStyle} placeholder="Məs: 1234567891" />
                    </div>

                    <div style={formGroup}>
                      <label style={labelStyle}>Vergi Dairəsi</label>
                      <input name="vergiDairesi" value={formData.vergiDairesi} onChange={handleInputChange} style={inputStyle} />
                    </div>
                    <div style={formGroup}>
                      <label style={labelStyle}>Ödəniş VÖEN-i (Kassa üçün)</label>
                      <input name="odenisVoen" value={formData.odenisVoen} onChange={handleInputChange} style={inputStyle} />
                    </div>

                    <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                      <div style={{...formGroup, flex: 1}}>
                        <label style={labelStyle}>Əvvəlki Qalıq Bakiye</label>
                        <input type="number" step="any" name="evvelkiQaliq" value={formData.evvelkiQaliq} onChange={handleInputChange} style={inputStyle} />
                      </div>
                      <div style={{...formGroup, flex: 1}}>
                        <label style={labelStyle}>Dövr Qalığı (Devir Bakiye)</label>
                        <input type="number" step="any" name="dovrQaligi" value={formData.dovrQaligi} onChange={handleInputChange} style={inputStyle} />
                      </div>
                      <div style={{...formGroup, flex: 1}}>
                        <label style={labelStyle}>Dövr Qalığı Növü</label>
                        <select name="dovrQaliqNovu" value={formData.dovrQaliqNovu} onChange={handleInputChange} style={inputStyle}>
                          <option value="Borc">Borc (Bizə borcludur)</option>
                          <option value="Alacaq">Alacaq (Bizim ona borcumuz var)</option>
                        </select>
                      </div>
                    </div>

                    <div style={formGroup}>
                      <label style={labelStyle}>Borc İdarəetməsi</label>
                      <select name="borcIdareetmesi" value={formData.borcIdareetmesi} onChange={handleInputChange} style={inputStyle}>
                        <option value="Açıq">Açıq (Sərbəst)</option>
                        <option value="Limitli">Limitləndirilmiş</option>
                        <option value="Bağlı">Bloklanmış</option>
                      </select>
                    </div>
                    <div style={formGroup}>
                      <label style={labelStyle}>Vade (Gün Sayısı)</label>
                      <input type="number" name="vadeGun" value={formData.vadeGun} onChange={handleInputChange} style={inputStyle} placeholder="Məs: 30 gün" />
                    </div>

                    <div style={formGroup}>
                      <label style={labelStyle}>Borc Limiti (Məbləğ)</label>
                      <input type="number" step="any" name="borcLimiti" value={formData.borcLimiti} onChange={handleInputChange} style={inputStyle} placeholder="0.00" />
                    </div>
                    <div style={formGroup}>
                      <label style={labelStyle}>Satış Qiymət Növü</label>
                      <select name="satisQiymeti" value={formData.satisQiymeti} onChange={handleInputChange} style={inputStyle}>
                        <option value="Pərakəndə">Pərakəndə (Retail)</option>
                        <option value="Topdan 1">Topdan 1 (Wholesale)</option>
                        <option value="Topdan 2">Topdan 2</option>
                      </select>
                    </div>

                    <div style={formGroup}>
                      <label style={labelStyle}>Şöbə (Şube)</label>
                      <input name="sobe" value={formData.sobe} onChange={handleInputChange} style={inputStyle} placeholder="Mərkəz" />
                    </div>
                    <div style={formGroup}>
                      <label style={labelStyle}>Personel Təyin Et (Sorumlu)</label>
                      <input name="isciTeyin" value={formData.isciTeyin} onChange={handleInputChange} style={inputStyle} placeholder="Satış təmsilçisinin adı" />
                    </div>
                  </div>
                )}

                {/* 4. Yaxinlari */}
                {activeTab === 'yaxinlari' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ backgroundColor: '#e0e7ff', color: '#4338ca', padding: '1rem', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600 }}>
                      Müştərinin fövqəladə hal və ya alternativ əlaqə üçün yaxınlarının məlumatları (Ad, Soyad, Qohumluq dərəcəsi, Nömrə).
                    </div>
                    <div style={formGroup}>
                      <label style={labelStyle}>Yaxınları (Sərbəst Mətn)</label>
                      <textarea name="yaxinlari" value={formData.yaxinlari} onChange={handleInputChange} style={{...inputStyle, minHeight: '200px'}} placeholder="1. Əli Həsənov (Qardaşı) - 050 123 45 67&#10;2. ..." />
                    </div>
                  </div>
                )}

                {/* 5. Zamin */}
                {activeTab === 'zamin' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ backgroundColor: '#fef3c7', color: '#b45309', padding: '1rem', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 600 }}>
                      Kredit və ya borclu satışlarda zamin (kefil) duran şəxsin detalları (VÖEN, Ad, Ünvan, İş yeri).
                    </div>
                    <div style={formGroup}>
                      <label style={labelStyle}>Zamin Məlumatları (Kefil)</label>
                      <textarea name="zamin" value={formData.zamin} onChange={handleInputChange} style={{...inputStyle, minHeight: '200px'}} placeholder="Zaminin Adı: ...&#10;ŞV Nömrəsi: ...&#10;VÖEN: ...&#10;Ünvan: ..." />
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Modal Footer */}
            <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid #e2e8f0', backgroundColor: 'white', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={closeModal} style={{ padding: '0.8rem 2rem', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '12px', color: '#475569', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseOver={e=>e.currentTarget.style.backgroundColor='#e2e8f0'} onMouseOut={e=>e.currentTarget.style.backgroundColor='#f1f5f9'}>İmtina</button>
              <button type="submit" form="customerForm" style={{ padding: '0.8rem 2.5rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.39)', transition: 'background-color 0.2s' }} onMouseOver={e=>e.currentTarget.style.backgroundColor='#4338ca'} onMouseOut={e=>e.currentTarget.style.backgroundColor='#4f46e5'}>{editingId ? 'Yadda Saxla' : 'Müştərini Yarat'}</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Styles
const thStyle: React.CSSProperties = { padding: '1rem 1.5rem', textAlign: 'left', color: '#64748b', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' };
const tdStyle: React.CSSProperties = { padding: '1rem 1.5rem', color: '#334155', fontSize: '0.95rem' };
const iconBtnStyle: React.CSSProperties = { background: '#f1f5f9', border: 'none', cursor: 'pointer', padding: '8px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.2s' };

const formGroup: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '0.5rem' };
const labelStyle: React.CSSProperties = { fontSize: '0.85rem', fontWeight: 700, color: '#475569' };
const inputStyle: React.CSSProperties = { padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', width: '100%', fontSize: '0.95rem', color: '#1e293b', transition: 'border-color 0.2s', backgroundColor: 'white' };

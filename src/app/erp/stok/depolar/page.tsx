'use client';
import React, { useState, useEffect } from 'react';
import { Store, Building2, Plus, Save, MapPin, Phone, Mail, Globe, FileText, Briefcase, CreditCard, Upload, Edit2, Trash2, X, Landmark } from 'lucide-react';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';

export default function DepolarPage() {
  // Base State
  const [warehouses, setWarehouses] = useState<any[]>([]);
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [editingId, setEditingId] = useState<number | null>(null);

  // Small Add Form State
  const [newDepoType, setNewDepoType] = useState('Şöbə');
  const [newDepoName, setNewDepoName] = useState('');

  // Large Edit Form State
  const defaultForm = {
    no: '17636',
    shobeAdi: '',
    tur: 'Şöbə',
    sektor: '',
    firmaNovu: '',
    firmaAdi: '',
    sahibAdSoyad: '',
    fin: '',
    voen: '',
    vergiIdaresi: '',
    unvan: '',
    telefon: '',
    faks: '',
    email: '',
    vebSayt: '',
    reyestrNo: '',
    digerNo: '',
    // Bank details
    bankAdi: '',
    iban: '',
    hesabNo: ''
  };

  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    // Load from local storage
    const stored = getAppStorage('erp_warehouses_detailed');
    if (stored) {
      setWarehouses(JSON.parse(stored));
    } else {
      // Migrate from old basic array if exists, otherwise empty
      const oldBasic = getAppStorage('erp_warehouses');
      if (oldBasic) {
        const parsed = JSON.parse(oldBasic);
        if (typeof parsed[0] === 'string') {
          const migrated = parsed.map((name: string, i: number) => ({
            ...defaultForm,
            id: i + 1,
            shobeAdi: name,
            tur: i === 0 ? 'Mərkəz' : 'Şöbə'
          }));
          setWarehouses(migrated);
          setAppStorage('erp_warehouses_detailed', JSON.stringify(migrated));
        } else {
          setWarehouses(parsed);
        }
      } else {
        const defaultW = [{ ...defaultForm, id: 1, shobeAdi: 'Mərkəz Şöbə', tur: 'Mərkəz' }];
        setWarehouses(defaultW);
        setAppStorage('erp_warehouses_detailed', JSON.stringify(defaultW));
      }
    }
  }, []);

  const saveToStorage = (data: any[]) => {
    setWarehouses(data);
    setAppStorage('erp_warehouses_detailed', JSON.stringify(data));
    // Also keep the simple array synced for other modules that just need names
    setAppStorage('erp_warehouses', JSON.stringify(data.map(w => w.shobeAdi)));
  };

  const openAddModal = () => {
    setNewDepoType('Şöbə');
    setNewDepoName('');
    setIsAddModalOpen(true);
  };

  const handleAddNew = () => {
    if (!newDepoName.trim()) {
      alert("Zəhmət olmasa Adı daxil edin.");
      return;
    }
    const newW = { ...defaultForm, id: Date.now(), tur: newDepoType, shobeAdi: newDepoName };
    saveToStorage([...warehouses, newW]);
    setIsAddModalOpen(false);
  };

  const openEditModal = (w: any) => {
    setEditingId(w.id);
    setFormData(w);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (warehouses.length <= 1) {
      alert("Xəta: Sistemdə ən azı bir şöbə/anbar qalmalıdır.");
      return;
    }
    if (window.confirm("Bu şöbəni və ona aid bütün firma məlumatlarını silmək istədiyinizə əminsiniz?")) {
      saveToStorage(warehouses.filter(w => w.id !== id));
    }
  };

  const handleSaveEdit = () => {
    if (!formData.shobeAdi || !formData.sektor || !formData.firmaNovu || !formData.unvan) {
      alert("Zəhmət olmasa ulduzla (*) işarələnmiş bütün məcburi xanaları doldurun.");
      return;
    }

    const updated = warehouses.map(w => w.id === editingId ? { ...formData, id: editingId } : w);
    saveToStorage(updated);
    setIsEditModalOpen(false);
  };

  return (
    <div style={{ padding: '2rem', height: '100%', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif', overflowY: 'auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#eef2ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={32} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: '#0f172a', margin: 0, fontWeight: 900, letterSpacing: '-0.5px' }}>
              Mövcud Şöbələr / Anbarlar
            </h1>
            <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.95rem' }}>Şirkətinizə aid bütün filialların siyahısı və məlumatları</p>
          </div>
        </div>
        
        <button onClick={openAddModal} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.39)', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>
          <Plus size={20}/> Yeni Şöbə/Anbar Əlavə Et
        </button>
      </div>

      {/* Main Content: Landscape Grid/List */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569', width: '80px' }}>TÜRÜ</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>ŞÖBƏ / ANBAR ADI</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>FİRMA NÖVÜ</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>VÖEN</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>TELEFON</th>
              <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569', textAlign: 'right' }}>ƏMƏLİYYATLAR</th>
            </tr>
          </thead>
          <tbody>
            {warehouses.map((w, index) => (
              <tr key={w.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: 'white', transition: 'background-color 0.2s' }} onMouseOver={e=>e.currentTarget.style.backgroundColor='#f8fafc'} onMouseOut={e=>e.currentTarget.style.backgroundColor='white'}>
                <td style={{ padding: '1rem 1.5rem' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', padding: '0.3rem 0.8rem', backgroundColor: w.tur === 'Mərkəz' ? '#eff6ff' : '#f1f5f9', color: w.tur === 'Mərkəz' ? '#3b82f6' : '#64748b', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800 }}>
                    {w.tur}
                  </span>
                </td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                  {w.shobeAdi}
                </td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.95rem', color: '#475569', fontWeight: 500 }}>
                  {w.firmaNovu || '-'}
                </td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.95rem', color: '#475569', fontWeight: 500, fontFamily: 'monospace' }}>
                  {w.voen || '-'}
                </td>
                <td style={{ padding: '1rem 1.5rem', fontSize: '0.95rem', color: '#475569', fontWeight: 500 }}>
                  {w.telefon || '-'}
                </td>
                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <button onClick={() => openEditModal(w)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', backgroundColor: '#f1f5f9', color: '#3b82f6', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e=>e.currentTarget.style.backgroundColor='#e0f2fe'} onMouseOut={e=>e.currentTarget.style.backgroundColor='#f1f5f9'}>
                      <Edit2 size={16} /> Düzəliş Et
                    </button>
                    <button onClick={() => handleDelete(w.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', backgroundColor: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e=>e.currentTarget.style.backgroundColor='#fee2e2'} onMouseOut={e=>e.currentTarget.style.backgroundColor='#fef2f2'}>
                      <Trash2 size={16} /> Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Small ADD Modal */}
      {isAddModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.5)', zIndex: 999, backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', width: '100%', maxWidth: '450px', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
            
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Yeni Əlavə Et</h2>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Türü <span style={{color: '#ef4444'}}>*</span></label>
                <select value={newDepoType} onChange={e=>setNewDepoType(e.target.value)} style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', backgroundColor: '#f8fafc' }}>
                  <option>Mərkəz</option>
                  <option>Şöbə</option>
                  <option>Anbar</option>
                  <option>Filial</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Adı <span style={{color: '#ef4444'}}>*</span></label>
                <input type="text" value={newDepoName} onChange={e=>setNewDepoName(e.target.value)} placeholder="Məsələn: Sumqayıt Anbarı" autoFocus style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} onKeyDown={e => e.key === 'Enter' && handleAddNew()}/>
              </div>
            </div>

            <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handleAddNew} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 2rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.39)' }}>
                <Save size={20}/> Yadda Saxla
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Large EDIT Modal / Form */}
      {isEditModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.5)', zIndex: 999, backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          
          <div style={{ backgroundColor: 'white', borderRadius: '20px', width: '100%', maxWidth: '900px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
                  <Briefcase size={20} />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Filial / Firma Məlumatlarına Düzəliş Et</h2>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>Zəhmət olmasa zəruri firma məlumatlarınızı tamamlayın</p>
                </div>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.2s' }} onMouseOver={e=>e.currentTarget.style.backgroundColor='#e2e8f0'} onMouseOut={e=>e.currentTarget.style.backgroundColor='transparent'}>
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '2rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f1f5f9', border: '2px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', cursor: 'pointer' }} title="Firma Logosu (Qeyri-məcburi)">
                    <Upload size={28} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#334155' }}>Firma Logosu</h3>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>(Zorunlu Değil) PNG və ya JPG</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#e2e8f0', padding: '0.5rem 1rem', borderRadius: '10px' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569' }}>Firma No:</span>
                  <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>{formData.no}</span>
                </div>
              </div>

              {/* Form Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Türü / Şöbə <span style={{color: '#ef4444'}}>*</span></label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <select value={formData.tur} onChange={e=>setFormData({...formData, tur: e.target.value})} style={{ width: '120px', padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', backgroundColor: '#f8fafc' }}>
                      <option>Mərkəz</option>
                      <option>Şöbə</option>
                      <option>Anbar</option>
                      <option>Filial</option>
                    </select>
                    <input type="text" value={formData.shobeAdi} onChange={e=>setFormData({...formData, shobeAdi: e.target.value})} placeholder="Adı. Məs: Bakı Filialı" style={{ flex: 1, padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Sektor <span style={{color: '#ef4444'}}>*Zorunlu</span></label>
                  <input type="text" value={formData.sektor} onChange={e=>setFormData({...formData, sektor: e.target.value})} placeholder="Məs: Pərakəndə, Tibb, İstehsalat" style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Firma Türü <span style={{color: '#ef4444'}}>*Zorunlu</span></label>
                  <select value={formData.firmaNovu} onChange={e=>setFormData({...formData, firmaNovu: e.target.value})} style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', backgroundColor: '#f8fafc' }}>
                    <option value="">Seçin...</option>
                    <option>MMC (Məhdud Məsuliyyətli Cəmiyyət)</option>
                    <option>Fiziki Şəxs (Fərdi Sahibkar)</option>
                    <option>ASC (Açıq Səhmdar Cəmiyyət)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Firma Adı</label>
                  <input type="text" value={formData.firmaAdi} onChange={e=>setFormData({...formData, firmaAdi: e.target.value})} placeholder="Rəsmi şirkət adı" style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Firma Sahibi Adı Soyadı</label>
                  <input type="text" value={formData.sahibAdSoyad} onChange={e=>setFormData({...formData, sahibAdSoyad: e.target.value})} placeholder="Ad və Soyad" style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>TC No / FİN</label>
                  <input type="text" value={formData.fin} onChange={e=>setFormData({...formData, fin: e.target.value})} placeholder="ŞV FİN kodu" maxLength={7} style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Vergi Kimlik No (VÖEN) <span style={{color: '#ef4444'}}>*</span></label>
                  <input type="text" value={formData.voen} onChange={e=>setFormData({...formData, voen: e.target.value})} placeholder="Vergi Ödəyicisinin Eyniləşdirmə Nömrəsi" style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Vergi Dairesi (İdarəsi)</label>
                  <input type="text" value={formData.vergiIdaresi} onChange={e=>setFormData({...formData, vergiIdaresi: e.target.value})} placeholder="Məs: Bakı Şəhər Kiçik Sahibkarlıqla İş İdarəsi" style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} />
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><MapPin size={16}/> Adres <span style={{color: '#ef4444'}}>*Zorunlu</span></label>
                  <textarea value={formData.unvan} onChange={e=>setFormData({...formData, unvan: e.target.value})} placeholder="Tam hüquqi ünvan" style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', minHeight: '80px', resize: 'vertical' }} />
                </div>

                {/* Contact Info */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Phone size={16}/> Telefon</label>
                  <input type="text" value={formData.telefon} onChange={e=>setFormData({...formData, telefon: e.target.value})} placeholder="+994 (__) ___ __ __" style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><FileText size={16}/> Fax</label>
                  <input type="text" value={formData.faks} onChange={e=>setFormData({...formData, faks: e.target.value})} placeholder="Faks nömrəsi" style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Mail size={16}/> Mail</label>
                  <input type="email" value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} placeholder="info@firma.az" style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '0.4rem' }}><Globe size={16}/> Web Site</label>
                  <input type="text" value={formData.vebSayt} onChange={e=>setFormData({...formData, vebSayt: e.target.value})} placeholder="www.firma.az" style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Ticaret sicil No</label>
                  <input type="text" value={formData.reyestrNo} onChange={e=>setFormData({...formData, reyestrNo: e.target.value})} style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Mersis No</label>
                  <input type="text" value={formData.digerNo} onChange={e=>setFormData({...formData, digerNo: e.target.value})} style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} />
                </div>

              </div>

              {/* Bank Details form added here */}
              <div style={{ marginTop: '1rem', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Landmark size={20} color="#4f46e5" /> Banka Hesabı Ekle (Anket)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Bank Adı</label>
                    <input type="text" value={formData.bankAdi} onChange={e=>setFormData({...formData, bankAdi: e.target.value})} placeholder="Məs: Kapital Bank" style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', backgroundColor: 'white' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>IBAN</label>
                    <input type="text" value={formData.iban} onChange={e=>setFormData({...formData, iban: e.target.value})} placeholder="AZ..." style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', backgroundColor: 'white' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Hesab No / SWIFT</label>
                    <input type="text" value={formData.hesabNo} onChange={e=>setFormData({...formData, hesabNo: e.target.value})} placeholder="Hesab məlumatları" style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', backgroundColor: 'white' }} />
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
              <button onClick={handleSaveEdit} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 2rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.39)', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>
                <Save size={20}/> Kaydet
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

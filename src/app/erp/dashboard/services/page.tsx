'use client'

import { useState } from 'react';

type ServiceCategory = 
  | 'Təcili Yardım və Reanimasiya' 
  | 'Diaqnostika Xidmətləri' 
  | 'Ambulator (Poliklinika) Xidmətləri'
  | 'Cərrahiyyə Xidmətləri (Stasionar)'
  | 'Doğum və Ginekologiya'
  | 'Pediatriya'
  | 'Fizioterapiya və Reabilitasiya';

const CATEGORIES: ServiceCategory[] = [
  'Təcili Yardım və Reanimasiya',
  'Diaqnostika Xidmətləri',
  'Ambulator (Poliklinika) Xidmətləri',
  'Cərrahiyyə Xidmətləri (Stasionar)',
  'Doğum və Ginekologiya',
  'Pediatriya',
  'Fizioterapiya və Reabilitasiya'
];

type MedicalService = {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  price: number;
  currency: 'AZN' | 'USD';
  status: 'Aktiv' | 'Deaktiv';
};

const INITIAL_SERVICES: MedicalService[] = [
  // Təcili Yardım
  { id: 'SRV-001', name: 'Təcili Tibbi Yardım', description: '7/24 qəfil xəstəlik və travmalar zamanı ilk müdaxilə', category: 'Təcili Yardım və Reanimasiya', price: 50, currency: 'AZN', status: 'Aktiv' },
  { id: 'SRV-002', name: 'İntensiv Terapiya və Reanimasiya (İTŞ)', description: 'Həyati təhlükəsi olan xəstələrin davamlı nəzarəti (günlük)', category: 'Təcili Yardım və Reanimasiya', price: 200, currency: 'AZN', status: 'Aktiv' },
  // Diaqnostika
  { id: 'SRV-003', name: 'Laboratoriya (Geniş qan)', description: 'Biokimyəvi, mikrobioloji və genetik testlər', category: 'Diaqnostika Xidmətləri', price: 40, currency: 'AZN', status: 'Aktiv' },
  { id: 'SRV-004', name: 'Radiologiya və Görüntüləmə', description: 'Rentgen, USM, MRT, KT, Mammoqrafiya', category: 'Diaqnostika Xidmətləri', price: 80, currency: 'AZN', status: 'Aktiv' },
  { id: 'SRV-005', name: 'Funksional Diaqnostika', description: 'EKQ, ExoKQ, EEQ, Endoskopiya', category: 'Diaqnostika Xidmətləri', price: 60, currency: 'AZN', status: 'Aktiv' },
  // Ambulator
  { id: 'SRV-006', name: 'Kardiologiya Qəbulu', description: 'Ürək və qan-damar xəstəliklərinin müayinəsi', category: 'Ambulator (Poliklinika) Xidmətləri', price: 45, currency: 'AZN', status: 'Aktiv' },
  { id: 'SRV-007', name: 'Nevrologiya Qəbulu', description: 'Sinir sistemi xəstəlikləri', category: 'Ambulator (Poliklinika) Xidmətləri', price: 45, currency: 'AZN', status: 'Aktiv' },
  // Cərrahiyyə
  { id: 'SRV-008', name: 'Ümumi Cərrahiyyə', description: 'Qarın boşluğu orqanlarının əməliyyatları', category: 'Cərrahiyyə Xidmətləri (Stasionar)', price: 1200, currency: 'AZN', status: 'Aktiv' },
  { id: 'SRV-009', name: 'Ürək-damar cərrahiyyəsi', description: 'Açıq və qapalı ürək əməliyyatları', category: 'Cərrahiyyə Xidmətləri (Stasionar)', price: 4500, currency: 'AZN', status: 'Aktiv' },
  // Doğum
  { id: 'SRV-010', name: 'Təbii Doğuş / Qeysəriyyə', description: 'Hamiləliyin təqibi və doğuş prosesi', category: 'Doğum və Ginekologiya', price: 900, currency: 'AZN', status: 'Aktiv' },
  // Pediatriya
  { id: 'SRV-011', name: 'Pediatr Qəbulu', description: 'Uşaq xəstəliklərinin diaqnostikası və müalicəsi', category: 'Pediatriya', price: 35, currency: 'AZN', status: 'Aktiv' },
  // Fizioterapiya
  { id: 'SRV-012', name: 'Fizioterapiya (1 seans)', description: 'Elektroterapiya, masaj, hərəkət bərpası', category: 'Fizioterapiya və Reabilitasiya', price: 30, currency: 'AZN', status: 'Aktiv' },
];

export default function MedicalServicesPage() {
  const [services, setServices] = useState<MedicalService[]>(INITIAL_SERVICES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<MedicalService>>({ category: 'Ambulator (Poliklinika) Xidmətləri', currency: 'AZN', status: 'Aktiv' });

  const formatNum = (num: number) => Number(num).toFixed(2).replace('.', ',');

  const handleOpenModal = (cat?: ServiceCategory) => {
    setIsEditing(false);
    setFormData({ 
      category: cat || 'Ambulator (Poliklinika) Xidmətləri', 
      currency: 'AZN', status: 'Aktiv', price: 0, name: '', description: '' 
    });
    setIsModalOpen(true);
  };

  const handleEdit = (srv: MedicalService) => {
    setIsEditing(true);
    setFormData(srv);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu tibbi xidməti silmək istədiyinizə əminsiniz?')) {
      setServices(services.filter(s => s.id !== id));
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.price || !formData.category) return alert('Xidmət adı, Kateqoriya və Qiymət mütləqdir!');
    
    if (isEditing) {
      setServices(services.map(s => s.id === formData.id ? { ...s, ...formData } as MedicalService : s));
    } else {
      const newSrv: MedicalService = {
        ...formData as MedicalService,
        id: `SRV-${1000 + Math.floor(Math.random()*9000)}`,
      };
      setServices([...services, newSrv]);
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '0.25rem' }}>Tibbi Xidmətlər Kataloqu</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Klinikanın təqdim etdiyi şöbələr üzrə xidmətlər və qiymətlər</p>
        </div>
        <button onClick={() => handleOpenModal()} style={{ padding: '0.65rem 1.25rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
          + Yeni Xidmət
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {CATEGORIES.map(category => {
          const categoryServices = services.filter(s => s.category === category);
          
          return (
            <div key={category} className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden' }}>
              <div style={{ padding: '1.25rem 1.5rem', backgroundColor: 'rgba(16, 185, 129, 0.05)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-color)' }}>{category}</h2>
                <button onClick={() => handleOpenModal(category)} style={{ padding: '0.4rem 0.8rem', backgroundColor: 'white', color: 'var(--primary-color)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  + Əlavə Et
                </button>
              </div>
              
              <div style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
                {categoryServices.length === 0 ? (
                  <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.9rem' }}>Bu şöbəyə hələ xidmət əlavə edilməyib.</div>
                ) : (
                  categoryServices.map(srv => (
                    <div key={srv.id} style={{ 
                      padding: '1.25rem', 
                      borderRadius: '12px', 
                      backgroundColor: 'var(--bg-color)', 
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      cursor: 'default'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.05)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <h3 style={{ fontSize: '1rem', fontWeight: 700, lineHeight: 1.3, color: 'var(--text-primary)', paddingRight: '1rem' }}>{srv.name}</h3>
                          <span style={{ 
                            padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 700,
                            backgroundColor: srv.status === 'Aktiv' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: srv.status === 'Aktiv' ? '#10b981' : '#ef4444'
                          }}>
                            {srv.status}
                          </span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.4 }}>
                          {srv.description || 'Geniş izahat əlavə edilməyib.'}
                        </p>
                      </div>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px dashed var(--border-color)' }}>
                        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary-color)' }}>
                          {formatNum(srv.price)} {srv.currency === 'AZN' ? '₼' : '$'}
                        </div>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button onClick={() => handleEdit(srv)} style={{ padding: '0.3rem 0.6rem', backgroundColor: '#f1f5f9', color: '#334155', borderRadius: '6px', border: '1px solid #cbd5e1', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}>Düzəliş</button>
                          <button onClick={() => handleDelete(srv.id)} style={{ padding: '0.3rem 0.6rem', backgroundColor: '#fef2f2', color: '#ef4444', borderRadius: '6px', border: '1px solid #fecaca', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}>Sil</button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
        }}>
          <div style={{ backgroundColor: 'var(--surface-color)', width: '100%', maxWidth: '550px', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>{isEditing ? 'Xidmətə Düzəliş Et' : 'Yeni Tibbi Xidmət'}</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Xidmətin Adı</label>
                <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Məs: Kardioloq Qəbulu" style={inputStyle} />
              </div>
              
              <div>
                <label style={labelStyle}>Qısa Açıqlama</label>
                <textarea rows={2} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Məs: Ürək və qan-damar xəstəliklərinin müayinəsi" style={{...inputStyle, resize: 'none'}} />
              </div>

              <div>
                <label style={labelStyle}>Kateqoriya / Şöbə</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as ServiceCategory})} style={inputStyle}>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                <div>
                  <label style={labelStyle}>Qiymət</label>
                  <input type="number" value={formData.price || ''} onChange={e => setFormData({...formData, price: Number(e.target.value)})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Valyuta</label>
                  <select value={formData.currency} onChange={e => setFormData({...formData, currency: e.target.value as any})} style={inputStyle}>
                    <option>AZN</option>
                    <option>USD</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} style={inputStyle}>
                  <option>Aktiv</option>
                  <option>Deaktiv</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2.5rem' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: '0.85rem 1.5rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}>İmtina</button>
              <button onClick={handleSave} style={{ padding: '0.85rem 2rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}>Təsdiqlə</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.9rem' };
const inputStyle = { width: '100%', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.95rem', outline: 'none' };

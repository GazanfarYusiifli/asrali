'use client'

import { useState, useEffect } from 'react';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';

type FacilityInfo = { id: string, name: string, voen: string, address: string };
const INITIAL_FACILITIES: FacilityInfo[] = [];


export default function MedicalSettingsPage() {
  const [activeTab, setActiveTab] = useState<'Regional İdarə' | 'Müəssisələr' | 'Vergi / Sığorta'>('Regional İdarə');
  const [facilities, setFacilities] = useState<FacilityInfo[]>(INITIAL_FACILITIES);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<FacilityInfo>>({ name: '', voen: '', address: '' });

  useEffect(() => {
    const saved = getAppStorage('erp_settings_facilities');
    if (saved) {
      try { setFacilities(JSON.parse(saved)); } catch(e){}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setAppStorage('erp_settings_facilities', JSON.stringify(facilities));
    }
  }, [facilities, isLoaded]);

  const handleOpenModal = () => {
    setIsEditing(false);
    setFormData({ name: '', voen: '', address: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (fac: FacilityInfo) => {
    setIsEditing(true);
    setFormData(fac);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Silmək istədiyinizə əminsiniz?')) {
      setFacilities(facilities.filter(f => f.id !== id));
    }
  };

  const handleSaveFacility = () => {
    if (!formData.name) return alert('Ad mütləqdir!');
    if (isEditing) {
      setFacilities(facilities.map(f => f.id === formData.id ? { ...f, ...formData } as FacilityInfo : f));
    } else {
      setFacilities([...facilities, { ...formData as FacilityInfo, id: 'F-' + Math.random().toString(36).substr(2, 9) }]);
    }
    setIsModalOpen(false);
  };

  const inputStyle = { width: '100%', padding: '0.85rem 1.25rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', outline: 'none', fontSize: '0.95rem', fontWeight: 500, transition: 'all 0.2s ease', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' };
  const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', letterSpacing: '0.3px' };

  const handleSave = () => {
    alert("Tənzimləmələr uğurla yadda saxlanıldı!");
  };

  return (
    <div style={{ maxWidth: '100%', overflowX: 'hidden', paddingBottom: '2rem' }}>
      
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', 
        marginBottom: '2.5rem', padding: '1.5rem 2rem', borderRadius: '24px',
        background: 'linear-gradient(135deg, var(--bg-color) 0%, rgba(16, 185, 129, 0.03) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.1)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
      }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Sistem Tənzimləmələri</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>Mərkəzi aparat və tabe olan səhiyyə müəssisələrinin idarə edilməsi</p>
        </div>
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.1)' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2.5rem', borderBottom: '2px solid rgba(16, 185, 129, 0.1)', paddingBottom: '1rem' }}>
        {['Regional İdarə', 'Müəssisələr', 'Vergi / Sığorta'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab as any)}
            style={{ 
              padding: '0.75rem 1.75rem', borderRadius: '12px', border: 'none', fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem',
              backgroundColor: activeTab === tab ? '#10b981' : 'transparent',
              color: activeTab === tab ? 'white' : 'var(--text-secondary)',
              boxShadow: activeTab === tab ? '0 4px 15px rgba(16, 185, 129, 0.3)' : 'none',
              transition: 'all 0.2s ease',
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
            {tab === 'Regional İdarə' && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg>}
            {tab === 'Müəssisələr' && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>}
            {tab === 'Vergi / Sığorta' && <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="14"/><path d="M12 10h4"/><path d="M8 10h.01"/><path d="M8 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>}
            {tab}
          </button>
        ))}
      </div>

      <div style={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.02)', maxWidth: '900px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #10b981, #34d399)' }}></div>
        <div style={{ padding: '2.5rem' }}>
          
          {activeTab === 'Regional İdarə' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', animation: 'fadeIn 0.3s ease-out' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Təşkilatın Adı</label>
                <div style={{ position: 'relative' }}>
                  <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"/><path d="M12 3v6"/></svg>
                  <input type="text" defaultValue="Bərdə Rayon Səhiyyə İdarəsi" style={{...inputStyle, paddingLeft: '2.75rem'}} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Əlaqə Nömrəsi</label>
                <div style={{ position: 'relative' }}>
                  <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  <input type="text" defaultValue="+994 20 205 67 89" style={{...inputStyle, paddingLeft: '2.75rem'}} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <div style={{ position: 'relative' }}>
                  <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                  <input type="text" defaultValue="info@barda-health.gov.az" style={{...inputStyle, paddingLeft: '2.75rem'}} />
                </div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Ünvan</label>
                <div style={{ position: 'relative' }}>
                  <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                  <input type="text" defaultValue="Bərdə ş., Tərtər küç. 5" style={{...inputStyle, paddingLeft: '2.75rem'}} />
                </div>
              </div>
              <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button onClick={handleSave} style={{ padding: '0.85rem 2.5rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>Yadda Saxla</button>
              </div>
            </div>
          )}

          {activeTab === 'Müəssisələr' && (
            <div style={{ animation: 'fadeIn 0.3s ease-out' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>Tabe Müəssisələrin Siyahısı</h3>
                <button onClick={handleOpenModal} style={{ padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}>+ Yeni Müəssisə Əlavə Et</button>
              </div>
              
              <div style={{ border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ backgroundColor: '#f8fafc', color: 'var(--text-secondary)' }}>
                    <tr>
                      <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Müəssisə Adı</th>
                      <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>VÖEN</th>
                      <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Ünvan</th>
                      <th style={{ padding: '1rem 1.5rem', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', textAlign: 'center' }}>Əməliyyat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {facilities.map((f, i) => (
                      <tr key={f.id} style={{ borderTop: '1px solid var(--border-color)', backgroundColor: i % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                        <td style={{ padding: '1rem 1.5rem', fontWeight: 700, color: '#3b82f6', fontSize: '0.9rem' }}>{f.name}</td>
                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 600 }}>{f.voen}</td>
                        <td style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{f.address}</td>
                        <td style={{ padding: '1rem 1.5rem', textAlign: 'center', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                          <button onClick={() => handleEdit(f)} style={{ padding: '0.4rem 0.8rem', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>Düzəliş</button>
                          <button onClick={() => handleDelete(f.id)} style={{ padding: '0.4rem 0.8rem', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem' }}>Sil</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Vergi / Sığorta' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', animation: 'fadeIn 0.3s ease-out' }}>
              <div>
                <label style={labelStyle}>Mərkəzi VÖEN (Vergi Ödəyicisinin Eyniləşdirmə Nömrəsi)</label>
                <div style={{ position: 'relative' }}>
                  <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 7h10"/><path d="M7 12h10"/><path d="M7 17h10"/></svg>
                  <input type="text" defaultValue="1500000000" style={{...inputStyle, paddingLeft: '2.75rem'}} />
                </div>
              </div>
              <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button onClick={handleSave} style={{ padding: '0.85rem 2.5rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>Yadda Saxla</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
      `}} />

      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
          <div style={{ backgroundColor: '#ffffff', padding: '2.5rem', borderRadius: '24px', width: '500px', maxWidth: '95%', boxShadow: '0 25px 50px rgba(0,0,0,0.15)', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>{isEditing ? 'Düzəliş Et' : 'Yeni Müəssisə'}</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Müəssisə Adı</label>
                <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} placeholder="Məs: Şəhər Poliklinikası" />
              </div>
              <div>
                <label style={labelStyle}>VÖEN</label>
                <input type="text" value={formData.voen || ''} onChange={e => setFormData({...formData, voen: e.target.value})} style={inputStyle} placeholder="150..." />
              </div>
              <div>
                <label style={labelStyle}>Ünvan</label>
                <input type="text" value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} style={inputStyle} placeholder="Ünvan daxil edin" />
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={() => setIsModalOpen(false)} style={{ padding: '0.85rem 1.5rem', backgroundColor: '#f1f5f9', color: '#64748b', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>Ləğv et</button>
                <button onClick={handleSaveFacility} style={{ padding: '0.85rem 2rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer' }}>Yadda saxla</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

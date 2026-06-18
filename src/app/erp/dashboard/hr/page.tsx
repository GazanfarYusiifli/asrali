'use client'

import { useState, useEffect } from 'react';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';

type Facility = {
  id: string;
  name: string;
  manager: string;
  type: string;
  budget: number;
  paid: number;
  staffCount: number;
  status: 'Aktiv' | 'Gözləmədə' | 'Tamamlanıb';
};

const INITIAL_FACILITIES: Facility[] = [];

export default function RegionalPayrollPage() {
  
  const [facilities, setFacilities] = useState<Facility[]>(INITIAL_FACILITIES);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = getAppStorage('erp_hr_facilities');
    if (saved) {
      try { setFacilities(JSON.parse(saved)); } catch(e){}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setAppStorage('erp_hr_facilities', JSON.stringify(facilities));
    }
  }, [facilities, isLoaded]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Facility>>({ status: 'Aktiv', type: 'Poliklinika' });

  const formatNum = (num: number) => Number(num).toFixed(2).replace('.', ',');

  const totalFacilities = facilities.length;
  const totalStaff = facilities.reduce((sum, f) => sum + f.staffCount, 0);
  const totalBudget = facilities.reduce((sum, f) => sum + f.budget, 0);

  const handleOpenModal = () => {
    setIsEditing(false);
    setFormData({ name: '', manager: '', type: 'Poliklinika', budget: 0, paid: 0, staffCount: 0, status: 'Aktiv' });
    setIsModalOpen(true);
  };

  const handleEdit = (fac: Facility) => {
    setIsEditing(true);
    setFormData(fac);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.budget) return alert('Zəhmət olmasa müəssisə adı və büdcəni qeyd edin!');
    
    if (isEditing) {
      setFacilities(facilities.map(f => f.id === formData.id ? { ...formData as Facility } : f));
    } else {
      const newFac: Facility = {
        ...formData as Facility,
        id: `FAC-${1000 + Math.floor(Math.random() * 9000)}`
      };
      setFacilities([newFac, ...facilities]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu müəssisəni silmək istədiyinizə əminsiniz?')) {
      setFacilities(facilities.filter(f => f.id !== id));
    }
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
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Müəssisələr üzrə Əməkhaqqı Fondu</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>Bərdə rayonu üzrə tabeçilikdə olan tibb müəssisələrinin aylıq əməkhaqqı büdcələrinə nəzarət</p>
        </div>
        <button onClick={handleOpenModal} style={{ padding: '0.8rem 1.5rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'transform 0.2s' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          Yeni Müəssisə
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem', animation: 'fadeIn 0.4s ease-out' }}>
        <div style={{ padding: '1.75rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(59,130,246,0.02) 100%)', border: '1px solid rgba(59,130,246,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--surface-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', boxShadow: '0 4px 10px rgba(59,130,246,0.2)' }}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg></div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>Ümumi Müəssisə Sayı</h3>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{totalFacilities}</div>
        </div>

        <div style={{ padding: '1.75rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(245,158,11,0.02) 100%)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--surface-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b', boxShadow: '0 4px 10px rgba(245,158,11,0.2)' }}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>Ümumi İşçi Ştatı</h3>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{totalStaff} <span style={{fontSize: '1rem', color: 'var(--text-secondary)'}}>Nəfər</span></div>
        </div>

        <div style={{ padding: '1.75rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0.02) 100%)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--surface-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', boxShadow: '0 4px 10px rgba(16,185,129,0.2)' }}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>Aylıq Əməkhaqqı Fondu (701)</h3>
          </div>
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{formatNum(totalBudget)} <span style={{fontSize: '1.25rem'}}>₼</span></div>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.02)', animation: 'fadeIn 0.4s ease-out' }}>
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>Səhiyyə Müəssisələrinin Siyahısı</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', textAlign: 'left', tableLayout: 'auto' }}>
            <thead style={{ backgroundColor: '#10b981', color: 'white' }}>
              <tr>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderRight: '1px solid rgba(255,255,255,0.1)' }}>Müəssisə</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderRight: '1px solid rgba(255,255,255,0.1)' }}>Rəhbər / Növ</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderRight: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>Ştat Sayı</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderRight: '1px solid rgba(255,255,255,0.1)' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderRight: '1px solid rgba(255,255,255,0.1)', textAlign: 'right' }}>Aylıq Büdcə</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderRight: '1px solid rgba(255,255,255,0.1)', textAlign: 'right' }}>Ödənilən</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'center' }}>Əməliyyat</th>
              </tr>
            </thead>
            <tbody>
              {facilities.map((fac, index) => {
                const percentPaid = fac.budget > 0 ? ((fac.paid / fac.budget) * 100).toFixed(0) : 0;
                return (
                <tr key={fac.id} className="table-row-modern" style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                  <td style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', borderRight: '1px solid rgba(0,0,0,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', fontWeight: 800 }}>
                        {fac.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, color: '#3b82f6' }}>{fac.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{fac.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', borderRight: '1px solid rgba(0,0,0,0.02)' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{fac.manager || 'Təyin edilməyib'}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{fac.type}</div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center', fontWeight: 800, color: '#f59e0b', borderBottom: '1px solid var(--border-color)', borderRight: '1px solid rgba(0,0,0,0.02)' }}>
                    {fac.staffCount}
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', borderRight: '1px solid rgba(0,0,0,0.02)' }}>
                    <span style={{ 
                      padding: '0.3rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700,
                      backgroundColor: fac.status === 'Aktiv' ? 'rgba(59, 130, 246, 0.1)' : fac.status === 'Tamamlanıb' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: fac.status === 'Aktiv' ? '#3b82f6' : fac.status === 'Tamamlanıb' ? '#10b981' : '#f59e0b'
                    }}>
                      {fac.status}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right', fontWeight: 800, borderBottom: '1px solid var(--border-color)', borderRight: '1px solid rgba(0,0,0,0.02)' }}>
                    {formatNum(fac.budget)} ₼
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right', borderBottom: '1px solid var(--border-color)', borderRight: '1px solid rgba(0,0,0,0.02)' }}>
                    <div style={{ fontWeight: 800, color: '#10b981' }}>{formatNum(fac.paid)} ₼</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                      <div style={{ width: '100%', backgroundColor: 'var(--bg-color)', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${percentPaid}%`, backgroundColor: '#10b981', height: '100%', borderRadius: '3px' }}></div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button onClick={() => handleEdit(fac)} style={{ padding: '0.4rem 0.6rem', backgroundColor: 'rgba(59,130,246,0.1)', color: '#3b82f6', borderRadius: '6px', border: 'none', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>Düzəliş</button>
                      <button onClick={() => handleDelete(fac.id)} style={{ padding: '0.4rem 0.6rem', backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', borderRadius: '6px', border: 'none', fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer' }}>Sil</button>
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{ backgroundColor: 'var(--surface-color)', width: '100%', maxWidth: '600px', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', color: 'var(--text-primary)' }}>
              {isEditing ? 'Müəssisə Məlumatlarını Yenilə' : 'Yeni Müəssisə Əlavə Et'}
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Müəssisənin Adı</label>
                <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Məs: Bərdə MRX" style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Müəssisənin Növü</label>
                  <select value={formData.type || ''} onChange={e => setFormData({...formData, type: e.target.value})} style={inputStyle}>
                    <option value="Xəstəxana">Xəstəxana</option>
                    <option value="Poliklinika">Poliklinika</option>
                    <option value="Diaqnostika">Diaqnostika Mərkəzi</option>
                    <option value="Məsləhətxana">Qadın Məsləhətxanası</option>
                    <option value="Digər">Digər</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Rəhbər / Baş Həkim</label>
                  <input type="text" value={formData.manager || ''} onChange={e => setFormData({...formData, manager: e.target.value})} placeholder="Məs: Dr. Vəli Əliyev" style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Aylıq Büdcə (₼)</label>
                  <input type="number" value={formData.budget || ''} onChange={e => setFormData({...formData, budget: Number(e.target.value)})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Ödənilmiş (₼)</label>
                  <input type="number" value={formData.paid || ''} onChange={e => setFormData({...formData, paid: Number(e.target.value)})} style={inputStyle} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Ştat Sayı</label>
                  <input type="number" value={formData.staffCount || ''} onChange={e => setFormData({...formData, staffCount: Number(e.target.value)})} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Status</label>
                  <select value={formData.status || 'Aktiv'} onChange={e => setFormData({...formData, status: e.target.value as any})} style={inputStyle}>
                    <option value="Aktiv">Aktiv (Ödəniş davam edir)</option>
                    <option value="Gözləmədə">Gözləmədə</option>
                    <option value="Tamamlanıb">Tamamlanıb (Tam ödənilib)</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2.5rem' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: '0.85rem 1.5rem', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '12px', cursor: 'pointer', fontWeight: 700, color: 'var(--text-secondary)' }}>İmtina</button>
              <button onClick={handleSave} style={{ padding: '0.85rem 2rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 800, boxShadow: '0 4px 15px rgba(16,185,129,0.3)' }}>Təsdiqlə</button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .table-row-modern:hover { background-color: #f1f5f9 !important; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
}

const labelStyle = { display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' };
const inputStyle = { width: '100%', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.95rem', outline: 'none', transition: 'all 0.2s' };

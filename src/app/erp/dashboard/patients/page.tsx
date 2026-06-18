'use client'

import { useState } from 'react';

type Patient = {
  id: string;
  name: string;
  fin: string;
  phone: string;
  gender: 'Kişi' | 'Qadın';
  status: 'Yeni' | 'Müalicədə' | 'Bitib';
  assignedDoctor: string;
  registrationDate: string;
};

const INITIAL_PATIENTS: Patient[] = [
  { id: 'PAS-1001', name: 'Rəşad Məmmədov', fin: '5DFG4H2', phone: '050-123-45-67', gender: 'Kişi', status: 'Müalicədə', assignedDoctor: 'Dr. Cavid Əliyev (Kardioloq)', registrationDate: '2026-06-15' },
  { id: 'PAS-1002', name: 'Leyla Hüseynova', fin: '7HJS9L1', phone: '055-987-65-43', gender: 'Qadın', status: 'Yeni', assignedDoctor: 'Dr. Aysel Qasımova (Terapevt)', registrationDate: '2026-06-14' },
];

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Patient>>({ status: 'Yeni', gender: 'Kişi' });

  const handleOpenModal = () => {
    setIsEditing(false);
    setFormData({ status: 'Yeni', gender: 'Kişi' });
    setIsModalOpen(true);
  };

  const handleEdit = (p: Patient) => {
    setIsEditing(true);
    setFormData(p);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Pasiyenti silmək istədiyinizə əminsiniz?')) {
      setPatients(patients.filter(p => p.id !== id));
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.fin) return alert('Ad və FİN mütləqdir!');
    
    if (isEditing) {
      setPatients(patients.map(p => p.id === formData.id ? { ...p, ...formData } as Patient : p));
    } else {
      const newPatient: Patient = {
        ...formData as any,
        id: `PAS-${1000 + patients.length + 1}`,
        registrationDate: new Date().toISOString().slice(0, 10),
      };
      setPatients([newPatient, ...patients]);
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '0.25rem' }}>Xəstə (Pasiyent) Qeydiyyatı</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Klinikaya müraciət edən xəstələrin uçotu və idarəedilməsi</p>
        </div>
        <button onClick={handleOpenModal} style={{ padding: '0.65rem 1.25rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
          + Yeni Pasiyent
        </button>
      </div>

      {/* METRİKLƏR */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', borderTop: '4px solid #10b981' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.5rem' }}>Cəmi Pasiyent</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{patients.length}</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', borderTop: '4px solid #3b82f6' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.5rem' }}>Yeni Müraciətlər (Bu ay)</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{patients.filter(p => p.status === 'Yeni').length}</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', borderTop: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.5rem' }}>Müalicədə Olanlar</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{patients.filter(p => p.status === 'Müalicədə').length}</div>
        </div>
      </div>

      {/* CƏDVƏL */}
      <div className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Pasiyent Bazası</h3>
          <input type="text" placeholder="Ad, FİN və ya Nömrə ilə axtar..." style={{ padding: '0.65rem 1rem', width: '300px', borderRadius: '10px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', outline: 'none' }} />
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', tableLayout: 'auto' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Pasiyent (İD / Ad)</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>FİN / Əlaqə</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Həkim / Şöbə</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center' }}>Əməliyyat</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <td style={{ padding: '1.25rem 1.5rem', wordBreak: 'break-word' }}>
                    <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: p.gender === 'Kişi' ? '#3b82f6' : '#ec4899' }}></div>
                      {p.name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{p.id} | {p.registrationDate}</div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontWeight: 600 }}>{p.fin}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{p.phone}</div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-primary)', fontWeight: 500 }}>{p.assignedDoctor || 'Təyin Edilməyib'}</td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <span style={{ 
                      padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700,
                      backgroundColor: p.status === 'Yeni' ? 'rgba(59, 130, 246, 0.1)' : p.status === 'Müalicədə' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      color: p.status === 'Yeni' ? '#3b82f6' : p.status === 'Müalicədə' ? '#f59e0b' : '#10b981'
                    }}>
                      {p.status}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center' }}>
                      <button onClick={() => handleEdit(p)} style={{ padding: '0.4rem 0.6rem', backgroundColor: '#3b82f6', color: 'white', borderRadius: '6px', border: 'none', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}>Düzəliş</button>
                      <button onClick={() => handleDelete(p.id)} style={{ padding: '0.4rem 0.6rem', backgroundColor: '#ef4444', color: 'white', borderRadius: '6px', border: 'none', fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' }}>Sil</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
        }}>
          <div style={{ backgroundColor: 'var(--surface-color)', width: '100%', maxWidth: '500px', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>{isEditing ? 'Pasiyent Düzəlişi' : 'Yeni Pasiyent'}</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Ad Soyad</label>
                <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>FİN Kod</label>
                <input type="text" value={formData.fin || ''} onChange={e => setFormData({...formData, fin: e.target.value})} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Əlaqə Nömrəsi</label>
                <input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Cinsiyyət</label>
                <select value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as any})} style={inputStyle}>
                  <option>Kişi</option>
                  <option>Qadın</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} style={inputStyle}>
                  <option>Yeni</option>
                  <option>Müalicədə</option>
                  <option>Bitib</option>
                </select>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Yönləndirilən Həkim</label>
                <select value={formData.assignedDoctor || ''} onChange={e => setFormData({...formData, assignedDoctor: e.target.value})} style={inputStyle}>
                  <option value="">Təyin Edilməyib</option>
                  <option>Dr. Cavid Əliyev (Kardioloq)</option>
                  <option>Dr. Aysel Qasımova (Terapevt)</option>
                  <option>Dr. Ramin Hüseynov (Cərrah)</option>
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

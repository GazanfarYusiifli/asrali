'use client'

import { useState } from 'react';

type Doctor = {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  phone: string;
  fee: number;
  status: 'Aktiv' | 'Məzuniyyət';
  schedule: string;
};

const INITIAL_DOCTORS: Doctor[] = [
  { id: 'DOC-01', name: 'Dr. Cavid Əliyev', specialty: 'Kardioloq', experience: 12, phone: '050-555-11-22', fee: 50, status: 'Aktiv', schedule: 'B.e, Ç.a, C.a (09:00 - 15:00)' },
  { id: 'DOC-02', name: 'Dr. Aysel Qasımova', specialty: 'Terapevt', experience: 8, phone: '055-666-33-44', fee: 35, status: 'Aktiv', schedule: 'Hər gün (10:00 - 18:00)' },
  { id: 'DOC-03', name: 'Dr. Ramin Hüseynov', specialty: 'Cərrah', experience: 15, phone: '070-777-55-66', fee: 80, status: 'Məzuniyyət', schedule: 'Çərşənbə və Cümə (12:00 - 16:00)' },
];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Doctor>>({ status: 'Aktiv', fee: 0, experience: 0 });

  const formatNum = (num: number) => Number(num) === 0 ? '0,00' : Number(num).toFixed(2).replace('.', ',');

  const handleOpenModal = () => {
    setIsEditing(false);
    setFormData({ status: 'Aktiv', fee: 0, experience: 0 });
    setIsModalOpen(true);
  };

  const handleEdit = (doc: Doctor) => {
    setIsEditing(true);
    setFormData(doc);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Həkimi bazadan silmək istədiyinizə əminsiniz?')) {
      setDoctors(doctors.filter(d => d.id !== id));
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.specialty) return alert('Ad və İxtisas mütləqdir!');
    
    if (isEditing) {
      setDoctors(doctors.map(d => d.id === formData.id ? { ...d, ...formData } as Doctor : d));
    } else {
      const newDoc: Doctor = {
        ...formData as any,
        id: `DOC-0${doctors.length + 1}`,
      };
      setDoctors([newDoc, ...doctors]);
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '0.25rem' }}>Həkimlər və Qəbul Cədvəli</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Klinika personalı, iş qrafikləri və qəbul haqları</p>
        </div>
        <button onClick={handleOpenModal} style={{ padding: '0.65rem 1.25rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
          + Yeni Həkim
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {doctors.map(doc => (
          <div key={doc.id} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: `4px solid ${doc.status === 'Aktiv' ? '#10b981' : '#f59e0b'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.25rem' }}>
                  {doc.name.charAt(4)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>{doc.name}</h3>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{doc.specialty} ({doc.experience} il təcrübə)</div>
                </div>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.6rem', borderRadius: '6px', backgroundColor: doc.status === 'Aktiv' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', color: doc.status === 'Aktiv' ? '#10b981' : '#f59e0b' }}>
                {doc.status}
              </span>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', backgroundColor: 'var(--bg-color)', padding: '1rem', borderRadius: '12px' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Əlaqə</div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{doc.phone}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Qəbul Haqqı</div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--primary-color)' }}>{formatNum(doc.fee)} ₼</div>
              </div>
              <div style={{ gridColumn: 'span 2', marginTop: '0.5rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Cədvəl</div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>🕒 {doc.schedule}</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
              <button onClick={() => handleEdit(doc)} style={{ flex: 1, padding: '0.6rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>Düzəliş</button>
              <button onClick={() => handleDelete(doc.id)} style={{ flex: 1, padding: '0.6rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}>Sil</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
        }}>
          <div style={{ backgroundColor: 'var(--surface-color)', width: '100%', maxWidth: '550px', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>{isEditing ? 'Həkim Düzəlişi' : 'Yeni Həkim'}</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Həkimin Adı (Məs: Dr. ...)</label>
                <input type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>İxtisas (Məs: Kardioloq)</label>
                <input type="text" value={formData.specialty || ''} onChange={e => setFormData({...formData, specialty: e.target.value})} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Təcrübə İlə (il)</label>
                <input type="number" value={formData.experience || ''} onChange={e => setFormData({...formData, experience: Number(e.target.value)})} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Əlaqə Nömrəsi</label>
                <input type="text" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Qəbul Haqqı (AZN)</label>
                <input type="number" value={formData.fee || ''} onChange={e => setFormData({...formData, fee: Number(e.target.value)})} style={inputStyle} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Qəbul Günləri və Saatları</label>
                <input type="text" value={formData.schedule || ''} onChange={e => setFormData({...formData, schedule: e.target.value})} placeholder="Məs: I, III, V günlər 09:00 - 15:00" style={inputStyle} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} style={inputStyle}>
                  <option>Aktiv</option>
                  <option>Məzuniyyət</option>
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

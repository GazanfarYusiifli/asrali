'use client'

import { useState } from 'react';

type Student = {
  id: string;
  name: string;
  surname: string;
  fatherName: string;
  parentName: string;
  phone: string;
  email: string;
  admissionDate: string;
  group: string;
  debt: string;
  status: 'Ödəyib' | 'Ödəməyib';
};

const INITIAL_STUDENTS: Student[] = [
  { id: 'ID0001', name: 'Nihad', surname: 'Əliyev', fatherName: 'Ceyhun', parentName: 'Ceyhun Əliyev', phone: '+994 50 123 45 67', email: 'nihad@mail.com', admissionDate: '2025-09-15', group: 'Riyaziyyat - A1', debt: '150 ₼', status: 'Ödəməyib' },
  { id: 'ID0002', name: 'Aysel', surname: 'Quliyeva', fatherName: 'Məhəmməd', parentName: 'Məhəmməd Quliyev', phone: '+994 55 987 65 43', email: 'aysel@mail.com', admissionDate: '2026-01-10', group: 'İngilis Dili - B2', debt: '0 ₼', status: 'Ödəyib' },
  { id: 'ID0003', name: 'Ramil', surname: 'Həsənov', fatherName: 'Elçin', parentName: 'Elçin Həsənov', phone: '+994 70 555 44 33', email: 'ramil@mail.com', admissionDate: '2026-02-20', group: 'Dizayn - C1', debt: '300 ₼', status: 'Ödəməyib' },
  { id: 'ID0004', name: 'Zəhra', surname: 'Abbasova', fatherName: 'Zaur', parentName: 'Zaur Abbasov', phone: '+994 51 222 11 00', email: 'zahra@mail.com', admissionDate: '2026-03-05', group: 'Kimya - A2', debt: '0 ₼', status: 'Ödəyib' },
];

// Inline SVG Icons for a modern look
const EyeIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const EditIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const TrashIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>;
const SearchIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  
  const [modalType, setModalType] = useState<'add' | 'edit' | 'details' | 'delete' | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [formData, setFormData] = useState<Partial<Student>>({});

  const generateId = () => {
    const nextNum = students.length > 0 ? Math.max(...students.map(s => parseInt(s.id.replace('ID', '')))) + 1 : 1;
    return `ID${nextNum.toString().padStart(4, '0')}`;
  };

  const handleOpenAdd = () => { setFormData({ status: 'Ödəməyib', debt: '0 ₼' }); setModalType('add'); };
  const handleOpenEdit = (s: Student) => { setSelectedStudent(s); setFormData({ ...s }); setModalType('edit'); };
  const handleOpenDetails = (s: Student) => { setSelectedStudent(s); setModalType('details'); };
  const handleOpenDelete = (s: Student) => { setSelectedStudent(s); setModalType('delete'); };

  const handleCloseModal = () => { setModalType(null); setSelectedStudent(null); setFormData({}); };

  const handleSave = () => {
    if (modalType === 'add') {
      const newStudent: Student = {
        ...formData as Student,
        id: generateId(),
        debt: formData.debt || '0 ₼',
        status: formData.status || 'Ödəməyib'
      };
      setStudents([newStudent, ...students]);
    } else if (modalType === 'edit' && selectedStudent) {
      setStudents(students.map(s => s.id === selectedStudent.id ? { ...s, ...formData } as Student : s));
    }
    handleCloseModal();
  };

  const handleDelete = () => {
    if (selectedStudent) {
      setStudents(students.filter(s => s.id !== selectedStudent.id));
      handleCloseModal();
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch = `${s.name} ${s.surname} ${s.phone}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' ? true : s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '0.25rem' }}>Şagird İdarəetməsi</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Ümumi {filteredStudents.length} şagird tapıldı</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ 
            padding: '0.65rem 1.25rem', 
            backgroundColor: 'transparent', 
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)', 
            borderRadius: '10px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}>
            Export (Excel)
          </button>
          <button onClick={handleOpenAdd} style={{ 
            padding: '0.65rem 1.25rem', 
            backgroundColor: 'var(--primary-color)', 
            color: 'white', 
            borderRadius: '10px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)',
            transition: 'all 0.2s'
          }}>
            + Yeni Şagird 
          </button>
        </div>
      </div>

      <div style={{ 
        backgroundColor: 'var(--surface-color)', 
        borderRadius: '16px', 
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-sm)',
        overflow: 'hidden'
      }}>
        {/* FILTER BAR */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: '0.75rem', 
            flex: 1, maxWidth: '400px', 
            padding: '0.65rem 1rem', 
            borderRadius: '10px', 
            border: '1px solid var(--border-color)', 
            backgroundColor: 'var(--bg-color)' 
          }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex' }}><SearchIcon /></span>
            <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Ad, ID və ya telefon nömrəsi..." 
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.95rem' }}
            />
          </div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ 
              padding: '0.65rem 1rem', 
              borderRadius: '10px', 
              border: '1px solid var(--border-color)', 
              backgroundColor: 'var(--bg-color)', 
              outline: 'none', 
              fontWeight: 500,
              cursor: 'pointer'
            }}>
            <option value="All">Bütün Statuslar</option>
            <option value="Ödəyib">Ödəyib (Aktiv)</option>
            <option value="Ödəməyib">Ödəməyib (Borclu)</option>
          </select>
        </div>

        {/* MODERN TABLE */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-color)' }}>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Şagird</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Valideyn & Əlaqə</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sinif</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Məlumat tapılmadı</td></tr>
              ) : filteredStudents.map((student, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', transition: 'all 0.2s' }} className="table-row-modern">
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ 
                        width: '40px', height: '40px', borderRadius: '50%', 
                        background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(79, 70, 229, 0.2))',
                        color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '0.9rem'
                      }}>
                        {student.name.charAt(0)}{student.surname.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem' }}>{student.name} {student.surname}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>ID: <span style={{ fontWeight: 500 }}>{student.id}</span></div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{student.parentName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{student.phone}</div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <span style={{ padding: '0.35rem 0.75rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                      {student.group}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem' }}>
                      <span style={{ 
                        padding: '0.35rem 0.85rem', 
                        borderRadius: '99px', 
                        fontSize: '0.8rem', 
                        fontWeight: 700,
                        backgroundColor: student.status === 'Ödəyib' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: student.status === 'Ödəyib' ? '#10b981' : '#ef4444'
                      }}>
                        {student.status}
                      </span>
                      {student.status === 'Ödəməyib' && <div style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 700, paddingLeft: '0.5rem' }}>Borc: {student.debt}</div>}
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleOpenDetails(student)} style={actionBtnStyle('rgba(79,70,229,0.1)', 'var(--primary-color)')} title="Ətraflı">
                        <EyeIcon />
                      </button>
                      <button onClick={() => handleOpenEdit(student)} style={actionBtnStyle('var(--bg-color)', 'var(--text-secondary)')} title="Düzəliş Et">
                        <EditIcon />
                      </button>
                      <button onClick={() => handleOpenDelete(student)} style={actionBtnStyle('rgba(239,68,68,0.1)', '#ef4444')} title="Sil">
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .table-row-modern:hover {
          background-color: var(--bg-color);
        }
      `}} />

      {/* MODALS */}
      {modalType && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '1rem'
        }}>
          
          {/* ADD / EDIT MODAL */}
          {(modalType === 'add' || modalType === 'edit') && (
            <div style={{ backgroundColor: 'var(--surface-color)', width: '100%', maxWidth: '650px', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>
                {modalType === 'add' ? 'Yeni Şagird Qeydiyyatı' : 'Məlumatları Yenilə'}
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
                <input placeholder="Şagirdin Adı" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} />
                <input placeholder="Soyadı" value={formData.surname || ''} onChange={e => setFormData({...formData, surname: e.target.value})} style={inputStyle} />
                <input placeholder="Ata adı" value={formData.fatherName || ''} onChange={e => setFormData({...formData, fatherName: e.target.value})} style={inputStyle} />
                <input placeholder="Vəlideyn / Qəyyum (Ad Soyad)" value={formData.parentName || ''} onChange={e => setFormData({...formData, parentName: e.target.value})} style={inputStyle} />
                <input placeholder="Əlaqə nömrəsi" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} style={inputStyle} />
                <input placeholder="Email ünvanı" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} style={inputStyle} />
                <input placeholder="Qrup / Sinif (Məs: Riyaziyyat A1)" value={formData.group || ''} onChange={e => setFormData({...formData, group: e.target.value})} style={inputStyle} />
                <input type="date" placeholder="Qəbul Tarixi" value={formData.admissionDate || ''} onChange={e => setFormData({...formData, admissionDate: e.target.value})} style={inputStyle} />
                
                <select value={formData.status || 'Ödəməyib'} onChange={e => setFormData({...formData, status: e.target.value as any})} style={inputStyle}>
                  <option value="Ödəyib">Ödəyib (Borc Yoxdur)</option>
                  <option value="Ödəməyib">Ödəməyib (Borclu)</option>
                </select>
                <input placeholder="Borc Məbləği (Məs: 150 ₼)" value={formData.debt || ''} onChange={e => setFormData({...formData, debt: e.target.value})} style={inputStyle} disabled={formData.status === 'Ödəyib'} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button onClick={handleCloseModal} style={{ padding: '0.85rem 1.5rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}>İmtina Et</button>
                <button onClick={handleSave} style={{ padding: '0.85rem 2rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' }}>Yadda Saxla</button>
              </div>
            </div>
          )}

          {/* DETAILS MODAL */}
          {modalType === 'details' && selectedStudent && (
            <div style={{ backgroundColor: 'var(--surface-color)', width: '100%', maxWidth: '500px', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid var(--border-color)' }}>
              
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ 
                  width: '80px', height: '80px', borderRadius: '50%', 
                  background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '2rem', margin: '0 auto 1rem', boxShadow: '0 10px 25px rgba(79,70,229,0.4)'
                }}>
                  {selectedStudent.name.charAt(0)}{selectedStudent.surname.charAt(0)}
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{selectedStudent.name} {selectedStudent.surname}</h2>
                <div style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>ID: {selectedStudent.id} • {selectedStudent.group}</div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'var(--bg-color)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <DetailRow label="Ata adı" value={selectedStudent.fatherName} />
                <DetailRow label="Valideyn/Qəyyum" value={selectedStudent.parentName} />
                <DetailRow label="Əlaqə nömrəsi" value={selectedStudent.phone} />
                <DetailRow label="Email ünvanı" value={selectedStudent.email} />
                <DetailRow label="Qəbul tarixi" value={selectedStudent.admissionDate} />
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderTop: '1px dashed var(--border-color)', marginTop: '0.5rem', paddingTop: '1rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Maliyyə Statusu</span>
                  <span style={{ fontWeight: 700, color: selectedStudent.status === 'Ödəyib' ? '#10b981' : '#ef4444' }}>
                    {selectedStudent.status} {selectedStudent.status === 'Ödəməyib' && `(${selectedStudent.debt})`}
                  </span>
                </div>
              </div>
              
              <button onClick={handleCloseModal} style={{ width: '100%', padding: '1rem', marginTop: '2rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}>Bağla</button>
            </div>
          )}

          {/* DELETE CONFIRM MODAL */}
          {modalType === 'delete' && selectedStudent && (
            <div style={{ backgroundColor: 'var(--surface-color)', width: '100%', maxWidth: '400px', padding: '2.5rem', borderRadius: '24px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid var(--border-color)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <TrashIcon />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Əminsiniz?</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.5 }}>
                <b>{selectedStudent.name} {selectedStudent.surname}</b> sistemdən tamamilə silinəcək. Bu əməliyyat geri qaytarıla bilməz.
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <button onClick={handleCloseModal} style={{ flex: 1, padding: '0.85rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}>İmtina</button>
                <button onClick={handleDelete} style={{ flex: 1, padding: '0.85rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, boxShadow: '0 4px 12px rgba(239,68,68,0.3)' }}>Bəli, Sil</button>
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '0.85rem 1rem',
  borderRadius: '10px',
  border: '1px solid var(--border-color)',
  backgroundColor: 'var(--bg-color)',
  color: 'var(--text-primary)',
  fontSize: '0.95rem',
  outline: 'none',
  transition: 'border-color 0.2s',
};

const actionBtnStyle = (bg: string, color: string) => ({
  width: '36px', height: '36px',
  borderRadius: '8px',
  backgroundColor: bg,
  color: color,
  border: 'none',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer',
  transition: 'transform 0.1s'
});

function DetailRow({ label, value }: { label: string, value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{label}</span>
      <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{value}</span>
    </div>
  )
}

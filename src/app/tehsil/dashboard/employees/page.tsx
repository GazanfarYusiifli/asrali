'use client'

import { useState } from 'react';

type Employee = {
  id: string;
  name: string;
  surname: string;
  role: string;
  department: 'Müəllim' | 'İnzibati Heyət';
  category: string;
  experience: string;
  salaryType: string;
  salary: string;
  phone: string;
  email: string;
};

const INITIAL_EMPLOYEES: Employee[] = [
  { id: 'EMP0001', name: 'Kəmalə', surname: 'Ələkbərova', role: 'Baş Müəllim (Riyaziyyat)', department: 'Müəllim', category: 'A kateqoriya', experience: '12 il', salaryType: 'Saathesabı', salary: '1,200 ₼', phone: '+994 50 111 22 33', email: 'kamala@mail.com' },
  { id: 'EMP0002', name: 'Fərid', surname: 'Həsənov', role: 'Müəllim (İngilis Dili)', department: 'Müəllim', category: 'B kateqoriya', experience: '4 il', salaryType: 'Fix + Faiz', salary: '850 ₼', phone: '+994 55 444 55 66', email: 'farid@mail.com' },
  { id: 'EMP0003', name: 'Aygün', surname: 'Məmmədova', role: 'Tədris Meneceri', department: 'İnzibati Heyət', category: 'Rəhbərlik', experience: '7 il', salaryType: 'Fix', salary: '1,500 ₼', phone: '+994 70 777 88 99', email: 'aygun@mail.com' },
];

const EyeIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const EditIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const TrashIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>;
const SearchIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  
  const [modalType, setModalType] = useState<'add' | 'edit' | 'details' | 'delete' | null>(null);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [search, setSearch] = useState('');
  const [depFilter, setDepFilter] = useState('All');
  const [formData, setFormData] = useState<Partial<Employee>>({});

  const generateId = () => {
    const nextNum = employees.length > 0 ? Math.max(...employees.map(e => parseInt(e.id.replace('EMP', '')))) + 1 : 1;
    return `EMP${nextNum.toString().padStart(4, '0')}`;
  };

  const handleOpenAdd = () => { setFormData({ department: 'Müəllim', salaryType: 'Fix', category: 'B kateqoriya' }); setModalType('add'); };
  const handleOpenEdit = (e: Employee) => { setSelectedEmp(e); setFormData({ ...e }); setModalType('edit'); };
  const handleOpenDetails = (e: Employee) => { setSelectedEmp(e); setModalType('details'); };
  const handleOpenDelete = (e: Employee) => { setSelectedEmp(e); setModalType('delete'); };

  const handleCloseModal = () => { setModalType(null); setSelectedEmp(null); setFormData({}); };

  const handleSave = () => {
    if (modalType === 'add') {
      const newEmp: Employee = {
        ...formData as Employee,
        id: generateId(),
        salary: formData.salary || '0 ₼'
      };
      setEmployees([newEmp, ...employees]);
    } else if (modalType === 'edit' && selectedEmp) {
      setEmployees(employees.map(e => e.id === selectedEmp.id ? { ...e, ...formData } as Employee : e));
    }
    handleCloseModal();
  };

  const handleDelete = () => {
    if (selectedEmp) {
      setEmployees(employees.filter(e => e.id !== selectedEmp.id));
      handleCloseModal();
    }
  };

  const filteredEmployees = employees.filter(e => {
    const matchesSearch = `${e.name} ${e.surname} ${e.role} ${e.phone}`.toLowerCase().includes(search.toLowerCase());
    const matchesDep = depFilter === 'All' ? true : e.department === depFilter;
    return matchesSearch && matchesDep;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '0.25rem' }}>Əməkdaş İdarəetməsi</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Ümumi {filteredEmployees.length} əməkdaş sistemdədir</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ 
            padding: '0.65rem 1.25rem', backgroundColor: 'transparent', color: 'var(--text-primary)',
            border: '1px solid var(--border-color)', borderRadius: '10px', fontWeight: 600, cursor: 'pointer'
          }}>
            Export (Excel)
          </button>
          <button onClick={handleOpenAdd} style={{ 
            padding: '0.65rem 1.25rem', backgroundColor: 'var(--primary-color)', color: 'white', 
            borderRadius: '10px', fontWeight: 600, border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
          }}>
            + Yeni Əməkdaş
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', borderLeft: '4px solid var(--primary-color)' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Aktiv Müəllimlər</h3>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{employees.filter(e => e.department === 'Müəllim').length}</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', borderLeft: '4px solid #f59e0b' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>İnzibati Heyət</h3>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>{employees.filter(e => e.department === 'İnzibati Heyət').length}</div>
        </div>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', borderLeft: '4px solid #ef4444' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Aylıq Əməkhaqqı Fondu</h3>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>38,200 ₼</div>
        </div>
      </div>

      <div style={{ 
        backgroundColor: 'var(--surface-color)', borderRadius: '16px', 
        border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden'
      }}>
        {/* FILTER BAR */}
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, maxWidth: '400px', 
            padding: '0.65rem 1rem', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)' 
          }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex' }}><SearchIcon /></span>
            <input 
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Ad, Vəzifə və ya telefon nömrəsi..." 
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.95rem' }}
            />
          </div>
          <select 
            value={depFilter} onChange={(e) => setDepFilter(e.target.value)}
            style={{ 
              padding: '0.65rem 1rem', borderRadius: '10px', border: '1px solid var(--border-color)', 
              backgroundColor: 'var(--bg-color)', outline: 'none', fontWeight: 500, cursor: 'pointer'
            }}>
            <option value="All">Bütün Heyət</option>
            <option value="Müəllim">Müəllimlər</option>
            <option value="İnzibati Heyət">İnzibati Heyət</option>
          </select>
        </div>

        {/* MODERN TABLE */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-color)' }}>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Əməkdaş & Vəzifə</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Əlaqə</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Kateqoriya / Staj</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Maaş & Növü</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Məlumat tapılmadı</td></tr>
              ) : filteredEmployees.map((emp, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', transition: 'all 0.2s' }} className="table-row-modern">
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ 
                        width: '40px', height: '40px', borderRadius: '50%', 
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.2))',
                        color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 700, fontSize: '0.9rem'
                      }}>
                        {emp.name.charAt(0)}{emp.surname.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem' }}>{emp.name} {emp.surname}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{emp.role}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{emp.phone}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{emp.email}</div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{emp.category}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Staj: {emp.experience}</div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.25rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{emp.salary}</span>
                      <span style={{ padding: '0.25rem 0.5rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                        {emp.salaryType}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleOpenDetails(emp)} style={actionBtnStyle('rgba(79,70,229,0.1)', 'var(--primary-color)')} title="Ətraflı">
                        <EyeIcon />
                      </button>
                      <button onClick={() => handleOpenEdit(emp)} style={actionBtnStyle('var(--bg-color)', 'var(--text-secondary)')} title="Düzəliş Et">
                        <EditIcon />
                      </button>
                      <button onClick={() => handleOpenDelete(emp)} style={actionBtnStyle('rgba(239,68,68,0.1)', '#ef4444')} title="Sil">
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
        .table-row-modern:hover { background-color: var(--bg-color); }
      `}} />

      {/* MODALS */}
      {modalType && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
        }}>
          
          {/* ADD / EDIT MODAL */}
          {(modalType === 'add' || modalType === 'edit') && (
            <div style={{ backgroundColor: 'var(--surface-color)', width: '100%', maxWidth: '650px', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid var(--border-color)' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>
                {modalType === 'add' ? 'Yeni Əməkdaş Əlavə Et' : 'Əməkdaş Məlumatlarını Yenilə'}
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
                <input placeholder="Adı" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} style={inputStyle} />
                <input placeholder="Soyadı" value={formData.surname || ''} onChange={e => setFormData({...formData, surname: e.target.value})} style={inputStyle} />
                <input placeholder="Vəzifəsi (Məs: Riyaziyyat müəllimi)" value={formData.role || ''} onChange={e => setFormData({...formData, role: e.target.value})} style={inputStyle} />
                <select value={formData.department || 'Müəllim'} onChange={e => setFormData({...formData, department: e.target.value as any})} style={inputStyle}>
                  <option value="Müəllim">Müəllim</option>
                  <option value="İnzibati Heyət">İnzibati Heyət</option>
                </select>
                <input placeholder="Əlaqə nömrəsi" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} style={inputStyle} />
                <input placeholder="Email ünvanı" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} style={inputStyle} />
                <input placeholder="Kateqoriya (Məs: B kateqoriya)" value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} style={inputStyle} />
                <input placeholder="Staj (Məs: 5 il)" value={formData.experience || ''} onChange={e => setFormData({...formData, experience: e.target.value})} style={inputStyle} />
                <select value={formData.salaryType || 'Fix'} onChange={e => setFormData({...formData, salaryType: e.target.value})} style={inputStyle}>
                  <option value="Fix">Sabit (Fix)</option>
                  <option value="Saathesabı">Saathesabı</option>
                  <option value="Fix + Faiz">Fix + Faiz</option>
                </select>
                <input placeholder="Maaş (Məs: 800 ₼)" value={formData.salary || ''} onChange={e => setFormData({...formData, salary: e.target.value})} style={inputStyle} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                <button onClick={handleCloseModal} style={{ padding: '0.85rem 1.5rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}>İmtina Et</button>
                <button onClick={handleSave} style={{ padding: '0.85rem 2rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)' }}>Yadda Saxla</button>
              </div>
            </div>
          )}

          {/* DETAILS MODAL */}
          {modalType === 'details' && selectedEmp && (
            <div style={{ backgroundColor: 'var(--surface-color)', width: '100%', maxWidth: '500px', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid var(--border-color)' }}>
              
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ 
                  width: '80px', height: '80px', borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: '2rem', margin: '0 auto 1rem', boxShadow: '0 10px 25px rgba(245,158,11,0.4)'
                }}>
                  {selectedEmp.name.charAt(0)}{selectedEmp.surname.charAt(0)}
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{selectedEmp.name} {selectedEmp.surname}</h2>
                <div style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>ID: {selectedEmp.id} • {selectedEmp.role}</div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', backgroundColor: 'var(--bg-color)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <DetailRow label="Bölmə (Departament)" value={selectedEmp.department} />
                <DetailRow label="Kateqoriya" value={selectedEmp.category} />
                <DetailRow label="Staj" value={selectedEmp.experience} />
                <DetailRow label="Əlaqə nömrəsi" value={selectedEmp.phone} />
                <DetailRow label="Email ünvanı" value={selectedEmp.email} />
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderTop: '1px dashed var(--border-color)', marginTop: '0.5rem', paddingTop: '1rem' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Əməkhaqqı ({selectedEmp.salaryType})</span>
                  <span style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.1rem' }}>{selectedEmp.salary}</span>
                </div>
              </div>
              
              <button onClick={handleCloseModal} style={{ width: '100%', padding: '1rem', marginTop: '2rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}>Bağla</button>
            </div>
          )}

          {/* DELETE CONFIRM MODAL */}
          {modalType === 'delete' && selectedEmp && (
            <div style={{ backgroundColor: 'var(--surface-color)', width: '100%', maxWidth: '400px', padding: '2.5rem', borderRadius: '24px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid var(--border-color)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <TrashIcon />
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Əminsiniz?</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.5 }}>
                <b>{selectedEmp.name} {selectedEmp.surname}</b> sistemdən tamamilə silinəcək. Bu əməliyyat geri qaytarıla bilməz.
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
  width: '100%', padding: '0.85rem 1rem', borderRadius: '10px',
  border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)',
  color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s',
};

const actionBtnStyle = (bg: string, color: string) => ({
  width: '36px', height: '36px', borderRadius: '8px', backgroundColor: bg, color: color,
  border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', transition: 'transform 0.1s'
});

function DetailRow({ label, value }: { label: string, value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{label}</span>
      <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.95rem', textAlign: 'right' }}>{value}</span>
    </div>
  )
}

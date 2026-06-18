'use client'

import { useState } from 'react';
import ContractTemplate from './ContractTemplate';

type Contract = {
  id: string;
  date: string;
  studentName: string;
  parentName: string;
  templateType: string;
  amount: string;
  status: 'İmzalanıb' | 'Gözləyir' | 'Ləğv';
  
  companyName?: string;
  companyVoen?: string;
  companyHH?: string;
  companyMH?: string;
  
  approvedByRole?: string;
  orderDate?: string;
  orderNumber?: string;
  
  parentIDCard?: string;
  parentFIN?: string;
  parentPhone?: string;
  parentAddress?: string;
};

const INITIAL_CONTRACTS: Contract[] = [
  { 
    id: 'MQ-2026-001', date: '2026-06-12', studentName: 'Nihad Əliyev', parentName: 'Ceyhun Əliyev', 
    templateType: 'Təhsil Xidməti Müqaviləsi', amount: '1,500 ₼', status: 'İmzalanıb', 
    parentFIN: '6YTR89A', parentPhone: '+994 50 123 45 67',
    companyName: 'EduFinance MMC', orderNumber: '142-A', approvedByRole: 'EduFinance MMC-nin Direktorunun',
    parentIDCard: 'AZE 12345678'
  },
];

const EyeIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const EditIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const TrashIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>;
const SearchIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;
const DownloadIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>;
const SparklesIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '6px' }}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>(INITIAL_CONTRACTS);
  
  const [modalType, setModalType] = useState<'add' | 'edit' | 'details' | 'delete' | 'print' | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [formData, setFormData] = useState<Partial<Contract>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const generateId = () => {
    const nextNum = contracts.length > 0 ? Math.max(...contracts.map(c => parseInt(c.id.replace('MQ-2026-', '')))) + 1 : 1;
    return `MQ-2026-${nextNum.toString().padStart(3, '0')}`;
  };

  const handleOpenAdd = () => { 
    setFormData({ 
      templateType: 'Təhsil Xidməti Müqaviləsi', status: 'Gözləyir', 
      date: new Date().toISOString().split('T')[0],
      orderDate: new Date().toISOString().split('T')[0],
      companyName: 'EduFinance MMC', companyVoen: '1234567891',
      companyHH: 'AZ12NABZ01234567890123456789', companyMH: 'AZ34CTRE01234567890123456789',
      approvedByRole: 'Təhsil Müəssisəsinin Rəhbərliyinin',
      orderNumber: '001',
    }); 
    setModalType('add'); 
  };
  const handleOpenEdit = (c: Contract) => { setSelectedContract(c); setFormData({ ...c }); setModalType('edit'); };
  const handleOpenDetails = (c: Contract) => { setSelectedContract(c); setModalType('details'); };
  const handleOpenDelete = (c: Contract) => { setSelectedContract(c); setModalType('delete'); };

  const handleCloseModal = () => { setModalType(null); setSelectedContract(null); setFormData({}); };

  const simulateAIGeneration = () => {
    setIsGenerating(true);
    setTimeout(() => {
      handleSave();
      setIsGenerating(false);
    }, 1500);
  };

  const handleSave = () => {
    if (modalType === 'add') {
      const newContract: Contract = {
        ...formData as Contract,
        id: generateId(),
      };
      setContracts([newContract, ...contracts]);
    } else if (modalType === 'edit' && selectedContract) {
      setContracts(contracts.map(c => c.id === selectedContract.id ? { ...c, ...formData } as Contract : c));
    }
    handleCloseModal();
  };

  const handleDelete = () => {
    if (selectedContract) {
      setContracts(contracts.filter(c => c.id !== selectedContract.id));
      handleCloseModal();
    }
  };

  const handleDownloadPDF = (e: React.MouseEvent, c: Contract) => {
    e.stopPropagation();
    setSelectedContract(c);
    setModalType('print');
  };

  const filteredContracts = contracts.filter(c => {
    const matchesSearch = `${c.id} ${c.studentName} ${c.parentName}`.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' ? true : c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '0.25rem' }}>Müqavilələr və Aktlar</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Ümumi {filteredContracts.length} müqavilə tapıldı</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleOpenAdd} style={{ 
            padding: '0.65rem 1.25rem', backgroundColor: 'var(--primary-color)', color: 'white', 
            borderRadius: '10px', fontWeight: 600, border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
          }}>
            + Yeni Müqavilə Yarat
          </button>
        </div>
      </div>

      <div style={{ 
        backgroundColor: 'var(--surface-color)', borderRadius: '16px', 
        border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', overflow: 'hidden'
      }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, maxWidth: '400px', 
            padding: '0.65rem 1rem', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)' 
          }}>
            <span style={{ color: 'var(--text-secondary)', display: 'flex' }}><SearchIcon /></span>
            <input 
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Müqavilə NO, Şagird və ya Vəli adı..." 
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.95rem' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-color)' }}>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Müqavilə NO / Tarix</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tərəf (Şagird / Vəli)</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Şablon Növü</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sənəd</th>
                <th style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', textAlign: 'right' }}>Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody>
              {filteredContracts.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Məlumat tapılmadı</td></tr>
              ) : filteredContracts.map((contract, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)', transition: 'all 0.2s' }} className="table-row-modern">
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ 
                        width: '40px', height: '40px', borderRadius: '10px', 
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.2))',
                        color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: '0.9rem'
                      }}>MQ</div>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{contract.id}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{contract.date}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{contract.studentName}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Vəli: {contract.parentName}</div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{contract.templateType}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Məbləğ: <span style={{ fontWeight: 700 }}>{contract.amount}</span></div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <button onClick={(e) => handleDownloadPDF(e, contract)} style={{
                        background: '#10b981', border: 'none', color: 'white',
                        padding: '0.5rem 0.85rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', transition: 'all 0.2s', boxShadow: '0 4px 10px rgba(16,185,129,0.3)'
                      }} className="pdf-btn">
                        <DownloadIcon /> PDF İxrac
                      </button>
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button onClick={() => handleOpenDetails(contract)} style={actionBtnStyle('rgba(79,70,229,0.1)', 'var(--primary-color)')} title="Ətraflı"><EyeIcon /></button>
                      <button onClick={() => handleOpenEdit(contract)} style={actionBtnStyle('var(--bg-color)', 'var(--text-secondary)')} title="Düzəliş Et"><EditIcon /></button>
                      <button onClick={() => handleOpenDelete(contract)} style={actionBtnStyle('rgba(239,68,68,0.1)', '#ef4444')} title="Sil"><TrashIcon /></button>
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
        .pdf-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 14px rgba(16,185,129,0.4) !important; }
        .ai-btn:hover { background: linear-gradient(135deg, #8b5cf6, #6d28d9) !important; transform: translateY(-1px); }
        
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(139, 92, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(139, 92, 246, 0); }
        }
      `}} />

      {/* PRINT / PDF MODAL */}
      {modalType === 'print' && selectedContract && (
        <ContractTemplate data={selectedContract} onClose={handleCloseModal} />
      )}

      {/* ADD / EDIT MODAL (FULLY DYNAMIC FORM) */}
      {(modalType === 'add' || modalType === 'edit') && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
        }}>
          <div style={{ backgroundColor: 'var(--surface-color)', width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>
              {modalType === 'add' ? '✨ Yeni Müqavilə Generasiyası (Tam Dinamik)' : 'Müqaviləni Yenilə'}
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
              
              {/* TƏŞKİLAT MƏLUMATLARI */}
              <div style={{ gridColumn: '1 / -1' }}><h3 style={sectionHeaderStyle}>🏢 Təşkilatın Rekvizitləri</h3></div>
              <input placeholder="Təhsil Müəssisəsinin Adı" value={formData.companyName || ''} onChange={e => setFormData({...formData, companyName: e.target.value})} style={inputStyle} />
              <input placeholder="VÖEN" value={formData.companyVoen || ''} onChange={e => setFormData({...formData, companyVoen: e.target.value})} style={inputStyle} />
              <input placeholder="Hesab (H/H)" value={formData.companyHH || ''} onChange={e => setFormData({...formData, companyHH: e.target.value})} style={inputStyle} />
              <input placeholder="Müxbir Hesab (M/H)" value={formData.companyMH || ''} onChange={e => setFormData({...formData, companyMH: e.target.value})} style={inputStyle} />

              {/* RƏSMİ TƏSDİQ (SAĞ YUXARI BÖLMƏ) */}
              <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}><h3 style={sectionHeaderStyle}>✒️ Rəsmi Təsdiq Edən Şəxs (Sağ Yuxarı Künc)</h3></div>
              <input placeholder="Təsdiq edənin vəzifəsi (Məs: EduFinance MMC-nin Direktorunun)" value={formData.approvedByRole || ''} onChange={e => setFormData({...formData, approvedByRole: e.target.value})} style={{...inputStyle, gridColumn: '1 / -1'}} />
              <div>
                <label style={labelStyle}>Əmr Tarixi</label>
                <input type="date" value={formData.orderDate || ''} onChange={e => setFormData({...formData, orderDate: e.target.value})} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Əmr Nömrəsi (№)</label>
                <input placeholder="Məsələn: 01-A" value={formData.orderNumber || ''} onChange={e => setFormData({...formData, orderNumber: e.target.value})} style={inputStyle} />
              </div>

              {/* ŞAGİRD VƏ VALİDEYN MƏLUMATLARI */}
              <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}><h3 style={sectionHeaderStyle}>👨‍👩‍👧 Tərəflərin Məlumatları</h3></div>
              <input placeholder="Şagirdin Adı və Soyadı" value={formData.studentName || ''} onChange={e => setFormData({...formData, studentName: e.target.value})} style={inputStyle} />
              <input placeholder="Valideynin Adı, Soyadı və Atasının Adı" value={formData.parentName || ''} onChange={e => setFormData({...formData, parentName: e.target.value})} style={inputStyle} />
              <input placeholder="Valideynin Şəxsiyyət Vəsiqəsinin Seriyası" value={formData.parentIDCard || ''} onChange={e => setFormData({...formData, parentIDCard: e.target.value})} style={inputStyle} />
              <input placeholder="Valideynin FİN Kodu" value={formData.parentFIN || ''} onChange={e => setFormData({...formData, parentFIN: e.target.value})} style={inputStyle} />
              <input placeholder="Valideynin Ünvanı" value={formData.parentAddress || ''} onChange={e => setFormData({...formData, parentAddress: e.target.value})} style={inputStyle} />
              <input placeholder="Əlaqə nömrəsi" value={formData.parentPhone || ''} onChange={e => setFormData({...formData, parentPhone: e.target.value})} style={inputStyle} />
              
              {/* MÜQAVİLƏ ŞƏRTLƏRİ */}
              <div style={{ gridColumn: '1 / -1', marginTop: '0.5rem' }}><h3 style={sectionHeaderStyle}>📑 Müqavilə Şərtləri</h3></div>
              <select value={formData.templateType || 'Təhsil Xidməti Müqaviləsi'} onChange={e => setFormData({...formData, templateType: e.target.value})} style={{...inputStyle, gridColumn: '1 / -1'}}>
                <option value="Təhsil Xidməti Müqaviləsi">Təhsil Xidməti Müqaviləsi</option>
                <option value="Fərdi Dərs Müqaviləsi">Fərdi Dərs Müqaviləsi</option>
                <option value="Kollektiv Dərs Müqaviləsi">Kollektiv Dərs Müqaviləsi</option>
              </select>
              <div>
                <label style={labelStyle}>Təhsil Haqqı Məbləği</label>
                <input placeholder="Ümumi Məbləğ (Məs: 1500 ₼)" value={formData.amount || ''} onChange={e => setFormData({...formData, amount: e.target.value})} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Müqavilənin Bağlanma Tarixi (Bakı Şəhəri)</label>
                <input type="date" value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <button onClick={handleCloseModal} style={{ padding: '0.85rem 1.5rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}>İmtina</button>
              {modalType === 'add' ? (
                <button onClick={simulateAIGeneration} disabled={isGenerating} style={{ 
                  padding: '0.85rem 2rem', background: 'linear-gradient(135deg, #a855f7, #7e22ce)', 
                  color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 700,
                  boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)', display: 'flex', alignItems: 'center',
                  animation: 'pulse-glow 2s infinite'
                }} className="ai-btn">
                  {isGenerating ? 'Generasiya olunur...' : <><SparklesIcon /> Tam Dinamik Generasiya Et</>}
                </button>
              ) : (
                <button onClick={handleSave} style={{ padding: '0.85rem 2rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}>Yenilə</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* DETAILS & DELETE MODALS REMAIN THE SAME */}
      {modalType === 'details' && selectedContract && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
        }}>
          <div style={{ backgroundColor: 'var(--surface-color)', width: '100%', maxWidth: '500px', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid var(--border-color)' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Sənəd: {selectedContract.id}</h2>
              <div style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{selectedContract.templateType}</div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button onClick={handleCloseModal} style={{ flex: 1, padding: '1rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}>Bağla</button>
              <button onClick={(e) => { handleCloseModal(); handleDownloadPDF(e, selectedContract); }} style={{ flex: 1, padding: '1rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <DownloadIcon /> PDF İxrac
              </button>
            </div>
          </div>
        </div>
      )}
      
      {modalType === 'delete' && selectedContract && (
         <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
        }}>
          <div style={{ backgroundColor: 'var(--surface-color)', width: '100%', maxWidth: '400px', padding: '2.5rem', borderRadius: '24px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>Silinmə!</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
              <button onClick={handleCloseModal} style={{ flex: 1, padding: '0.85rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}>İmtina</button>
              <button onClick={handleDelete} style={{ flex: 1, padding: '0.85rem', background: '#ef4444', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}>Bəli, Sil</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' };
const sectionHeaderStyle = { fontSize: '1.1rem', fontWeight: 700, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', color: 'var(--primary-color)' };
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

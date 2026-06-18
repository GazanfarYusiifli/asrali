'use client';
import React, { useState, useEffect } from 'react';
import { 
  FolderKanban, Plus, TrendingDown, ShoppingBag, ShoppingCart, 
  Settings, Trash2, X, ChevronDown, ChevronUp, Edit3, PowerOff, CheckCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';

export default function LayiheIzlemePage() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  
  // Modals: 'newProject', 'editProject', 'masraf', 'alis', 'satis', null
  const [actionModal, setActionModal] = useState<string | null>(null);
  const [editingTransactionId, setEditingTransactionId] = useState<string | null>(null);

  // Form states for Masraf
  const [masrafForm, setMasrafForm] = useState({
    tarih: new Date().toISOString().split('T')[0],
    giderTuru: '',
    kasaBanka: 'Kassa',
    aciqlama: '',
    miktar: '',
    kdv: 0,
    kdvDahil: false
  });

  // Invoice lines state and form details
  const [invoiceDetails, setInvoiceDetails] = useState({
    cari: '',
    evrakTarihi: new Date().toISOString().split('T')[0],
    faturaNo: '',
    evrakAciklamasi: ''
  });
  const [invoiceLines, setInvoiceLines] = useState<any[]>([]);

  // Expanded rows for tables
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  
  // Customers list for select
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    const localProjects = JSON.parse(getAppStorage('erp_projects') || '[]');
    setProjects(localProjects);
    if (localProjects.length > 0 && !selectedProjectId) {
      setSelectedProjectId(localProjects[0].id);
    }
    
    // Load customers
    const localCustomers = JSON.parse(getAppStorage('erp_customers') || '[]');
    setCustomers(localCustomers);
  }, []);

  const selectedProject = projects.find(p => p.id === selectedProjectId);

  const calculateTotal = (arr: any[]) => {
    if (!arr) return 0;
    return arr.reduce((sum, item) => sum + Number(item.genelToplam || item.miktar || 0), 0);
  };

  const addInvoiceLine = () => {
    setInvoiceLines([...invoiceLines, { id: Date.now().toString(), urunAd: '', miktar: 1, kdv: 18, birimFiyat: 0, kdvDahil: false }]);
  };

  const updateInvoiceLine = (id: string, field: string, value: any) => {
    setInvoiceLines(lines => lines.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const removeInvoiceLine = (id: string) => {
    setInvoiceLines(lines => lines.filter(l => l.id !== id));
  };

  const calculateLineTotals = (line: any) => {
    const miktar = Number(line.miktar) || 0;
    const birimFiyat = Number(line.birimFiyat) || 0;
    const kdv = Number(line.kdv) || 0;

    if (line.kdvDahil) {
      const genelToplam = miktar * birimFiyat;
      const araToplam = genelToplam / (1 + (kdv / 100));
      return { araToplam, genelToplam };
    } else {
      const araToplam = miktar * birimFiyat;
      const genelToplam = araToplam * (1 + (kdv / 100));
      return { araToplam, genelToplam };
    }
  };

  const getInvoiceTotals = () => {
    let araToplam = 0;
    let genelToplam = 0;
    invoiceLines.forEach(line => {
      const totals = calculateLineTotals(line);
      araToplam += totals.araToplam;
      genelToplam += totals.genelToplam;
    });
    return { araToplam, genelToplam };
  };

  const toggleRow = (id: string) => {
    setExpandedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  };

  // -------------------------
  // FORM SUBMISSIONS & ACTIONS
  // -------------------------
  const handleModalSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    let updatedProjects = [...projects];

    if (actionModal === 'newProject') {
      const ad = fd.get('ad') as string;
      const aciqlama = fd.get('aciqlama') as string;
      const newProj = {
        id: Date.now().toString(),
        ad,
        aciqlama,
        status: 'Aktiv',
        masraflar: [], alislar: [], satislar: []
      };
      updatedProjects.push(newProj);
      setSelectedProjectId(newProj.id);

    } else if (actionModal === 'editProject') {
      const ad = fd.get('ad') as string;
      const aciqlama = fd.get('aciqlama') as string;
      updatedProjects = updatedProjects.map(p => p.id === selectedProjectId ? { ...p, ad, aciqlama } : p);

    } else if (selectedProject) {
      // Masraf, Alış, Satış
      if (actionModal === 'masraf') {
        const miktar = Number(masrafForm.miktar);
        const kdv = Number(masrafForm.kdv);
        const kdvDahil = masrafForm.kdvDahil;
        
        let araToplam = 0;
        let genelToplam = 0;
        if (kdvDahil) {
          genelToplam = miktar;
          araToplam = miktar / (1 + (kdv / 100));
        } else {
          araToplam = miktar;
          genelToplam = miktar * (1 + (kdv / 100));
        }

        const newItem = { 
          id: editingTransactionId || Date.now().toString(),
          type: 'masraf',
          tarih: masrafForm.tarih,
          giderTuru: masrafForm.giderTuru,
          kasaBanka: masrafForm.kasaBanka,
          aciqlama: masrafForm.aciqlama,
          miktar,
          kdv,
          kdvDahil,
          araToplam,
          genelToplam
        };
        
        updatedProjects = updatedProjects.map(p => {
          if (p.id === selectedProjectId) {
            let newMasraflar = p.masraflar || [];
            if (editingTransactionId) {
              newMasraflar = newMasraflar.map((m:any) => m.id === editingTransactionId ? newItem : m);
            } else {
              newMasraflar = [...newMasraflar, newItem];
            }
            return { ...p, masraflar: newMasraflar };
          }
          return p;
        });

      } else if (actionModal === 'alis' || actionModal === 'satis') {
        const { araToplam, genelToplam } = getInvoiceTotals();
        const newItem = {
          id: editingTransactionId || Date.now().toString(),
          type: actionModal,
          evrakTarihi: invoiceDetails.evrakTarihi,
          faturaNo: invoiceDetails.faturaNo,
          evrakAciklamasi: invoiceDetails.evrakAciklamasi,
          cari: invoiceDetails.cari,
          lines: invoiceLines,
          araToplam,
          genelToplam
        };
        
        updatedProjects = updatedProjects.map(p => {
          if (p.id === selectedProjectId) {
            if (actionModal === 'alis') {
              let newArr = p.alislar || [];
              newArr = editingTransactionId ? newArr.map((m:any) => m.id === editingTransactionId ? newItem : m) : [...newArr, newItem];
              return { ...p, alislar: newArr };
            }
            if (actionModal === 'satis') {
              let newArr = p.satislar || [];
              newArr = editingTransactionId ? newArr.map((m:any) => m.id === editingTransactionId ? newItem : m) : [...newArr, newItem];
              return { ...p, satislar: newArr };
            }
          }
          return p;
        });
      }
    }

    setProjects(updatedProjects);
    setAppStorage('erp_projects', JSON.stringify(updatedProjects));
    closeModal();
  };

  const handleProjectAction = (action: string) => {
    if (action === 'delete') {
      if (confirm("Bu layihəni silsəniz, bütün əməliyyatları geri qaytarılmaz şəkildə silinəcək. Əminsiniz?")) {
        const newProjects = projects.filter(p => p.id !== selectedProjectId);
        setProjects(newProjects);
        setAppStorage('erp_projects', JSON.stringify(newProjects));
        setSelectedProjectId(newProjects.length > 0 ? newProjects[0].id : '');
      }
    } else if (action === 'close') {
      const newProjects = projects.map(p => p.id === selectedProjectId ? { ...p, status: 'Bağlı' } : p);
      setProjects(newProjects);
      setAppStorage('erp_projects', JSON.stringify(newProjects));
    } else if (action === 'open') {
      const newProjects = projects.map(p => p.id === selectedProjectId ? { ...p, status: 'Aktiv' } : p);
      setProjects(newProjects);
      setAppStorage('erp_projects', JSON.stringify(newProjects));
    }
  };

  const deleteTransaction = (type: string, id: string) => {
    if (!confirm("Sənədi silmək istədiyinizə əminsiniz?")) return;
    const newProjects = projects.map(p => {
      if (p.id === selectedProjectId) {
        if (type === 'masraf') return { ...p, masraflar: (p.masraflar||[]).filter((m:any) => m.id !== id) };
        if (type === 'alis') return { ...p, alislar: (p.alislar||[]).filter((m:any) => m.id !== id) };
        if (type === 'satis') return { ...p, satislar: (p.satislar||[]).filter((m:any) => m.id !== id) };
      }
      return p;
    });
    setProjects(newProjects);
    setAppStorage('erp_projects', JSON.stringify(newProjects));
  };

  const editTransaction = (type: string, row: any) => {
    if (selectedProject?.status === 'Bağlı') {
      alert("Layihə bağlıdır! Redaktə etmək üçün layihəni aktivləşdirin.");
      return;
    }
    setEditingTransactionId(row.id);
    setActionModal(type);
    
    if (type === 'masraf') {
      setMasrafForm({
        tarih: row.tarih,
        giderTuru: row.giderTuru,
        kasaBanka: row.kasaBanka,
        aciqlama: row.aciqlama,
        miktar: row.miktar || (row.kdvDahil ? row.genelToplam : row.araToplam),
        kdv: row.kdv,
        kdvDahil: row.kdvDahil
      });
    } else {
      setInvoiceDetails({
        cari: row.cari,
        evrakTarihi: row.evrakTarihi,
        faturaNo: row.faturaNo,
        evrakAciklamasi: row.evrakAciklamasi
      });
      setInvoiceLines(row.lines || []);
    }
  };

  const openModal = (type: string) => {
    if (selectedProject?.status === 'Bağlı' && ['masraf', 'alis', 'satis'].includes(type)) {
      alert("Bu layihə bağlıdır! Yeni əməliyyat əlavə etmək üçün əvvəlcə layihəni aktivləşdirin.");
      return;
    }
    setEditingTransactionId(null);
    setActionModal(type);
    
    if (type === 'masraf') {
      setMasrafForm({
        tarih: new Date().toISOString().split('T')[0],
        giderTuru: '',
        kasaBanka: 'Kassa',
        aciqlama: '',
        miktar: '',
        kdv: 0,
        kdvDahil: false
      });
    } else if (type === 'alis' || type === 'satis') {
      setInvoiceDetails({
        cari: '',
        evrakTarihi: new Date().toISOString().split('T')[0],
        faturaNo: '',
        evrakAciklamasi: ''
      });
      setInvoiceLines([{ id: Date.now().toString(), urunAd: '', miktar: 1, kdv: 18, birimFiyat: 0, kdvDahil: false }]);
    }
  };

  const closeModal = () => {
    setActionModal(null);
    setEditingTransactionId(null);
  };

  // -------------------------
  // RENDER HELPERS
  // -------------------------
  const isProjectClosed = selectedProject?.status === 'Bağlı';

  return (
    <div style={{ padding: '2rem', height: '100%', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.8rem', color: '#1e293b', margin: 0, fontWeight: 800, letterSpacing: '-0.5px' }}>
          <FolderKanban size={32} color="#4f46e5" /> Layihə İzləmə
        </h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', marginBottom: '4px' }}>Layihə Seçin</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <select 
                value={selectedProjectId} 
                onChange={(e) => setSelectedProjectId(e.target.value)}
                style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: 'white', minWidth: '220px', fontWeight: 600, color: '#334155', outline: 'none' }}
              >
                <option value="" disabled>Seçin...</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.ad} {p.status === 'Bağlı' ? '(Bağlı)' : ''}</option>
                ))}
              </select>
              <button onClick={() => openModal('newProject')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.65rem', background: '#e0e7ff', border: 'none', borderRadius: '8px', color: '#4f46e5', cursor: 'pointer', transition: 'all 0.2s', width: '40px', height: '40px' }}>
                <Plus size={20}/>
              </button>
            </div>
          </div>
        </div>
      </div>

      {!selectedProject ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
          <div style={{ textAlign: 'center', color: '#64748b' }}>
            <FolderKanban size={64} style={{ opacity: 0.2, marginBottom: '1rem' }} />
            <h2 style={{ margin: 0, color: '#334155' }}>Layihə Seçilməyib</h2>
            <p style={{ marginTop: '0.5rem' }}>Məlumatları görmək üçün yuxarıdan layihə seçin və ya yenisini yaradın.</p>
          </div>
        </div>
      ) : (
        <>
          {/* Project Details & Management */}
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.5rem', fontWeight: 800 }}>{selectedProject.ad}</h2>
                <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, backgroundColor: isProjectClosed ? '#fee2e2' : '#dcfce7', color: isProjectClosed ? '#ef4444' : '#10b981' }}>
                  {isProjectClosed ? 'BAĞLI' : 'AKTİV'}
                </span>
              </div>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>{selectedProject.aciqlama || 'Bu layihə üçün əlavə açıqlama qeyd edilməyib.'}</p>
            </div>
            
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => openModal('editProject')} style={{...projectActionBtn, color: '#3b82f6', backgroundColor: '#eff6ff'}}><Edit3 size={16}/> Redaktə Et</button>
              {isProjectClosed ? (
                <button onClick={() => handleProjectAction('open')} style={{...projectActionBtn, color: '#10b981', backgroundColor: '#dcfce7'}}><CheckCircle size={16}/> Layihəni Aktivləşdir</button>
              ) : (
                <button onClick={() => handleProjectAction('close')} style={{...projectActionBtn, color: '#f59e0b', backgroundColor: '#fef3c7'}}><PowerOff size={16}/> Layihəni Bağla</button>
              )}
              <button onClick={() => handleProjectAction('delete')} style={{...projectActionBtn, color: '#ef4444', backgroundColor: '#fee2e2'}}><Trash2 size={16}/> Sil</button>
            </div>
          </div>

          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            <SummaryCard title="Cəmi Xərc (Masraf)" amount={calculateTotal(selectedProject.masraflar)} icon={<TrendingDown size={24} color="#ef4444"/>} color="#fee2e2" />
            <SummaryCard title="Cəmi Alış" amount={calculateTotal(selectedProject.alislar)} icon={<ShoppingBag size={24} color="#f59e0b"/>} color="#fef3c7" />
            <SummaryCard title="Cəmi Satış" amount={calculateTotal(selectedProject.satislar)} icon={<ShoppingCart size={24} color="#10b981"/>} color="#dcfce7" />
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', backgroundColor: 'white', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
            <ActionButton title="Xərc (Masraf) Əlavə Et" onClick={() => openModal('masraf')} icon={<Plus size={16}/>} disabled={isProjectClosed} />
            <ActionButton title="Alış Fakturası Əlavə Et" onClick={() => openModal('alis')} icon={<Plus size={16}/>} disabled={isProjectClosed} />
            <ActionButton title="Satış Fakturası Əlavə Et" onClick={() => openModal('satis')} icon={<Plus size={16}/>} disabled={isProjectClosed} />
          </div>

          {/* Tables */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <MasrafTable title="Xərclər (Masraflar)" data={selectedProject.masraflar || []} onEdit={(r)=>editTransaction('masraf',r)} onDelete={(id)=>deleteTransaction('masraf',id)} />
            <InvoiceTable title="Alış Sənədləri" data={selectedProject.alislar || []} type="alis" expandedRows={expandedRows} toggleRow={toggleRow} onEdit={(r)=>editTransaction('alis',r)} onDelete={(id)=>deleteTransaction('alis',id)} />
            <InvoiceTable title="Satış Sənədləri" data={selectedProject.satislar || []} type="satis" expandedRows={expandedRows} toggleRow={toggleRow} onEdit={(r)=>editTransaction('satis',r)} onDelete={(id)=>deleteTransaction('satis',id)} />
          </div>
        </>
      )}

      {/* MODALS */}
      {actionModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(4px)', overflowY: 'auto', padding: '2rem 1rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', width: '100%', maxWidth: (actionModal === 'alis' || actionModal === 'satis') ? '900px' : '550px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', position: 'relative' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, backgroundColor: 'white', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', zIndex: 10 }}>
              <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.4rem', fontWeight: 800 }}>
                {actionModal === 'newProject' && 'Yeni Layihə'}
                {actionModal === 'editProject' && 'Layihəni Redaktə Et'}
                {actionModal === 'masraf' && (editingTransactionId ? 'Xərci (Masrafı) Redaktə Et' : 'Xərc (Masraf) Əməliyyatı')}
                {actionModal === 'alis' && (editingTransactionId ? 'Alış Fakturasını Redaktə Et' : 'Alış Fakturası')}
                {actionModal === 'satis' && (editingTransactionId ? 'Satış Fakturasını Redaktə Et' : 'Satış Fakturası')}
              </h2>
              <button type="button" onClick={closeModal} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={24}/></button>
            </div>

            <form onSubmit={handleModalSubmit} style={{ padding: '2rem' }}>
              {/* Project Modals */}
              {(actionModal === 'newProject' || actionModal === 'editProject') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={labelStyle}>Layihənin Adı</label>
                    <input name="ad" type="text" style={inputStyle} required defaultValue={actionModal === 'editProject' ? selectedProject?.ad : ''} placeholder="Məs: STX Projesi" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={labelStyle}>Layihə Açıqlaması</label>
                    <textarea name="aciqlama" style={{...inputStyle, minHeight: '100px'}} defaultValue={actionModal === 'editProject' ? selectedProject?.aciqlama : ''} placeholder="Layihə haqqında qısa məlumat..." />
                  </div>
                </div>
              )}

              {/* Masraf Modal */}
              {actionModal === 'masraf' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={labelStyle}>Tarix</label>
                      <input type="date" value={masrafForm.tarih} onChange={(e)=>setMasrafForm({...masrafForm, tarih: e.target.value})} style={inputStyle} required />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={labelStyle}>Xərc Növü (Gider Türü)</label>
                      <input type="text" value={masrafForm.giderTuru} onChange={(e)=>setMasrafForm({...masrafForm, giderTuru: e.target.value})} style={inputStyle} required placeholder="Məs: Nəqliyyat, Yemək" />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={labelStyle}>İlgili Layihə</label>
                      <input type="text" style={{...inputStyle, backgroundColor: '#f1f5f9', color: '#64748b'}} disabled value={selectedProject?.ad} />
                    </div>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={labelStyle}>Kassa / Bank</label>
                      <select value={masrafForm.kasaBanka} onChange={(e)=>setMasrafForm({...masrafForm, kasaBanka: e.target.value})} style={inputStyle} required>
                        <option value="Kassa">Əsas Kassa (Nəğd)</option>
                        <option value="Bank">Bank Hesabı (Köçürmə)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={labelStyle}>Açıqlama</label>
                    <input type="text" value={masrafForm.aciqlama} onChange={(e)=>setMasrafForm({...masrafForm, aciqlama: e.target.value})} style={inputStyle} placeholder="Xərc barədə əlavə qeydlər" />
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={labelStyle}>Məbləğ (AZN)</label>
                      <input type="number" step="any" value={masrafForm.miktar} onChange={(e)=>setMasrafForm({...masrafForm, miktar: e.target.value})} style={inputStyle} required placeholder="0.00" />
                    </div>
                    <div style={{ width: '100px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={labelStyle}>ƏDV %</label>
                      <input type="number" value={masrafForm.kdv} onChange={(e)=>setMasrafForm({...masrafForm, kdv: Number(e.target.value)})} style={inputStyle} required min="0" max="100" />
                    </div>
                    <div style={{ paddingBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input type="checkbox" id="kdvDahil" checked={masrafForm.kdvDahil} onChange={(e)=>setMasrafForm({...masrafForm, kdvDahil: e.target.checked})} style={{ width: '18px', height: '18px' }} />
                      <label htmlFor="kdvDahil" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>ƏDV Daxil</label>
                    </div>
                  </div>
                </div>
              )}

              {/* Alış & Satış Modals */}
              {(actionModal === 'alis' || actionModal === 'satis') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {/* Top Details */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={labelStyle}>Cari Hesab</label>
                      <select value={invoiceDetails.cari} onChange={(e)=>setInvoiceDetails({...invoiceDetails, cari: e.target.value})} style={inputStyle} required>
                        <option value="" disabled>Seçin...</option>
                        {customers.map(c => (
                          <option key={c.id} value={c.hesabAdi}>{c.hesabAdi}</option>
                        ))}
                        {invoiceDetails.cari && !customers.some(c => c.hesabAdi === invoiceDetails.cari) && (
                          <option value={invoiceDetails.cari}>{invoiceDetails.cari} (Sistemdə Yoxdur)</option>
                        )}
                      </select>
                      {customers.length === 0 && (
                        <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 600 }}>Cari hesab tapılmadı. Zəhmət olmasa "Müştəri və Təchizatçı" bölməsindən əlavə edin.</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={labelStyle}>Sənəd Tarixi</label>
                      <input type="date" value={invoiceDetails.evrakTarihi} onChange={(e)=>setInvoiceDetails({...invoiceDetails, evrakTarihi: e.target.value})} style={inputStyle} required />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={labelStyle}>Faktura Nömrəsi</label>
                      <input type="text" value={invoiceDetails.faturaNo} onChange={(e)=>setInvoiceDetails({...invoiceDetails, faturaNo: e.target.value})} style={inputStyle} required placeholder="Məs: INV-001" />
                    </div>
                    <div style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={labelStyle}>Sənəd Açıqlaması</label>
                      <input type="text" value={invoiceDetails.evrakAciklamasi} onChange={(e)=>setInvoiceDetails({...invoiceDetails, evrakAciklamasi: e.target.value})} style={inputStyle} placeholder="Faktura haqqında qısa qeyd" />
                    </div>
                  </div>

                  {/* Invoice Lines */}
                  <div>
                    <h3 style={{ fontSize: '1rem', color: '#1e293b', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '1rem' }}>Məhsullar / Xidmətlər</h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {invoiceLines.map((line) => {
                        const rowTotal = calculateLineTotals(line);
                        return (
                          <div key={line.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', backgroundColor: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                            <input 
                              type="text" value={line.urunAd} onChange={(e) => updateInvoiceLine(line.id, 'urunAd', e.target.value)}
                              placeholder="Ürün / Hizmet Adı" required style={{...inputStyle, flex: 2, padding: '0.6rem'}} 
                            />
                            <div style={{ position: 'relative', flex: 0.8 }}>
                               <input 
                                type="number" step="any" value={line.miktar} onChange={(e) => updateInvoiceLine(line.id, 'miktar', e.target.value)}
                                placeholder="Miqdar" required style={{...inputStyle, width: '100%', padding: '0.6rem'}} 
                              />
                            </div>
                            <div style={{ position: 'relative', flex: 1 }}>
                              <input 
                                type="number" step="any" value={line.birimFiyat} onChange={(e) => updateInvoiceLine(line.id, 'birimFiyat', e.target.value)}
                                placeholder="Vahid Qiymət" required style={{...inputStyle, width: '100%', padding: '0.6rem'}} 
                              />
                            </div>
                            <div style={{ position: 'relative', width: '70px' }}>
                              <input 
                                type="number" value={line.kdv} onChange={(e) => updateInvoiceLine(line.id, 'kdv', e.target.value)}
                                placeholder="ƏDV" required style={{...inputStyle, width: '100%', padding: '0.6rem'}} 
                              />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', width: '80px' }}>
                              <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#64748b', textAlign: 'center', lineHeight: 1 }}>ƏDV<br/>Daxil</span>
                              <input 
                                type="checkbox" checked={line.kdvDahil} onChange={(e) => updateInvoiceLine(line.id, 'kdvDahil', e.target.checked)}
                                style={{ width: '16px', height: '16px', cursor: 'pointer' }} 
                              />
                            </div>
                            <div style={{ width: '100px', textAlign: 'right', fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                              {rowTotal.genelToplam.toFixed(2)} ₼
                            </div>
                            <button type="button" onClick={() => removeInvoiceLine(line.id)} disabled={invoiceLines.length === 1} style={{ background: 'none', border: 'none', color: invoiceLines.length === 1 ? '#cbd5e1' : '#ef4444', cursor: invoiceLines.length === 1 ? 'not-allowed' : 'pointer' }}>
                              <Trash2 size={18}/>
                            </button>
                          </div>
                        )
                      })}
                    </div>
                    
                    <button type="button" onClick={addInvoiceLine} style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem', backgroundColor: 'white', border: '1px dashed #94a3b8', borderRadius: '8px', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>
                      <Plus size={16}/> Yeni Sətir Əlavə Et
                    </button>
                  </div>

                  {/* Totals */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <div style={{ width: '300px', backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: '#64748b', fontSize: '0.95rem', fontWeight: 600 }}>
                        <span>ARA TOPLAM:</span>
                        <span>{getInvoiceTotals().araToplam.toLocaleString('az-AZ', {minimumFractionDigits:2, maximumFractionDigits:2})} ₼</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', color: '#64748b', fontSize: '0.95rem', fontWeight: 600 }}>
                        <span>ƏDV CƏMİ:</span>
                        <span>{(getInvoiceTotals().genelToplam - getInvoiceTotals().araToplam).toLocaleString('az-AZ', {minimumFractionDigits:2, maximumFractionDigits:2})} ₼</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid #e2e8f0', color: '#0f172a', fontSize: '1.2rem', fontWeight: 800 }}>
                        <span>GENEL TOPLAM:</span>
                        <span>{getInvoiceTotals().genelToplam.toLocaleString('az-AZ', {minimumFractionDigits:2, maximumFractionDigits:2})} ₼</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
                <button type="button" onClick={closeModal} style={{ flex: 1, padding: '1rem', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '12px', color: '#475569', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>İmtina</button>
                <button type="submit" style={{ flex: 2, padding: '1rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(79, 70, 229, 0.39)' }}>{editingTransactionId ? 'Dəyişiklikləri Yadda Saxla' : 'Yadda Saxla'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// -------------------------
// COMPONENTS
// -------------------------

const SummaryCard = ({ title, amount, icon, color }: { title: string, amount: number, icon: any, color: string }) => (
  <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
    <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {icon}
    </div>
    <div>
      <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>{title}</div>
      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px' }}>{amount.toLocaleString('az-AZ', {minimumFractionDigits: 2, maximumFractionDigits: 2})} <span style={{fontSize:'1rem', color:'#94a3b8'}}>₼</span></div>
    </div>
  </div>
);

const ActionButton = ({ title, onClick, icon, disabled }: { title: string, onClick: () => void, icon: any, disabled?: boolean }) => (
  <button 
    onClick={onClick} 
    disabled={disabled}
    style={{ 
      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', 
      padding: '0.8rem', backgroundColor: disabled ? '#f1f5f9' : '#f8fafc', 
      border: '1px solid #e2e8f0', borderRadius: '8px', fontWeight: 700, 
      color: disabled ? '#94a3b8' : '#334155', cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.2s',
      opacity: disabled ? 0.7 : 1
    }} 
  >
    {icon} {title}
  </button>
);

const MasrafTable = ({ title, data, onEdit, onDelete }: { title: string, data: any[], onEdit: (r:any)=>void, onDelete: (id:string)=>void }) => (
  <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
    <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#f8fafc' }}>
      <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#ef4444' }}></div>
      <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b', fontWeight: 800 }}>{title}</h3>
    </div>
    <div style={{ overflowX: 'auto', padding: '1rem' }}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem', minWidth: '800px' }}>
        <thead>
          <tr>
            <th style={thStyle}>Tarix</th>
            <th style={thStyle}>Kassa/Bank</th>
            <th style={thStyle}>Xərc Növü</th>
            <th style={thStyle}>Açıqlama</th>
            <th style={{...thStyle, textAlign: 'right'}}>ƏDV (%)</th>
            <th style={{...thStyle, textAlign: 'right'}}>Ümumi Toplam</th>
            <th style={{...thStyle, textAlign: 'right', width: '80px'}}>Əməliyyat</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', fontWeight: 600, fontStyle: 'italic' }}>Qeyd yoxdur.</td></tr>
          ) : data.map((row) => (
            <tr key={row.id} style={{ backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <td style={{...tdStyle, borderTopLeftRadius: '12px', borderBottomLeftRadius: '12px', borderLeft: '1px solid #e2e8f0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0'}}>{new Date(row.tarih).toLocaleDateString('az-AZ')}</td>
              <td style={{...tdStyle, borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', fontWeight: 700}}>{row.kasaBanka}</td>
              <td style={{...tdStyle, borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0'}}><span style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>{row.giderTuru}</span></td>
              <td style={{...tdStyle, borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', fontSize: '0.85rem'}}>{row.aciqlama || '-'}</td>
              <td style={{...tdStyle, borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', textAlign: 'right'}}>{row.kdv}%</td>
              <td style={{...tdStyle, borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', textAlign: 'right', fontWeight: 800, color: '#ef4444', fontSize: '1rem'}}>
                {Number(row.genelToplam).toLocaleString('az-AZ', {minimumFractionDigits: 2})} ₼
              </td>
              <td style={{...tdStyle, borderTopRightRadius: '12px', borderBottomRightRadius: '12px', borderRight: '1px solid #e2e8f0', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', textAlign: 'right'}}>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button onClick={() => onEdit(row)} style={iconBtnStyle} title="Redaktə et"><Edit3 size={16} color="#3b82f6"/></button>
                  <button onClick={() => onDelete(row.id)} style={iconBtnStyle} title="Sil"><Trash2 size={16} color="#ef4444"/></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const InvoiceTable = ({ title, data, type, expandedRows, toggleRow, onEdit, onDelete }: { title: string, data: any[], type: string, expandedRows: string[], toggleRow: (id:string) => void, onEdit: (r:any)=>void, onDelete: (id:string)=>void }) => {
  let badgeColor = type === 'alis' ? '#f59e0b' : '#10b981';
  let badgeBg = type === 'alis' ? '#fef3c7' : '#dcfce7';

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
      <div style={{ padding: '1.2rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#f8fafc' }}>
        <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: badgeColor }}></div>
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b', fontWeight: 800 }}>{title}</h3>
      </div>
      <div style={{ overflowX: 'auto', padding: '1rem' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem', minWidth: '900px' }}>
          <thead>
            <tr>
              <th style={{...thStyle, width: '40px'}}></th>
              <th style={thStyle}>Tarix</th>
              <th style={thStyle}>Faktura No</th>
              <th style={thStyle}>Cari Hesab</th>
              <th style={thStyle}>Açıqlama</th>
              <th style={{...thStyle, textAlign: 'right'}}>Ara Toplam</th>
              <th style={{...thStyle, textAlign: 'right'}}>Ümumi Toplam</th>
              <th style={{...thStyle, textAlign: 'right', width: '80px'}}>Əməliyyat</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8', fontWeight: 600, fontStyle: 'italic' }}>Qeyd yoxdur.</td></tr>
            ) : data.map((row) => {
              const isExpanded = expandedRows.includes(row.id);
              return (
                <React.Fragment key={row.id}>
                  <tr style={{ backgroundColor: isExpanded ? '#f8fafc' : 'white', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                    <td style={{...tdStyle, borderTopLeftRadius: '12px', borderBottomLeftRadius: isExpanded ? '0' : '12px', borderLeft: '1px solid #e2e8f0', borderTop: '1px solid #e2e8f0', borderBottom: isExpanded ? 'none' : '1px solid #e2e8f0'}}>
                      <button onClick={() => toggleRow(row.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', backgroundColor: isExpanded ? '#e2e8f0' : '#f1f5f9', color: '#475569' }}>
                        {isExpanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                      </button>
                    </td>
                    <td style={{...tdStyle, borderTop: '1px solid #e2e8f0', borderBottom: isExpanded ? 'none' : '1px solid #e2e8f0'}}>{new Date(row.evrakTarihi).toLocaleDateString('az-AZ')}</td>
                    <td style={{...tdStyle, borderTop: '1px solid #e2e8f0', borderBottom: isExpanded ? 'none' : '1px solid #e2e8f0', fontWeight: 800, color: badgeColor}}>{row.faturaNo}</td>
                    <td style={{...tdStyle, borderTop: '1px solid #e2e8f0', borderBottom: isExpanded ? 'none' : '1px solid #e2e8f0', fontWeight: 700}}>{row.cari}</td>
                    <td style={{...tdStyle, borderTop: '1px solid #e2e8f0', borderBottom: isExpanded ? 'none' : '1px solid #e2e8f0', fontSize: '0.85rem'}}>{row.evrakAciklamasi || '-'}</td>
                    <td style={{...tdStyle, borderTop: '1px solid #e2e8f0', borderBottom: isExpanded ? 'none' : '1px solid #e2e8f0', textAlign: 'right', color: '#64748b'}}>{Number(row.araToplam).toLocaleString('az-AZ', {minimumFractionDigits: 2})} ₼</td>
                    <td style={{...tdStyle, borderTop: '1px solid #e2e8f0', borderBottom: isExpanded ? 'none' : '1px solid #e2e8f0', textAlign: 'right', fontWeight: 800, color: '#1e293b', fontSize: '1rem'}}>
                      {Number(row.genelToplam).toLocaleString('az-AZ', {minimumFractionDigits: 2})} ₼
                    </td>
                    <td style={{...tdStyle, borderTopRightRadius: '12px', borderBottomRightRadius: isExpanded ? '0' : '12px', borderRight: '1px solid #e2e8f0', borderTop: '1px solid #e2e8f0', borderBottom: isExpanded ? 'none' : '1px solid #e2e8f0', textAlign: 'right'}}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => onEdit(row)} style={iconBtnStyle} title="Redaktə et"><Edit3 size={16} color="#3b82f6"/></button>
                        <button onClick={() => onDelete(row.id)} style={iconBtnStyle} title="Sil"><Trash2 size={16} color="#ef4444"/></button>
                      </div>
                    </td>
                  </tr>
                  
                  {isExpanded && (
                    <tr>
                      <td colSpan={8} style={{ padding: '0', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                        <div style={{ padding: '1rem 1rem 1.5rem 4rem' }}>
                          <div style={{ backgroundColor: 'white', borderRadius: '8px', border: '1px dashed #cbd5e1', overflow: 'hidden' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                              <thead style={{ backgroundColor: '#f1f5f9' }}>
                                <tr>
                                  <th style={{padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', color: '#64748b'}}>Məhsul / Xidmət Adı</th>
                                  <th style={{padding: '0.75rem', textAlign: 'right', fontSize: '0.75rem', color: '#64748b'}}>Miqdar</th>
                                  <th style={{padding: '0.75rem', textAlign: 'right', fontSize: '0.75rem', color: '#64748b'}}>Vahid Qiymət</th>
                                  <th style={{padding: '0.75rem', textAlign: 'right', fontSize: '0.75rem', color: '#64748b'}}>ƏDV (%)</th>
                                  <th style={{padding: '0.75rem', textAlign: 'right', fontSize: '0.75rem', color: '#64748b'}}>Cəmi (ƏDV Daxil)</th>
                                </tr>
                              </thead>
                              <tbody>
                                {row.lines?.map((line: any) => {
                                  let gToplam = 0;
                                  if (line.kdvDahil) gToplam = Number(line.miktar) * Number(line.birimFiyat);
                                  else gToplam = (Number(line.miktar) * Number(line.birimFiyat)) * (1 + Number(line.kdv)/100);

                                  return (
                                    <tr key={line.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                                      <td style={{padding: '0.75rem', fontSize: '0.85rem', fontWeight: 600, color: '#334155'}}>{line.urunAd}</td>
                                      <td style={{padding: '0.75rem', fontSize: '0.85rem', textAlign: 'right', color: '#64748b'}}>{line.miktar}</td>
                                      <td style={{padding: '0.75rem', fontSize: '0.85rem', textAlign: 'right', color: '#64748b'}}>{Number(line.birimFiyat).toLocaleString('az-AZ',{minimumFractionDigits:2})} ₼</td>
                                      <td style={{padding: '0.75rem', fontSize: '0.85rem', textAlign: 'right', color: '#64748b'}}>{line.kdv}% {line.kdvDahil && <span style={{fontSize:'0.65rem', color:'#10b981', fontWeight:700}}>(Daxil)</span>}</td>
                                      <td style={{padding: '0.75rem', fontSize: '0.9rem', textAlign: 'right', fontWeight: 700, color: '#1e293b'}}>{gToplam.toLocaleString('az-AZ',{minimumFractionDigits:2})} ₼</td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// -------------------------
// STYLES
// -------------------------
const thStyle: React.CSSProperties = { padding: '0 1rem 0.5rem 1rem', textAlign: 'left', color: '#64748b', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' };
const tdStyle: React.CSSProperties = { padding: '1rem', color: '#334155', fontSize: '0.9rem' };
const labelStyle: React.CSSProperties = { fontSize: '0.85rem', fontWeight: 700, color: '#475569' };
const inputStyle: React.CSSProperties = { padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', width: '100%', fontSize: '0.95rem', color: '#1e293b', transition: 'border-color 0.2s' };
const projectActionBtn: React.CSSProperties = { border: 'none', padding: '0.5rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.2s' };
const iconBtnStyle: React.CSSProperties = { background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.2s' };

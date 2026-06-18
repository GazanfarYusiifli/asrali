'use client'

import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';

function InvoiceModal({ isOpen, onClose, editingInvoice, onSave }: any) {
  const [debitor, setDebitor] = useState('');
  const [voen, setVoen] = useState('');

  const [eqfAsas, setEqfAsas] = useState<number | ''>('');
  const [eqfDerece, setEqfDerece] = useState('18%');
  const [eqfTarix, setEqfTarix] = useState('');
  const [eqfSeriya, setEqfSeriya] = useState('');
  
  const [odenisAsas, setOdenisAsas] = useState<number | ''>('');
  const [odenisDerece, setOdenisDerece] = useState('18%');
  const [odenisTarixAsas, setOdenisTarixAsas] = useState('');
  const [odenisTarixEdv, setOdenisTarixEdv] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'nagd'>('bank');
  const [bankName, setBankName] = useState('Kapital Bank');

  const parseRate = (val: string) => {
    if (val === '18%') return 0.18;
    if (val === '18/118') return 18/118;
    if (val === '10%') return 0.10;
    if (val === '10/110') return 10/110;
    if (val === '20%') return 0.20;
    if (val === '20/120') return 20/120;
    return 0;
  };

  useEffect(() => {
    if (editingInvoice) {
      setDebitor(editingInvoice.debitor);
      setVoen(editingInvoice.voen);
      setEqfAsas(editingInvoice.eqf?.asas || '');
      setEqfTarix(editingInvoice.eqf?.tarix || '');
      setEqfSeriya(editingInvoice.eqf?.seriya || '');
      setOdenisAsas(editingInvoice.odenis?.asas || '');
      setOdenisTarixAsas(editingInvoice.odenis?.tarixAsas || '');
      setOdenisTarixEdv(editingInvoice.odenis?.tarixEdv || '');
      setPaymentMethod(editingInvoice.nagd > 0 ? 'nagd' : 'bank');
      setBankName(editingInvoice.bankName || 'Kapital Bank');
    } else {
      setDebitor('');
      setVoen('');
      setEqfAsas('');
      setEqfDerece('18%');
      setEqfTarix('');
      setEqfSeriya('');
      setOdenisAsas('');
      setOdenisDerece('18%');
      setOdenisTarixAsas('');
      setOdenisTarixEdv('');
      setPaymentMethod('bank');
      setBankName('Kapital Bank');
    }
  }, [editingInvoice, isOpen]);

  if (!isOpen) return null;

  const eqfRate = parseRate(eqfDerece);
  const eqfEdv = (Number(eqfAsas) * eqfRate).toFixed(2);

  const odenisRate = parseRate(odenisDerece);
  const odenisEdv = (Number(odenisAsas) * odenisRate).toFixed(2);

  const handleSaveData = () => {
    const eAsas = Number(eqfAsas) || 0;
    const eEdv = Number(eqfEdv) || 0;
    const eCemi = eAsas + eEdv;

    const oAsas = Number(odenisAsas) || 0;
    const oEdv = Number(odenisEdv) || 0;

    const qAsas = eAsas - oAsas;
    const qEdv = eEdv - oEdv;
    const qCemi = qAsas + qEdv;

    const newData = {
      id: editingInvoice ? editingInvoice.id : 'INV-' + Math.floor(Math.random() * 100000),
      debitor, voen,
      eqf: { tarix: eqfTarix, seriya: eqfSeriya, asas: eAsas, edv: eEdv, cemi: eCemi },
      odenis: { tarixAsas: odenisTarixAsas, asas: oAsas, tarixEdv: odenisTarixEdv, edv: oEdv },
      qaliq: { asas: qAsas, edv: qEdv, cemi: qCemi },
      bank: paymentMethod === 'bank' ? oAsas : 0,
      bankName: paymentMethod === 'bank' ? bankName : '',
      dep: oEdv,
      nagd: paymentMethod === 'nagd' ? oAsas : 0,
      atb: 0
    };

    onSave(newData);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'fadeIn 0.2s ease-out', padding: '1rem' }}>
      <div style={{ backgroundColor: 'var(--surface-color)', padding: '2.5rem', borderRadius: '24px', width: '100%', maxWidth: '1000px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', border: '1px solid var(--border-color)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>{editingInvoice ? 'Qeydə Düzəliş Et' : 'Yeni Debitor Əlavə Et'}</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: '0.5rem', borderRadius: '50%', transition: 'background 0.2s' }} onMouseOver={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'} onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        
        {/* Əsas Məlumatlar */}
        <div style={{ marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>1</span>
            Əsas Məlumatlar
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Debitor Adı</label>
              <input type="text" value={debitor} onChange={e => setDebitor(e.target.value)} placeholder="Məs. TechCorp MMC" style={{ width: '100%', padding: '0.9rem 1.2rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', outline: 'none', fontSize: '0.95rem', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>VÖEN</label>
              <input type="text" value={voen} onChange={e => setVoen(e.target.value)} placeholder="Məs. 1405678912" style={{ width: '100%', padding: '0.9rem 1.2rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', outline: 'none', fontSize: '0.95rem', transition: 'border-color 0.2s' }} onFocus={e => e.target.style.borderColor = '#3b82f6'} onBlur={e => e.target.style.borderColor = 'var(--border-color)'} />
            </div>
          </div>
        </div>

        {/* EQF and ÖDƏNİŞ Wrapper */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
          
          {/* EQF Məlumatları */}
          <div style={{ padding: '1.5rem', borderRadius: '16px', background: 'rgba(59,130,246,0.02)', border: '1px solid rgba(59,130,246,0.1)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'rgba(59,130,246,0.1)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>2</span>
              EQF Məlumatları
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Tarix</label>
                <input type="date" value={eqfTarix} onChange={e => setEqfTarix(e.target.value)} style={{ width: '100%', padding: '0.9rem 1.2rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Seriya</label>
                <input type="text" value={eqfSeriya} onChange={e => setEqfSeriya(e.target.value)} placeholder="EQF-00123" style={{ width: '100%', padding: '0.9rem 1.2rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Əsas Məbləğ (₼)</label>
                <input type="number" value={eqfAsas} onChange={e => setEqfAsas(e.target.value ? Number(e.target.value) : '')} placeholder="0.00" style={{ width: '100%', padding: '0.9rem 1.2rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Dərəcə (ƏDV)</label>
                <select value={eqfDerece} onChange={e => {
                  const val = e.target.value;
                  setEqfDerece(val);
                  setOdenisDerece(val);
                }} style={{ width: '100%', padding: '0.9rem 1.2rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)', outline: 'none' }}>
                  <option value="18%">18%</option>
                  <option value="18/118">18/118</option>
                  <option value="10%">10%</option>
                  <option value="10/110">10/110</option>
                  <option value="20%">20%</option>
                  <option value="20/120">20/120</option>
                  <option value="0%">0%</option>
                  <option value="edvsiz">ƏDV-siz</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>ƏDV (Auto)</label>
                <input type="text" value={eqfEdv} readOnly style={{ width: '100%', padding: '0.9rem 1.2rem', borderRadius: '12px', border: '1px solid transparent', backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', fontWeight: 700, outline: 'none' }} />
              </div>
            </div>
          </div>

          {/* ÖDƏNİŞ Məlumatları */}
          <div style={{ padding: '1.5rem', borderRadius: '16px', background: 'rgba(16,185,129,0.02)', border: '1px solid rgba(16,185,129,0.1)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#10b981', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'rgba(16,185,129,0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>3</span>
              ÖDƏNİŞ Məlumatları
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Əsas Məbləğ (₼)</label>
                <input type="number" value={odenisAsas} onChange={e => setOdenisAsas(e.target.value ? Number(e.target.value) : '')} placeholder="0.00" style={{ width: '100%', padding: '0.9rem 1.2rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Əsas ödəniş tarixi</label>
                <input type="date" value={odenisTarixAsas} onChange={e => setOdenisTarixAsas(e.target.value)} style={{ width: '100%', padding: '0.9rem 1.2rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Dərəcə (ƏDV)</label>
                <select value={odenisDerece} onChange={e => setOdenisDerece(e.target.value)} style={{ width: '100%', padding: '0.9rem 1.2rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)', outline: 'none' }}>
                  <option value="18%">18%</option>
                  <option value="18/118">18/118</option>
                  <option value="10%">10%</option>
                  <option value="10/110">10/110</option>
                  <option value="20%">20%</option>
                  <option value="20/120">20/120</option>
                  <option value="0%">0%</option>
                  <option value="edvsiz">ƏDV-siz</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>ƏDV Məbləği (Auto)</label>
                <input type="text" value={odenisEdv} readOnly style={{ width: '100%', padding: '0.9rem 1.2rem', borderRadius: '12px', border: '1px solid transparent', backgroundColor: 'rgba(16,185,129,0.1)', color: '#10b981', fontWeight: 700, outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>ƏDV ödəniş tarixi</label>
                <input type="date" value={odenisTarixEdv} onChange={e => setOdenisTarixEdv(e.target.value)} style={{ width: '100%', padding: '0.9rem 1.2rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)', outline: 'none' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Ödəniş üsulları */}
        <div style={{ marginBottom: '1.5rem', padding: '1.5rem', borderRadius: '16px', background: 'rgba(245,158,11,0.02)', border: '1px solid rgba(245,158,11,0.1)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#d97706', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'rgba(245,158,11,0.1)', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem' }}>4</span>
            Ödəniş üsulları
          </h3>
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
              <input type="radio" name="payment_method" checked={paymentMethod === 'bank'} onChange={() => setPaymentMethod('bank')} style={{ accentColor: '#d97706', transform: 'scale(1.2)' }} /> Bank
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600 }}>
              <input type="radio" name="payment_method" checked={paymentMethod === 'nagd'} onChange={() => setPaymentMethod('nagd')} style={{ accentColor: '#d97706', transform: 'scale(1.2)' }} /> Nağd
            </label>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Bankı Seçin</label>
              <select value={bankName} onChange={e => setBankName(e.target.value)} disabled={paymentMethod !== 'bank'} style={{ width: '100%', padding: '0.9rem 1.2rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: paymentMethod === 'bank' ? 'var(--surface-color)' : 'var(--bg-color)', outline: 'none', opacity: paymentMethod === 'bank' ? 1 : 0.6 }}>
                <option value="Kapital Bank">Kapital Bank</option>
                <option value="ABB">ABB</option>
                <option value="Pasha Bank">Pasha Bank</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Məbləğ ({paymentMethod === 'bank' ? 'Bank' : 'Nağd'})</label>
              <input type="text" value={odenisAsas} readOnly style={{ width: '100%', padding: '0.9rem 1.2rem', borderRadius: '12px', border: '1px solid transparent', backgroundColor: 'rgba(245,158,11,0.1)', color: '#d97706', fontWeight: 700, outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Depozit (Əgər varsa)</label>
              <input type="text" value={odenisEdv} readOnly style={{ width: '100%', padding: '0.9rem 1.2rem', borderRadius: '12px', border: '1px solid transparent', backgroundColor: 'rgba(245,158,11,0.1)', color: '#d97706', fontWeight: 700, outline: 'none' }} />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
          <button onClick={onClose} style={{ padding: '0.9rem 1.75rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', fontWeight: 700, cursor: 'pointer', color: 'var(--text-primary)', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.02)'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>İmtina</button>
          <button onClick={handleSaveData} style={{ padding: '0.9rem 1.75rem', borderRadius: '12px', border: 'none', backgroundColor: '#3b82f6', color: 'white', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-1px)'} onMouseOut={e => e.currentTarget.style.transform = 'none'}>{editingInvoice ? 'Yadda Saxla' : 'Əlavə Et'}</button>
        </div>
      </div>
    </div>
  );
}

const INITIAL_INVOICES: any[] = [];

export default function AccountingPage() {
  
  const [invoices, setInvoices] = useState<any[]>(INITIAL_INVOICES);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = getAppStorage('erp_invoices');
    if (saved) {
      try { setInvoices(JSON.parse(saved)); } catch(e){}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setAppStorage('erp_invoices', JSON.stringify(invoices));
    }
  }, [invoices, isLoaded]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<any>(null);

  const formatNum = (num: number) => Number(num).toFixed(2).replace('.', ',');

  const handleDelete = (id: string) => {
    if(confirm('Bu qeydi silmək istədiyinizə əminsiniz?')) {
      setInvoices(invoices.filter(inv => inv.id !== id));
    }
  };

  const handleEdit = (invoice: any) => {
    setEditingInvoice(invoice);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingInvoice(null);
    setIsModalOpen(true);
  };

  const handlePrint = () => {
    const exportData = invoices.map(inv => ({
      "DEBİTOR": inv.debitor,
      "VÖEN": inv.voen,
      "EQF TARİXİ": inv.eqf.tarix,
      "EQF SERİYA №": inv.eqf.seriya,
      "EQF ƏSAS MƏBLƏĞ": inv.eqf.asas,
      "EQF ƏDV": inv.eqf.edv,
      "EQF CƏMİ": inv.eqf.cemi,
      "ÖDƏNİŞ TARİXİ": inv.odenis.tarixAsas,
      "ÖDƏNİŞ ƏSAS MƏBLƏĞ": inv.odenis.asas,
      "ƏDV ÖDƏNİŞ TARİXİ": inv.odenis.tarixEdv,
      "ÖDƏNİŞ ƏDV": inv.odenis.edv,
      "QALIQ ƏSAS MƏBLƏĞ": inv.qaliq.asas,
      "QALIQ ƏDV": inv.qaliq.edv,
      "QALIQ CƏMİ": inv.qaliq.cemi,
      "BANK": inv.bank || 0,
      "BANK ADI": inv.bankName || '-',
      "DEP": inv.dep || 0,
      "NAĞD": inv.nagd || 0,
      "ATB / DİGƏR": inv.atb || 0
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Debitorlar");
    XLSX.writeFile(workbook, "Debitor_Kreditor_Cedveli.xlsx");
  };

  const totalDebitorBorc = invoices.reduce((acc, inv) => acc + (Number(inv.qaliq?.cemi) || 0), 0);
  const totalEqf = invoices.reduce((acc, inv) => acc + (Number(inv.eqf?.cemi) || 0), 0);
  const totalIncome = invoices.reduce((acc, inv) => acc + (Number(inv.bank) || 0) + (Number(inv.nagd) || 0) + (Number(inv.dep) || 0) + (Number(inv.atb) || 0), 0);

  return (
    <div style={{ maxWidth: '100%', overflowX: 'hidden', paddingBottom: '2rem' }}>
      
      {/* HEADER */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', 
        marginBottom: '2.5rem', padding: '1.5rem 2rem', borderRadius: '24px',
        background: 'linear-gradient(135deg, var(--bg-color) 0%, rgba(59, 130, 246, 0.03) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.1)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
      }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Ödəniş və Xərc Uçotu</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>Fakturalar, hesabatlar və maliyyə icmalı</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={handlePrint} style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', backgroundColor: 'transparent', color: 'var(--text-primary)', borderRadius: '12px', fontWeight: 700, border: '1px solid var(--border-color)', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg> Hesabat Çıxart
          </button>
          <button onClick={handleAddNew} style={{ 
            display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', backgroundColor: '#3b82f6', color: 'white', borderRadius: '12px', fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)', whiteSpace: 'nowrap', transition: 'all 0.2s'
          }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg> Yeni Qeyd Əlavə Et
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem', animation: 'fadeIn 0.4s ease-out' }}>
        <div style={{ padding: '1.75rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(245,158,11,0.1) 0%, rgba(245,158,11,0.02) 100%)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--surface-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f59e0b' }}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg></div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>Ümumi Debitor Borclar (Qalıq)</h3>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#b45309' }}>{formatNum(totalDebitorBorc)} ₼</div>
        </div>

        <div style={{ padding: '1.75rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(59,130,246,0.02) 100%)', border: '1px solid rgba(59,130,246,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--surface-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg></div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>Cəmi EQF Məbləği</h3>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#1d4ed8' }}>{formatNum(totalEqf)} ₼</div>
        </div>

        <div style={{ padding: '1.75rem', borderRadius: '24px', background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0.02) 100%)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--surface-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg></div>
            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase' }}>Xalis Mənfəət (İllik)</h3>
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#047857' }}>{formatNum(totalIncome)} ₼</div>
          <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700, marginTop: '0.5rem' }}>* Hazırda Daxil Olan Ümumi Ödənişləri göstərir</div>
        </div>
      </div>

      {/* TABLE */}
      <div style={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
        <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface-color)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>Debitor / Kreditor Cədvəli (EQF və Ödənişlər)</h3>
        </div>
        <div style={{ overflowX: 'auto', width: '100%', animation: 'fadeIn 0.3s ease-out' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0', textAlign: 'left', tableLayout: 'auto' }}>
            <thead style={{ color: 'white', backgroundColor: '#064e3b' }}>
              <tr>
                <th rowSpan={2} style={{ ...thStyle, borderTopLeftRadius: '0px' }}>DEBİTOR</th>
                <th rowSpan={2} style={{ ...thStyle }}>VÖEN</th>
                <th colSpan={5} style={{ ...thStyle, textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>EQF</th>
                <th colSpan={4} style={{ ...thStyle, textAlign: 'center', backgroundColor: '#065f46', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>ÖDƏNİŞ</th>
                <th colSpan={3} style={{ ...thStyle, textAlign: 'center', backgroundColor: '#047857', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>QALIQ</th>
                <th rowSpan={2} style={{ ...thStyle, textAlign: 'center' }}>BANK</th>
                <th rowSpan={2} style={{ ...thStyle, textAlign: 'center' }}>DEP</th>
                <th rowSpan={2} style={{ ...thStyle, textAlign: 'center' }}>NAĞD</th>
                <th rowSpan={2} style={{ ...thStyle, textAlign: 'center' }}>ATB / DİGƏR</th>
                <th rowSpan={2} style={{ ...thStyle, borderTopRightRadius: '0px', textAlign: 'center' }}>ƏMƏLİYYAT</th>
              </tr>
              <tr>
                {/* EQF */}
                <th style={{ ...thStyle, backgroundColor: 'rgba(255,255,255,0.05)' }}>TARİXİ</th>
                <th style={{ ...thStyle, backgroundColor: 'rgba(255,255,255,0.05)' }}>SERİYA №</th>
                <th style={{ ...thStyle, backgroundColor: 'rgba(255,255,255,0.05)' }}>ƏSAS MƏBLƏĞ</th>
                <th style={{ ...thStyle, backgroundColor: 'rgba(255,255,255,0.05)' }}>ƏDV</th>
                <th style={{ ...thStyle, backgroundColor: 'rgba(255,255,255,0.05)' }}>CƏMİ</th>
                
                {/* ÖDƏNİŞ */}
                <th style={{ ...thStyle, backgroundColor: '#065f46' }}>TARİXİ</th>
                <th style={{ ...thStyle, backgroundColor: '#065f46' }}>ƏSAS MƏBLƏĞ</th>
                <th style={{ ...thStyle, backgroundColor: '#065f46' }}>TARİXİ</th>
                <th style={{ ...thStyle, backgroundColor: '#065f46' }}>ƏDV</th>
                
                {/* Qalıq */}
                <th style={{ ...thStyle, backgroundColor: '#047857' }}>ƏSAS MƏBLƏĞ</th>
                <th style={{ ...thStyle, backgroundColor: '#047857' }}>ƏDV</th>
                <th style={{ ...thStyle, backgroundColor: '#047857' }}>CƏMİ</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((item, index) => (
                <tr key={item.id} className="table-row-modern" style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc', transition: 'all 0.2s ease' }}>
                  <td style={{ ...tdStyle, borderLeft: '1px solid var(--border-color)', fontWeight: 700, color: '#3b82f6' }}>{item.debitor}</td>
                  <td style={{ ...tdStyle, fontWeight: 500, color: 'var(--text-secondary)' }}>{item.voen}</td>
                  
                  {/* EQF */}
                  <td style={{ ...tdStyle }}>{item.eqf.tarix}</td>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>{item.eqf.seriya}</td>
                  <td style={{ ...tdStyle, fontWeight: 700 }}>{formatNum(item.eqf.asas)}</td>
                  <td style={{ ...tdStyle, color: 'var(--text-secondary)' }}>{formatNum(item.eqf.edv)}</td>
                  <td style={{ ...tdStyle, fontWeight: 800, color: '#047857' }}>{formatNum(item.eqf.cemi)}</td>
                  
                  {/* ÖDƏNİŞ */}
                  <td style={{ ...tdStyle, backgroundColor: 'rgba(59,130,246,0.02)' }}>{item.odenis.tarixAsas}</td>
                  <td style={{ ...tdStyle, backgroundColor: 'rgba(59,130,246,0.02)', fontWeight: 700 }}>{formatNum(item.odenis.asas)}</td>
                  <td style={{ ...tdStyle, backgroundColor: 'rgba(59,130,246,0.02)' }}>{item.odenis.tarixEdv}</td>
                  <td style={{ ...tdStyle, backgroundColor: 'rgba(59,130,246,0.02)' }}>{formatNum(item.odenis.edv)}</td>

                  {/* Qalıq */}
                  <td style={{ ...tdStyle, backgroundColor: 'rgba(29,78,216,0.02)' }}>{formatNum(item.qaliq.asas)}</td>
                  <td style={{ ...tdStyle, backgroundColor: 'rgba(29,78,216,0.02)' }}>{formatNum(item.qaliq.edv)}</td>
                  <td style={{ ...tdStyle, backgroundColor: 'rgba(29,78,216,0.02)', fontWeight: 800, color: '#b45309' }}>{formatNum(item.qaliq.cemi)}</td>
                  
                  {/* Digər */}
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <div style={{ fontWeight: 700 }}>{item.bank ? formatNum(item.bank) : '-'}</div>
                    {item.bankName && <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.bankName}</div>}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{item.dep ? formatNum(item.dep) : '-'}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{item.nagd ? formatNum(item.nagd) : '-'}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{item.atb ? formatNum(item.atb) : '-'}</td>

                  <td style={{ ...tdStyle, textAlign: 'center', borderRight: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                      <button 
                        onClick={() => handleEdit(item)}
                        title="Düzəliş"
                        style={{ 
                          width: '32px', height: '32px', borderRadius: '8px', border: 'none', 
                          backgroundColor: 'rgba(59,130,246,0.1)', color: '#3b82f6', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', transition: 'all 0.2s'
                        }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/></svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        title="Sil"
                        style={{ 
                          width: '32px', height: '32px', borderRadius: '8px', border: 'none', 
                          backgroundColor: 'rgba(239,68,68,0.1)', color: '#ef4444', 
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', transition: 'all 0.2s'
                        }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <InvoiceModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        editingInvoice={editingInvoice} 
        onSave={(newData: any) => {
          if (editingInvoice) {
            setInvoices(invoices.map(inv => inv.id === newData.id ? newData : inv));
          } else {
            setInvoices([newData, ...invoices]);
          }
          setIsModalOpen(false);
        }} 
      />

      <style dangerouslySetInnerHTML={{__html: `
        .table-row-modern:hover { background-color: #f1f5f9 !important; }
        .table-row-modern button:hover { opacity: 0.8; transform: translateY(-1px); }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: '1rem 0.5rem',
  fontWeight: 700,
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  borderBottom: '1px solid rgba(0,0,0,0.05)',
  borderRight: '1px solid rgba(255,255,255,0.1)',
  whiteSpace: 'nowrap',
};

const tdStyle: React.CSSProperties = {
  padding: '1rem 0.5rem',
  fontSize: '0.8rem',
  borderBottom: '1px solid var(--border-color)',
  borderRight: '1px solid rgba(0,0,0,0.02)',
  verticalAlign: 'middle',
  whiteSpace: 'nowrap'
};

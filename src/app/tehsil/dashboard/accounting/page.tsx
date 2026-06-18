'use client'

import { useState } from 'react';

type DebitorRow = {
  id: string;
  debitor: string;
  voen: string;
  eqf: { tarix: string; seriya: string; esas: number; edv: number; cemi: number; edvRate?: string };
  odenis: { tarix1: string; esas: number; tarix2: string; edv: number; edvRate?: string };
  qaliq: { esas: number; edv: number; cemi: number; };
  bankName?: string;
  kapB: number; // Bank payment
  dep: number;
  nagd: number; // Cash payment
  atb: number; // Digər
  createdAt?: string; // Siyahıya əlavə edilmə tarixi
};

const INITIAL_ROWS: DebitorRow[] = [
  {
    id: '1',
    debitor: 'TechCorp MMC',
    voen: '1405678912',
    eqf: { tarix: '10.06.2026', seriya: 'EQF-00123', esas: 95088.24, edv: 0.00, cemi: 95088.24, edvRate: 'Manual' },
    odenis: { tarix1: '12.06.2026', esas: 33796.30, tarix2: '-', edv: 0.00, edvRate: 'Manual' },
    qaliq: { esas: 61291.94, edv: 0.00, cemi: 61291.94 },
    bankName: 'Kapital Bank',
    kapB: 33796.30,
    dep: 0,
    nagd: 0,
    atb: 0,
    createdAt: new Date().toISOString()
  }
];

export default function AccountingPage() {
  const [rows, setRows] = useState<DebitorRow[]>(INITIAL_ROWS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [payMethod, setPayMethod] = useState<'Bank' | 'Nağd'>('Bank');

  // Form State
  const [formData, setFormData] = useState<DebitorRow>({
    id: '', debitor: '', voen: '',
    eqf: { tarix: '', seriya: '', esas: 0, edv: 0, cemi: 0, edvRate: 'Manual' },
    odenis: { tarix1: '', esas: 0, tarix2: '', edv: 0, edvRate: 'Manual' },
    qaliq: { esas: 0, edv: 0, cemi: 0 },
    bankName: 'Kapital Bank',
    kapB: 0, dep: 0, nagd: 0, atb: 0
  });

  // Dinamik statları hesablamaq
  const totalReceivables = rows.reduce((sum, r) => sum + r.qaliq.cemi, 0); 
  const totalEQF = rows.reduce((sum, r) => sum + r.eqf.cemi, 0);

  const formatNum = (num: number) => Number(num) === 0 ? '0,00' : Number(num).toFixed(2).replace('.', ',');

  const calculateEDV = (esas: number, rate: string) => {
    let edv = 0;
    if(rate === '18%') edv = esas * 0.18;
    else if(rate === '18/118') edv = esas * (18/118);
    else if(rate === '10%') edv = esas * 0.10;
    else if(rate === '10/110') edv = esas * (10/110);
    else if(rate === '20%') edv = esas * 0.20;
    else if(rate === '20/120') edv = esas * (20/120);
    return Number(edv.toFixed(2));
  };

  const exportToExcel = () => {
    const headers = [
      "Debitor", "VÖEN", "EQF Tarixi", "EQF Seriya", "EQF Əsas", "EQF ƏDV", "EQF CƏMİ",
      "Ödəniş Tarixi 1", "Ödəniş Əsas", "Ödəniş Tarixi 2", "Ödəniş ƏDV",
      "Qalıq Əsas", "Qalıq ƏDV", "Qalıq Cəmi", 
      "Bank", "Depozit", "Nağd", "ATB/Digər", "Əlavə edilmə tarixi"
    ];
    
    const csvRows = [headers.join('\t')];
    
    rows.forEach(r => {
      const rowData = [
        r.debitor || '-', r.voen || '-', 
        r.eqf.tarix || '-', r.eqf.seriya || '-', formatNum(r.eqf.esas), formatNum(r.eqf.edv), formatNum(r.eqf.cemi),
        r.odenis.tarix1 || '-', formatNum(r.odenis.esas), r.odenis.tarix2 || '-', formatNum(r.odenis.edv),
        formatNum(r.qaliq.esas), formatNum(r.qaliq.edv), formatNum(r.qaliq.cemi),
        r.kapB > 0 ? `${formatNum(r.kapB)} (${r.bankName})` : '0,00', 
        formatNum(r.dep), formatNum(r.nagd), formatNum(r.atb),
        r.createdAt ? new Date(r.createdAt).toLocaleDateString('az-AZ') : '-'
      ];
      csvRows.push(rowData.join('\t'));
    });

    // BOM for UTF-8 Excel support
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const blob = new Blob([bom, csvRows.join('\n')], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Hesabat_${new Date().toISOString().slice(0,10)}.xls`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 1 rüb (3 ay ~ 90 gün) keçib-keçmədiyini yoxlayır
  const isEditable = (createdAt?: string) => {
    if (!createdAt) return true; // köhnə məlumatlar üçün
    const createdDate = new Date(createdAt).getTime();
    const now = new Date().getTime();
    const daysDiff = (now - createdDate) / (1000 * 60 * 60 * 24);
    return daysDiff <= 90;
  };

  const handleOpenModal = () => {
    setIsEditing(false);
    setPayMethod('Bank');
    setFormData({
      id: '', debitor: '', voen: '',
      eqf: { tarix: '', seriya: '', esas: 0, edv: 0, cemi: 0, edvRate: 'Manual' },
      odenis: { tarix1: '', esas: 0, tarix2: '', edv: 0, edvRate: 'Manual' },
      qaliq: { esas: 0, edv: 0, cemi: 0 },
      bankName: 'Kapital Bank',
      kapB: 0, dep: 0, nagd: 0, atb: 0
    });
    setIsModalOpen(true);
  };

  const handleEdit = (row: DebitorRow) => {
    if (!isEditable(row.createdAt)) {
      alert('Bu qeyd 1 rübdən (3 aydan) əvvəl əlavə edildiyi üçün düzəliş edilə bilməz.');
      return;
    }
    setIsEditing(true);
    setPayMethod(row.nagd > 0 && row.kapB === 0 ? 'Nağd' : 'Bank');
    setFormData(row);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu qeydi silmək istədiyinizə əminsiniz?')) {
      setRows(rows.filter(r => r.id !== id));
    }
  };

  const handleSave = () => {
    if (!formData.debitor) return alert('Debitor adı mütləqdir!');
    
    // Auto-calculate CƏMİ and Qalıq dynamically
    const eqfCemi = formData.eqf.esas + formData.eqf.edv;
    
    const qaliqEsas = formData.eqf.esas - formData.odenis.esas;
    const qaliqEdv = formData.eqf.edv - formData.odenis.edv;
    const qaliqCemi = qaliqEsas + qaliqEdv;

    // Clean payment methods based on selected mode
    let finalKapB = formData.kapB || 0;
    let finalNagd = formData.nagd || 0;
    let finalBankName = formData.bankName;

    if (payMethod === 'Nağd') {
      finalKapB = 0;
      finalBankName = '';
    } else {
      finalNagd = 0;
    }

    const newRecord: DebitorRow = {
      ...formData,
      id: isEditing ? formData.id : Date.now().toString(),
      createdAt: isEditing ? (formData.createdAt || new Date().toISOString()) : new Date().toISOString(),
      eqf: { ...formData.eqf, cemi: eqfCemi || formData.eqf.cemi },
      qaliq: { esas: qaliqEsas, edv: qaliqEdv, cemi: qaliqCemi },
      kapB: finalKapB,
      nagd: finalNagd,
      bankName: finalBankName,
    };

    if (isEditing) {
      setRows(rows.map(r => r.id === newRecord.id ? newRecord : r));
    } else {
      setRows([...rows, newRecord]);
    }
    
    setIsModalOpen(false);
  };

  return (
    <div style={{ maxWidth: '100%', overflowX: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '0.25rem', color: '#064e3b' }}>Ödəniş və Xərc Uçotu</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Fakturalar, hesabatlar və maliyyə icmalı</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={exportToExcel} style={{ 
            padding: '0.65rem 1.25rem', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '10px', fontWeight: 600, cursor: 'pointer'
          }}>
            Hesabat Çıxart
          </button>
          <button onClick={handleOpenModal} style={{ 
            padding: '0.65rem 1.25rem', backgroundColor: '#10b981', color: 'white', borderRadius: '10px', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}>
            + Yeni Qeyd Əlavə Et
          </button>
        </div>
      </div>

      {/* KPI KARTLARI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', borderLeft: '4px solid #10b981' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>Ümumi Debitor Borclar (Qalıq)</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#064e3b' }}>{formatNum(totalReceivables)} ₼</div>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', borderLeft: '4px solid #f59e0b' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>Cəmi EQF Məbləği</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{formatNum(totalEQF)} ₼</div>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', borderLeft: '4px solid #059669' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>Xalis Mənfəət (İllik)</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>128450,00 ₼</div>
          <div style={{ color: '#059669', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: 600 }}>Keçən ilə nisbətən +24% artım</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* YENİ DEBİTOR / KREDİTOR CƏDVƏLİ */}
        <div className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden', padding: '1px' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#064e3b' }}>Debitor / Kreditor Cədvəli (EQF və Ödənişlər)</h3>
          </div>
          <div style={{ overflowX: 'auto', paddingBottom: '1rem', width: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', tableLayout: 'auto' }}>
              <thead>
                <tr style={{ backgroundColor: '#10b981', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.2)' }}>
                  <th rowSpan={2} style={thStyle}>Debitor</th>
                  <th rowSpan={2} style={thStyle}>VÖEN</th>
                  <th colSpan={5} style={thStyle}>EQF</th>
                  <th colSpan={4} style={thStyle}>ÖDƏNİŞ</th>
                  <th colSpan={3} style={thStyle}>Qalıq</th>
                  <th rowSpan={2} style={{ ...thStyle, backgroundColor: '#059669', minWidth: '60px' }}>Bank</th>
                  <th rowSpan={2} style={{ ...thStyle, backgroundColor: '#047857', minWidth: '40px' }}>Dep</th>
                  <th rowSpan={2} style={{ ...thStyle, backgroundColor: '#fca5a5', minWidth: '40px', color: '#000' }}>Nağd</th>
                  <th rowSpan={2} style={{ ...thStyle, backgroundColor: '#34d399', minWidth: '40px', color: '#000' }}>ATB / Digər</th>
                  <th rowSpan={2} style={{ ...thStyle, backgroundColor: '#064e3b' }}>Əməliyyat</th>
                </tr>
                <tr style={{ backgroundColor: '#10b981', color: 'white' }}>
                  <th style={thStyle}>Tarixi</th>
                  <th style={thStyle}>Seriya №</th>
                  <th style={thStyle}>ƏSAS məbləğ</th>
                  <th style={thStyle}>ƏDV</th>
                  <th style={thStyle}>CƏMİ</th>
                  
                  <th style={thStyle}>Tarixi</th>
                  <th style={thStyle}>Əsas Məbləğ</th>
                  <th style={thStyle}>Tarixi</th>
                  <th style={thStyle}>ƏDV</th>
                  
                  <th style={thStyle}>Əsas Məbləğ</th>
                  <th style={thStyle}>ƏDV</th>
                  <th style={thStyle}>CƏMİ</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => {
                  const editable = isEditable(row.createdAt);
                  return (
                    <tr key={row.id} style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: index % 2 === 0 ? '#ffffff' : '#f0fdf4' }} className="table-row-modern">
                      <td style={{...tdStyle, fontWeight: 700}}>{row.debitor}</td>
                      <td style={tdStyle}>{row.voen}</td>
                      
                      <td style={tdStyle}>{row.eqf.tarix}</td>
                      <td style={tdStyle}>{row.eqf.seriya}</td>
                      <td style={{ ...tdStyle, fontWeight: 700 }}>{formatNum(row.eqf.esas)}</td>
                      <td style={tdStyle}>{formatNum(row.eqf.edv)}</td>
                      <td style={{ ...tdStyle, fontWeight: 800 }}>{formatNum(row.eqf.cemi)}</td>
                      
                      <td style={tdStyle}>{row.odenis.tarix1}</td>
                      <td style={{ ...tdStyle, fontWeight: 700, color: '#10b981' }}>{formatNum(row.odenis.esas)}</td>
                      <td style={tdStyle}>{row.odenis.tarix2}</td>
                      <td style={tdStyle}>{formatNum(row.odenis.edv)}</td>
                      
                      <td style={{ ...tdStyle, fontWeight: 700, color: '#ef4444' }}>{formatNum(row.qaliq.esas)}</td>
                      <td style={tdStyle}>{formatNum(row.qaliq.edv)}</td>
                      <td style={{ ...tdStyle, fontWeight: 800, color: '#ef4444' }}>{formatNum(row.qaliq.cemi)}</td>
                      
                      <td style={tdStyle}>
                        {row.kapB > 0 ? (
                          <>
                            <div style={{ fontWeight: 700 }}>{formatNum(row.kapB)}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{row.bankName}</div>
                          </>
                        ) : ''}
                      </td>
                      <td style={tdStyle}>{row.dep > 0 ? formatNum(row.dep) : ''}</td>
                      <td style={tdStyle}>{row.nagd > 0 ? formatNum(row.nagd) : ''}</td>
                      <td style={tdStyle}>{row.atb > 0 ? formatNum(row.atb) : ''}</td>
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center', flexWrap: 'nowrap' }}>
                          <button 
                            onClick={() => handleEdit(row)} 
                            title={!editable ? "1 rübdən (3 aydan) çox vaxt keçib" : ""}
                            style={{ 
                              padding: '0.3rem 0.5rem', 
                              backgroundColor: editable ? '#3b82f6' : '#94a3b8', 
                              color: 'white', 
                              borderRadius: '4px', 
                              border: 'none', 
                              fontWeight: 600, 
                              fontSize: '0.65rem', 
                              cursor: editable ? 'pointer' : 'not-allowed',
                              whiteSpace: 'nowrap'
                            }}>
                            Düzəliş
                          </button>
                          <button onClick={() => handleDelete(row.id)} style={{ padding: '0.3rem 0.5rem', backgroundColor: '#ef4444', color: 'white', borderRadius: '4px', border: 'none', fontWeight: 600, fontSize: '0.65rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>Sil</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {rows.length === 0 && <tr><td colSpan={19} style={{ padding: '2rem', color: 'var(--text-secondary)' }}>Məlumat yoxdur</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* YENİ / DÜZƏLİŞ QEYD MODALI */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
        }}>
          <div style={{ backgroundColor: 'var(--surface-color)', width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', color: '#064e3b' }}>
              {isEditing ? 'Qeydə Düzəliş Et' : 'Yeni Debitor Əlavə Et'}
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div style={{ backgroundColor: 'var(--bg-color)', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
                <h4 style={{ marginBottom: '1rem', color: '#064e3b' }}>Əsas Məlumatlar</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div><label style={labelStyle}>Debitor Adı</label><input type="text" value={formData.debitor} onChange={e => setFormData({...formData, debitor: e.target.value})} style={inputStyle} /></div>
                  <div><label style={labelStyle}>VÖEN</label><input type="text" value={formData.voen} onChange={e => setFormData({...formData, voen: e.target.value})} style={inputStyle} /></div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div style={{ backgroundColor: 'var(--bg-color)', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #059669' }}>
                  <h4 style={{ marginBottom: '1.25rem', color: '#064e3b' }}>EQF Məlumatları</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div><label style={labelStyle}>Tarix</label><input type="date" value={formData.eqf.tarix} onChange={e => setFormData({...formData, eqf: {...formData.eqf, tarix: e.target.value}})} style={inputStyle} /></div>
                    <div><label style={labelStyle}>Seriya</label><input type="text" value={formData.eqf.seriya} onChange={e => setFormData({...formData, eqf: {...formData.eqf, seriya: e.target.value}})} style={inputStyle} /></div>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={labelStyle}>Əsas Məbləğ</label>
                      <input type="number" value={formData.eqf.esas || ''} onChange={e => {
                        const val = Number(e.target.value);
                        
                        // Recalculate EDV based on current rate
                        const eqfRate = formData.eqf.edvRate || 'Manual';
                        const newEdvEQF = eqfRate !== 'Manual' ? calculateEDV(val, eqfRate) : formData.eqf.edv;

                        setFormData({
                          ...formData, 
                          eqf: { ...formData.eqf, esas: val, edv: newEdvEQF }
                        });
                      }} style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Dərəcə (ƏDV)</label>
                      <select style={inputStyle} value={formData.eqf.edvRate || 'Manual'} onChange={(e) => {
                        const rate = e.target.value;
                        const esasEQF = formData.eqf.esas || 0;
                        const newEdvEQF = rate !== 'Manual' ? calculateEDV(esasEQF, rate) : formData.eqf.edv;

                        // Auto-sync ÖDƏNİŞ Dərəcə
                        const esasOdenis = formData.odenis.esas || 0;
                        const newEdvOdenis = rate !== 'Manual' ? calculateEDV(esasOdenis, rate) : formData.odenis.edv;

                        setFormData({
                          ...formData, 
                          eqf: { ...formData.eqf, edv: newEdvEQF, edvRate: rate },
                          odenis: { ...formData.odenis, edv: newEdvOdenis, edvRate: rate },
                          dep: newEdvOdenis
                        });
                      }}>
                        <option value="Manual">Secin...</option>
                        <option value="18%">18%</option>
                        <option value="18/118">18/118</option>
                        <option value="10%">10%</option>
                        <option value="10/110">10/110</option>
                        <option value="20%">20%</option>
                        <option value="20/120">20/120</option>
                        <option value="0%">0% (ƏDV-siz)</option>
                      </select>
                    </div>
                    <div><label style={labelStyle}>ƏDV Məbləği</label><input type="number" value={formData.eqf.edv || ''} onChange={e => setFormData({...formData, eqf: {...formData.eqf, edv: Number(e.target.value)}})} style={inputStyle} /></div>
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-color)', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #10b981' }}>
                  <h4 style={{ marginBottom: '1.25rem', color: '#064e3b' }}>ÖDƏNİŞ Məlumatları</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                      <label style={labelStyle}>Əsas Məbləğ</label>
                      <input type="number" value={formData.odenis.esas || ''} onChange={e => {
                        const val = Number(e.target.value);

                        // Recalculate EDV based on current rate
                        const odenisRate = formData.odenis.edvRate || 'Manual';
                        const newEdvOdenis = odenisRate !== 'Manual' ? calculateEDV(val, odenisRate) : formData.odenis.edv;

                        setFormData({
                          ...formData, 
                          odenis: { ...formData.odenis, esas: val, edv: newEdvOdenis }, 
                          kapB: val, 
                          nagd: val,
                          dep: newEdvOdenis
                        });
                      }} style={inputStyle} />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}><label style={labelStyle}>Əsas məbləğin ödəniş tarixi</label><input type="date" value={formData.odenis.tarix1} onChange={e => setFormData({...formData, odenis: {...formData.odenis, tarix1: e.target.value}})} style={inputStyle} /></div>
                    <div>
                      <label style={labelStyle}>Dərəcə (ƏDV)</label>
                      <select style={inputStyle} value={formData.odenis.edvRate || 'Manual'} onChange={(e) => {
                        const rate = e.target.value;
                        const esas = formData.odenis.esas || 0;
                        const newEdv = rate !== 'Manual' ? calculateEDV(esas, rate) : formData.odenis.edv;
                        
                        setFormData({
                          ...formData, 
                          odenis: {...formData.odenis, edv: newEdv, edvRate: rate}, 
                          dep: newEdv
                        });
                      }}>
                        <option value="Manual">Secin...</option>
                        <option value="18%">18%</option>
                        <option value="18/118">18/118</option>
                        <option value="10%">10%</option>
                        <option value="10/110">10/110</option>
                        <option value="20%">20%</option>
                        <option value="20/120">20/120</option>
                        <option value="0%">0% (ƏDV-siz)</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>ƏDV Məbləği</label>
                      <input type="number" value={formData.odenis.edv || ''} onChange={e => {
                        const val = Number(e.target.value);
                        setFormData({...formData, odenis: {...formData.odenis, edv: val}, dep: val});
                      }} style={inputStyle} />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}><label style={labelStyle}>ƏDV məbləğin ödəniş tarixi</label><input type="date" value={formData.odenis.tarix2} onChange={e => setFormData({...formData, odenis: {...formData.odenis, tarix2: e.target.value}})} style={inputStyle} /></div>
                  </div>
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-color)', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #059669' }}>
                <h4 style={{ marginBottom: '1.25rem', color: '#064e3b' }}>Ödəniş üsulları</h4>
                
                <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>
                    <input type="radio" name="payMethod" value="Bank" checked={payMethod === 'Bank'} onChange={() => setPayMethod('Bank')} style={{ transform: 'scale(1.2)', accentColor: '#10b981' }} />
                    1. Bank
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>
                    <input type="radio" name="payMethod" value="Nağd" checked={payMethod === 'Nağd'} onChange={() => setPayMethod('Nağd')} style={{ transform: 'scale(1.2)', accentColor: '#10b981' }} />
                    2. Nağd
                  </label>
                </div>

                {payMethod === 'Bank' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
                    <div>
                      <label style={labelStyle}>Bankı Seçin</label>
                      <select style={inputStyle} value={formData.bankName || ''} onChange={e => setFormData({...formData, bankName: e.target.value})}>
                        <option value="Kapital Bank">Kapital Bank</option>
                        <option value="ABB">ABB</option>
                        <option value="Paşa Bank">Paşa Bank</option>
                        <option value="Unibank">Unibank</option>
                        <option value="AccessBank">AccessBank</option>
                        <option value="Digər Bank">Digər Bank</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Məbləğ (Bank)</label>
                      <input type="number" value={formData.kapB || ''} onChange={e => setFormData({...formData, kapB: Number(e.target.value)})} style={inputStyle} placeholder="0.00" />
                    </div>
                  </div>
                )}

                {payMethod === 'Nağd' && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', animation: 'fadeIn 0.3s ease' }}>
                    <div>
                      <label style={labelStyle}>Məbləğ (Nağd)</label>
                      <input type="number" value={formData.nagd || ''} onChange={e => setFormData({...formData, nagd: Number(e.target.value)})} style={inputStyle} placeholder="0.00" />
                    </div>
                  </div>
                )}

                {/* Additional optional channels for Dep */}
                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px dashed var(--border-color)', display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                  <div><label style={labelStyle}>Depozit (Əgər varsa)</label><input type="number" value={formData.dep || ''} onChange={e => setFormData({...formData, dep: Number(e.target.value)})} style={inputStyle} /></div>
                </div>

              </div>

            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2.5rem' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: '0.85rem 1.5rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}>İmtina</button>
              <button onClick={handleSave} style={{ padding: '0.85rem 2.5rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 600, boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
                {isEditing ? 'Yadda Saxla' : 'Əlavə Et'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .table-row-modern:hover { filter: brightness(0.95); transition: 0.2s; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-5px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: '0.5rem 0.3rem',
  fontWeight: 700,
  fontSize: '0.65rem',
  border: '1px solid rgba(255,255,255,0.3)',
  wordBreak: 'break-word',
};

const tdStyle: React.CSSProperties = {
  padding: '0.5rem 0.3rem',
  fontSize: '0.7rem',
  border: '1px solid var(--border-color)',
  wordBreak: 'break-word',
};
const actionBtnStyle = { background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', padding: '0.2rem' };
const labelStyle = { display: 'block', marginBottom: '0.25rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.8rem' };
const inputStyle = { width: '100%', padding: '0.65rem 0.85rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: '#fff', color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.9rem', outline: 'none' };

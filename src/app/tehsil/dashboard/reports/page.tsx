'use client'

import { useState } from 'react';

// AR Maliyyə Nazirliyinin Hesablar Planı əsasında bəzi hesablar
const CHART_OF_ACCOUNTS = [
  { code: '111', name: 'Torpaq, tikili və avadanlıqların dəyəri', type: 'Aktiv' },
  { code: '211', name: 'Alıcılar və sifarişçilərin (şagirdlərin) debitor borcları', type: 'Aktiv' },
  { code: '221', name: 'Kassa (Nəğd pul vəsaitləri)', type: 'Aktiv' },
  { code: '222', name: 'Bank (Hesablaşma hesabı)', type: 'Aktiv' },
  { code: '331', name: 'Nizamnamə (Pay) kapitalı', type: 'Kapital' },
  { code: '341', name: 'Bölüşdürülməmiş mənfəət (Ödənilməmiş zərər)', type: 'Kapital' },
  { code: '531', name: 'İşçi heyətinə qısamüddətli borclar (Əməkhaqqı)', type: 'Öhdəlik' },
  { code: '545', name: 'Təxirə salınmış gəlirlər (Qabaqcadan ödəniş)', type: 'Öhdəlik' },
  { code: '601', name: 'Satışdan (Təhsil xidmətlərindən) gəlirlər', type: 'Gəlir' },
  { code: '721', name: 'İnzibati xərclər (İcarə, əməkhaqqı)', type: 'Xərc' }
];

// İlkin məlumatlar
const INITIAL_TRANSACTIONS = [
  { id: 'TR-001', date: '2026-06-01', description: 'Təsisçilərin kapital qoyuluşu', debit: '222', credit: '331', amount: 50000 },
  { id: 'TR-002', date: '2026-06-05', description: 'Nihad Əliyevdən illik təhsil haqqı (Kassa)', debit: '221', credit: '601', amount: 1500 },
  { id: 'TR-003', date: '2026-06-08', description: 'Aysel Quliyevadan banka ödəniş', debit: '222', credit: '601', amount: 800 },
  { id: 'TR-004', date: '2026-06-10', description: 'Müəllimlərə əməkhaqqı hesablanması', debit: '721', credit: '531', amount: 4500 },
  { id: 'TR-005', date: '2026-06-11', description: 'Müəllimlərə əməkhaqqı ödənişi (Bankdan)', debit: '531', credit: '222', amount: 4500 },
  { id: 'TR-006', date: '2026-06-12', description: 'Ofis icarə haqqının ödənilməsi', debit: '721', credit: '222', amount: 2000 },
  { id: 'TR-007', date: '2026-06-13', description: 'Ramil Həsənova hesablanmış borc (Ödəməyib)', debit: '211', credit: '601', amount: 1200 },
];

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState<'balans' | 'əməliyyatlar' | 'hesablar'>('balans');
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Yeni əməliyyat form state
  const [newTr, setNewTr] = useState({ date: new Date().toISOString().split('T')[0], description: '', debit: '221', credit: '601', amount: '' });

  // Balans hesablamaları (Sadələşdirilmiş T-Hesab məntiqi)
  const getAccountBalance = (code: string, type: string) => {
    let balance = 0;
    transactions.forEach(t => {
      if (t.debit === code) {
        balance += (type === 'Aktiv' || type === 'Xərc') ? t.amount : -t.amount;
      }
      if (t.credit === code) {
        balance += (type === 'Öhdəlik' || type === 'Kapital' || type === 'Gəlir') ? t.amount : -t.amount;
      }
    });
    return balance;
  };

  const calculateTotal = (types: string[]) => {
    return CHART_OF_ACCOUNTS
      .filter(acc => types.includes(acc.type))
      .reduce((sum, acc) => sum + getAccountBalance(acc.code, acc.type), 0);
  };

  const totalAssets = calculateTotal(['Aktiv']);
  const totalLiabilities = calculateTotal(['Öhdəlik']);
  const totalEquity = calculateTotal(['Kapital']);
  const netIncome = calculateTotal(['Gəlir']) - calculateTotal(['Xərc']);
  
  // Mühasibatlıqda Balans bərabərliyi: Aktivlər = Öhdəliklər + Kapital + Xalis Mənfəət
  const totalEquityAndLiabilities = totalLiabilities + totalEquity + netIncome;

  const handleAddTransaction = () => {
    if(!newTr.description || !newTr.amount) return alert('Məzmun və Məbləğ daxil edilməlidir!');
    const newTransaction = {
      id: `TR-${(transactions.length + 1).toString().padStart(3, '0')}`,
      date: newTr.date,
      description: newTr.description,
      debit: newTr.debit,
      credit: newTr.credit,
      amount: parseFloat(newTr.amount)
    };
    setTransactions([newTransaction, ...transactions]); // Ən yuxarıya əlavə edir
    setIsModalOpen(false);
    setNewTr({ date: new Date().toISOString().split('T')[0], description: '', debit: '221', credit: '601', amount: '' });
  };

  const handleDeleteTransaction = (id: string) => {
    if (confirm('Bu əməliyyatı silmək istədiyinizə əminsiniz?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '0.25rem' }}>Milli Mühasibat Uçotu</h1>
          <p style={{ color: 'var(--text-secondary)' }}>AR Maliyyə Nazirliyinin Standartları (Hesablar Planı) üzrə inteqrasiya</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => setIsModalOpen(true)} style={{ padding: '0.65rem 1.25rem', backgroundColor: '#10b981', color: 'white', borderRadius: '10px', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
            + Yeni Əməliyyat (Memorial Order)
          </button>
        </div>
      </div>

      {/* TABS */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', marginBottom: '2rem' }}>
        <button onClick={() => setActiveTab('balans')} style={tabStyle(activeTab === 'balans')}>Maliyyə Vəziyyəti (Balans)</button>
        <button onClick={() => setActiveTab('əməliyyatlar')} style={tabStyle(activeTab === 'əməliyyatlar')}>Jurnal (İkili Yazılış)</button>
        <button onClick={() => setActiveTab('hesablar')} style={tabStyle(activeTab === 'hesablar')}>Hesablar Planı</button>
      </div>

      {/* 1. MALIYYƏ VƏZİYYƏTİ HESABATI (BALANS) */}
      {activeTab === 'balans' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* AKTİVLƏR */}
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#3b82f6', marginBottom: '1.5rem', borderBottom: '2px solid #3b82f6', paddingBottom: '0.5rem' }}>AKTİVLƏR (Nəyimiz var?)</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {CHART_OF_ACCOUNTS.filter(a => a.type === 'Aktiv').map(acc => {
                  const bal = getAccountBalance(acc.code, acc.type);
                  if (bal === 0) return null;
                  return (
                    <tr key={acc.code} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>{acc.code}</td>
                      <td style={{ padding: '0.75rem 0', fontWeight: 600 }}>{acc.name}</td>
                      <td style={{ padding: '0.75rem 0', textAlign: 'right', fontWeight: 700 }}>{bal.toLocaleString('en-US')} ₼</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '2px solid var(--border-color)', fontSize: '1.2rem', fontWeight: 800 }}>
              <span>CƏMİ AKTİVLƏR:</span>
              <span>{totalAssets.toLocaleString('en-US')} ₼</span>
            </div>
          </div>

          {/* ÖHDƏLİKLƏR VƏ KAPİTAL */}
          <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ef4444', marginBottom: '1.5rem', borderBottom: '2px solid #ef4444', paddingBottom: '0.5rem' }}>ÖHDƏLİKLƏR VƏ KAPİTAL (Kimə borcluyuq?)</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                {CHART_OF_ACCOUNTS.filter(a => a.type === 'Öhdəlik' || a.type === 'Kapital').map(acc => {
                  const bal = getAccountBalance(acc.code, acc.type);
                  if (bal === 0) return null;
                  return (
                    <tr key={acc.code} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                      <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>{acc.code}</td>
                      <td style={{ padding: '0.75rem 0', fontWeight: 600 }}>{acc.name}</td>
                      <td style={{ padding: '0.75rem 0', textAlign: 'right', fontWeight: 700 }}>{bal.toLocaleString('en-US')} ₼</td>
                    </tr>
                  );
                })}
                <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <td style={{ padding: '0.75rem 0', color: 'var(--text-secondary)' }}>801</td>
                  <td style={{ padding: '0.75rem 0', fontWeight: 800, color: '#10b981' }}>Xalis Mənfəət (Dövr üzrə)</td>
                  <td style={{ padding: '0.75rem 0', textAlign: 'right', fontWeight: 800, color: '#10b981' }}>{netIncome.toLocaleString('en-US')} ₼</td>
                </tr>
              </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '2px solid var(--border-color)', fontSize: '1.2rem', fontWeight: 800 }}>
              <span>CƏMİ PASSİVLƏR:</span>
              <span>{totalEquityAndLiabilities.toLocaleString('en-US')} ₼</span>
            </div>
          </div>

          {/* MƏNFƏƏT VƏ ZƏRƏR (P&L) */}
          <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '2rem', borderRadius: '16px', marginTop: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#10b981', marginBottom: '1.5rem', borderBottom: '2px solid #10b981', paddingBottom: '0.5rem' }}>MƏNFƏƏT VƏ YA ZƏRƏR HAQQINDA HESABAT</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div>
                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Gəlirlər</h4>
                {CHART_OF_ACCOUNTS.filter(a => a.type === 'Gəlir').map(acc => {
                  const bal = getAccountBalance(acc.code, acc.type);
                  return (
                    <div key={acc.code} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                      <span style={{ fontWeight: 600 }}>{acc.code} - {acc.name}</span>
                      <span style={{ fontWeight: 700, color: '#10b981' }}>+{bal.toLocaleString('en-US')} ₼</span>
                    </div>
                  );
                })}
              </div>
              <div>
                <h4 style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Xərclər</h4>
                {CHART_OF_ACCOUNTS.filter(a => a.type === 'Xərc').map(acc => {
                  const bal = getAccountBalance(acc.code, acc.type);
                  return (
                    <div key={acc.code} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                      <span style={{ fontWeight: 600 }}>{acc.code} - {acc.name}</span>
                      <span style={{ fontWeight: 700, color: '#ef4444' }}>-{bal.toLocaleString('en-US')} ₼</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. JURNAL VƏ ƏMƏLİYYATLAR (İKİLİ YAZILIŞ) */}
      {activeTab === 'əməliyyatlar' && (
        <div className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Sənəd № / Tarix</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Məzmun (Təsərrüfat Əməliyyatı)</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#3b82f6', fontSize: '0.85rem' }}>Debit (Dt)</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#ef4444', fontSize: '0.85rem' }}>Kredit (Kt)</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'right' }}>Məbləğ (₼)</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'right' }}>Sil</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(tr => (
                <tr key={tr.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontWeight: 700 }}>{tr.id}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{tr.date}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{tr.description}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>{tr.debit}</span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>{tr.credit}</span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 800, textAlign: 'right' }}>{tr.amount.toLocaleString('en-US')} ₼</td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <button onClick={() => handleDeleteTransaction(tr.id)} style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', padding: '0.4rem 0.6rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', transition: 'background 0.2s' }}>Sil</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. HESABLAR PLANI */}
      {activeTab === 'hesablar' && (
        <div className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Hesabın Şifri (Kodu)</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Hesabın Adı</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Bölməsi (Tipi)</th>
              </tr>
            </thead>
            <tbody>
              {CHART_OF_ACCOUNTS.map(acc => (
                <tr key={acc.code} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 800, fontSize: '1.1rem' }}>{acc.code}</td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>{acc.name}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{
                      padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 700,
                      backgroundColor: acc.type === 'Aktiv' ? 'rgba(59,130,246,0.1)' : 
                                       acc.type === 'Öhdəlik' ? 'rgba(239,68,68,0.1)' :
                                       acc.type === 'Kapital' ? 'rgba(168,85,247,0.1)' :
                                       acc.type === 'Gəlir' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                      color: acc.type === 'Aktiv' ? '#3b82f6' : 
                             acc.type === 'Öhdəlik' ? '#ef4444' :
                             acc.type === 'Kapital' ? '#a855f7' :
                             acc.type === 'Gəlir' ? '#10b981' : '#f59e0b'
                    }}>
                      {acc.type}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* YENİ ƏMƏLİYYAT MODALI */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
        }}>
          <div style={{ backgroundColor: 'var(--surface-color)', width: '100%', maxWidth: '600px', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>İkili Yazılış (Memorial Order)</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
              <div>
                <label style={labelStyle}>Tarix</label>
                <input type="date" value={newTr.date} onChange={e => setNewTr({...newTr, date: e.target.value})} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Məzmun (Təsərrüfat Əməliyyatının Detalı)</label>
                <input placeholder="Məs: Şagirddən aylıq ödəniş, və ya Ofis icarəsi ödənişi" value={newTr.description} onChange={e => setNewTr({...newTr, description: e.target.value})} style={inputStyle} />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{...labelStyle, color: '#3b82f6'}}>Debit (Dt)</label>
                  <select value={newTr.debit} onChange={e => setNewTr({...newTr, debit: e.target.value})} style={inputStyle}>
                    {CHART_OF_ACCOUNTS.map(acc => <option key={acc.code} value={acc.code}>{acc.code} - {acc.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{...labelStyle, color: '#ef4444'}}>Kredit (Kt)</label>
                  <select value={newTr.credit} onChange={e => setNewTr({...newTr, credit: e.target.value})} style={inputStyle}>
                    {CHART_OF_ACCOUNTS.map(acc => <option key={acc.code} value={acc.code}>{acc.code} - {acc.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Məbləğ (₼)</label>
                <input type="number" placeholder="Məs: 500" value={newTr.amount} onChange={e => setNewTr({...newTr, amount: e.target.value})} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: '0.85rem 1.5rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}>İmtina</button>
              <button onClick={handleAddTransaction} style={{ padding: '0.85rem 2rem', background: '#10b981', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}>Əməliyyatı İcra Et</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const tabStyle = (isActive: boolean) => ({
  padding: '0.75rem 1.5rem',
  background: 'none',
  border: 'none',
  borderBottom: isActive ? '3px solid var(--primary-color)' : '3px solid transparent',
  color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
  fontWeight: isActive ? 700 : 600,
  fontSize: '1rem',
  cursor: 'pointer',
  transition: 'all 0.2s'
});

const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' };
const inputStyle = {
  width: '100%', padding: '0.85rem 1rem', borderRadius: '10px',
  border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)',
  color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s',
};

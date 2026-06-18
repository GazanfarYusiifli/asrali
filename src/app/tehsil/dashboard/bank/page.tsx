'use client'

import { useState } from 'react';

type Transaction = {
  id: string;
  date: string;
  type: 'Mədaxil' | 'Məxaric' | 'Köçürmə';
  amount: number;
  account: string;
  description: string;
  createdAt?: string;
};

const INITIAL_TRANSACTIONS: Transaction[] = [
  { id: 'TRX-101', date: '2026-06-13 14:30', type: 'Mədaxil', amount: 1500, account: 'Kapital Bank (AZN)', description: 'Aylıq təhsil haqqı ödənişləri (Toplu)', createdAt: new Date().toISOString() },
  { id: 'TRX-102', date: '2026-06-12 09:15', type: 'Məxaric', amount: -400, account: 'Kassa (Nağd)', description: 'Təsərrüfat xərcləri və ofis ləvazimatları', createdAt: new Date().toISOString() },
  { id: 'TRX-103', date: '2026-06-10 16:45', type: 'Köçürmə', amount: 2000, account: 'ABB (USD)', description: 'Xaricdən gələn proqram təminatı ödənişi', createdAt: new Date().toISOString() },
  { id: 'TRX-104', date: '2026-06-08 11:20', type: 'Məxaric', amount: -3500, account: 'Kapital Bank (AZN)', description: 'Müəllimlərin əməkhaqqı (İyun ayı)', createdAt: new Date().toISOString() },
];

export default function BankPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Transaction>>({ type: 'Mədaxil', account: 'Kapital Bank (AZN)' });

  // Dinamik qalıq hesablamaları
  const calculateBalance = (accountName: string, initialBalance: number) => {
    return transactions.reduce((acc, trx) => {
      if (trx.account === accountName) {
        return acc + trx.amount;
      }
      return acc;
    }, initialBalance);
  };

  const kapitalBalance = calculateBalance('Kapital Bank (AZN)', 45000);
  const abbBalance = calculateBalance('ABB (USD)', 12500); // USD olaraq fərz edirik
  const kassaBalance = calculateBalance('Kassa (Nağd)', 4300);

  const totalBalanceAZN = kapitalBalance + kassaBalance + (abbBalance * 1.7); // Təxmini 1.7 məzənnə

  const formatNum = (num: number) => Number(num) === 0 ? '0,00' : Number(num).toFixed(2).replace('.', ',');

  const isEditable = (createdAt?: string) => {
    if (!createdAt) return true;
    const createdDate = new Date(createdAt).getTime();
    const now = new Date().getTime();
    const daysDiff = (now - createdDate) / (1000 * 60 * 60 * 24);
    return daysDiff <= 90;
  };

  const exportToExcel = () => {
    const headers = ["Tranzaksiya", "Tarix", "Növü", "Hesab", "Təyinat", "Məbləğ", "Əlavə edilmə tarixi"];
    const csvRows = [headers.join('\t')];
    
    transactions.forEach(trx => {
      const rowData = [
        trx.id, trx.date, trx.type, trx.account, trx.description,
        formatNum(trx.amount),
        trx.createdAt ? new Date(trx.createdAt).toLocaleDateString('az-AZ') : '-'
      ];
      csvRows.push(rowData.join('\t'));
    });

    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
    const blob = new Blob([bom, csvRows.join('\n')], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Bank_Xezine_Cixarisi_${new Date().toISOString().slice(0,10)}.xls`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleOpenModal = (defaultType: 'Mədaxil' | 'Məxaric' | 'Köçürmə') => {
    setIsEditing(false);
    setFormData({ type: defaultType, account: 'Kapital Bank (AZN)', amount: '', description: '' } as any);
    setIsModalOpen(true);
  };

  const handleEdit = (trx: Transaction) => {
    if (!isEditable(trx.createdAt)) {
      alert('Bu qeyd 1 rübdən (3 aydan) əvvəl əlavə edildiyi üçün düzəliş edilə bilməz.');
      return;
    }
    setIsEditing(true);
    setFormData({ ...trx, amount: Math.abs(trx.amount) } as any);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bu əməliyyatı silmək istədiyinizə əminsiniz?')) {
      setTransactions(transactions.filter(t => t.id !== id));
    }
  };

  const handleSaveTransaction = () => {
    if (!formData.amount || !formData.description) return alert('Məbləğ və təyinat mütləqdir!');
    
    let finalAmount = Number(formData.amount);
    if (formData.type === 'Məxaric' && finalAmount > 0) finalAmount = -finalAmount;
    if (formData.type === 'Mədaxil' && finalAmount < 0) finalAmount = Math.abs(finalAmount);
    // Köçürmə fərz edirik ki, məxaric kimi balansdan çıxır, ya da detallı köçürmə məntiqi yaza bilərik
    // Sadəcə göstərici olaraq qeyd edirik

    const newTrx: Transaction = {
      ...formData as any,
      id: isEditing ? formData.id! : `TRX-${Date.now().toString().slice(-4)}`,
      date: isEditing ? formData.date! : new Date().toLocaleString('az-AZ', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
      amount: finalAmount,
      account: formData.account || 'Kapital Bank (AZN)',
      createdAt: isEditing ? (formData.createdAt || new Date().toISOString()) : new Date().toISOString()
    };

    if (isEditing) {
      setTransactions(transactions.map(t => t.id === newTrx.id ? newTrx : t));
    } else {
      setTransactions([newTrx, ...transactions]);
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '0.25rem' }}>Bank və Xəzinə (Kassa)</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Maliyyə vəsaitlərinin hərəkəti və hesab qalıqları</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={exportToExcel} style={{ padding: '0.65rem 1.25rem', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
            Hesabat Çıxart
          </button>
          <button onClick={() => handleOpenModal('Köçürmə')} style={{ padding: '0.65rem 1.25rem', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
            🔄 Köçürmə Et
          </button>
          <button onClick={() => handleOpenModal('Məxaric')} style={{ padding: '0.65rem 1.25rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer' }}>
            - Pul Çıxar (Məxaric)
          </button>
          <button onClick={() => handleOpenModal('Mədaxil')} style={{ padding: '0.65rem 1.25rem', backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)' }}>
            + Pul Mədaxili
          </button>
        </div>
      </div>

      {/* BALANS KARTLARI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '20px', background: 'linear-gradient(135deg, #064e3b, #10b981)', color: 'white', gridColumn: 'span 1' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 500, opacity: 0.8, marginBottom: '0.5rem' }}>Ümumi Vəsait (Ekvivalent)</h3>
          <div style={{ fontSize: '3rem', fontWeight: 800 }}>{formatNum(totalBalanceAZN)} <span style={{fontSize: '1.5rem'}}>₼</span></div>
        </div>
        
        <AccountCard title="Kapital Bank" type="Cari Hesab" balance={`${formatNum(kapitalBalance)} ₼`} color="#3b82f6" logo="KB" />
        <AccountCard title="ABB" type="Xarici Valyuta" balance={`${formatNum(abbBalance)} $`} color="#f59e0b" logo="AB" />
        <AccountCard title="Kassa (Mərkəz)" type="Nağd Vəsait" balance={`${formatNum(kassaBalance)} ₼`} color="#10b981" logo="💰" />
      </div>

      {/* ƏMƏLİYYATLAR CƏDVƏLİ */}
      <div className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Son Əməliyyatlar (Tarixçə)</h3>
          <input type="text" placeholder="Axtarış..." style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', outline: 'none' }} />
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', tableLayout: 'auto' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Tranzaksiya / Tarix</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Növü</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Hesab</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Təyinat (Qeyd)</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'right' }}>Məbləğ</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center' }}>Əməliyyat</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((trx) => {
                const editable = isEditable(trx.createdAt);
                return (
                  <tr key={trx.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }} className="table-row-modern">
                    <td style={{ padding: '1.25rem 1.5rem', wordBreak: 'break-word' }}>
                      <div style={{ fontWeight: 700 }}>{trx.id}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{trx.date}</div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <span style={{ 
                        padding: '0.35rem 0.75rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 700,
                        backgroundColor: trx.type === 'Mədaxil' ? 'rgba(16, 185, 129, 0.1)' : trx.type === 'Məxaric' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                        color: trx.type === 'Mədaxil' ? '#10b981' : trx.type === 'Məxaric' ? '#ef4444' : '#3b82f6'
                      }}>
                        {trx.type}
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', fontWeight: 600, wordBreak: 'break-word' }}>{trx.account}</td>
                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', wordBreak: 'break-word', maxWidth: '300px' }}>{trx.description}</td>
                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right', fontWeight: 800, color: trx.amount > 0 ? '#10b981' : trx.amount < 0 ? '#ef4444' : 'var(--text-primary)', whiteSpace: 'nowrap' }}>
                      {trx.amount > 0 ? '+' : ''}{formatNum(trx.amount)} {trx.account.includes('USD') ? '$' : '₼'}
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center', flexWrap: 'nowrap' }}>
                        <button 
                          onClick={() => handleEdit(trx)} 
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
                        <button onClick={() => handleDelete(trx.id)} style={{ padding: '0.3rem 0.5rem', backgroundColor: '#ef4444', color: 'white', borderRadius: '4px', border: 'none', fontWeight: 600, fontSize: '0.65rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>Sil</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* YENİ / DÜZƏLİŞ ƏMƏLİYYAT MODALI */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
        }}>
          <div style={{ backgroundColor: 'var(--surface-color)', width: '100%', maxWidth: '450px', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>
              {isEditing ? 'Düzəliş Et' : `Yeni ${formData.type}`}
            </h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Əməliyyat Növü</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {['Mədaxil', 'Məxaric', 'Köçürmə'].map(t => (
                    <button key={t} onClick={() => setFormData({...formData, type: t as any})} style={{ 
                      flex: 1, padding: '0.75rem', borderRadius: '10px', fontWeight: 600, cursor: 'pointer',
                      border: '1px solid',
                      borderColor: formData.type === t ? 'var(--primary-color)' : 'var(--border-color)',
                      backgroundColor: formData.type === t ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-color)',
                      color: formData.type === t ? 'var(--primary-color)' : 'var(--text-secondary)',
                    }}>{t}</button>
                  ))}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Hesabı Seçin</label>
                <select value={formData.account} onChange={e => setFormData({...formData, account: e.target.value})} style={inputStyle}>
                  <option>Kapital Bank (AZN)</option>
                  <option>ABB (USD)</option>
                  <option>Kassa (Nağd)</option>
                </select>
              </div>

              <div>
                <label style={labelStyle}>Məbləğ</label>
                <input type="number" value={formData.amount || ''} onChange={e => setFormData({...formData, amount: e.target.value as any})} placeholder="Məs: 500" style={inputStyle} />
              </div>
              
              <div>
                <label style={labelStyle}>Təyinat / Qeyd</label>
                <input type="text" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Ödənişin məqsədi..." style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2.5rem' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: '0.85rem 1.5rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}>İmtina</button>
              <button onClick={handleSaveTransaction} style={{ padding: '0.85rem 2rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}>
                {isEditing ? 'Yadda Saxla' : 'Təsdiqlə'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .table-row-modern:hover { background-color: var(--bg-color); transition: 0.2s; }
      `}} />
    </div>
  );
}

function AccountCard({ title, type, balance, color, logo }: any) {
  return (
    <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: `${color}15`, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem' }}>
          {logo}
        </div>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', padding: '0.2rem 0.5rem', backgroundColor: 'var(--bg-color)', borderRadius: '6px' }}>{type}</span>
      </div>
      <div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>{title}</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{balance}</div>
      </div>
    </div>
  )
}

const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.9rem' };
const inputStyle = { width: '100%', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.95rem', outline: 'none' };

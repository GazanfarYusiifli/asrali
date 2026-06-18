'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';

// Mock Data for General Ledger Journal
const INITIAL_JOURNAL: any[] = [];

export default function GeneralLedgerPage() {
  
  const [journal, setJournal] = useState<any[]>(INITIAL_JOURNAL);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = getAppStorage('erp_journal');
    if (saved) {
      try { setJournal(JSON.parse(saved)); } catch(e){}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setAppStorage('erp_journal', JSON.stringify(journal));
    }
  }, [journal, isLoaded]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal State
  const [newEntry, setNewEntry] = useState({
    date: '',
    description: '',
    drAcc: '',
    crAcc: '',
    amount: ''
  });

  const handleSaveEntry = () => {
    if (!newEntry.description || !newEntry.drAcc || !newEntry.crAcc || !newEntry.amount) {
      alert("Zəhmət olmasa bütün sahələri doldurun.");
      return;
    }
    const trxNo = `TRX-${1000 + journal.length + 1}`;
    setJournal([{
      id: trxNo,
      date: newEntry.date || new Date().toLocaleString('az-AZ', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute:'2-digit' }),
      description: newEntry.description,
      drAcc: newEntry.drAcc,
      crAcc: newEntry.crAcc,
      amount: Number(newEntry.amount),
      user: 'Admin'
    }, ...journal]);
    setIsModalOpen(false);
    setNewEntry({ date: '', description: '', drAcc: '', crAcc: '', amount: '' });
  };

  const filteredJournal = journal.filter(trx => 
    trx.id.includes(searchTerm) || 
    trx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trx.drAcc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    trx.crAcc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatNum = (num: number) => Number(num).toFixed(2).replace('.', ',');

  const thStyle = { padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'rgba(0,0,0,0.02)' };
  const tdStyle = { padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border-color)' };

  return (
    <div style={{ maxWidth: '100%', overflowX: 'hidden', paddingBottom: '2rem' }}>
      
      {/* HEADER */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', 
        marginBottom: '2rem', padding: '1.5rem 2rem', borderRadius: '24px',
        background: 'linear-gradient(135deg, var(--bg-color) 0%, rgba(16, 185, 129, 0.03) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.1)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
      }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Baş Kitab (General Ledger)</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>Sistemdəki bütün əməliyyatların xronoloji "İkili Yazılış" jurnalı (Dr / Cr)</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input 
              type="text" 
              placeholder="Əməliyyat axtar..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '0.8rem 1.5rem 0.8rem 2.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)', outline: 'none', width: '250px', color: 'var(--text-primary)' }}
            />
          </div>
          <button onClick={() => setIsModalOpen(true)} style={{ padding: '0.8rem 1.5rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Yeni Əməliyyat (Dr/Cr)
          </button>
        </div>
      </div>

      {/* JOURNAL TABLE */}
      <div style={{ backgroundColor: 'var(--surface-color)', borderRadius: '24px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr>
              <th style={thStyle}>Trx No</th>
              <th style={thStyle}>Tarix / Vaxt</th>
              <th style={thStyle}>Açıqlama (Description)</th>
              <th style={thStyle}>Debit Hesabı (Dr)</th>
              <th style={thStyle}>Kredit Hesabı (Cr)</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Məbləğ (₼)</th>
              <th style={{ ...thStyle, textAlign: 'center' }}>İstifadəçi</th>
            </tr>
          </thead>
          <tbody>
            {filteredJournal.map((trx: any, index: number) => (
              <tr key={trx.id} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc', transition: 'all 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(16, 185, 129, 0.03)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8fafc'}>
                <td style={{ ...tdStyle, fontWeight: 800, color: '#10b981' }}>{trx.id}</td>
                <td style={{ ...tdStyle, fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{trx.date}</td>
                <td style={{ ...tdStyle, fontWeight: 700, color: 'var(--text-primary)' }}>{trx.description}</td>
                <td style={{ ...tdStyle }}>
                  <span style={{ display: 'inline-block', padding: '0.3rem 0.6rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem' }}>
                    Dr: {trx.drAcc}
                  </span>
                </td>
                <td style={{ ...tdStyle }}>
                  <span style={{ display: 'inline-block', padding: '0.3rem 0.6rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '6px', fontWeight: 700, fontSize: '0.85rem' }}>
                    Cr: {trx.crAcc}
                  </span>
                </td>
                <td style={{ ...tdStyle, textAlign: 'right', fontWeight: 800, fontSize: '1.05rem', color: '#1e293b' }}>{formatNum(trx.amount)}</td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '30px', height: '30px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: '#64748b', fontSize: '0.75rem', fontWeight: 700 }} title={trx.user}>
                    {trx.user.charAt(0)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' }}>
          <div style={{ backgroundColor: 'var(--surface-color)', padding: '2rem', borderRadius: '24px', width: '500px', maxWidth: '90%', boxShadow: '0 20px 40px rgba(0,0,0,0.2)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Yeni Jurnal Əməliyyatı</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Açıqlama (Description)</label>
                <input type="text" value={newEntry.description} onChange={e => setNewEntry({...newEntry, description: e.target.value})} style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} placeholder="Məs: Dərman alışı" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Debit (Dr)</label>
                  <select value={newEntry.drAcc} onChange={e => setNewEntry({...newEntry, drAcc: e.target.value})} style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}>
                    <option value="">Seçin...</option>
                    <option value="101 Kassa">101 Kassa</option>
                    <option value="102 Bank">102 Bank</option>
                    <option value="201 Debitorlar">201 Debitorlar</option>
                    <option value="205 Anbar">205 Anbar</option>
                    <option value="301 Kreditorlar">301 Kreditorlar</option>
                    <option value="331 Əməkhaqqı Borcları">331 Əməkhaqqı Borcları</option>
                    <option value="721 Əməkhaqqı Xərcləri">721 Əməkhaqqı Xərcləri</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Kredit (Cr)</label>
                  <select value={newEntry.crAcc} onChange={e => setNewEntry({...newEntry, crAcc: e.target.value})} style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}>
                    <option value="">Seçin...</option>
                    <option value="101 Kassa">101 Kassa</option>
                    <option value="102 Bank">102 Bank</option>
                    <option value="201 Debitorlar">201 Debitorlar</option>
                    <option value="301 Kreditorlar">301 Kreditorlar</option>
                    <option value="331 Əməkhaqqı Borcları">331 Əməkhaqqı Borcları</option>
                    <option value="401 Nizamnamə Kapitalı">401 Nizamnamə Kapitalı</option>
                    <option value="601 Gəlirlər">601 Gəlirlər</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Məbləğ (₼)</label>
                <input type="number" value={newEntry.amount} onChange={e => setNewEntry({...newEntry, amount: e.target.value})} style={{ width: '100%', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} placeholder="0.00" />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}>Ləğv et</button>
              <button onClick={handleSaveEntry} style={{ padding: '0.8rem 1.5rem', borderRadius: '12px', border: 'none', backgroundColor: '#10b981', color: 'white', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}>Əlavə et</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

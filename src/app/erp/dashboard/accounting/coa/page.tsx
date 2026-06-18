'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';

// Mock Data for Chart of Accounts
const INITIAL_COA: any[] = [];

export default function ChartOfAccountsPage() {
  
  const [accounts, setAccounts] = useState<any[]>(INITIAL_COA);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = getAppStorage('erp_accounts');
    if (saved) {
      try { setAccounts(JSON.parse(saved)); } catch(e){}
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      setAppStorage('erp_accounts', JSON.stringify(accounts));
    }
  }, [accounts, isLoaded]);

  const [searchTerm, setSearchTerm] = useState('');
  
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<any>(null);

  const [newAcc, setNewAcc] = useState({ id: '', name: '', type: 'Aktiv', balance: '' });

  const handleAddAccount = () => {
    if (!newAcc.id || !newAcc.name) {
      alert("Zəhmət olmasa Hesab No və Adı doldurun.");
      return;
    }
    setAccounts([...accounts, { ...newAcc, balance: Number(newAcc.balance) || 0 }]);
    setIsNewModalOpen(false);
    setNewAcc({ id: '', name: '', type: 'Aktiv', balance: '' });
  };

  const handleViewDetail = (acc: any) => {
    setSelectedAccount(acc);
    setIsDetailModalOpen(true);
  };

  const filteredAccounts = accounts.filter(acc => 
    acc.id.includes(searchTerm) || acc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatNum = (num: number) => Number(num).toFixed(2).replace('.', ',');

  // Group accounts by Type
  const groupedAccounts = filteredAccounts.reduce((acc, curr) => {
    if (!acc[curr.type]) acc[curr.type] = [];
    acc[curr.type].push(curr);
    return acc;
  }, {} as Record<string, typeof INITIAL_COA>);

  
  const totalAktiv = accounts.filter(a => a.type === 'Aktiv').reduce((sum, a) => sum + (Number(a.balance) || 0), 0);
  const totalPassiv = accounts.filter(a => a.type === 'Passiv').reduce((sum, a) => sum + (Number(a.balance) || 0), 0);
  const totalKapital = accounts.filter(a => a.type === 'Kapital').reduce((sum, a) => sum + (Number(a.balance) || 0), 0);
  const totalGelir = accounts.filter(a => a.type === 'Gəlir').reduce((sum, a) => sum + (Number(a.balance) || 0), 0);
  const totalXerc = accounts.filter(a => a.type === 'Xərc').reduce((sum, a) => sum + (Number(a.balance) || 0), 0);

  const totalPassivKapital = totalPassiv + totalKapital + (totalGelir - totalXerc);
  const balanceDiff = Math.abs(totalAktiv - totalPassivKapital);

  return (
    <div style={{ maxWidth: '100%', overflowX: 'hidden', paddingBottom: '2rem' }}>
      
      {/* HEADER */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', 
        marginBottom: '2rem', padding: '1.5rem 2rem', borderRadius: '24px',
        background: 'linear-gradient(135deg, var(--bg-color) 0%, rgba(59, 130, 246, 0.03) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.1)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.02)'
      }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1px', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>Hesablar Planı (CoA)</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>Bütün aktiv, passiv, gəlir və xərc hesablarının strukturu</p>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative' }}>
            <svg style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input 
              type="text" 
              placeholder="Hesab axtar (No və ya Ad)..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '0.8rem 1.5rem 0.8rem 2.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--surface-color)', outline: 'none', width: '300px', color: 'var(--text-primary)' }}
            />
          </div>
          <button onClick={() => setIsNewModalOpen(true)} style={{ padding: '0.8rem 1.5rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Yeni Hesab
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* LEDGER SHORTCUT */}
        <div style={{ flex: '0 0 280px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ padding: '1.5rem', borderRadius: '20px', backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.02)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', marginBottom: '1rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Baş Kitab (Jurnal)</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              Sistemdəki bütün əməliyyatların Debit / Kredit ikili yazılış tarixçəsi.
            </p>
            <Link href="/erp/dashboard/accounting/ledger" style={{ display: 'block', textAlign: 'center', padding: '0.8rem', backgroundColor: '#f1f5f9', color: '#0f172a', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, transition: '0.2s' }}>
              Jurnala Keçid →
            </Link>
          </div>
          
          <div style={{ padding: '1.5rem', borderRadius: '20px', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>Mühasibat Balansı</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Aktivlər:</span>
              <span style={{ fontWeight: 700 }}>{formatNum(totalAktiv)} ₼</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>Passivlər + Kapital:</span>
              <span style={{ fontWeight: 700 }}>{formatNum(totalPassivKapital)} ₼</span>
            </div>
            {balanceDiff > 0.01 ? (
              <div style={{ fontSize: '0.75rem', color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.2)', padding: '0.5rem', borderRadius: '8px', textAlign: 'center' }}>
                ⚠️ Balans fərqi: {formatNum(balanceDiff)} ₼ (Uyğunsuzluq)
              </div>
            ) : (
               <div style={{ fontSize: '0.75rem', color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.2)', padding: '0.5rem', borderRadius: '8px', textAlign: 'center' }}>
                ✅ Balans tam uyğundur
              </div>
            )}
          </div>
        </div>

        {/* COA LIST */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {['Aktiv', 'Passiv', 'Kapital', 'Gəlir', 'Xərc'].map(type => {
            const typeAccounts = groupedAccounts[type];
            if (!typeAccounts || typeAccounts.length === 0) return null;
            
            let color = '#3b82f6';
            if (type === 'Aktiv') color = '#10b981';
            if (type === 'Passiv') color = '#ef4444';
            if (type === 'Kapital') color = '#8b5cf6';
            if (type === 'Gəlir') color = '#0ea5e9';
            if (type === 'Xərc') color = '#f59e0b';

            return (
              <div key={type} style={{ backgroundColor: 'var(--surface-color)', borderRadius: '24px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.02)' }}>
                <div style={{ padding: '1.25rem 1.5rem', backgroundColor: `rgba(${color === '#10b981' ? '16, 185, 129' : color === '#ef4444' ? '239, 68, 68' : color === '#8b5cf6' ? '139, 92, 246' : color === '#0ea5e9' ? '14, 165, 233' : '245, 158, 11'}, 0.05)`, borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', backgroundColor: color, boxShadow: `0 0 10px ${color}` }}></div>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{type} Hesabları</h2>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', width: '100px', backgroundColor: 'rgba(0,0,0,0.02)' }}>Hesab No</th>
                      <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', backgroundColor: 'rgba(0,0,0,0.02)' }}>Hesab Adı</th>
                      <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textAlign: 'right', backgroundColor: 'rgba(0,0,0,0.02)' }}>Cari Qalıq (Balance)</th>
                      <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textAlign: 'center', width: '120px', backgroundColor: 'rgba(0,0,0,0.02)' }}>Əməliyyat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {typeAccounts.map((acc: any, index: number) => (
                      <tr key={acc.id} className="table-row-modern" style={{ borderBottom: index === typeAccounts.length - 1 ? 'none' : '1px solid var(--border-color)', transition: 'all 0.2s ease', backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.02)'} onMouseLeave={e => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f8fafc'}>
                        <td style={{ padding: '1.25rem 1.5rem', fontWeight: 800, color, fontSize: '1.1rem' }}>{acc.id}</td>
                        <td style={{ padding: '1.25rem 1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>{acc.name}</td>
                        <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right', fontWeight: 800, fontSize: '1.15rem', color: 'var(--text-primary)' }}>{formatNum(acc.balance)} ₼</td>
                        <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                          <button onClick={() => handleViewDetail(acc)} style={{ padding: '0.5rem 1rem', borderRadius: '10px', backgroundColor: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.2s', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }} onMouseEnter={e => {e.currentTarget.style.backgroundColor = 'var(--bg-color)'; e.currentTarget.style.color = 'var(--text-primary)'}} onMouseLeave={e => {e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'}}>Detallar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>

      </div>

      {/* NEW ACCOUNT MODAL */}
      {isNewModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
          <div style={{ backgroundColor: '#ffffff', padding: '2.5rem', borderRadius: '24px', width: '500px', maxWidth: '95%', boxShadow: '0 25px 50px rgba(0,0,0,0.15)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '16px', backgroundColor: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
              </div>
              <div>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.5px' }}>Yeni Hesab Yarat</h2>
                <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>Sistemə yeni uçot hesabı əlavə edin</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.25rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem' }}>Hesab No *</label>
                  <input type="text" value={newAcc.id} onChange={e => setNewAcc({...newAcc, id: e.target.value})} style={{ width: '100%', padding: '0.9rem 1.2rem', borderRadius: '14px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 600, outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => e.currentTarget.style.borderColor = '#10b981'} onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'} placeholder="Məs: 105" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem' }}>Hesab Tipi *</label>
                  <select value={newAcc.type} onChange={e => setNewAcc({...newAcc, type: e.target.value})} style={{ width: '100%', padding: '0.9rem 1.2rem', borderRadius: '14px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 600, outline: 'none', cursor: 'pointer', transition: 'border-color 0.2s' }} onFocus={e => e.currentTarget.style.borderColor = '#10b981'} onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'}>
                    <option value="Aktiv">Aktiv</option>
                    <option value="Passiv">Passiv</option>
                    <option value="Kapital">Kapital</option>
                    <option value="Gəlir">Gəlir</option>
                    <option value="Xərc">Xərc</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem' }}>Hesabın Adı *</label>
                <input type="text" value={newAcc.name} onChange={e => setNewAcc({...newAcc, name: e.target.value})} style={{ width: '100%', padding: '0.9rem 1.2rem', borderRadius: '14px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 600, outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => e.currentTarget.style.borderColor = '#10b981'} onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'} placeholder="Məs: Xarici Valyuta Hesabı" />
              </div>
              <div style={{ position: 'relative' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem' }}>İlkin Qalıq (Məbləğ)</label>
                <input type="number" value={newAcc.balance} onChange={e => setNewAcc({...newAcc, balance: e.target.value})} style={{ width: '100%', padding: '0.9rem 1.2rem 0.9rem 2.5rem', borderRadius: '14px', border: '2px solid #e2e8f0', backgroundColor: '#f8fafc', color: '#0f172a', fontWeight: 700, fontSize: '1.1rem', outline: 'none', transition: 'border-color 0.2s' }} onFocus={e => e.currentTarget.style.borderColor = '#10b981'} onBlur={e => e.currentTarget.style.borderColor = '#e2e8f0'} placeholder="0.00" />
                <span style={{ position: 'absolute', left: '1.2rem', top: '2.5rem', color: '#94a3b8', fontWeight: 800, fontSize: '1.1rem' }}>₼</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2.5rem' }}>
              <button onClick={() => setIsNewModalOpen(false)} style={{ padding: '0.9rem 1.5rem', borderRadius: '14px', border: '2px solid #e2e8f0', backgroundColor: 'transparent', color: '#64748b', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}>Ləğv et</button>
              <button onClick={handleAddAccount} style={{ padding: '0.9rem 2rem', borderRadius: '14px', border: 'none', backgroundColor: '#10b981', color: 'white', fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>Yadda saxla</button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {isDetailModalOpen && selectedAccount && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
          <div style={{ backgroundColor: '#ffffff', padding: '2.5rem', borderRadius: '28px', width: '550px', maxWidth: '95%', boxShadow: '0 25px 60px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '6px', background: 'linear-gradient(90deg, #10b981, #3b82f6)' }}></div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <div style={{ backgroundColor: '#f1f5f9', padding: '0.3rem 0.6rem', borderRadius: '6px', color: '#475569', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '1px' }}>HESAB NO: {selectedAccount.id}</div>
                  <div style={{ padding: '0.3rem 0.8rem', borderRadius: '6px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', fontSize: '0.8rem', fontWeight: 800 }}>{selectedAccount.type}</div>
                </div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.5px', lineHeight: 1.2 }}>{selectedAccount.name}</h2>
              </div>
              <button onClick={() => setIsDetailModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '0.5rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '1.2rem', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Status</div>
                <div style={{ color: '#10b981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.1rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981' }}></div>
                  Aktiv (Açıq)
                </div>
              </div>
              <div style={{ padding: '1.2rem', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>Son Əməliyyat</div>
                <div style={{ color: '#0f172a', fontWeight: 800, fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Bu gün, 14:30
                </div>
              </div>
            </div>

            <div style={{ padding: '2rem', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem', boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)' }}>
              <div style={{ color: '#475569', fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Cari Yekun Qalıq</div>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-1px' }}>{formatNum(selectedAccount.balance)} <span style={{ color: '#10b981' }}>₼</span></div>
              <div style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: 700, marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                Bu ay +12% artım
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button style={{ padding: '0.9rem 1.5rem', borderRadius: '14px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#0f172a', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                Çıxarış (Statement)
              </button>
              <button onClick={() => setIsDetailModalOpen(false)} style={{ padding: '0.9rem 2.5rem', borderRadius: '14px', border: 'none', backgroundColor: '#0f172a', color: 'white', fontWeight: 800, cursor: 'pointer', boxShadow: '0 10px 25px rgba(15, 23, 42, 0.3)', transition: 'transform 0.2s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>Bağla</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

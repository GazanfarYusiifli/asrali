'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ArrowDownRight, ArrowUpRight, Wallet, Search, Calendar, FileText, Edit, Trash2, X, Plus, ChevronDown, List, TrendingUp, TrendingDown, RefreshCw, BarChart2, CheckSquare, Link as LinkIcon } from 'lucide-react';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';

export default function FinansDetayPage() {
  const params = useParams();
  const typeParam = params.type as string; // 'kassa', 'banka', 'kredi_karti', 'pos'
  
  const [transactions, setTransactions] = useState<any[]>([]);
  const [stats, setStats] = useState({
    gunlukGiris: 0,
    gunlukCikis: 0,
    toplamDurum: 0
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [editingTx, setEditingTx] = useState<any>(null);
  
  // New Tx Dropdown & Modal State
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [newTxType, setNewTxType] = useState<string | null>(null); // 'giris', 'cikis', 'transfer', 'bakiye'
  const [sortOrder, setSortOrder] = useState<'desc'|'asc'>('desc');
  const [newTxData, setNewTxData] = useState({
    aciklama: '', miktar: '', tarih: new Date().toISOString().split('T')[0], kdv: '0', kassaAdi: '', kategori: '', aliciHesap: '', islemYonu: 'out'
  });

  const [allHesablar, setAllHesablar] = useState<any[]>([]);
  const [currentAccountNames, setCurrentAccountNames] = useState<string[]>([]);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [newAccountData, setNewAccountData] = useState({ ad: '', valyuta: 'AZN', mebleg: '0' });
  const [isBankIntegrationModalOpen, setIsBankIntegrationModalOpen] = useState(false);

  const typeLabels: any = {
    'kassa': 'Kassa',
    'banka': 'Banka',
    'kredi_karti': 'Kredit Kartı',
    'pos': 'POS Hesabı'
  };

  const pageTitle = `${typeLabels[typeParam] || 'Hesab'} Əməliyyatları`;

  useEffect(() => {
    const loadedHesablar = JSON.parse(getAppStorage('erp_hesablar') || '[]');
    setAllHesablar(loadedHesablar);

    // Find account names that match this type
    const matchingAccountNames = loadedHesablar.filter((h: any) => h.type === typeParam).map((h: any) => h.ad);
    
    // Also include 'Ana Kassa' if we are looking at kassa type
    if (typeParam === 'kassa') {
      matchingAccountNames.push('Ana Kassa');
    }

    setCurrentAccountNames(matchingAccountNames);

    const allTx = JSON.parse(getAppStorage('erp_finans_islemleri') || '[]');
    
    // Filter tx that belong to these accounts
    const filteredTx = allTx.filter((t: any) => matchingAccountNames.includes(t.kassaAdi));
    
    // Calculate stats before sorting
    let tGiris = 0;
    let tCikis = 0;
    filteredTx.forEach((t: any) => {
      const val = Number(t.miktar) || 0;
      if (t.tur === 'Gəlir') tGiris += val;
      if (t.tur === 'Xərc' || t.tur === 'Para Çıkışı') tCikis += val;
    });
    setStats({ gunlukGiris: tGiris, gunlukCikis: tCikis, toplamDurum: tGiris - tCikis });
    
    // Sort
    filteredTx.sort((a: any, b: any) => {
      const timeDiff = new Date(b.tarih).getTime() - new Date(a.tarih).getTime();
      return sortOrder === 'desc' ? timeDiff : -timeDiff;
    });
    
    setTransactions(filteredTx);

    // Calculate stats
    const todayStr = new Date().toISOString().split('T')[0];
    let gunlukGiris = 0;
    let gunlukCikis = 0;
    let toplamDurum = 0;

    filteredTx.forEach((t: any) => {
      const val = Number(t.miktar) || 0;
      if (t.tur === 'Gəlir') {
        toplamDurum += val;
        if (t.tarih === todayStr) gunlukGiris += val;
      } else {
        toplamDurum -= val;
        if (t.tarih === todayStr) gunlukCikis += val;
      }
    });

    setStats({ gunlukGiris, gunlukCikis, toplamDurum });
  }, [typeParam, editingTx]); // Re-run when editingTx becomes null after save/delete

  const handleDelete = (id: string) => {
    if (confirm('Bu əməliyyatı silmək istədiyinizə əminsiniz?')) {
      const allTx = JSON.parse(getAppStorage('erp_finans_islemleri') || '[]');
      const updated = allTx.filter((t: any) => t.id !== id);
      setAppStorage('erp_finans_islemleri', JSON.stringify(updated));
      setEditingTx(null); // trigger useEffect
      window.location.reload(); // simple reload to update stats cleanly
    }
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    const allTx = JSON.parse(getAppStorage('erp_finans_islemleri') || '[]');
    const index = allTx.findIndex((t: any) => t.id === editingTx.id);
    if (index > -1) {
      allTx[index] = editingTx;
      setAppStorage('erp_finans_islemleri', JSON.stringify(allTx));
    }
    setEditingTx(null);
    window.location.reload();
  };

  const handleNewTxSave = (e: React.FormEvent) => {
    e.preventDefault();
    const allTx = JSON.parse(getAppStorage('erp_finans_islemleri') || '[]');
    
    if (newTxType === 'transfer') {
      const currentHesap = newTxData.kassaAdi || (currentAccountNames.length > 0 ? currentAccountNames[0] : typeLabels[typeParam]);
      const otherHesap = newTxData.aliciHesap;

      const fromHesap = newTxData.islemYonu === 'in' ? otherHesap : currentHesap;
      const toHesap = newTxData.islemYonu === 'in' ? currentHesap : otherHesap;

      // Xərc from source account
      allTx.push({
        id: Date.now().toString() + '_out',
        kassaAdi: fromHesap,
        tarih: newTxData.tarih,
        tur: 'Xərc',
        kayitTur: 'Transfer Çıxış',
        kdv: '0',
        miktar: newTxData.miktar,
        parabirimi: 'AZN', 
        aciklama: `Transfer: -> ${toHesap} (${newTxData.aciklama})`,
        isleyiYapan: 'Sistem'
      });

      // Gəlir to target account
      allTx.push({
        id: Date.now().toString() + '_in',
        kassaAdi: toHesap,
        tarih: newTxData.tarih,
        tur: 'Gəlir',
        kayitTur: 'Transfer Mədaxil',
        kdv: '0',
        miktar: newTxData.miktar,
        parabirimi: 'AZN', 
        aciklama: `Transfer: <- ${fromHesap} (${newTxData.aciklama})`,
        isleyiYapan: 'Sistem'
      });

    } else {
      let tur = 'Gəlir';
      let kayitTur = newTxType === 'bakiye' ? 'Bakiye Düzeltme' : newTxType === 'cikis' ? 'Xərc' : 'Mədaxil';
      if (newTxType === 'cikis') tur = 'Xərc';

      const targetKassa = newTxData.kassaAdi || (currentAccountNames.length > 0 ? currentAccountNames[0] : typeLabels[typeParam]);

      allTx.push({
        id: Date.now().toString(),
        kassaAdi: targetKassa,
        tarih: newTxData.tarih,
        tur: tur,
        kayitTur: newTxData.kategori || kayitTur,
        kdv: newTxData.kdv,
        miktar: newTxData.miktar,
        parabirimi: 'AZN', // default
        aciklama: newTxData.aciklama,
        isleyiYapan: 'Sistem'
      });
    }

    setAppStorage('erp_finans_islemleri', JSON.stringify(allTx));
    setNewTxType(null);
    window.location.reload();
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccountData.ad) return;
    
    const loaded = JSON.parse(getAppStorage('erp_hesablar') || '[]');
    const newHesab = { id: Date.now().toString(), type: typeParam, ...newAccountData };
    loaded.push(newHesab);
    setAppStorage('erp_hesablar', JSON.stringify(loaded));

    const islemData = JSON.parse(getAppStorage('erp_finans_islemleri') || '[]');
    if (Number(newAccountData.mebleg) > 0) {
      islemData.push({
        id: Date.now().toString() + '_devir',
        kassaAdi: newAccountData.ad,
        tarih: new Date().toISOString().split('T')[0],
        tur: 'Gəlir',
        kayitTur: 'Devir (Başlanğıc)',
        kdv: '0',
        miktar: newAccountData.mebleg,
        parabirimi: newAccountData.valyuta,
        aciklama: `${newAccountData.ad} Başlanğıc Balansı`,
        isleyiYapan: 'Admin'
      });
      setAppStorage('erp_finans_islemleri', JSON.stringify(islemData));
    }
    
    setAllHesablar(loaded);
    const newMatching = loaded.filter((h: any) => h.type === typeParam).map((h: any) => h.ad);
    setCurrentAccountNames(newMatching);
    setIsCreatingAccount(false);
    setNewAccountData({ ad: '', valyuta: 'AZN', mebleg: '0' });
    setNewTxData({...newTxData, kassaAdi: newAccountData.ad});
  };

  // Apply filters
  const displayedTx = transactions.filter(t => {
    let matchesSearch = true;
    if (searchTerm) {
      matchesSearch = t.aciklama.toLowerCase().includes(searchTerm.toLowerCase()) || 
                      t.kassaAdi.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    let matchesStart = true;
    if (startDate) {
      matchesStart = new Date(t.tarih) >= new Date(startDate);
    }
    
    let matchesEnd = true;
    if (endDate) {
      matchesEnd = new Date(t.tarih) <= new Date(endDate);
    }

    return matchesSearch && matchesStart && matchesEnd;
  });

  return (
    <div style={{ padding: '2rem', height: '100%', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#e0f2fe', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Wallet size={32} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: '#0f172a', margin: 0, fontWeight: 900, letterSpacing: '-0.5px' }}>
              {pageTitle}
            </h1>
            <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '1rem' }}>Sistemdəki bütün {typeLabels[typeParam]} hesablarınızın hərəkət tarixçəsi</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '0.8rem', position: 'relative' }}>
          {typeParam === 'banka' && (
            <button onClick={() => setIsBankIntegrationModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', backgroundColor: 'transparent', color: '#0ea5e9', border: '1px solid #0ea5e9', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseOver={e=>e.currentTarget.style.backgroundColor='#e0f2fe'} onMouseOut={e=>e.currentTarget.style.backgroundColor='transparent'}>
              <LinkIcon size={20}/> Bank İnteqrasiyası Əlavə Et
            </button>
          )}
          <button onClick={() => setIsActionsOpen(!isActionsOpen)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', backgroundColor: '#0ea5e9', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(14, 165, 233, 0.39)' }}>
            <Plus size={20}/> Yeni İşlem Ekle <ChevronDown size={16}/>
          </button>
          {isActionsOpen && (
            <div style={{ position: 'absolute', top: '110%', right: 0, backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', width: '280px', zIndex: 50, padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              <button onClick={() => {setNewTxType('giris'); setIsActionsOpen(false);}} style={dropdownBtnStyle}><TrendingUp size={16} color="#10b981"/> Para Girişi</button>
              <button onClick={() => {setNewTxType('cikis'); setIsActionsOpen(false);}} style={dropdownBtnStyle}><TrendingDown size={16} color="#ef4444"/> Para Çıkışı</button>
              <button onClick={() => {setNewTxType('transfer'); setIsActionsOpen(false);}} style={dropdownBtnStyle}><RefreshCw size={16} color="#3b82f6"/> Hesaplar Arası Transfer</button>
              <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0.5rem 0' }}/>
              <button onClick={() => { setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc'); setIsActionsOpen(false); }} style={dropdownBtnStyle}><List size={16} color="#64748b"/> Kayıt Sırasına Göre Sırala</button>
              <button style={dropdownBtnStyle}><BarChart2 size={16} color="#8b5cf6"/> Gelişmiş Raporlama</button>
              <button style={dropdownBtnStyle}><CheckSquare size={16} color="#f59e0b"/> Günlük Kasa</button>
              <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0.5rem 0' }}/>
              <button onClick={() => {setNewTxType('bakiye'); setIsActionsOpen(false);}} style={dropdownBtnStyle}><Wallet size={16} color="#0f172a"/> Bakiye Düzelt</button>
            </div>
          )}
        </div>
      </div>

      {/* Summary Widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        
        <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444', fontWeight: 700, fontSize: '0.9rem' }}>
            <div style={{ padding: '6px', backgroundColor: '#fee2e2', borderRadius: '8px' }}><ArrowUpRight size={16}/></div>
            GÜNLÜK ÇIKIŞ (XƏRC)
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a' }}>
            {stats.gunlukCikis.toLocaleString('az-AZ', {minimumFractionDigits: 2})} <span style={{fontSize: '1rem', color: '#94a3b8'}}>₼</span>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 700, fontSize: '0.9rem' }}>
            <div style={{ padding: '6px', backgroundColor: '#dcfce7', borderRadius: '8px' }}><ArrowDownRight size={16}/></div>
            GÜNLÜK GİRİŞ (MƏDAXİL)
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a' }}>
            {stats.gunlukGiris.toLocaleString('az-AZ', {minimumFractionDigits: 2})} <span style={{fontSize: '1rem', color: '#94a3b8'}}>₼</span>
          </div>
        </div>

        <div style={{ backgroundColor: '#0ea5e9', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 10px 15px -3px rgba(14,165,233,0.3)', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.9rem', color: '#e0f2fe' }}>
            <Wallet size={20}/>
            {typeLabels[typeParam]?.toUpperCase()} DURUMU (BAKİYE)
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900 }}>
            {stats.toplamDurum.toLocaleString('az-AZ', {minimumFractionDigits: 2})} <span style={{fontSize: '1rem', color: '#bae6fd'}}>₼</span>
          </div>
        </div>

      </div>

      {/* Toolbar / Filters */}
      <div style={{ display: 'flex', gap: '1rem', backgroundColor: 'white', padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Açıqlama və ya Hesab Adı ilə Ara..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem' }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Başlangıç:</span>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem', color: '#334155' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Bitiş:</span>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem', color: '#334155' }} />
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ overflowX: 'auto', flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead style={{ backgroundColor: '#f8fafc', position: 'sticky', top: 0, zIndex: 1, borderBottom: '2px solid #e2e8f0' }}>
              <tr>
                <th style={thStyle}>Açıklama</th>
                <th style={thStyle}>Tarih</th>
                <th style={thStyle}>Hesab / İşlem No</th>
                <th style={thStyle}>İşlemi Yapan</th>
                <th style={{...thStyle, textAlign: 'right'}}>Miktar</th>
                <th style={{...thStyle, textAlign: 'right', width: '100px'}}>Əməliyyat</th>
              </tr>
            </thead>
            <tbody>
              {displayedTx.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '4rem 2rem', color: '#94a3b8', fontWeight: 600, fontStyle: 'italic' }}>
                  <FileText size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto', display: 'block' }} />
                  Bu aralığa uyğun əməliyyat tapılmadı.
                </td></tr>
              ) : displayedTx.map((t, idx) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background-color 0.2s' }} onMouseOver={e=>e.currentTarget.style.backgroundColor='#f8fafc'} onMouseOut={e=>e.currentTarget.style.backgroundColor='white'}>
                  <td style={{...tdStyle, fontWeight: 600, color: '#334155'}}>{t.aciklama}</td>
                  <td style={tdStyle}>{new Date(t.tarih).toLocaleDateString('az-AZ')}</td>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 700, color: '#0ea5e9' }}>{t.kassaAdi}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>#{t.id}</div>
                  </td>
                  <td style={{...tdStyle, color: '#64748b'}}>{t.isleyiYapan}</td>
                  <td style={{...tdStyle, textAlign: 'right', fontWeight: 800, color: t.tur === 'Gəlir' ? '#10b981' : '#ef4444', fontSize: '1rem'}}>
                    {t.tur === 'Gəlir' ? '+' : '-'}{Number(t.miktar).toLocaleString('az-AZ', {minimumFractionDigits: 2})} {t.parabirimi}
                  </td>
                  <td style={{...tdStyle, textAlign: 'right', display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center'}}>
                    <button onClick={() => setEditingTx(t)} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: 'none', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '0.4rem 0.8rem', cursor: 'pointer', color: '#3b82f6', fontSize: '0.8rem', fontWeight: 700 }} title="Düzenle"><Edit size={14}/> Düzenle</button>
                    <button onClick={() => handleDelete(t.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', background: '#fee2e2', border: 'none', borderRadius: '6px', padding: '0.4rem 0.8rem', cursor: 'pointer', color: '#ef4444', fontSize: '0.8rem', fontWeight: 700 }} title="Tamamen SİL"><Trash2 size={14}/> Tamamen SİL</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingTx && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(4px)', padding: '2rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', width: '100%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
            
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
              <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.25rem', fontWeight: 800 }}>Əməliyyata Düzəliş Et</h2>
              <button type="button" onClick={() => setEditingTx(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="#64748b"/></button>
            </div>

            <form onSubmit={handleEditSave} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Tarix (Tarih)</label>
                  <input type="date" value={editingTx.tarih} onChange={e => setEditingTx({...editingTx, tarih: e.target.value})} required style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', width: '100%', fontSize: '0.95rem' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Kateqoriya (Kategori)</label>
                  <input type="text" value={editingTx.kayitTur || editingTx.kategori || ''} onChange={e => setEditingTx({...editingTx, kayitTur: e.target.value, kategori: e.target.value})} style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', width: '100%', fontSize: '0.95rem' }} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Açıqlama</label>
                <input type="text" value={editingTx.aciklama} onChange={e => setEditingTx({...editingTx, aciklama: e.target.value})} required style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', width: '100%', fontSize: '0.95rem' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>ƏDV (KDV %)</label>
                  <input type="number" value={editingTx.kdv || '0'} onChange={e => setEditingTx({...editingTx, kdv: e.target.value})} style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', width: '100%', fontSize: '0.95rem' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Məbləğ (Miktar)</label>
                  <input type="number" step="any" value={editingTx.miktar} onChange={e => setEditingTx({...editingTx, miktar: e.target.value})} required style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', width: '100%', fontSize: '0.95rem', fontWeight: 800, color: '#0ea5e9' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setEditingTx(null)} style={{ flex: 1, padding: '1rem', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '12px', color: '#475569', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>İmtina</button>
                <button type="submit" style={{ flex: 2, padding: '1rem', backgroundColor: '#0ea5e9', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>Yadda Saxla</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Tx Modal */}
      {newTxType && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(4px)', padding: '2rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', width: '100%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
            
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
              <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.25rem', fontWeight: 800 }}>
                {newTxType === 'giris' ? 'Para Girişi Ekle' : newTxType === 'cikis' ? 'Para Çıkışı Ekle' : newTxType === 'transfer' ? 'Hesaplar Arası Transfer' : 'Bakiye Düzelt'}
              </h2>
              <button type="button" onClick={() => setNewTxType(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="#64748b"/></button>
            </div>

            <form onSubmit={handleNewTxSave} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {newTxType === 'transfer' ? (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Cari Hesab ({typeLabels[typeParam]})</label>
                      <select value={newTxData.kassaAdi} onChange={e => setNewTxData({...newTxData, kassaAdi: e.target.value})} required style={inputStyle}>
                        <option value="">Hesab seçin...</option>
                        {allHesablar.filter(h => h.type === typeParam).map((h: any) => (
                          <option key={h.id} value={h.ad}>{h.ad}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>İşlem Yönü</label>
                      <select value={newTxData.islemYonu} onChange={e => setNewTxData({...newTxData, islemYonu: e.target.value})} style={inputStyle}>
                        <option value="out">Bu Hesaptan Başka Hesaba</option>
                        <option value="in">Başka Hesaptan Bu Hesaba</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>
                      {newTxData.islemYonu === 'in' ? 'Gönderen Hesap' : 'Alıcı Hesap'}
                    </label>
                    <select value={newTxData.aliciHesap} onChange={e => setNewTxData({...newTxData, aliciHesap: e.target.value})} required style={inputStyle}>
                      <option value="">Hesab seçin...</option>
                      {allHesablar.filter(h => h.type === 'kassa').length > 0 && (
                        <optgroup label="KASSALAR">
                          {allHesablar.filter(h => h.type === 'kassa').map((h: any) => <option key={h.id} value={h.ad}>{h.ad}</option>)}
                        </optgroup>
                      )}
                      {allHesablar.filter(h => h.type === 'banka').length > 0 && (
                        <optgroup label="BANKALAR">
                          {allHesablar.filter(h => h.type === 'banka').map((h: any) => <option key={h.id} value={h.ad}>{h.ad}</option>)}
                        </optgroup>
                      )}
                      {allHesablar.filter(h => h.type === 'kredi_karti').length > 0 && (
                        <optgroup label="KREDİT KARTLARI">
                          {allHesablar.filter(h => h.type === 'kredi_karti').map((h: any) => <option key={h.id} value={h.ad}>{h.ad}</option>)}
                        </optgroup>
                      )}
                      {allHesablar.filter(h => h.type === 'pos').length > 0 && (
                        <optgroup label="POS HESABLARI">
                          {allHesablar.filter(h => h.type === 'pos').map((h: any) => <option key={h.id} value={h.ad}>{h.ad}</option>)}
                        </optgroup>
                      )}
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Açıklama</label>
                      <input type="text" value={newTxData.aciklama} onChange={e => setNewTxData({...newTxData, aciklama: e.target.value})} required style={inputStyle} placeholder="Məs: Transfer qeydi" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Miktar (TL)</label>
                      <input type="number" step="any" value={newTxData.miktar} onChange={e => setNewTxData({...newTxData, miktar: e.target.value})} required style={{ ...inputStyle, fontWeight: 800, color: '#0ea5e9' }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Tarih</label>
                    <input type="date" value={newTxData.tarih} onChange={e => setNewTxData({...newTxData, tarih: e.target.value})} required style={inputStyle} />
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Hansı Hesab üçün?</label>
                      {!isCreatingAccount && (
                        <button type="button" onClick={() => setIsCreatingAccount(true)} style={{ background: 'none', border: 'none', color: '#0ea5e9', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                          + Yeni {typeLabels[typeParam]} Yarat
                        </button>
                      )}
                    </div>
                    
                    {isCreatingAccount ? (
                      <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px dashed #cbd5e1', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#1e293b' }}>Yeni {typeLabels[typeParam]} Məlumatları</h4>
                        <input type="text" placeholder="Hesabın Adı (Məs: Mərkəz Kassa)" value={newAccountData.ad} onChange={e => setNewAccountData({...newAccountData, ad: e.target.value})} style={inputStyle} />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                          <input type="number" step="any" placeholder="Başlanğıc Balans" value={newAccountData.mebleg} onChange={e => setNewAccountData({...newAccountData, mebleg: e.target.value})} style={inputStyle} />
                          <select value={newAccountData.valyuta} onChange={e => setNewAccountData({...newAccountData, valyuta: e.target.value})} style={inputStyle}>
                            <option value="AZN">AZN</option><option value="USD">USD</option><option value="EUR">EUR</option><option value="TRY">TRY</option>
                          </select>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button type="button" onClick={() => setIsCreatingAccount(false)} style={{ flex: 1, padding: '0.5rem', border: 'none', borderRadius: '8px', backgroundColor: '#e2e8f0', color: '#475569', fontWeight: 600, cursor: 'pointer' }}>Ləğv Et</button>
                          <button type="button" onClick={handleCreateAccount} style={{ flex: 1, padding: '0.5rem', border: 'none', borderRadius: '8px', backgroundColor: '#10b981', color: 'white', fontWeight: 600, cursor: 'pointer' }}>Yarat</button>
                        </div>
                      </div>
                    ) : allHesablar.filter(h => h.type === typeParam).length === 0 ? (
                      <div style={{ color: '#ef4444', fontSize: '0.85rem', fontWeight: 600, padding: '0.75rem', backgroundColor: '#fee2e2', borderRadius: '8px' }}>
                        Diqqət: Sistemdə heç bir {typeLabels[typeParam]} tapılmadı. Yuxarıdakı "Yeni {typeLabels[typeParam]} Yarat" düyməsinə klikləyin.
                      </div>
                    ) : (
                      <select value={newTxData.kassaAdi} onChange={e => setNewTxData({...newTxData, kassaAdi: e.target.value})} required style={inputStyle}>
                        <option value="">Hesab seçin...</option>
                        {allHesablar.filter(h => h.type === typeParam).map((h: any) => (
                          <option key={h.id} value={h.ad}>{h.ad}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Tarih</label>
                      <input type="date" value={newTxData.tarih} onChange={e => setNewTxData({...newTxData, tarih: e.target.value})} required style={inputStyle} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Kateqoriya (Kategori)</label>
                      <input type="text" value={newTxData.kategori} onChange={e => setNewTxData({...newTxData, kategori: e.target.value})} style={inputStyle} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Açıqlama</label>
                    <input type="text" value={newTxData.aciklama} onChange={e => setNewTxData({...newTxData, aciklama: e.target.value})} required style={inputStyle} placeholder="Məs: Kassa daxilolma" />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>ƏDV (KDV %)</label>
                      <input type="number" value={newTxData.kdv} onChange={e => setNewTxData({...newTxData, kdv: e.target.value})} style={inputStyle} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Məbləğ (Miktar)</label>
                      <input type="number" step="any" value={newTxData.miktar} onChange={e => setNewTxData({...newTxData, miktar: e.target.value})} required style={{ ...inputStyle, fontWeight: 800, color: '#0ea5e9' }} />
                    </div>
                  </div>
                </>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setNewTxType(null)} style={{ flex: 1, padding: '1rem', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '12px', color: '#475569', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>İmtina</button>
                <button type="submit" style={{ flex: 2, padding: '1rem', backgroundColor: '#0ea5e9', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>Yadda Saxla</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bank Integration Modal */}
      {isBankIntegrationModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(4px)', padding: '2rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', width: '100%', maxWidth: '600px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
              <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LinkIcon size={24} color="#0ea5e9"/> Bank İnteqrasiyası Əlavə Et
              </h2>
              <button type="button" onClick={() => setIsBankIntegrationModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="#64748b"/></button>
            </div>
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 1rem 0', color: '#1e40af', fontSize: '1.1rem', fontWeight: 800 }}>NECƏ İŞLƏYİR?</h3>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#334155', fontSize: '0.95rem', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <li>İlk olaraq inteqrasiya etmək istədiyiniz bank filialına, aşağıdakı menyudan "İnteqrasiya Əlavə Et" düyməsini sıxdıqda; izah edildiyi kimi müraciət etməlisiniz.</li>
                  <li>Hesab hərəkətləriniz (Kassa və Bank + Bank İnteqrasiyası) səhifənizdə avtomatik olaraq siyahıya alınır.</li>
                  <li>Hesabınıza daxil olan və xaric olan pulları müştəri, tədarükçü, işçi, çek, sənəd və gəlir-xərc kateqoriyaları ilə uyğunlaşdırdıqda avtomatik olaraq hesablara işlənir.</li>
                  <li>Mühasib panelindən bank hərəkətlərinizi mühasibiniz istədiyi zaman əldə edə bilər.</li>
                  <li>Bütün banklarınızdakı cari balansları eyni ekranda görə bilərsiniz.</li>
                </ul>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Bank Seçin</label>
                <select style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', width: '100%', fontSize: '0.95rem', color: '#1e293b' }}>
                  <option value="">Seçim edin...</option>
                  <option value="kapital">Kapital Bank</option>
                  <option value="abb">ABB (Azərbaycan Beynəlxalq Bankı)</option>
                  <option value="pasha">PAŞA Bank</option>
                  <option value="unibank">Unibank</option>
                  <option value="leobank">Leobank</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsBankIntegrationModalOpen(false)} style={{ flex: 1, padding: '1rem', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '12px', color: '#475569', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>İmtina</button>
                <button type="button" onClick={() => { alert('Müraciətiniz qeydə alındı! Bank tərəfindən təsdiq gözlənilir.'); setIsBankIntegrationModalOpen(false); }} style={{ flex: 2, padding: '1rem', backgroundColor: '#0ea5e9', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>İnteqrasiya Əlavə Et</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Styles
const thStyle: React.CSSProperties = { padding: '1rem 1.5rem', textAlign: 'left', color: '#64748b', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' };
const tdStyle: React.CSSProperties = { padding: '1rem 1.5rem', color: '#1e293b', fontSize: '0.9rem' };
const dropdownBtnStyle: React.CSSProperties = { width: '100%', textAlign: 'left', padding: '0.8rem 1rem', backgroundColor: 'transparent', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: '#334155', transition: 'background-color 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' };
const inputStyle: React.CSSProperties = { padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', width: '100%', fontSize: '0.95rem' };

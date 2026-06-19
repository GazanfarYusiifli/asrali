'use client';
import React, { useState, useEffect } from 'react';
import { useI18n } from '../../context/I18nContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Sparkles, Calendar, ArrowUpRight, ArrowDownRight, 
  Wallet, Building2, CreditCard, Receipt, HandCoins, 
  Banknote, TrendingUp, History, Info
} from 'lucide-react';
import { getAppStorage, setAppStorage } from '@/utils/storage';

export default function DashboardPage() {
  const { t, language } = useI18n();
  const { trialDaysLeft } = useAuth();
  
  // Dashboard states
  const [isMounted, setIsMounted] = useState(false);
  const [stats, setStats] = useState({
    receivables: { total: 0, planned: 0, installments: 0, checks: 0, notes: 0 },
    payables: { total: 0, current: 0, planned: 0, creditCards: 0, checks: 0, notes: 0 },
    vat: 0,
    profit: 0,
    assets: { mainCash: 0, creditCards: 0, pos: 0 },
    recentTransactions: [] as any[]
  });

  useEffect(() => {
    // Initialize dummy data if empty or '[]' to make it dynamic
    const existingSales = getAppStorage('erp_sales');
    if (!existingSales || existingSales === '[]') {
      setAppStorage('erp_sales', JSON.stringify([
        { id: '1', date: '2026-06-15', amount: 1500, type: 'Kredit', status: 'Ödənilməyib', customer: 'Ali Vəliyev' },
        { id: '2', date: '2026-06-18', amount: 2000, type: 'Nağd', status: 'Ödənilib', customer: 'Ayşə Məmmədova' },
        { id: '3', date: '2026-06-19', amount: 3500, type: 'Taksit', status: 'Ödənilməyib', customer: 'Vəli Əliyev' }
      ]));
    }

    const existingExpenses = getAppStorage('erp_expenses');
    if (!existingExpenses || existingExpenses === '[]') {
      setAppStorage('erp_expenses', JSON.stringify([
        { id: '1', tarix: '2026-06-10', mebleg: 500, veziyyet: 'Ödənilməyib', aciqlama: 'Ofis kirayəsi', tip: 'Cari' },
        { id: '2', tarix: '2026-06-12', mebleg: 300, veziyyet: 'Ödənilməyib', aciqlama: 'Təchizatçı', tip: 'Çek' },
        { id: '3', tarix: '2026-06-14', mebleg: 1200, veziyyet: 'Ödənilməyib', aciqlama: 'Maaşlar', tip: 'Cari' }
      ]));
    }

    const existingTransactions = getAppStorage('erp_transactions');
    if (!existingTransactions || existingTransactions === '[]') {
      setAppStorage('erp_transactions', JSON.stringify([
        { id: 't1', date: '18.06.2026', customer: '123', action: 'İcra Başlat', debt: '-', credit: '-' },
        { id: 't2', date: '17.06.2026', customer: 'Ali Vəliyev', action: 'Satış', debt: '1500', credit: '-' },
        { id: 't3', date: '15.06.2026', customer: 'Ofis kirayəsi', action: 'Xərc', debt: '-', credit: '500' }
      ]));
    }

    const existingAssets = getAppStorage('erp_assets');
    if (!existingAssets || existingAssets === '[]') {
      setAppStorage('erp_assets', JSON.stringify({
        mainCash: 12500,
        creditCards: 3200,
        pos: 4500
      }));
    }

    // Load and calculate
    let sales = [];
    let expenses = [];
    let transactions = [];
    let storedAssets = { mainCash: 12500, creditCards: 3200, pos: 4500 };

    try {
      sales = JSON.parse(getAppStorage('erp_sales') || '[]');
      expenses = JSON.parse(getAppStorage('erp_expenses') || '[]');
      transactions = JSON.parse(getAppStorage('erp_transactions') || '[]');
      const a = JSON.parse(getAppStorage('erp_assets') || 'null');
      if (a) storedAssets = a;
    } catch(e) {}

    let recTotal = 0;
    sales.forEach((s: any) => { 
      const amount = Number(s.miktar || s.amount || s.qiymet || s.total || 0);
      if (s.teslimDurumu === 'Təslim Edilməyib' || s.status === 'Ödənilməyib') recTotal += amount; 
    });

    let payTotal = 0, payCurrent = 0, payChecks = 0;
    expenses.forEach((e: any) => { 
      const amount = Number(e.mebleg || e.amount || e.total || 0);
      if (e.veziyyet === 'Ödənilməyib' || e.status === 'Ödənilməyib') {
        payTotal += amount;
        if (e.kassaBanka === 'Əsas Bank Hesabı' || e.tip === 'Cari') payCurrent += amount;
        if (e.kateqoriya?.toLowerCase().includes('çek') || e.tip === 'Çek') payChecks += amount;
      }
    });

    let profit = 0;
    sales.forEach((s: any) => {
      profit += Number(s.miktar || s.amount || s.qiymet || s.total || 0);
    });
    expenses.forEach((e: any) => {
      profit -= Number(e.mebleg || e.amount || e.total || 0);
    });

    // Extract recent transactions effectively
    const recent = [];
    sales.slice(0, 3).forEach((s: any) => recent.push({
      id: s.id, date: s.tarih || s.date, customer: s.hesapAdi || s.customer, action: 'Satış', debt: Number(s.miktar || 0), credit: '-'
    }));
    expenses.slice(0, 2).forEach((e: any) => recent.push({
      id: e.id, date: e.tarix || e.date, customer: e.kateqoriya || e.aciqlama, action: 'Xərc', debt: '-', credit: Number(e.mebleg || 0)
    }));
    recent.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Handle NaN just in case
    if (isNaN(profit)) profit = 0;
    if (isNaN(recTotal)) recTotal = 0;
    if (isNaN(payTotal)) payTotal = 0;

    setStats({
      receivables: { total: recTotal, planned: recTotal * 0.8, installments: recTotal * 0.2, checks: 0, notes: 0 },
      payables: { total: payTotal, current: payCurrent, planned: 0, creditCards: 0, checks: payChecks, notes: 0 },
      vat: profit * 0.18,
      profit: profit,
      assets: { mainCash: storedAssets.mainCash || 0, creditCards: storedAssets.creditCards || 0, pos: storedAssets.pos || 0 },
      recentTransactions: recent.length > 0 ? recent.slice(0, 5) : transactions.slice(0, 5)
    });
    
    setIsMounted(true);

  }, []);
  
  const [formattedDate, setFormattedDate] = useState<string>('');

  useEffect(() => {
    // Format current date based on active language
    const today = new Date();
    const dateOptions: Intl.DateTimeFormatOptions = { 
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
    };
    const locale = language === 'az' ? 'az-AZ' : language === 'tr' ? 'tr-TR' : language === 'ru' ? 'ru-RU' : 'en-US';
    setFormattedDate(today.toLocaleDateString(locale, dateOptions));
  }, [language]);

  if (!isMounted) return null;

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1400px', margin: '0 auto' }}>
      
      {/* AI Assistant Banner */}
      <div style={{ 
        background: 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)',
        borderRadius: '12px',
        padding: '1rem 1.5rem',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        boxShadow: '0 4px 15px rgba(139, 92, 246, 0.2)'
      }}>
        <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '50%' }}>
          <Sparkles size={24} color="white" />
        </div>
        <span style={{ fontWeight: 500, fontSize: '0.95rem' }}>
          {t('dash_ai_banner')}
        </span>
      </div>

      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', marginBottom: '0.25rem' }}>
            <Calendar size={16} />
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{formattedDate}</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', margin: 0 }}>
            {t('menu_dashboard')}
          </h1>
        </div>
        
        {/* Trial Days Alert */}
        <div style={{ 
          background: '#fffbeb',
          border: '1px solid #fde68a',
          color: '#d97706',
          padding: '0.75rem 1.25rem',
          borderRadius: '10px',
          fontSize: '0.85rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <Info size={18} />
          {t('dash_usage_left').replace('{days}', (trialDaysLeft || 14).toString())}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        
        {/* Receivables Widget */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: 'transform 0.2s', cursor: 'default' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>{t('dash_receivables')}</div>
            <div style={{ background: '#dcfce7', padding: '0.4rem', borderRadius: '8px' }}>
              <ArrowUpRight size={20} color="#16a34a" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#16a34a', marginBottom: '1.5rem' }}>{stats.receivables.total.toLocaleString('az-AZ')} ₼</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: t('dash_planned_collection'), val: `${stats.receivables.planned.toLocaleString('az-AZ')} ₼`, icon: <Calendar size={14} /> },
              { label: t('dash_installments'), val: `${stats.receivables.installments.toLocaleString('az-AZ')} ₼`, icon: <History size={14} /> },
              { label: t('dash_check'), val: `${stats.receivables.checks.toLocaleString('az-AZ')} ₼`, icon: <Receipt size={14} /> },
              { label: t('dash_promissory_note'), val: `${stats.receivables.notes.toLocaleString('az-AZ')} ₼`, icon: <Banknote size={14} /> }
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', borderBottom: idx !== 3 ? '1px dashed #e2e8f0' : 'none', paddingBottom: idx !== 3 ? '0.5rem' : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b' }}>
                  {item.icon} {item.label}
                </div>
                <div style={{ fontWeight: 600, color: '#334155' }}>{item.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Payables Widget */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: 'transform 0.2s', cursor: 'default' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ color: '#64748b', fontWeight: 600, fontSize: '0.9rem' }}>{t('dash_payables')}</div>
            <div style={{ background: '#fee2e2', padding: '0.4rem', borderRadius: '8px' }}>
              <ArrowDownRight size={20} color="#dc2626" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#dc2626', marginBottom: '1.5rem' }}>{stats.payables.total.toLocaleString('az-AZ')} ₼</div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {[
              { label: t('dash_current_debt'), val: `${stats.payables.current.toLocaleString('az-AZ')} ₼`, icon: <HandCoins size={14} /> },
              { label: t('dash_planned_payment'), val: `${stats.payables.planned.toLocaleString('az-AZ')} ₼`, icon: <Calendar size={14} /> },
              { label: t('dash_credit_cards'), val: `${stats.payables.creditCards.toLocaleString('az-AZ')} ₼`, icon: <CreditCard size={14} /> },
              { label: t('dash_check'), val: `${stats.payables.checks.toLocaleString('az-AZ')} ₼`, icon: <Receipt size={14} /> },
              { label: t('dash_promissory_note'), val: `${stats.payables.notes.toLocaleString('az-AZ')} ₼`, icon: <Banknote size={14} /> }
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', borderBottom: idx !== 4 ? '1px dashed #e2e8f0' : 'none', paddingBottom: idx !== 4 ? '0.5rem' : 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b' }}>
                  {item.icon} {item.label}
                </div>
                <div style={{ fontWeight: 600, color: '#334155' }}>{item.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* VAT & Profit */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ flex: 1, background: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'center', transition: 'transform 0.2s', cursor: 'default' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
             <div style={{ color: '#64748b', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem' }}>{t('dash_vat_status')}</div>
             <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#3b82f6' }}>{stats.vat.toLocaleString('az-AZ')} ₼ (B)</div>
          </div>
          <div style={{ flex: 1, background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 10px 15px -3px rgba(16,185,129,0.3)', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden', transition: 'transform 0.2s', cursor: 'default' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
             <TrendingUp size={80} color="rgba(255,255,255,0.15)" style={{ position: 'absolute', right: '-10px', bottom: '-10px' }} />
             <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.5rem', opacity: 0.9 }}>{t('dash_monthly_profit')}</div>
             <div style={{ fontSize: '2rem', fontWeight: 800 }}>{stats.profit.toLocaleString('az-AZ')} ₼</div>
          </div>
        </div>
        
      </div>

      {/* Lower Section (Assets & Transactions) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginTop: '0.5rem' }}>
        
        {/* Assets (Varlıklar) */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>{t('dash_assets')}</h3>
          </div>
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.75rem', letterSpacing: '0.5px' }}>{t('dash_cash_registers')}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f1f5f9', padding: '0.75rem 1rem', borderRadius: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Wallet size={16} color="#64748b"/> {t('dash_main_cash')}</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>{stats.assets.mainCash.toLocaleString('az-AZ')} ₼</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.75rem', letterSpacing: '0.5px' }}>{t('dash_bank_accounts')}</div>
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px dashed #cbd5e1', textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>
                Kayıt bulunamadı.
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
               <div style={{ flex: 1 }}>
                 <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.75rem', letterSpacing: '0.5px' }}>{t('dash_credit_cards')}</div>
                 <div style={{ fontSize: '1rem', fontWeight: 700, color: '#334155' }}>{stats.assets.creditCards.toLocaleString('az-AZ')} ₼</div>
               </div>
               <div style={{ flex: 1 }}>
                 <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.75rem', letterSpacing: '0.5px' }}>{t('dash_pos_accounts')}</div>
                 <div style={{ fontSize: '1rem', fontWeight: 700, color: '#334155' }}>{stats.assets.pos.toLocaleString('az-AZ')} ₼</div>
               </div>
            </div>

          </div>
        </div>

        {/* Transactions Table & Subscription */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
            <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', background: '#f8fafc' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>{t('dash_recent_transactions')}</h3>
            </div>
            <div style={{ flex: 1, padding: '1.5rem', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '350px' }}>
                <thead>
                  <tr style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, borderBottom: '2px solid #e2e8f0' }}>
                    <th style={{ paddingBottom: '0.75rem', paddingRight: '1rem' }}>{t('dash_date')}</th>
                    <th style={{ paddingBottom: '0.75rem', paddingRight: '1rem' }}>{t('dash_customer')}</th>
                    <th style={{ paddingBottom: '0.75rem', paddingRight: '1rem' }}>{t('dash_transaction')}</th>
                    <th style={{ paddingBottom: '0.75rem', paddingRight: '1rem' }}>{t('dash_debt')}</th>
                    <th style={{ paddingBottom: '0.75rem' }}>{t('dash_credit')}</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentTransactions.map((tx, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '1rem 1rem 1rem 0', fontSize: '0.85rem', color: '#334155' }}>{tx.date}</td>
                      <td style={{ padding: '1rem 1rem 1rem 0', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{tx.customer}</td>
                      <td style={{ padding: '1rem 1rem 1rem 0', fontSize: '0.85rem', color: '#334155' }}>{tx.action}</td>
                      <td style={{ padding: '1rem 1rem 1rem 0', fontSize: '0.85rem', color: '#dc2626', fontWeight: 600 }}>{tx.debt !== '-' ? `${tx.debt} ₼` : '-'}</td>
                      <td style={{ padding: '1rem 0', fontSize: '0.85rem', color: '#16a34a', fontWeight: 600 }}>{tx.credit !== '-' ? `${tx.credit} ₼` : '-'}</td>
                    </tr>
                  ))}
                  {stats.recentTransactions.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ padding: '2rem 0', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>Məlumat yoxdur.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Subscription Progress */}
          <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
             <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1e293b', margin: '0 0 1rem 0' }}>{t('dash_subscription_info')}</h3>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
               <span style={{ color: '#64748b' }}>1 {t('dash_days_left')}</span>
               <span style={{ color: '#d97706' }}>{trialDaysLeft} {t('dash_days_left')}</span>
               <span style={{ color: '#64748b' }}>365 {t('dash_days_left')}</span>
             </div>
             <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.max(1, ((trialDaysLeft || 14) / 365) * 100)}%`, height: '100%', background: 'linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)', borderRadius: '4px' }}></div>
             </div>
          </div>

        </div>

      </div>

    </div>
  );
}

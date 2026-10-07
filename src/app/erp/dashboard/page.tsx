'use client';
import React, { useState, useEffect } from 'react';
import { useI18n } from '../../context/I18nContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Sparkles, Calendar, ArrowUpRight, ArrowDownRight, 
  Wallet, Building2, CreditCard, Receipt, HandCoins, 
  Banknote, TrendingUp, History, Info, ShieldCheck, CheckCircle2,
  Zap, Infinity as InfinityIcon
} from 'lucide-react';
import { getAppStorage, setAppStorage } from '@/utils/storage';
import { createClient } from '@/utils/supabase/client';

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
    setIsMounted(true);

    const fetchStats = async () => {
      const supabase = createClient();

      // Fetch all required data
      const { data: salesData } = await supabase.from('erp_sales').select('*');
      const { data: expensesData } = await supabase.from('erp_expenses').select('*');
      
      const sales = salesData || [];
      const expenses = expensesData || [];
      let storedAssets = { mainCash: 12500, creditCards: 3200, pos: 4500 };

      try {
        const a = JSON.parse(getAppStorage('erp_assets') || 'null');
        if (a) storedAssets = a;
      } catch(e) {}

      let recTotal = 0;
      sales.forEach((s: any) => { 
        const amount = Number(s.miktar || s.amount || s.qiymet || s.total || 0);
        if (s.teslim_durumu === 'Təslim Edilməyib' || s.status === 'Ödənilməyib') recTotal += amount; 
      });

      let payTotal = 0, payCurrent = 0, payChecks = 0;
      expenses.forEach((e: any) => { 
        const amount = Number(e.mebleg || e.amount || e.total || 0);
        if (e.veziyyet === 'Ödənilməyib' || e.status === 'Ödənilməyib') {
          payTotal += amount;
          if (e.kassa_banka === 'Əsas Bank Hesabı' || e.tip === 'Cari') payCurrent += amount;
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
      const recent: any[] = [];
      sales.slice(0, 3).forEach((s: any) => recent.push({
        id: s.id, date: s.tarih || s.date, customer: s.hesap_adi || s.customer, action: 'Satış', debt: Number(s.miktar || 0), credit: '-'
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
        recentTransactions: recent.slice(0, 5)
      });
    };

    fetchStats();
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
      
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', marginBottom: '0.25rem' }}>
            <Calendar size={15} />
            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{formattedDate}</span>
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1e293b', margin: 0, letterSpacing: '-0.02em' }}>
            {t('menu_dashboard')}
          </h1>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '1.25rem' }}>
        
        {/* Receivables Widget */}
        <div style={{ 
          background: 'white', 
          borderRadius: '20px', 
          padding: '1.6rem', 
          border: '1px solid #edf2f7', 
          boxShadow: '0 4px 20px -4px rgba(16, 185, 129, 0.08), 0 2px 6px -1px rgba(0,0,0,0.02)', 
          transition: 'all 0.25s ease', 
          cursor: 'default',
          position: 'relative',
          overflow: 'hidden'
        }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 28px -6px rgba(16, 185, 129, 0.15)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px -4px rgba(16, 185, 129, 0.08)'; }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <div>
              <div style={{ color: '#64748b', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '-0.01em' }}>{t('dash_receivables')}</div>
              <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, marginTop: '0.15rem' }}>Gözlənilən daxilolmalar</div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16a34a', boxShadow: '0 2px 8px rgba(22, 163, 74, 0.15)' }}>
              <ArrowUpRight size={20} />
            </div>
          </div>
          
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '1.5rem', lineHeight: 1 }}>
            {stats.receivables.total.toLocaleString('az-AZ')} <span style={{ fontSize: '1.4rem', color: '#16a34a', fontWeight: 700 }}>₼</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', background: '#f8fafc', padding: '1rem', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
            {[
              { label: t('dash_planned_collection'), val: `${stats.receivables.planned.toLocaleString('az-AZ')} ₼`, icon: <Calendar size={14} color="#10b981" /> },
              { label: t('dash_installments'), val: `${stats.receivables.installments.toLocaleString('az-AZ')} ₼`, icon: <History size={14} color="#059669" /> },
              { label: t('dash_check'), val: `${stats.receivables.checks.toLocaleString('az-AZ')} ₼`, icon: <Receipt size={14} color="#047857" /> },
              { label: t('dash_promissory_note'), val: `${stats.receivables.notes.toLocaleString('az-AZ')} ₼`, icon: <Banknote size={14} color="#065f46" /> }
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#64748b', fontWeight: 500 }}>
                  {item.icon} {item.label}
                </div>
                <div style={{ fontWeight: 700, color: '#1e293b' }}>{item.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Payables Widget */}
        <div style={{ 
          background: 'white', 
          borderRadius: '20px', 
          padding: '1.6rem', 
          border: '1px solid #edf2f7', 
          boxShadow: '0 4px 20px -4px rgba(239, 68, 68, 0.08), 0 2px 6px -1px rgba(0,0,0,0.02)', 
          transition: 'all 0.25s ease', 
          cursor: 'default',
          position: 'relative',
          overflow: 'hidden'
        }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 28px -6px rgba(239, 68, 68, 0.15)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px -4px rgba(239, 68, 68, 0.08)'; }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '120px', height: '120px', background: 'radial-gradient(circle, rgba(239,68,68,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <div>
              <div style={{ color: '#64748b', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '-0.01em' }}>{t('dash_payables')}</div>
              <div style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700, marginTop: '0.15rem' }}>Ödəniləcək məbləğ</div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#dc2626', boxShadow: '0 2px 8px rgba(220, 38, 38, 0.15)' }}>
              <ArrowDownRight size={20} />
            </div>
          </div>
          
          <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', marginBottom: '1.5rem', lineHeight: 1 }}>
            {stats.payables.total.toLocaleString('az-AZ')} <span style={{ fontSize: '1.4rem', color: '#dc2626', fontWeight: 700 }}>₼</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', background: '#f8fafc', padding: '1rem', borderRadius: '14px', border: '1px solid #f1f5f9' }}>
            {[
              { label: t('dash_current_debt'), val: `${stats.payables.current.toLocaleString('az-AZ')} ₼`, icon: <HandCoins size={14} color="#ef4444" /> },
              { label: t('dash_planned_payment'), val: `${stats.payables.planned.toLocaleString('az-AZ')} ₼`, icon: <Calendar size={14} color="#dc2626" /> },
              { label: t('dash_credit_cards'), val: `${stats.payables.creditCards.toLocaleString('az-AZ')} ₼`, icon: <CreditCard size={14} color="#b91c1c" /> },
              { label: t('dash_check'), val: `${stats.payables.checks.toLocaleString('az-AZ')} ₼`, icon: <Receipt size={14} color="#991b1b" /> },
              { label: t('dash_promissory_note'), val: `${stats.payables.notes.toLocaleString('az-AZ')} ₼`, icon: <Banknote size={14} color="#7f1d1d" /> }
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: '#64748b', fontWeight: 500 }}>
                  {item.icon} {item.label}
                </div>
                <div style={{ fontWeight: 700, color: '#1e293b' }}>{item.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* VAT & Profit Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {/* VAT Card */}
          <div style={{ 
            flex: 1, 
            background: 'white', 
            borderRadius: '20px', 
            padding: '1.5rem', 
            border: '1px solid #edf2f7', 
            boxShadow: '0 4px 20px -4px rgba(59, 130, 246, 0.08), 0 2px 6px -1px rgba(0,0,0,0.02)', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between', 
            transition: 'all 0.25s ease', 
            cursor: 'default',
            position: 'relative',
            overflow: 'hidden'
          }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 28px -6px rgba(59, 130, 246, 0.15)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px -4px rgba(59, 130, 246, 0.08)'; }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: '#64748b', fontWeight: 600, fontSize: '0.85rem' }}>{t('dash_vat_status')}</div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#2563eb', backgroundColor: '#eff6ff', padding: '0.2rem 0.6rem', borderRadius: '12px', border: '1px solid #dbeafe' }}>
                Bəyannamə (B)
              </span>
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1e3a8a', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {stats.vat.toLocaleString('az-AZ')} <span style={{ fontSize: '1.3rem', color: '#3b82f6', fontWeight: 700 }}>₼</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.35rem' }}>Cari dövr üzrə ƏDV balansı</div>
            </div>
          </div>

          {/* Profit Card */}
          <div style={{ 
            flex: 1, 
            background: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #14b8a6 100%)', 
            color: 'white', 
            borderRadius: '20px', 
            padding: '1.5rem', 
            boxShadow: '0 10px 25px -4px rgba(16, 185, 129, 0.35)', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between', 
            position: 'relative', 
            overflow: 'hidden', 
            transition: 'all 0.25s ease', 
            cursor: 'default' 
          }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 14px 30px -4px rgba(16, 185, 129, 0.45)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px -4px rgba(16, 185, 129, 0.35)'; }}>
            <TrendingUp size={90} color="rgba(255,255,255,0.14)" style={{ position: 'absolute', right: '-12px', bottom: '-12px', pointerEvents: 'none' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem', opacity: 0.95 }}>{t('dash_monthly_profit')}</div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'white', backgroundColor: 'rgba(255,255,255,0.22)', padding: '0.2rem 0.6rem', borderRadius: '12px', backdropFilter: 'blur(5px)' }}>
                Xalis Gəlir
              </span>
            </div>
            
            <div style={{ marginTop: '0.75rem', zIndex: 1 }}>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1 }}>
                {stats.profit.toLocaleString('az-AZ')} <span style={{ fontSize: '1.4rem', opacity: 0.9 }}>₼</span>
              </div>
              <div style={{ fontSize: '0.75rem', opacity: 0.85, marginTop: '0.35rem' }}>Aktiv ayın mənfəət göstəricisi</div>
            </div>
          </div>

        </div>
        
      </div>

      {/* Lower Section (Assets & Transactions) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.25rem', marginTop: '0.25rem' }}>
        
        {/* Assets (Varlıklar) */}
        <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #edf2f7', overflow: 'hidden', boxShadow: '0 4px 20px -4px rgba(0,0,0,0.03)' }}>
          <div style={{ padding: '1.25rem 1.6rem', borderBottom: '1px solid #f1f5f9', background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Wallet size={16} />
              </div>
              <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>{t('dash_assets')}</h3>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Maliyyə balansları</span>
          </div>
          
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.5rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{t('dash_cash_registers')}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', padding: '0.85rem 1.1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building2 size={16} color="#64748b"/> {t('dash_main_cash')}
                </span>
                <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{stats.assets.mainCash.toLocaleString('az-AZ')} ₼</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.5rem', letterSpacing: '0.5px', textTransform: 'uppercase' }}>{t('dash_bank_accounts')}</div>
              <div style={{ background: '#f8fafc', padding: '0.9rem', borderRadius: '12px', border: '1px dashed #cbd5e1', textAlign: 'center', fontSize: '0.82rem', color: '#94a3b8' }}>
                Kayıt bulunamadı.
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
               <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                 <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.35rem', textTransform: 'uppercase' }}>{t('dash_credit_cards')}</div>
                 <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{stats.assets.creditCards.toLocaleString('az-AZ')} ₼</div>
               </div>
               <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                 <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.35rem', textTransform: 'uppercase' }}>{t('dash_pos_accounts')}</div>
                 <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{stats.assets.pos.toLocaleString('az-AZ')} ₼</div>
               </div>
            </div>

          </div>
        </div>

        {/* Transactions Table & Subscription */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          <div style={{ background: 'white', borderRadius: '20px', border: '1px solid #edf2f7', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 4px 20px -4px rgba(0,0,0,0.03)' }}>
            <div style={{ padding: '1.25rem 1.6rem', borderBottom: '1px solid #f1f5f9', background: 'linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#f0fdf4', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <History size={16} />
                </div>
                <h3 style={{ fontSize: '0.98rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>{t('dash_recent_transactions')}</h3>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>Son hərəkətlər</span>
            </div>
            
            <div style={{ flex: 1, padding: '1.25rem 1.6rem', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '350px' }}>
                <thead>
                  <tr style={{ color: '#94a3b8', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid #f1f5f9' }}>
                    <th style={{ paddingBottom: '0.75rem', paddingRight: '1rem' }}>{t('dash_date')}</th>
                    <th style={{ paddingBottom: '0.75rem', paddingRight: '1rem' }}>{t('dash_customer')}</th>
                    <th style={{ paddingBottom: '0.75rem', paddingRight: '1rem' }}>{t('dash_transaction')}</th>
                    <th style={{ paddingBottom: '0.75rem', paddingRight: '1rem' }}>{t('dash_debt')}</th>
                    <th style={{ paddingBottom: '0.75rem' }}>{t('dash_credit')}</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentTransactions.map((tx, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f8fafc', transition: 'background 0.15s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td style={{ padding: '0.9rem 1rem 0.9rem 0', fontSize: '0.82rem', color: '#64748b' }}>{tx.date}</td>
                      <td style={{ padding: '0.9rem 1rem 0.9rem 0', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>{tx.customer}</td>
                      <td style={{ padding: '0.9rem 1rem 0.9rem 0', fontSize: '0.82rem', color: '#64748b' }}>
                        <span style={{ backgroundColor: '#f1f5f9', padding: '0.2rem 0.55rem', borderRadius: '6px', fontWeight: 600, color: '#334155' }}>{tx.action}</span>
                      </td>
                      <td style={{ padding: '0.9rem 1rem 0.9rem 0', fontSize: '0.85rem', color: '#dc2626', fontWeight: 700 }}>{tx.debt !== '-' ? `${tx.debt} ₼` : '-'}</td>
                      <td style={{ padding: '0.9rem 0', fontSize: '0.85rem', color: '#16a34a', fontWeight: 700 }}>{tx.credit !== '-' ? `${tx.credit} ₼` : '-'}</td>
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

          {/* Subscription Card - Ultra-Modern Apple Glass Design */}
          <div style={{ 
            background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)', 
            borderRadius: '20px', 
            border: '1px solid #bbf7d0', 
            padding: '1.35rem 1.6rem', 
            boxShadow: '0 8px 24px -4px rgba(16, 185, 129, 0.12), 0 2px 6px -1px rgba(0,0,0,0.02)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.25rem',
            flexWrap: 'wrap',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.25s ease'
          }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 30px -4px rgba(16, 185, 129, 0.18)'; }} onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 24px -4px rgba(16, 185, 129, 0.12)'; }}>
            
            <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', zIndex: 1 }}>
              <div style={{ 
                width: '46px', 
                height: '46px', 
                borderRadius: '14px', 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.01em' }}>
                    {t('dash_subscription_info')}
                  </h3>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    fontWeight: 800, 
                    color: '#059669', 
                    backgroundColor: '#d1fae5', 
                    padding: '0.2rem 0.65rem', 
                    borderRadius: '20px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    border: '1px solid #a7f3d0'
                  }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 6px #10b981' }} />
                    Aktiv
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#475569', marginTop: '0.25rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Zap size={13} color="#10b981" /> PRO Paketi · Tam Funksional Giriş
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', zIndex: 1 }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Paket Statusu</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'flex-end', marginTop: '0.15rem' }}>
                  <InfinityIcon size={18} color="#10b981" /> Limitsiz Müddət
                </div>
              </div>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '12px', 
                backgroundColor: 'white', 
                border: '1px solid #bbf7d0', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#10b981',
                boxShadow: '0 2px 6px rgba(16, 185, 129, 0.1)'
              }}>
                <CheckCircle2 size={20} />
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

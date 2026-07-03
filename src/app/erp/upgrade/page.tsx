'use client';
import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import { useI18n } from '../../context/I18nContext';

export default function UpgradePage() {
  const { subscription } = useAuth();
  const { language } = useI18n();
  const isExpired = subscription?.status === 'EXPIRED';

  const getPricing = () => {
    switch (language) {
      case 'en': return { currency: 'USD', symbol: '$', amount: '29' };
      case 'ru': return { currency: 'RUB', symbol: '₽', amount: '2600' };
      case 'tr': return { currency: 'TRY', symbol: '₺', amount: '950' };
      case 'sv': return { currency: 'SEK', symbol: 'kr', amount: '300' };
      case 'az': 
      default: return { currency: 'AZN', symbol: '₼', amount: '49' };
    }
  };
  const pricing = getPricing();

  return (
    <div style={{ minHeight: '100%', padding: '4rem 2rem', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      {isExpired && (
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '1rem 2rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2rem', maxWidth: '800px', width: '100%' }}>
          <ShieldAlert size={24} />
          <span style={{ fontWeight: 600 }}>Diqqət: Sınaq müddətiniz (14 gün) başa çatıb. Sistemdən istifadəyə davam etmək üçün paketini yüksəltməlisiniz.</span>
        </div>
      )}

      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.5px' }}>Biznesinizi Daha İrəli Aparın</h1>
        <p style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: '600px', margin: '0 auto' }}>
          ASRALI PRO ilə bütün modullara məhdudiyyətsiz giriş əldə edin və biznes proseslərinizi tam avtomatlaşdırın.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', maxWidth: '1000px', width: '100%' }}>
        
        {/* Basic Plan (Current) */}
        <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '2.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', opacity: isExpired ? 0.6 : 1, position: 'relative' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>Sadə Paket (Sınaq)</h3>
          <p style={{ color: '#64748b', marginBottom: '2rem' }}>Sadə funksiyalarla işləmək üçün</p>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: '#0f172a', marginBottom: '2rem' }}>0 <span style={{ fontSize: '1.2rem', color: '#94a3b8', fontWeight: 600 }}>{pricing.currency} / 14 gün</span></div>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', color: '#475569' }}><CheckCircle2 size={20} color="#cbd5e1" /> Bütün əsas modullar (məhdudiyyətli)</li>
            <li style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', color: '#475569' }}><CheckCircle2 size={20} color="#cbd5e1" /> Tək istifadəçi girişi</li>
            <li style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', color: '#475569', textDecoration: 'line-through', opacity: 0.5 }}><CheckCircle2 size={20} color="#cbd5e1" /> E-Ticarət inteqrasiyası</li>
            <li style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', color: '#475569', textDecoration: 'line-through', opacity: 0.5 }}><CheckCircle2 size={20} color="#cbd5e1" /> 7/24 Texniki Dəstək</li>
          </ul>

          <button disabled style={{ width: '100%', padding: '1rem', backgroundColor: '#f1f5f9', color: '#94a3b8', border: 'none', borderRadius: '12px', fontWeight: 600, fontSize: '1rem' }}>
            {isExpired ? 'Müddət Bitib' : 'Hazırki Paketiniz'}
          </button>
        </div>

        {/* PRO Plan */}
        <div style={{ backgroundColor: '#0f172a', borderRadius: '24px', padding: '2.5rem', border: '1px solid #1e293b', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)', position: 'relative', transform: 'scale(1.05)' }}>
          <div style={{ position: 'absolute', top: '-15px', right: '2rem', backgroundColor: '#10b981', color: 'white', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem', boxShadow: '0 4px 6px rgba(16,185,129,0.3)' }}>
            <Sparkles size={14} /> Tövsiyə Edilir
          </div>

          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>PRO Paket</h3>
          <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Peşəkar idarəetmə üçün</p>
          <div style={{ fontSize: '3rem', fontWeight: 800, color: 'white', marginBottom: '2rem' }}>{pricing.amount} <span style={{ fontSize: '1.2rem', color: '#64748b', fontWeight: 600 }}>{pricing.currency} / aylıq</span></div>
          
          <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 2.5rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <li style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', color: '#e2e8f0' }}><CheckCircle2 size={20} color="#10b981" /> Məhdudiyyətsiz faktura kəsimi</li>
            <li style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', color: '#e2e8f0' }}><CheckCircle2 size={20} color="#10b981" /> CRM İdarəetməsi</li>
            <li style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', color: '#e2e8f0' }}><CheckCircle2 size={20} color="#10b981" /> Süni İntellekt (MİRA AI)</li>
            <li style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', color: '#e2e8f0' }}><CheckCircle2 size={20} color="#10b981" /> E-Ticarət (Sayt) İnteqrasiyası</li>
            <li style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', color: '#e2e8f0' }}><CheckCircle2 size={20} color="#10b981" /> E-Faktura və Bank İnteqrasiyası</li>
            <li style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', color: '#e2e8f0' }}><CheckCircle2 size={20} color="#10b981" /> Limitsiz istifadəçi hesabı</li>
            <li style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', color: '#e2e8f0' }}><CheckCircle2 size={20} color="#10b981" /> 7/24 Prioritetli Texniki Dəstək</li>
          </ul>

          <Link href="/erp/upgrade/checkout" style={{ display: 'block', width: '100%', textAlign: 'center', padding: '1rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', textDecoration: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', transition: 'all 0.2s', boxShadow: '0 4px 6px rgba(16,185,129,0.3)' }} onMouseOver={e => e.currentTarget.style.filter = 'brightness(1.1)'} onMouseOut={e => e.currentTarget.style.filter = 'brightness(1)'}>
            PRO Paketə Keç
          </Link>
        </div>

      </div>
    </div>
  );
}

'use client';
import React from 'react';
import { Lock, Crown, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ETicaretProPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '2rem', backgroundColor: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ backgroundColor: 'white', padding: '4rem 3rem', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)', maxWidth: '600px', width: '100%', textAlign: 'center', border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden' }}>
        
        {/* Background Decorative Gradient */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'linear-gradient(90deg, #f59e0b, #fbbf24, #fcd34d)' }}></div>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(245, 158, 11, 0.1) 0%, transparent 70%)', borderRadius: '50%' }}></div>

        <div style={{ width: '80px', height: '80px', backgroundColor: '#fffbeb', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto', color: '#f59e0b', boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.1)' }}>
          <Lock size={40} />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Crown size={24} color="#f59e0b" />
          <h1 style={{ fontSize: '2rem', color: '#0f172a', margin: 0, fontWeight: 800 }}>PRO Versiyaya Keçid</h1>
        </div>
        
        <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
          E-Ticarət modulu, o cümlədən Gələn Sifarişlər və Tənzimləmələr yalnız <strong>ASHRALI PRO</strong> istifadəçiləri üçün aktivdir. Daha çox funksiya və tam inteqrasiya üçün paketini yüksəlt.
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '14px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(245, 158, 11, 0.3)', transition: 'transform 0.1s' }} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}>
            Paketi Yüksəlt <ArrowRight size={18} />
          </button>
          <Link href="/erp/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', backgroundColor: '#f8fafc', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '14px', fontWeight: 600, fontSize: '1rem', textDecoration: 'none', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#e2e8f0'} onMouseOut={e => e.currentTarget.style.backgroundColor = '#f8fafc'}>
            Ana Səhifəyə Qayıt
          </Link>
        </div>

      </div>
    </div>
  );
}

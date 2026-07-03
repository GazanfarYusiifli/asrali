'use client';
import React from 'react';
import { Brain, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function AiPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '2rem', backgroundColor: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ backgroundColor: 'white', padding: '4rem 3rem', borderRadius: '24px', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)', maxWidth: '600px', width: '100%', textAlign: 'center', border: '1px solid #e2e8f0', position: 'relative', overflow: 'hidden' }}>
        
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: 'linear-gradient(90deg, #8b5cf6, #c084fc, #e879f9)' }}></div>
        <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%)', borderRadius: '50%' }}></div>

        <div style={{ width: '80px', height: '80px', backgroundColor: '#f5f3ff', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto', color: '#8b5cf6', boxShadow: '0 10px 15px -3px rgba(139, 92, 246, 0.1)' }}>
          <Brain size={40} />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Sparkles size={24} color="#8b5cf6" />
          <h1 style={{ fontSize: '2rem', color: '#0f172a', margin: 0, fontWeight: 800 }}>MİRA AI (Süni İntellekt)</h1>
        </div>
        
        <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2.5rem' }}>
          MİRA AI köməkçisi hazırda təlim keçir. Bu xidmət hazırda bütün istifadəçilərimiz üçün <strong>PULSUZDUR</strong>. Yaxın zamanda məlumatlarınızı analiz etmək və idarəetməni asanlaşdırmaq üçün aktiv olacaq!
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
          <Link href="/erp/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 2rem', backgroundColor: '#f8fafc', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '14px', fontWeight: 600, fontSize: '1rem', textDecoration: 'none', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#e2e8f0'} onMouseOut={e => e.currentTarget.style.backgroundColor = '#f8fafc'}>
            Ana Səhifəyə Qayıt
          </Link>
        </div>

      </div>
    </div>
  );
}

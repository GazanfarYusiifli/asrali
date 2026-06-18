'use client';
import React from 'react';
import { HeadphonesIcon, MessageCircle, Globe, Shield, FileText, HeartHandshake } from 'lucide-react';
import Link from 'next/link';

export default function YardimPage() {
  return (
    <div style={{ padding: '2.5rem', minHeight: '100%', backgroundColor: '#f4f7f6', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.4)' }}>
            <HeadphonesIcon size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: '#0f172a', margin: 0, fontWeight: 800, letterSpacing: '-0.5px' }}>Dəstək Mərkəzi</h1>
            <p style={{ margin: '0.3rem 0 0 0', color: '#64748b', fontSize: '0.95rem' }}>Problemlərinizin həlli və təklifləriniz üçün biz buradayıq.</p>
          </div>
        </div>

        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          
          {/* WhatsApp Support */}
          <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <MessageCircle size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#1e293b', margin: '0 0 0.5rem 0', fontWeight: 700 }}>Texniki Dəstək</h3>
            <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', flex: 1, margin: '0 0 1.5rem 0' }}>
              Sistemdən istifadə ilə bağlı hər hansı bir çətinliyiniz və ya sualınız varsa, WhatsApp üzərindən bizə yazın. Dəstək komandamız ən qısa zamanda sizə cavab verəcək.
            </p>
            <a href="https://wa.me/994555945100" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '1rem', backgroundColor: '#25D366', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', textDecoration: 'none', transition: 'all 0.2s', boxShadow: '0 4px 6px rgba(37, 211, 102, 0.2)' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#1ebc5c'} onMouseOut={e => e.currentTarget.style.backgroundColor = '#25D366'}>
              WhatsApp ilə Yazın
            </a>
          </div>

          {/* Consultation */}
          <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
              <Globe size={24} />
            </div>
            <h3 style={{ fontSize: '1.25rem', color: '#1e293b', margin: '0 0 0.5rem 0', fontWeight: 700 }}>Konsultasiya & Layihə</h3>
            <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.6', flex: 1, margin: '0 0 1.5rem 0' }}>
              Biznesinizin rəqəmsallaşdırılması, xüsusi modulların yazılması və ya avtomatlaşdırma barədə peşəkar konsultasiya üçün vebsaytımızı ziyarət edin.
            </p>
            <a href="https://nitrocalls.site" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%', padding: '1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', textDecoration: 'none', transition: 'all 0.2s', boxShadow: '0 4px 6px rgba(59, 130, 246, 0.2)' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#2563eb'} onMouseOut={e => e.currentTarget.style.backgroundColor = '#3b82f6'}>
              Saytımıza Keçid
            </a>
          </div>

        </div>

        {/* Feedback Section */}
        <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '2.5rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.03)', marginBottom: '2rem', display: 'flex', alignItems: 'flex-start', gap: '1.5rem' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '14px', backgroundColor: '#fff7ed', color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <HeartHandshake size={28} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', color: '#1e293b', margin: '0 0 0.5rem 0', fontWeight: 800 }}>Təklif və fikirlərinizə hər zaman açığıq</h3>
            <p style={{ color: '#64748b', fontSize: '1rem', lineHeight: '1.6', margin: 0 }}>
              Platformamızın daha da təkmilləşməsi üçün sizin geri dönüşləriniz bizim üçün çox dəyərlidir. İstər yeni bir funksiya istəyi, istərsə də istifadə zamanı qarşılaşdığınız çətinliklər barədə bizə yaza bilərsiniz. Biz sizinlə birlikdə böyüyürük!
            </p>
          </div>
        </div>

        {/* Legal Links */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e2e8f0' }}>
          <Link href="/privacy" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600, transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#0f172a'} onMouseOut={e => e.currentTarget.style.color = '#64748b'}>
            <Shield size={18} /> Privacy Policy
          </Link>
          <span style={{ color: '#cbd5e1' }}>|</span>
          <Link href="/terms" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', textDecoration: 'none', fontSize: '0.95rem', fontWeight: 600, transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#0f172a'} onMouseOut={e => e.currentTarget.style.color = '#64748b'}>
            <FileText size={18} /> Terms of Service
          </Link>
        </div>

      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '../context/I18nContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { createClient } from '@/utils/supabase/client';
export default function RegisterPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [orgType, setOrgType] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [regMethod, setRegMethod] = useState<'google' | 'password'>('google');
  
  // New form fields
  const [orgName, setOrgName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [subdomain, setSubdomain] = useState('');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const orgTypes = [
    { id: 'perakende', icon: '🏪', title: t('reg_type_retail'), desc: 'Market, geyim, elektronika və digər mağazalar' },
    { id: 'topdansatis', icon: '🏢', title: t('reg_type_wholesale'), desc: 'Distribütor, anbar və böyük həcmli satışlar' },
    { id: 'xidmet', icon: '🛠️', title: t('reg_type_service'), desc: 'Salonlar, klinikalar, təmir və digər xidmətlər' },
    { id: 'istehsalat', icon: '⚙️', title: t('reg_type_production'), desc: 'Zavodlar, fabriklər və xammal emalı' }
  ];

  const handleNextStep = () => {
    if (orgType) {
      setStep(2);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: '#f8fafc', color: '#0f172a', fontFamily: '"Inter", sans-serif' }}>
      
      {/* LEFT SIDEBAR - INFO */}
      <div style={{ flex: '0 0 40%', backgroundColor: '#020617', padding: '4rem', display: 'none', flexDirection: 'column', color: 'white' }} className="desktop-sidebar">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', marginBottom: '4rem' }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #10b981, #0ea5e9)' }}></div>
          <span style={{ fontSize: '1.5rem', fontWeight: 900, color: 'white' }}>ASHRALI</span>
        </Link>

        {step === 1 ? (
          <>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.2 }}>{t('reg_title')}</h1>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '3rem', lineHeight: 1.6 }}>
              {t('reg_desc')}
            </p>

            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <span style={{ color: '#10b981', fontSize: '1.5rem' }}>✓</span>
                <span style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: 1.5 }}>Müştəri borcları və ödənişlərin rahat idarə olunması</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <span style={{ color: '#10b981', fontSize: '1.5rem' }}>✓</span>
                <span style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: 1.5 }}>Müqavilə, hesabat və maliyyə sənədlərinin sistemləşdirilməsi</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <span style={{ color: '#10b981', fontSize: '1.5rem' }}>✓</span>
                <span style={{ color: '#cbd5e1', fontSize: '1.1rem', lineHeight: 1.5 }}>Hər təşkilat üçün ayrıca və təhlükəsiz məlumat mühiti</span>
              </li>
            </ul>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.2 }}>{t('reg_org_details')}</h1>
            <p style={{ color: '#94a3b8', fontSize: '1.1rem', marginBottom: '3rem', lineHeight: 1.6 }}>
              Bu addımda biznesiniz haqqında əsas məlumatları daxil edin. Müraciət təsdiqləndikdən sonra sistem üçün giriş məlumatları təqdim olunacaq.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
              <div style={{ position: 'absolute', left: '15px', top: '20px', bottom: '20px', width: '2px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
              
              <div style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#10b981', color: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>1</div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>Təşkilat məlumatları</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>Ad, əlaqəli şəxs, telefon və email qeyd olunur.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#1e293b', border: '2px solid #334155', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>2</div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>Subdomain seçimi</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>Məsələn: magaza.ashrali.az formatında fərdi giriş ünvanı.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#1e293b', border: '2px solid #334155', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>3</div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>Müraciətin göndərilməsi</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>Məlumatlar yoxlanıldıqdan sonra 14 günlük trial aktivləşəcək.</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* RIGHT CONTENT - FORM */}
      <div style={{ flex: '1', padding: '2rem 5%', display: 'flex', flexDirection: 'column' }}>
        
        {/* Mobile Header (visible only on small screens) */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '3rem' }} className="mobile-header">
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #10b981, #0ea5e9)' }}></div>
            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>ASHRALI</span>
          </Link>
          <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
            <LanguageSwitcher />
            <span style={{ marginLeft: '1rem' }}>{t('reg_has_account')}</span> <Link href="/login" style={{ color: '#0ea5e9', fontWeight: 600, textDecoration: 'none' }}>{t('reg_login_link')}</Link>
          </div>
        </div>

        {/* Desktop Login Link */}
        <div style={{ textAlign: 'right', marginBottom: '4rem', display: 'none', alignItems: 'center', gap: '1rem', justifyContent: 'flex-end' }} className="desktop-login-link">
          <LanguageSwitcher />
          <div>
            <span style={{ color: '#64748b' }}>{t('reg_has_account')}</span> <Link href="/login" style={{ color: '#0ea5e9', fontWeight: 600, textDecoration: 'none', marginLeft: '0.5rem' }}>{t('reg_login_link')}</Link>
          </div>
        </div>

        <div style={{ maxWidth: '600px', margin: '0 auto', width: '100%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingBottom: '4rem' }}>
          
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>{step === 1 ? t('reg_step1') : t('reg_step2')}</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              {step === 1 ? t('reg_choose_type') : t('reg_org_details')}
            </h2>
            <p style={{ color: '#64748b' }}>
              {step === 1 
                ? 'Seçiminizə əsasən qeydiyyat forması uyğunlaşdırılacaq.' 
                : 'Zəhmət olmasa məlumatları düzgün və tam formada daxil edin.'}
            </p>
          </div>

          {step === 1 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {orgTypes.map((type) => (
                <div 
                  key={type.id}
                  onClick={() => setOrgType(type.id)}
                  style={{ 
                    padding: '1.5rem', 
                    borderRadius: '16px', 
                    border: `2px solid ${orgType === type.id ? '#0ea5e9' : '#e2e8f0'}`,
                    backgroundColor: orgType === type.id ? '#f0f9ff' : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.5rem',
                    transition: 'all 0.2s',
                    boxShadow: orgType === type.id ? '0 4px 12px rgba(14, 165, 233, 0.1)' : 'none'
                  }}
                  className="org-type-card"
                >
                  <div style={{ fontSize: '2.5rem' }}>{type.icon}</div>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>{type.title}</h4>
                    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>{type.desc}</p>
                  </div>
                  <div style={{ marginLeft: 'auto', width: '24px', height: '24px', borderRadius: '50%', border: `2px solid ${orgType === type.id ? '#0ea5e9' : '#cbd5e1'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {orgType === type.id && <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#0ea5e9' }}></div>}
                  </div>
                </div>
              ))}

              <button 
                onClick={handleNextStep}
                disabled={!orgType}
                style={{ 
                  marginTop: '1.5rem',
                  padding: '1.2rem', 
                  backgroundColor: orgType ? '#0f172a' : '#cbd5e1', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '12px', 
                  fontWeight: 700, 
                  fontSize: '1.1rem',
                  cursor: orgType ? 'pointer' : 'not-allowed',
                  transition: 'background 0.3s'
                }}
              >
                Davam et →
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Selected Type Display */}
              <div style={{ padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginBottom: '0.25rem' }}>Seçdiyiniz təşkilat tipi</div>
                  <div style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>{orgTypes.find(t => t.id === orgType)?.icon}</span>
                    {orgTypes.find(t => t.id === orgType)?.title}
                  </div>
                </div>
                <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#0ea5e9', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Dəyiş</button>
              </div>

              {/* Registration Method Selection */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem' }}>
                <button 
                  type="button" 
                  onClick={() => setRegMethod('google')}
                  style={{
                    flex: 1,
                    padding: '0.85rem',
                    borderRadius: '10px',
                    border: `2px solid ${regMethod === 'google' ? '#0ea5e9' : '#cbd5e1'}`,
                    backgroundColor: regMethod === 'google' ? '#f0f9ff' : 'white',
                    color: regMethod === 'google' ? '#0ea5e9' : '#475569',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  🚀 Google (Gmail) ilə
                </button>
                <button 
                  type="button" 
                  onClick={() => setRegMethod('password')}
                  style={{
                    flex: 1,
                    padding: '0.85rem',
                    borderRadius: '10px',
                    border: `2px solid ${regMethod === 'password' ? '#0ea5e9' : '#cbd5e1'}`,
                    backgroundColor: regMethod === 'password' ? '#f0f9ff' : 'white',
                    color: regMethod === 'password' ? '#0ea5e9' : '#475569',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  🔑 E-poçt və Şifrə ilə
                </button>
              </div>


              <div className="form-group">
                <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>{t('reg_org_name')}</label>
                <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)} placeholder="Biznesinizin adı" style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>{t('reg_contact_person')}</label>
                  <input type="text" value={contactName} onChange={(e) => setContactName(e.target.value)} placeholder="Ad və Soyad" style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }} />
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>{t('reg_phone')}</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+994 (__) ___ __ __" style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }} />
                </div>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>{t('reg_email')} (*)</label>
                <input 
                  type="email" 
                  placeholder="nümunə@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }} 
                />
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>Giriş məlumatları bu ünvana göndəriləcək.</div>
              </div>

              {regMethod === 'password' && (
                <>
                  <div className="form-group">
                    <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Şifrə (*)</label>
                    <input 
                      type="password" 
                      placeholder="Ən az 6 simvol" 
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
                      style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: `1px solid ${passwordError ? '#ef4444' : '#cbd5e1'}`, fontSize: '1rem', outline: 'none' }} 
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Şifrənin təsdiqi (*)</label>
                    <input 
                      type="password" 
                      placeholder="Şifrəni təkrar daxil edin" 
                      value={passwordConfirm}
                      onChange={(e) => { setPasswordConfirm(e.target.value); setPasswordError(''); }}
                      onBlur={() => {
                        if (passwordConfirm && password !== passwordConfirm) {
                          setPasswordError('Şifrələr uyğun gəlmir');
                        }
                      }}
                      style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: `1px solid ${passwordError ? '#ef4444' : '#cbd5e1'}`, fontSize: '1rem', outline: 'none' }} 
                      required
                    />
                    {passwordError && (
                      <div style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        ⚠️ {passwordError}
                      </div>
                    )}
                  </div>
                </>
              )}


              <div className="form-group">
                <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>{t('reg_subdomain')}</label>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <input type="text" value={subdomain} onChange={(e) => setSubdomain(e.target.value)} placeholder="magaza1" style={{ flex: 1, padding: '1rem', borderRadius: '12px 0 0 12px', border: '1px solid #cbd5e1', borderRight: 'none', fontSize: '1rem', outline: 'none' }} />
                  <div style={{ padding: '1rem', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '0 12px 12px 0', color: '#64748b', fontWeight: 600 }}>.ashrali.az</div>
                </div>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>{t('reg_notes')}</label>
                <textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Xüsusi istəkləriniz və ya suallarınız..." style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none', resize: 'vertical' }}></textarea>
              </div>

              <button 
                disabled={isLoading}
                onClick={async () => {
                  if (!orgName || !contactName || !phone || !email || !subdomain) {
                    alert('Zəhmət olmasa bütün mütləq (*) xanaları doldurun');
                    return;
                  }
                  if (regMethod === 'password') {
                    if (!password || password.length < 6) {
                      alert('Zəhmət olmasa ən azı 6 simvoldan ibarət şifrə daxil edin');
                      return;
                    }
                    if (password !== passwordConfirm) {
                      setPasswordError('Şifrələr uyğun gəlmir');
                      alert('Şifrələr uyğun gəlmir. Zəhmət olmasa yenidən yoxlayın.');
                      return;
                    }
                  }
                  
                  setIsLoading(true);
                  try {
                    await fetch('/api/register-email', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        orgType: orgTypes.find(t => t.id === orgType)?.title,
                        orgName,
                        contactName,
                        phone,
                        email,
                        subdomain,
                        notes
                      }),
                    });

                    const supabase = createClient();
                    
                    if (regMethod === 'google') {
                      // Start Google OAuth flow directly after sending registration email
                      const { error: oauthError } = await supabase.auth.signInWithOAuth({
                        provider: 'google',
                        options: {
                          redirectTo: `${window.location.origin}/api/auth/callback?type=register`,
                          queryParams: {
                            prompt: 'select_account',
                          },
                        },
                      });
                      if (oauthError) {
                        throw oauthError;
                      }
                    } else {
                      // Register with email and password
                      const { error: signUpError } = await supabase.auth.signUp({
                        email,
                        password,
                        options: {
                          data: {
                            registered: true
                          }
                        }
                      });
                      if (signUpError) {
                        throw signUpError;
                      }
                      alert('Qeydiyyat uğurla tamamlandı!');
                      window.location.href = '/erp/dashboard';
                    }
                  } catch (error: any) {
                    console.error('Registration error:', error);
                    alert(error.message || 'Müraciət göndərilərkən xəta baş verdi.');
                    setIsLoading(false);
                  }
                }}

                style={{ 
                  marginTop: '1rem',
                  padding: '1.2rem', 
                  backgroundColor: '#0ea5e9', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '12px', 
                  fontWeight: 700, 
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  transition: 'background 0.3s',
                  textAlign: 'center',
                  display: 'block',
                  width: '100%'
                }}
              >
                {isLoading ? '...' : t('reg_btn_start')}
              </button>
              
              <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
                <span style={{ color: '#10b981' }}>🔒</span> Müraciət məlumatlarınız təhlükəsiz şəkildə emal olunur.
              </div>
            </div>
          )}

        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media (min-width: 1024px) {
          .desktop-sidebar { display: flex !important; }
          .mobile-header { display: none !important; }
          .desktop-login-link { display: block !important; }
        }
        
        .org-type-card:hover { border-color: #cbd5e1 !important; }
        
        .form-group input:focus, .form-group textarea:focus { border-color: #0ea5e9 !important; box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1); }
      `}} />
    </div>
  );
}

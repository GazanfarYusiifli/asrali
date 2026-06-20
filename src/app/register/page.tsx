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
  const [otpToken, setOtpToken] = useState('');
  
  // New form fields
  const [contactName, setContactName] = useState('');
  const [orgName, setOrgName] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [username, setUsername] = useState('');
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
          <img src="/logo.png" alt="ASRALI" style={{ height: "40px", width: "auto", borderRadius: "8px" }} />
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
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: step > 1 ? '#10b981' : '#1e293b', border: step > 1 ? 'none' : '2px solid #334155', color: step > 1 ? '#020617' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>1</div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>Təşkilat məlumatları</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>Ad, əlaqəli şəxs, telefon və email qeyd olunur.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: step > 2 ? '#10b981' : '#1e293b', border: step > 2 ? 'none' : '2px solid #334155', color: step > 2 ? '#020617' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', flexShrink: 0 }}>2</div>
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem' }}>E-poçt təsdiqi</h4>
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.5 }}>Təhlükəsizlik üçün e-poçt ünvanınız kod vasitəsilə təsdiqlənir.</p>
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
            <img src="/logo.png" alt="ASRALI" style={{ height: "32px", width: "auto", borderRadius: "8px" }} />
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
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>{step === 1 ? t('reg_step1') : step === 2 ? t('reg_step2') : 'Addım 3'}</div>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              {step === 1 ? t('reg_choose_type') : step === 2 ? t('reg_org_details') : 'E-poçt Təsdiqi'}
            </h2>
            <p style={{ color: '#64748b' }}>
              {step === 1 
                ? 'Seçiminizə əsasən qeydiyyat forması uyğunlaşdırılacaq.' 
                : step === 2
                  ? 'Zəhmət olmasa məlumatları düzgün və tam formada daxil edin.'
                  : 'E-poçt ünvanınıza göndərilən 6 rəqəmli kodu daxil edin.'}
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
          ) : step === 2 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Selected Type Display */}
              <div style={{ padding: '1rem', backgroundColor: '#f1f5f9', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginBottom: '0.25rem' }}>Seçdiyiniz təşkilat tipi</div>
                  <div style={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>{orgTypes.find(t => t.id === orgType)?.icon}</span>
                    {orgTypes.find(t => t.id === orgType)?.title}
                  </div>
                </div>
                <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#0ea5e9', fontWeight: 600, cursor: 'pointer', fontSize: '0.9rem' }}>Dəyiş</button>
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div className="form-group">
                  <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Ölkə (*)</label>
                  <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Azərbaycan" style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }} />
                </div>
                <div className="form-group">
                  <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>Şəhər (*)</label>
                  <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Bakı" style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }} />
                </div>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>İstifadəçi adı (Opsional)</label>
                <input 
                  type="text" 
                  value={username} 
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!val.includes('@')) {
                      setUsername(val);
                    }
                  }} 
                  placeholder="istifadeci_adi ( @ simvolsuz )" 
                  style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', outline: 'none' }} 
                />
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>E-poçt əvəzinə bu adla da giriş edə bilərsiniz.</div>
              </div>

              <button 
                disabled={isLoading}
                onClick={async () => {
                  if (!orgName || !contactName || !phone || !country || !city || !email) {
                    alert('Zəhmət olmasa bütün mütləq (*) xanaları doldurun');
                    return;
                  }
                  if (!password || password.length < 6) {
                    alert('Zəhmət olmasa ən azı 6 simvoldan ibarət şifrə daxil edin');
                    return;
                  }
                  if (password !== passwordConfirm) {
                    setPasswordError('Şifrələr uyğun gəlmir');
                    alert('Şifrələr uyğun gəlmir. Zəhmət olmasa yenidən yoxlayın.');
                    return;
                  }
                  
                  setIsLoading(true);
                  try {
                    const supabase = createClient();
                    
                    // Email registration logic follows...
                    await fetch('/api/register-email', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        orgType: orgTypes.find(t => t.id === orgType)?.title,
                        orgName,
                        phone,
                        country,
                        city,
                        email,
                        username
                      }),
                    });
                      // Register with email and password
                      const { data, error: signUpError } = await supabase.auth.signUp({
                        email,
                        password
                      });
                      if (signUpError) {
                        throw signUpError;
                      }
                      
                      // If email confirmation is disabled in Supabase, we get a session immediately.
                      if (data.session) {
                        const { error: updateError } = await supabase.auth.updateUser({
                          data: { registered: true }
                        });
                        if (updateError) throw updateError;
                        
                        // Create tenant and subscription via RPC
                        const { error: rpcError } = await supabase.rpc('complete_user_registration', {
                          p_full_name: contactName,
                          p_company_name: orgName,
                          p_phone: phone,
                          p_country: country,
                          p_city: city,
                          p_username: username,
                          p_email: email
                        });
                        if (rpcError) throw rpcError;

                        alert('Qeydiyyat uğurla tamamlandı! 14 günlük sınaq müddətiniz başladı.');
                        window.location.href = '/erp/dashboard';
                      } else {
                        // Session is null meaning Supabase still requires email confirmation.
                        alert('Xəta: Supabase panelində "Confirm Email" (E-poçt təsdiqi) aktivdir. Zəhmət olmasa Authentication > Providers > Email bölməsindən "Confirm email" seçimini deaktiv edin və yenidən cəhd edin.');
                        setIsLoading(false);
                      }
                  } catch (error: any) {
                    console.error('Registration error:', error);
                    const errMsg = error.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
                    alert(errMsg || 'Müraciət göndərilərkən xəta baş verdi.');
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
                {isLoading ? 'Gözləyin...' : 'E-poçt ilə Qeydiyyatı Tamamla'}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.5rem 0', color: '#64748b' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
                <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 600 }}>və ya</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }}></div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%' }}>
                <button 
                  type="button" 
                  onClick={async () => {
                    const supabase = createClient();
                    await supabase.auth.signInWithOAuth({
                      provider: 'google',
                      options: {
                        redirectTo: `${window.location.origin}/api/auth/callback?type=register`,
                        queryParams: {
                          prompt: 'select_account',
                        },
                      },
                    });
                  }}
                  className="oauth-btn google-btn"
                >
                  <div style={{ backgroundColor: 'white', borderRadius: '50%', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.78 15.72 17.56V20.31H19.28C21.36 18.4 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                      <path d="M12 23C14.97 23 17.46 22.02 19.28 20.31L15.72 17.56C14.73 18.22 13.48 18.63 12 18.63C9.13 18.63 6.7 16.69 5.82 14.1H2.15V16.94C3.96 20.53 7.69 23 12 23Z" fill="#34A853"/>
                      <path d="M5.82 14.1C5.6 13.44 5.47 12.73 5.47 12C5.47 11.27 5.6 10.56 5.82 9.9V7.06H2.15C1.41 8.54 1 10.22 1 12C1 13.78 1.41 15.46 2.15 16.94L5.82 14.1Z" fill="#FBBC05"/>
                      <path d="M12 5.38C13.62 5.38 15.06 5.94 16.2 7.02L19.36 3.86C17.46 2.09 14.97 1 12 1C7.69 1 3.96 3.47 2.15 7.06L5.82 9.9C6.7 7.31 9.13 5.38 12 5.38Z" fill="#EA4335"/>
                    </svg>
                  </div>
                  Google ilə qeydiyyatdan keç
                </button>

                <button 
                  type="button" 
                  onClick={async () => {
                    const supabase = createClient();
                    await supabase.auth.signInWithOAuth({
                      provider: 'facebook',
                      options: {
                        redirectTo: `${window.location.origin}/api/auth/callback?type=register`,
                      },
                    });
                  }}
                  className="oauth-btn facebook-btn"
                >
                  <div style={{ backgroundColor: '#1877F2', borderRadius: '50%', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M23.9981 11.9991C23.9981 5.37216 18.626 0 11.9991 0C5.37216 0 0 5.37216 0 11.9991C0 17.9882 4.38789 22.9522 10.1242 23.8524V15.4676H7.07758V11.9991H10.1242V9.35553C10.1242 6.34826 11.9156 4.68714 14.6564 4.68714C15.9692 4.68714 17.3424 4.92149 17.3424 4.92149V7.87439H15.8294C14.3388 7.87439 13.874 8.79933 13.874 9.74824V11.9991H17.2018L16.6698 15.4676H13.874V23.8524C19.6103 22.9522 23.9981 17.9882 23.9981 11.9991Z" fill="white"/>
                    </svg>
                  </div>
                  Facebook ilə qeydiyyatdan keç
                </button>
              </div>
              
            <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#64748b', marginTop: '0.5rem' }}>
              <span style={{ color: '#10b981' }}>🔒</span> Müraciət məlumatlarınız təhlükəsiz şəkildə emal olunur.
            </div>
          </div>
          ) : step === 3 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: 'white', padding: '2rem', borderRadius: '16px', border: '1px solid #cbd5e1' }}>
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✉️</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Kodu daxil edin</h3>
                <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                  <b>{email}</b> ünvanına 6 rəqəmli təsdiq kodu göndərdik.
                </p>
              </div>

              <div className="form-group">
                <input 
                  type="text" 
                  maxLength={6}
                  value={otpToken} 
                  onChange={(e) => setOtpToken(e.target.value.replace(/\D/g, ''))} 
                  placeholder="------" 
                  style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '2rem', letterSpacing: '0.5rem', textAlign: 'center', outline: 'none', fontWeight: 700 }} 
                />
              </div>

              <button 
                disabled={isLoading || otpToken.length !== 6}
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    const supabase = createClient();
                    const { data, error } = await supabase.auth.verifyOtp({
                      email,
                      token: otpToken,
                      type: 'signup'
                    });

                    if (error) throw error;

                    if (data.session) {
                      const { error: updateError } = await supabase.auth.updateUser({
                        data: { registered: true }
                      });
                      if (updateError) throw updateError;
                      
                      // Create tenant and subscription via RPC
                      const { error: rpcError } = await supabase.rpc('complete_user_registration', {
                        p_full_name: contactName,
                        p_company_name: orgName,
                        p_phone: phone,
                        p_country: country,
                        p_city: city,
                        p_username: username,
                        p_email: email
                      });
                      if (rpcError) throw rpcError;

                      alert('Qeydiyyat uğurla tamamlandı! 14 günlük sınaq müddətiniz başladı.');
                      window.location.href = '/erp/dashboard';
                    }
                  } catch (error: any) {
                    console.error('OTP Error:', error);
                    alert(error.message || 'Kod yanlışdır və ya müddəti bitib.');
                  } finally {
                    setIsLoading(false);
                  }
                }}
                style={{ 
                  marginTop: '0.5rem',
                  padding: '1.2rem', 
                  backgroundColor: otpToken.length === 6 ? '#10b981' : '#cbd5e1', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '12px', 
                  fontWeight: 700, 
                  fontSize: '1.1rem',
                  cursor: otpToken.length === 6 ? 'pointer' : 'not-allowed',
                  transition: 'background 0.3s',
                  width: '100%'
                }}
              >
                {isLoading ? 'Yoxlanılır...' : 'Təsdiqlə və Daxil ol'}
              </button>

              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <button onClick={() => setStep(2)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.9rem', textDecoration: 'underline' }}>
                  Geri qayıt və e-poçtu dəyiş
                </button>
              </div>
            </div>
          ) : null}

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

        .oauth-btn {
          width: 100%;
          padding: 1.2rem;
          color: white;
          border: none;
          borderRadius: 12px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1.1rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          transition: all 0.2s;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        .google-btn {
          background-color: white;
          color: #0f172a;
          border: 1px solid #cbd5e1;
        }
        .google-btn:hover {
          background-color: #f8fafc;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }
        .facebook-btn {
          background-color: #1877F2;
          color: white;
        }
        .facebook-btn:hover {
          background-color: #166FE5;
          box-shadow: 0 10px 15px -3px rgba(24, 119, 242, 0.3);
          transform: translateY(-2px);
        }
      `}} />
    </div>
  );
}

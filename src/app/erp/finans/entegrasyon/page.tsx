'use client';
import React, { useState } from 'react';
import { Link2, Building2, CheckCircle2, FileText, PhoneCall, Lock, Crown, ArrowRight } from 'lucide-react';

export default function BankIntegrationPage() {
  const [processingBank, setProcessingBank] = useState<string | null>(null);
  
  // Simulated PRO state
  const isProMode = false;

  const handleIntegrate = (bankId: string) => {
    if (!isProMode) return;
    
    setProcessingBank(bankId);
    const selected = banks.find(b => b.id === bankId);
    setTimeout(() => {
      setProcessingBank(null);
      const isConfirmed = window.confirm(`Sistem ${selected?.name} serverlərinə qoşulmağa hazırdır.\n\nBankın rəsmi portalında ASAN İmza ilə təsdiq etmək üçün bankın səhifəsinə yönləndirilməyə razısınızmı?`);
      if (isConfirmed) {
        window.open(`https://www.google.com/search?q=${selected?.name}+Business+Internet+Banking`, '_blank');
      } else {
        if(window.confirm(`Əgər çətinlik çəkirsinizsə, ${selected?.name} çağrı mərkəzinə (${selected?.contact}) zəng edək?`)) {
          window.location.href = `tel:${selected?.contact}`;
        }
      }
    }, 1200);
  };

  const banks = [
    { id: 'kapital', name: 'Kapital Bank', color: '#dc2626', initials: 'KB', contact: '*8196' },
    { id: 'abb', name: 'ABB', fullName: 'Azərbaycan Beynəlxalq Bankı', color: '#2563eb', initials: 'ABB', contact: '936' },
    { id: 'pasha', name: 'PAŞA Bank', color: '#064e3b', initials: 'PB', contact: '*8123' },
    { id: 'unibank', name: 'Unibank', color: '#f97316', initials: 'UB', contact: '117' },
    { id: 'leobank', name: 'Leobank', color: '#0f172a', initials: 'LB', contact: '*7777' },
    { id: 'xalq', name: 'Xalq Bank', color: '#475569', initials: 'XB', contact: '138' }
  ];

  return (
    <div style={{ position: 'relative', minHeight: '100%', backgroundColor: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* PRO Lock Overlay */}
      {!isProMode && (
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50, backdropFilter: 'blur(6px) grayscale(40%)', backgroundColor: 'rgba(248, 250, 252, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)', maxWidth: '500px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', margin: '2rem' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 10px 15px -3px rgba(217, 119, 6, 0.4)' }}>
              <Lock size={40} />
            </div>
            
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Crown size={24} color="#d97706" />
                <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>PRO Versiya</h2>
              </div>
              <p style={{ margin: '0.5rem 0 0 0', color: '#475569', fontSize: '1.05rem', lineHeight: '1.6' }}>
                Bank İnteqrasiyası yalnız <strong>PRO paket</strong> istifadəçiləri üçündür. Bütün bank hesablarınızı canlı izləmək və avtomatlaşdırmaq üçün paketinizi yüksəldin.
              </p>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: '0.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.8rem', width: '100%', textAlign: 'left' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#334155', fontSize: '0.95rem', fontWeight: 500 }}>
                <CheckCircle2 size={18} color="#10b981" /> Canlı hesab qalıqları və tranzaksiyalar
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#334155', fontSize: '0.95rem', fontWeight: 500 }}>
                <CheckCircle2 size={18} color="#10b981" /> Avtomatik gəlir-xərc sinxronizasiyası
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#334155', fontSize: '0.95rem', fontWeight: 500 }}>
                <CheckCircle2 size={18} color="#10b981" /> Birbaşa bank portallarına sürətli keçid
              </li>
            </ul>

            <button style={{ width: '100%', padding: '1.2rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: '14px', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.4)', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>
              PRO Paketə Yüksəlt <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Main Content (Blurred if not PRO) */}
      <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', filter: !isProMode ? 'blur(4px)' : 'none', pointerEvents: !isProMode ? 'none' : 'auto', userSelect: !isProMode ? 'none' : 'auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#e0f2fe', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Link2 size={32} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: '#0f172a', margin: 0, fontWeight: 900, letterSpacing: '-0.5px' }}>
              Bank İnteqrasiyası
            </h1>
            <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '1rem' }}>Bütün bank hesablarınızı ERP sisteminə bağlayın və canlı izləyin</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', flex: 1 }}>
          
          {/* Info Card (Landscape) */}
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '0.5rem', backgroundColor: '#eff6ff', borderRadius: '10px' }}><Building2 size={24} color="#3b82f6"/></div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#1e293b' }}>NECƏ İŞLƏYİR?</h2>
            </div>
            
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }}/>
                <span style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.5' }}>İlk olaraq inteqrasiya etmək istədiyiniz bank filialına müraciət edərək "İnteqrasiya Əlavə Et" sorğusunu təsdiqlətməlisiniz.</span>
              </li>
              <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }}/>
                <span style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.5' }}>Hesab hərəkətləriniz (Kassa və Bank + Bank İnteqrasiyası) səhifənizdə avtomatik olaraq siyahıya alınır.</span>
              </li>
              <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }}/>
                <span style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.5' }}>Hesabınıza daxil olan və xaric olan pulları müştəri, tədarükçü, işçi və gəlir-xərc kateqoriyaları ilə uyğunlaşdırdıqda avtomatik olaraq hesablara işlənir.</span>
              </li>
              <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }}/>
                <span style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.5' }}>Mühasib panelindən bank hərəkətlərinizi mühasibiniz istədiyi zaman onlayn əldə edə bilər.</span>
              </li>
              <li style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }}/>
                <span style={{ color: '#475569', fontSize: '0.95rem', lineHeight: '1.5' }}>Bütün banklarınızdakı cari balansları tək və eyni ekranda saniyə-saniyə görə bilərsiniz.</span>
              </li>
            </ul>
          </div>

          {/* Action Form / Bank Grid (Landscape) */}
          <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '2.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>Bankı Seçin</h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>Aşağıdakı siyahıdan inteqrasiya etmək istədiyiniz bankı seçib müraciət göndərin</p>
              </div>
              
              <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', padding: '1rem 1.5rem', borderRadius: '16px', display: 'flex', gap: '1.5rem', maxWidth: '500px' }}>
                <div style={{ padding: '0.5rem', backgroundColor: '#fef3c7', borderRadius: '10px', height: 'fit-content' }}>
                  <FileText size={24} color="#d97706"/>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <strong style={{ color: '#92400e', fontSize: '0.95rem' }}>İnteqrasiya üçün Tələb Olunan Sənədlər:</strong>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#b45309', fontSize: '0.85rem', lineHeight: '1.5' }}>
                    <li>ASAN İmza vasitəsilə müraciət formunun imzalanması</li>
                    <li>Bank tərəfindən təqdim edilən API müqaviləsinin təsdiqi</li>
                    <li>Şirkətin VÖEN və rəhbərin şəxsiyyət vəsiqəsi surəti</li>
                  </ul>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
              {banks.map((bank) => (
                <div key={bank.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '16px', backgroundColor: '#f8fafc', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }} onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = bank.color; }} onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.02)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
                  
                  {/* Fake Logo */}
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: bank.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 900, marginBottom: '1rem', boxShadow: `0 4px 10px ${bank.color}40` }}>
                    {bank.initials}
                  </div>
                  
                  {/* Bank Name */}
                  <h4 style={{ margin: '0 0 0.2rem 0', fontSize: '1.05rem', fontWeight: 800, color: '#1e293b', textAlign: 'center' }}>{bank.name}</h4>
                  {bank.fullName && <span style={{ fontSize: '0.75rem', color: '#94a3b8', textAlign: 'center', marginBottom: '0.5rem', minHeight: '18px' }}>{bank.fullName}</span>}
                  {!bank.fullName && <span style={{ marginBottom: '0.5rem', minHeight: '18px' }}></span>}

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1.2rem' }}>
                    <PhoneCall size={14}/> <span>{bank.contact}</span>
                  </div>

                  {/* Button */}
                  <button 
                    onClick={() => handleIntegrate(bank.id)}
                    disabled={processingBank !== null}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.8rem', backgroundColor: processingBank === bank.id ? '#94a3b8' : 'white', color: processingBank === bank.id ? 'white' : bank.color, border: `1px solid ${processingBank === bank.id ? '#94a3b8' : bank.color}`, borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem', cursor: processingBank !== null ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
                    onMouseOver={e => { if(processingBank === null) { e.currentTarget.style.backgroundColor = bank.color; e.currentTarget.style.color = 'white'; } }}
                    onMouseOut={e => { if(processingBank === null) { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.color = bank.color; } }}
                  >
                    {processingBank === bank.id ? 'Göndərilir...' : 'İnteqrasiya Et'}
                  </button>
                </div>
              ))}
            </div>
            
            <div style={{ textAlign: 'center', fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.5rem' }}>
              * Bank təsdiqi qanunvericiliyə uyğun olaraq 1-3 iş günü çəkə bilər. Əlavə suallarınız üçün müvafiq bankın çağrı mərkəzi ilə əlaqə saxlaya bilərsiniz.
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

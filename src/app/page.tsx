'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from './context/I18nContext';
import LanguageSwitcher from './components/LanguageSwitcher';

export default function Home() {
  const { t } = useI18n();
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#020617', color: '#e2e8f0', overflowX: 'hidden', fontFamily: '"Inter", system-ui, -apple-system, sans-serif' }}>
      
      {/* HEADER / NAVBAR */}
      <header style={{ 
        position: 'fixed', top: 0, left: 0, right: 0, 
        padding: '1rem 5%', 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: 'rgba(2, 6, 23, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        zIndex: 100,
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} className="hover-lift-sm">
          <img src="/logo.png" alt="ASRALI Logo" style={{ height: "40px", width: "auto", borderRadius: "8px" }} />
          <span style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.5px', color: 'white' }}>ASRALI</span>
        </div>
        
        <nav style={{ display: 'none', gap: '2.5rem', alignItems: 'center' }} className="desktop-nav">
          <a href="#xususiyyetler" className="nav-link">{t('nav_features')}</a>
          <a href="#is-prinsipi" className="nav-link">{t('nav_how_it_works')}</a>
          <a href="#teskilat-novleri" className="nav-link">{t('nav_organizations')}</a>
          <a href="#qiymetler" className="nav-link">{t('nav_pricing')}</a>
        </nav>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <LanguageSwitcher />
          <Link href="/login" className="nav-link-bold">
            {t('nav_login')}
          </Link>
          <Link href="/register" className="btn-primary">
            {t('nav_register')}
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section style={{ 
        padding: '12rem 5% 6rem', 
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'radial-gradient(ellipse at top, #0f172a 0%, #020617 70%)',
      }}>
        {/* Background Image & Effects */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, opacity: 0.1 }}>
           <Image src="/hero_abstract.png" alt="Abstract Background" fill style={{ objectFit: 'cover', objectPosition: 'center' }} priority />
        </div>
        <div style={{ position: 'absolute', top: '10%', left: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', filter: 'blur(60px)', zIndex: 1, animation: 'float 20s ease-in-out infinite' }}></div>
        <div style={{ position: 'absolute', bottom: '10%', right: '-5%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', filter: 'blur(60px)', zIndex: 1, animation: 'float 15s ease-in-out infinite reverse' }}></div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1000px', margin: '0 auto' }} className="fade-in-up">
          <div className="badge-pill">
            <span style={{ marginRight: '8px' }}>✨</span> {t('hero_badge')}
          </div>
          
          <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', fontWeight: 900, marginBottom: '1.5rem', lineHeight: 1.05, letterSpacing: '-2px', color: 'white', whiteSpace: 'pre-line' }}>
            {t('hero_title').split('\n')[0]} <br/>
            <span style={{ position: 'relative', display: 'inline-block' }}>
              <span style={{ background: 'linear-gradient(135deg, #34d399, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', position: 'relative', zIndex: 2 }}>
                {t('hero_title').split('\n')[1] || ''}
              </span>
            </span>
          </h1>
          
          <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', color: '#94a3b8', maxWidth: '800px', margin: '0 auto 3rem', lineHeight: 1.6, fontWeight: 400 }}>
            {t('hero_desc')}
          </p>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem' }}>
            <Link href="/register" className="btn-primary btn-large glow-effect">
              {t('btn_register_now')}
            </Link>
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW MOCKUP */}
      <section style={{ padding: '0 5% 6rem', marginTop: '-6rem', position: 'relative', zIndex: 10 }} className="fade-in-up delay-1">
        <div style={{ maxWidth: '1200px', margin: '0 auto', perspective: '1000px' }}>
          <div className="glass-dashboard hover-3d">
            <Image 
              src="/dashboard_mockup.png" 
              alt="ASRALI Dashboard Mockup" 
              width={1200} 
              height={800} 
              style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '16px' }}
            />
          </div>
        </div>
      </section>

      {/* METRICS */}
      <section style={{ padding: '2rem 5% 6rem' }}>
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', maxWidth: '1000px', margin: '0 auto', backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '3rem', borderRadius: '32px', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 40px -15px rgba(0,0,0,0.5)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'white', marginBottom: '0.5rem' }}>10+</div>
              <div style={{ color: '#94a3b8', fontSize: '1rem', fontWeight: 600 }}>maliyyə və idarəetmə modulu</div>
            </div>
            <div style={{ textAlign: 'center', position: 'relative' }}>
              <div className="vertical-divider"></div>
              <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'white', marginBottom: '0.5rem' }}>1 panel</div>
              <div style={{ color: '#94a3b8', fontSize: '1rem', fontWeight: 600 }}>satış, alış və hesabat nəzarəti</div>
            </div>
            <div style={{ textAlign: 'center', position: 'relative' }}>
              <div className="vertical-divider"></div>
              <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'white', marginBottom: '0.5rem' }}>24/7</div>
              <div style={{ color: '#94a3b8', fontSize: '1rem', fontWeight: 600 }}>sistemə onlayn giriş imkanı</div>
            </div>
          </div>
      </section>

      {/* CORE BENEFITS TICKER */}
      <section style={{ padding: '2rem 0', backgroundColor: '#020617', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <div className="ticker-wrapper">
          <div className="ticker-content">
            <span className="ticker-item"><span className="ticker-icon">✓</span> Multi-tenant struktur: hər biznes üçün ayrı məlumat bazası</span>
            <span className="ticker-item"><span className="ticker-icon">✓</span> Müqavilə, qəbz və hesabatların ixrac imkanı</span>
            <span className="ticker-item"><span className="ticker-icon">✓</span> Rol əsaslı giriş və icazə sistemi</span>
            {/* Duplicated for infinite scroll */}
            <span className="ticker-item"><span className="ticker-icon">✓</span> Multi-tenant struktur: hər biznes üçün ayrı məlumat bazası</span>
            <span className="ticker-item"><span className="ticker-icon">✓</span> Müqavilə, qəbz və hesabatların ixrac imkanı</span>
            <span className="ticker-item"><span className="ticker-icon">✓</span> Rol əsaslı giriş və icazə sistemi</span>
          </div>
        </div>
      </section>

      {/* FEATURES (Niyə ASRALI?) */}
      <section id="xususiyyetler" style={{ padding: '8rem 5%', backgroundColor: '#0f172a', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at top right, rgba(16,185,129,0.05), transparent 600px)' }}></div>
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }} className="fade-in-up reveal">
            <h2 className="section-subtitle">Əsas imkanlar</h2>
            <h3 className="section-title">Niyə ASRALI?</h3>
            <p className="section-desc">
              Biznesinizin gündəlik maliyyə və idarəetmə əməliyyatlarını vahid sistemdə toplamaq üçün hazırlanmış modullar.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {[
              { icon: '📊', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.1)', title: 'Müştəri və Satış idarəetməsi', desc: 'Müştəri məlumatları, müqavilələr, borc xülasələri və ödəniş tarixçəsi bir ekranda idarə olunur.' },
              { icon: '📄', color: '#f87171', bg: 'rgba(248, 113, 113, 0.1)', title: 'Avtomatik müqavilələr', desc: 'Şablon əsaslı müqavilə yaratmaq, avtomatik nömrələmə, çap və PDF ixrac funksiyaları.' },
              { icon: '💹', color: '#34d399', bg: 'rgba(52, 211, 153, 0.1)', title: 'Maliyyə hesabatları', desc: 'Gəlir-xərc analizi, borc hesabatları, kassa və bank balansı real vaxt göstəriciləri ilə izlənir.' },
              { icon: '📦', color: '#a78bfa', bg: 'rgba(167, 139, 250, 0.1)', title: 'İnventar və Stok idarəetmə', desc: 'Anbar inventarı, sərfiyyat materialları, verilmə və geri qaytarılma əməliyyatları nəzarətdə saxlanılır.' },
              { icon: '👥', color: '#fbbf24', bg: 'rgba(251, 191, 36, 0.1)', title: 'Əməkdaş idarəetməsi', desc: 'Əməkdaş məlumatları, vəzifələr, staj hesablamaları, maaşlar və kateqoriyalar üzrə sistemli uçot.' },
              { icon: '🔒', color: '#cbd5e1', bg: 'rgba(203, 213, 225, 0.1)', title: 'Təhlükəsiz struktur', desc: 'Hər biznes üçün ayrıca məlumat bazası, lisenziya və rol əsaslı icazə sistemi.' }
            ].map((feature, i) => (
              <div key={i} className="feature-card reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="feature-icon" style={{ backgroundColor: feature.bg, color: feature.color }}>{feature.icon}</div>
                <h4 className="feature-title">{feature.title}</h4>
                <p className="feature-desc">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (UPDATED REGISTRATION FLOW) */}
      <section id="is-prinsipi" style={{ padding: '8rem 5%', backgroundColor: '#020617', color: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(16,185,129,0.1), transparent 70%)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', borderRadius: '50%', pointerEvents: 'none' }}></div>
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }} className="reveal">
            <h2 className="section-subtitle" style={{ color: '#34d399' }}>Sürətli Başlanğıc</h2>
            <h3 className="section-title" style={{ color: 'white' }}>Biznesinizi İdarə Etməyə 3 Addımda Başlayın</h3>
            <p className="section-desc" style={{ color: '#94a3b8' }}>
              Qeydiyyatdan keçdiyiniz an sistem dərhal aktivləşir və 14 gün pulsuz sınaq istifadəsi başlayır.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', position: 'relative' }}>
            <div className="step-line"></div>

            {[
              { num: 1, title: 'Sürətli Qeydiyyat', desc: 'Google hesabınızla və ya mail ünvanınızla cəmi 1 klikə qeydiyyatdan keçin.' },
              { num: 2, title: 'Anında Aktivasiya', desc: 'Sistem sizin üçün ayrıca məlumat bazası yaradır və 14 günlük pulsuz TRIAL rejimini aktivləşdirir.' },
              { num: 3, title: 'Sistemdən İstifadə', desc: 'İdarəetmə paneliniz tam hazırdır! Xərclərinizi, satışlarınızı və anbarınızı dərhal daxil edə bilərsiniz.' }
            ].map((step, i) => (
              <div key={i} className="step-card reveal" style={{ transitionDelay: `${i * 0.2}s` }}>
                <div className="step-number">{step.num}</div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', color: 'white' }}>{step.title}</h4>
                <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '4rem' }} className="reveal">
             <Link href="/register" className="btn-primary btn-large glow-effect" style={{ display: 'inline-block' }}>
               İndi Qeydiyyatdan Keç →
             </Link>
          </div>
        </div>
      </section>

      {/* COMPATIBILITY (Təşkilat növləri) */}
      <section id="teskilat-novleri" style={{ padding: '8rem 5%', backgroundColor: '#0f172a' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }} className="reveal">
            <h2 className="section-subtitle">Uyğunluq</h2>
            <h3 className="section-title" style={{ color: 'white' }}>Hər Təşkilat Növü Üçün</h3>
            <p className="section-desc" style={{ color: '#94a3b8' }}>
              ASRALI müxtəlif ölçülü və fərqli idarəetmə modelinə sahib müəssisələrə asanlıqla uyğunlaşdırıla bilər.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
             {[
              { icon: '🏪', title: 'Pərakəndə Mağazalar', desc: 'Kassa satışları, barkodlu anbar izlənməsi və gündəlik hesabatlar.' },
              { icon: '🏢', title: 'Topdansatış', desc: 'Müştəri borcları, E-Faktura, böyük anbar transferləri və sifarişlər.' },
              { icon: '🛠️', title: 'Xidmət Sektoru', desc: 'Müqaviləli ödənişlər, aylıq abonəliklər, layihə xərcləri və personal.' },
              { icon: '⚙️', title: 'İstehsalat', desc: 'Xammal qeydiyyatı, istehsalat xərcləri, maya dəyərinin hesablanması.' }
            ].map((org, i) => (
              <div key={i} className="org-card reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="org-icon">{org.icon}</div>
                <h4 className="org-title">{org.title}</h4>
                <p className="org-desc">{org.desc}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* PRICING (Qiymətləndirmə) - 3 PACKAGES */}
      <section id="qiymetler" style={{ padding: '8rem 5%', backgroundColor: '#020617', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }} className="reveal">
            <h2 className="section-subtitle">Qiymətləndirmə</h2>
            <h3 className="section-title" style={{ color: 'white' }}>Sizə Uyğun Paketi Seçin</h3>
            <p className="section-desc" style={{ color: '#94a3b8' }}>
              Biznesinizin ölçüsünə uyğun, heç bir gizli xərc olmayan şəffaf qiymətləndirmə.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'stretch' }}>
            
            {/* Sadə Paket */}
            <div className="pricing-card reveal" style={{ transitionDelay: '0.1s' }}>
              <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>SADƏ PAKET</h4>
              <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Sistemi test etmək istəyənlər üçün</p>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: 'white', marginBottom: '0.5rem', letterSpacing: '-1px' }}>Pulsuz</div>
              <div style={{ color: '#10b981', fontWeight: 700, marginBottom: '2.5rem' }}>14 GÜN</div>
              
              <ul className="pricing-list">
                <li className="pricing-list-item"><span className="pricing-check">✓</span> Bütün modullara tam çıxış</li>
                <li className="pricing-list-item"><span className="pricing-check">✓</span>Limitsiz satış və alış əməliyyatı</li>
                <li className="pricing-list-item"><span className="pricing-check">✓</span> Bulud əsaslı məlumat yaddaşı</li>
                <li className="pricing-list-item"><span className="pricing-check">✓</span> 1 İdarəçi hesabı</li>
              </ul>

              <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                 <Link href="/register" className="btn-outline" style={{ display: 'block', width: '100%', borderColor: 'rgba(255,255,255,0.2)' }}>
                   İndi Yoxla
                 </Link>
              </div>
            </div>

            {/* PRO Paket (POPULAR) */}
            <div className="pricing-card pricing-card-pro reveal" style={{ transitionDelay: '0.2s' }}>
              <div style={{ position: 'absolute', top: '-15px', right: '10%', background: 'linear-gradient(135deg, #10b981, #0ea5e9)', color: 'white', padding: '0.4rem 1rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 800, letterSpacing: '1px', boxShadow: '0 4px 10px rgba(16,185,129,0.3)' }}>ƏN ÇOX SEÇİLƏN</div>
              
              <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>PRO PAKET</h4>
              <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Kiçik və orta bizneslər üçün ideal</p>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
                <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', marginTop: '0.5rem', marginRight: '4px' }}>₼</span>
                <span style={{ fontSize: '3.5rem', fontWeight: 900, background: 'linear-gradient(135deg, #10b981, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-1px' }}>49</span>
              </div>
              <div style={{ color: '#94a3b8', fontWeight: 500, marginBottom: '2.5rem' }}>aylıq ödəniş</div>
              
              <ul className="pricing-list">
                <li className="pricing-list-item"><span className="pricing-check">✓</span> Bütün PRO funksionallıqlar</li>
                <li className="pricing-list-item"><span className="pricing-check">✓</span> E-faktura və Bank inteqrasiyası</li>
                <li className="pricing-list-item"><span className="pricing-check">✓</span> Qabaqcıl Hesabatlar</li>
                <li className="pricing-list-item"><span className="pricing-check">✓</span> 5+ İstifadəçi hesabı</li>
                <li className="pricing-list-item"><span className="pricing-check">✓</span> 7/24 Prioritetli texniki dəstək</li>
              </ul>

              <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                 <Link href="/register" className="btn-primary" style={{ display: 'block', width: '100%' }}>
                   Abunə Ol
                 </Link>
              </div>
            </div>

            {/* Korporativ Paket */}
            <div className="pricing-card reveal" style={{ transitionDelay: '0.3s' }}>
              <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>KORPORATİV</h4>
              <p style={{ color: '#94a3b8', marginBottom: '2rem' }}>Böyük müəssisə və şirkətlər üçün</p>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'white', margin: '0.5rem 0 0.5rem', letterSpacing: '-1px', lineHeight: 1.2 }}>Razılaşma<br/>Əsasında</div>
              <div style={{ color: 'transparent', fontWeight: 700, marginBottom: '1.5rem' }}>-</div>
              
              <ul className="pricing-list">
                <li className="pricing-list-item"><span className="pricing-check">✓</span> Özəl funksionallıqların inkişafı</li>
                <li className="pricing-list-item"><span className="pricing-check">✓</span> Xüsusi Server və Domen</li>
                <li className="pricing-list-item"><span className="pricing-check">✓</span> Mövcud proqramlara inteqrasiya</li>
                <li className="pricing-list-item"><span className="pricing-check">✓</span> Limitsiz istifadəçi hüquqları</li>
              </ul>

              <div style={{ marginTop: 'auto', paddingTop: '2rem' }}>
                 <Link href="/login" className="btn-outline" style={{ display: 'block', width: '100%', borderColor: 'rgba(255,255,255,0.2)' }}>
                   Əlaqə Saxla
                 </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" style={{ padding: '8rem 5%', backgroundColor: '#0f172a' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }} className="reveal">
            <h2 style={{ fontSize: '3rem', fontWeight: 900, color: 'white', letterSpacing: '-1px' }}>Tez-tez verilən suallar</h2>
            <p style={{ fontSize: '1.125rem', color: '#94a3b8', marginTop: '1rem' }}>
              Sistem, qeydiyyat, qiymət və təhlükəsizliklə bağlı əsas cavablar.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="faq-card reveal">
              <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>ASRALI nədir?</h4>
              <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>ASRALI mağazalar, şirkətlər, kurslar və digər biznes müəssisələri üçün hazırlanmış maliyyə idarəetmə sistemidir (ERP). Sistem ödəniş, borc, müqavilə, xərc, inventar və hesabat proseslərini vahid paneldə toplamağa kömək edir.</p>
            </div>
            
            <div className="faq-card reveal">
              <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>Sistemdən necə istifadə edə bilərəm?</h4>
              <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>Qeydiyyatdan keçdiyiniz an sistemə giriş edirsiniz və 14 günlük pulsuz sınaq müddəti (TRIAL) başlayır. Sistem tam onlayn (bulud) işləyir, kompüterə heç nə yükləməyə ehtiyac yoxdur.</p>
            </div>

            <div className="faq-card reveal">
              <h4 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>Məlumatlar təhlükəsiz saxlanılırmı?</h4>
              <p style={{ color: '#94a3b8', lineHeight: 1.6 }}>Bəli. Hər bir biznesin (müştərinin) məlumat bazası digərlərindən tamamilə izolyasiya edilmişdir. Təhlükəsizlik və icazələr xüsusi alqoritmlərlə qorunur.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section style={{ padding: '6rem 5%', background: 'linear-gradient(135deg, #0ea5e9, #10b981)', color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '100%', height: '200%', background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 60%)', transform: 'rotate(30deg)', pointerEvents: 'none' }}></div>
        <div style={{ position: 'relative', zIndex: 1 }} className="reveal">
          <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, marginBottom: '1.5rem', letterSpacing: '-1px' }}>Biznesinizi rəqəmsallaşdırmağa hazırsınız?</h2>
          <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.9)', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
            Qeydiyyatdan keçin və 14 gün ərzində bütün funksiyaları tamamilə pulsuz yoxlayın.
          </p>
          <Link href="/register" className="btn-white btn-large glow-effect" style={{ display: 'inline-block' }}>
            Hemen Qeydiyyatdan Keç
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ backgroundColor: '#020617', color: '#94a3b8', padding: '5rem 5% 2rem', position: 'relative', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '3rem', marginBottom: '2rem' }}>
          
          <div style={{ gridColumn: '1 / -1' }} className="footer-brand-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <img src="/logo.png" alt="ASRALI Logo" style={{ height: "40px", width: "auto", borderRadius: "8px" }} />
              <span style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.5px', color: 'white' }}>ASRALI</span>
            </div>
            <p style={{ lineHeight: 1.6, maxWidth: '300px', color: '#64748b' }}>
              Azərbaycan biznesləri üçün maliyyə idarəetməsini daha sadə, şəffaf və sistemli edən rəqəmsal platforma.
            </p>
          </div>

          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '1.5rem' }}>Keçidlər</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><a href="#xususiyyetler" className="footer-link">Xüsusiyyətlər</a></li>
              <li><a href="#is-prinsipi" className="footer-link">İş prinsipi</a></li>
              <li><a href="#teskilat-novleri" className="footer-link">Təşkilat növləri</a></li>
              <li><a href="#qiymetler" className="footer-link">Qiymətlər</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '1.5rem' }}>Hesab</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link href="/register" className="footer-link">Qeydiyyat</Link></li>
              <li><Link href="/login" className="footer-link">Daxil ol</Link></li>
              <li><a href="#faq" className="footer-link">Tez-tez verilən suallar</a></li>
            </ul>
          </div>

          <div>
            <h4 style={{ color: 'white', fontWeight: 700, marginBottom: '1.5rem' }}>Əlaqə</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.4rem', borderRadius: '50%' }}>✉</span> info@asrali.az</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.4rem', borderRadius: '50%' }}>📞</span> +994 55 594 51 00</li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><span style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.4rem', borderRadius: '50%' }}>📍</span> Bakı, Azərbaycan</li>
            </ul>
          </div>

        </div>
        <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
          &copy; {new Date().getFullYear()} ASRALI. Bütün hüquqlar qorunur.
        </div>
      </footer>

      {/* GLOBAL CSS FOR ADVANCED EFFECTS */}
      <style dangerouslySetInnerHTML={{__html: `
        /* General Setup */
        html { scroll-behavior: smooth; }
        
        /* Typography Helpers */
        .section-subtitle { font-size: 1rem; font-weight: 800; color: #34d399; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 1rem; }
        .section-title { font-size: clamp(2.5rem, 4vw, 3.5rem); font-weight: 900; color: white; letter-spacing: -1px; }
        .section-desc { font-size: 1.125rem; color: #94a3b8; max-width: 600px; margin: 1.5rem auto 0; line-height: 1.6; }

        /* Buttons */
        .btn-primary { padding: 0.7rem 1.8rem; background: linear-gradient(135deg, #10b981, #0ea5e9); color: white; border-radius: 99px; font-weight: 700; text-decoration: none; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); border: 1px solid rgba(255,255,255,0.2); text-align: center; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.4); }
        
        .btn-large { padding: 1.2rem 3rem; font-size: 1.1rem; }
        
        .btn-outline { padding: 1rem 2.5rem; background: transparent; color: white; border: 1px solid rgba(255,255,255,0.2); border-radius: 99px; font-weight: 700; text-decoration: none; transition: all 0.3s; text-align: center; }
        .btn-outline:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.4); transform: translateY(-2px); }

        .btn-white { padding: 1.2rem 3rem; background: white; color: #0ea5e9; border-radius: 99px; font-weight: 800; text-decoration: none; transition: all 0.3s; text-align: center; }
        .btn-white:hover { transform: translateY(-2px); box-shadow: 0 15px 30px rgba(0,0,0,0.2); }

        .glow-effect { position: relative; }
        .glow-effect::after { content: ''; position: absolute; top: -2px; left: -2px; right: -2px; bottom: -2px; background: inherit; filter: blur(15px); opacity: 0; z-index: -1; transition: opacity 0.3s; border-radius: inherit; }
        .glow-effect:hover::after { opacity: 0.6; }

        /* Navigation */
        .nav-link { color: #94a3b8; font-weight: 600; text-decoration: none; font-size: 0.95rem; transition: color 0.2s; position: relative; }
        .nav-link::after { content: ''; position: absolute; width: 0; height: 2px; bottom: -4px; left: 0; background: #10b981; transition: width 0.3s; }
        .nav-link:hover { color: white; }
        .nav-link:hover::after { width: 100%; }

        .nav-link-bold { color: white; font-weight: 700; text-decoration: none; transition: color 0.2s; }
        .nav-link-bold:hover { color: #10b981; }

        .footer-link { color: #94a3b8; text-decoration: none; transition: color 0.2s; }
        .footer-link:hover { color: white; }

        /* Badges & Elements */
        .badge-pill { display: inline-flex; align-items: center; padding: 0.5rem 1.2rem; background: rgba(15,23,42,0.8); color: white; border-radius: 99px; font-weight: 700; font-size: 0.875rem; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2); }

        /* Cards */
        .feature-card { padding: 2.5rem; background: rgba(30, 41, 59, 0.4); backdrop-filter: blur(10px); border-radius: 24px; border: 1px solid rgba(255,255,255,0.05); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .feature-card:hover { transform: translateY(-10px) scale(1.02); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); background: rgba(30, 41, 59, 0.8); border-color: rgba(255,255,255,0.1); }
        .feature-icon { width: 64px; height: 64px; border-radius: 18px; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin-bottom: 1.5rem; transition: transform 0.3s; border: 1px solid rgba(255,255,255,0.1); }
        .feature-card:hover .feature-icon { transform: scale(1.1) rotate(5deg); }
        .feature-title { font-size: 1.25rem; font-weight: 800; color: white; margin-bottom: 1rem; }
        .feature-desc { color: #94a3b8; line-height: 1.6; }

        .org-card { background: rgba(30, 41, 59, 0.4); padding: 2.5rem; border-radius: 24px; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 4px 6px -1px rgba(0,0,0,0.2); transition: all 0.3s; }
        .org-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.4); border-color: rgba(255,255,255,0.1); background: rgba(30, 41, 59, 0.8); }
        .org-icon { font-size: 3rem; margin-bottom: 1.5rem; }
        .org-title { font-size: 1.25rem; font-weight: 800; color: white; margin-bottom: 0.75rem; }
        .org-desc { color: #94a3b8; font-size: 0.95rem; line-height: 1.6; }

        .faq-card { background: rgba(30, 41, 59, 0.4); padding: 1.5rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); transition: background 0.2s; }
        .faq-card:hover { background: rgba(30, 41, 59, 0.8); }

        .step-card { position: relative; z-index: 1; text-align: center; padding: 2rem; background: rgba(30, 41, 59, 0.4); backdrop-filter: blur(10px); border-radius: 24px; border: 1px solid rgba(255,255,255,0.05); transition: transform 0.3s, background 0.3s; }
        .step-card:hover { transform: translateY(-5px); background: rgba(30, 41, 59, 0.8); border-color: rgba(16, 185, 129, 0.3); }
        .step-number { width: 70px; height: 70px; border-radius: 50%; background: #020617; border: 2px solid #10b981; color: #10b981; display: flex; align-items: center; justify-content: center; font-size: 1.75rem; font-weight: 900; margin: 0 auto 1.5rem; box-shadow: 0 0 30px rgba(16, 185, 129, 0.3); transition: all 0.3s; }
        .step-card:hover .step-number { background: #10b981; color: #020617; box-shadow: 0 0 40px rgba(16, 185, 129, 0.6); transform: scale(1.1); }
        .step-line { position: absolute; top: 65px; left: 10%; right: 10%; height: 2px; background: linear-gradient(90deg, transparent 0%, #10b981 50%, transparent 100%); z-index: 0; opacity: 0.3; }

        /* Pricing specific */
        .pricing-card { background: rgba(30, 41, 59, 0.4); border-radius: 32px; border: 1px solid rgba(255,255,255,0.05); padding: 3rem 2rem; display: flex; flex-direction: column; align-items: center; text-align: center; transition: transform 0.3s, box-shadow 0.3s; }
        .pricing-card:hover { transform: translateY(-8px); box-shadow: 0 30px 60px -15px rgba(0,0,0,0.5); background: rgba(30, 41, 59, 0.8); border-color: rgba(255,255,255,0.1); }
        .pricing-card-pro { background: rgba(15, 23, 42, 0.8); border-color: rgba(16, 185, 129, 0.5); position: relative; transform: scale(1.05); box-shadow: 0 20px 40px rgba(0,0,0,0.3); z-index: 2; }
        .pricing-card-pro:hover { transform: scale(1.05) translateY(-8px); box-shadow: 0 30px 60px rgba(16,185,129,0.2); }
        
        .pricing-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 1rem; text-align: left; width: 100%; }
        .pricing-list-item { display: flex; align-items: center; gap: 0.75rem; color: #cbd5e1; font-weight: 500; font-size: 0.95rem; }
        .pricing-check { color: #10b981; background: rgba(16,185,129,0.1); width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.7rem; font-weight: bold; flex-shrink: 0; border: 1px solid rgba(16,185,129,0.3); }

        /* Dashboard Mockup 3D effect */
        .glass-dashboard { border-radius: 16px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.2); backdrop-filter: blur(10px); padding: 8px; }
        .hover-3d { transition: transform 0.5s ease; transform-style: preserve-3d; }
        .hover-3d:hover { transform: perspective(1000px) rotateX(2deg) rotateY(-2deg) scale(1.02); box-shadow: -20px 30px 60px rgba(0,0,0,0.5); }

        /* Ticker Animation */
        .ticker-wrapper { display: flex; width: 100%; box-sizing: border-box; }
        .ticker-content { display: flex; padding-left: 100%; animation: ticker 25s linear infinite; }
        .ticker-item { display: inline-flex; align-items: center; gap: 0.75rem; margin-right: 4rem; color: #cbd5e1; font-weight: 600; font-size: 1.1rem; letter-spacing: 0.5px; }
        .ticker-icon { color: #10b981; background: rgba(16,185,129,0.2); border-radius: 50%; width: 20px; height: 20px; display: inline-flex; align-items: center; justify-content: center; font-size: 0.7rem; }
        
        /* Keyframes */
        @keyframes ticker { 0% { transform: translate3d(0, 0, 0); } 100% { transform: translate3d(-100%, 0, 0); } }
        @keyframes float { 0% { transform: translate(0, 0) rotate(0deg); } 33% { transform: translate(30px, -50px) rotate(10deg); } 66% { transform: translate(-20px, 20px) rotate(-5deg); } 100% { transform: translate(0, 0) rotate(0deg); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }

        /* Utility animations */
        .fade-in-up { animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .delay-1 { animation-delay: 0.2s; opacity: 0; }
        
        .hover-lift-sm { transition: transform 0.2s; }
        .hover-lift-sm:hover { transform: translateY(-1px); }

        .vertical-divider { position: absolute; left: -1rem; top: 10%; bottom: 10%; width: 1px; background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.1), transparent); }

        /* Responsive overrides */
        @media (max-width: 768px) {
          .step-line { display: none; }
          .vertical-divider { display: none; }
          .pricing-card-pro { transform: scale(1); }
          .pricing-card-pro:hover { transform: scale(1) translateY(-8px); }
        }
      `}} />
    </div>
  );
}

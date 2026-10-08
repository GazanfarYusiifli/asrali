'use client';

import Link from 'next/link';
import FeedbackForm from './components/FeedbackForm';
import Image from 'next/image';
import { useI18n } from './context/I18nContext';
import LanguageSwitcher from './components/LanguageSwitcher';
import { 
  ArrowRight, 
  Check, 
  Sparkles, 
  BarChart3, 
  FileText, 
  TrendingUp, 
  Package, 
  Users, 
  ShieldCheck, 
  ChevronRight, 
  Store, 
  Building2, 
  Wrench, 
  Cpu, 
  Mail, 
  Phone, 
  MapPin, 
  Zap, 
  Layers, 
  Clock,
  HelpCircle,
  Star
} from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const { t, language } = useI18n();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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

  const toggleFaq = (idx: number) => {
    setOpenFaq(prev => prev === idx ? null : idx);
  };

  const features = [
    { 
      icon: BarChart3, 
      color: '#059669', 
      bg: '#ecfdf5', 
      border: '#a7f3d0',
      title: 'Müştəri və Satış İdarəetməsi', 
      desc: 'Müştəri bazası, borc xülasələri, cari hesab qalığı və real-vaxt ödəniş tarixçəsi tək idarəetmə panelində.' 
    },
    { 
      icon: FileText, 
      color: '#0284c7', 
      bg: '#f0f9ff', 
      border: '#bae6fd',
      title: 'Avtomatlaşdırılmış Müqavilələr', 
      desc: 'Şablon əsaslı müqavilə yaratmaq, avtomatik nömrələmə, çap, QR təsdiqi və ani PDF ixrac funksiyaları.' 
    },
    { 
      icon: TrendingUp, 
      color: '#059669', 
      bg: '#ecfdf5', 
      border: '#a7f3d0',
      title: 'Maliyyə & Balans Analitikası', 
      desc: 'Gəlir-xərc nisbətləri, debitor-kreditor borc hesabatları, kassa və bank çıxarışları dəqiq göstəricilərlə.' 
    },
    { 
      icon: Package, 
      color: '#7c3aed', 
      bg: '#f5f3ff', 
      border: '#ddd6fe',
      title: 'İnventar & Stok İdarəetməsi', 
      desc: 'Çoxanbarlı stok izləmə, barkod, kritik limit xəbərdarlıqları, anbarlararası transfer və sayım prosesləri.' 
    },
    { 
      icon: Users, 
      color: '#d97706', 
      bg: '#fffbeb', 
      border: '#fde68a',
      title: 'Əməkdaş və HR Uçotu', 
      desc: 'Əməkdaş məlumatları, vəzifələr, davamiyyət və məzuniyyətlər, toplu maaş hesablanması və bonus uçotu.' 
    },
    { 
      icon: ShieldCheck, 
      color: '#0891b2', 
      bg: '#ecfeff', 
      border: '#a5f3fc',
      title: 'Təhlükəsiz Bulud İnfrastrukturu', 
      desc: 'Hər biznes üçün ayrıca izolyasiya olunmuş verilənlər bazası, gündəlik nüsxələmə və güclü icazə idarəsi.' 
    }
  ];

  const faqs = [
    {
      q: 'ASRALI nədir və kimlər üçündür?',
      a: 'ASRALI mağazalar, şirkətlər, xidmət müəssisələri və istehsalatlar üçün hazırlanmış müasir bulud əsaslı maliyyə və resurs idarəetmə sistemidir (ERP). Bütün satış, alış, anbar, kassa və hesabatları bir mərkəzdən idarə etməyə imkan verir.'
    },
    {
      q: 'Sistemdən necə istifadə etməyə başlaya bilərəm?',
      a: 'Qeydiyyatdan keçdiyiniz an fərdi təşkilat bazanız bir neçə saniyəyə yaradılır və 14 günlük pulsuz sınaq müddəti (TRIAL) dərhal aktivləşir. Kompüter və ya telefona proqram yükləməyə ehtiyac yoxdur, tam brauzer üzərindən işləyir.'
    },
    {
      q: 'Məlumatlarım təhlükəsiz şəkildə qorunurmu?',
      a: 'Bəli. Hər şirkətin məlumatları digər şirkətlərdən tamamilə təcrid olunmuş və şifrələnmiş şəkildə saxlanılır. Gündəlik avtomatik ehtiyat nüsxələri (backup) təmin edilir.'
    },
    {
      q: 'Mobil telefondan və ya planşetdən istifadə mümkündürmü?',
      a: 'Bəli. ASRALI tam responsiv müasir veb texnologiyaları ilə hazırlanıb. İstənilən smartfon, planşet və noutbukdan rahatlıqla daxil olub bütün əməliyyatları apara bilərsiniz.'
    }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', color: '#0f172a', overflowX: 'hidden', fontFamily: 'inherit' }}>
      
      {/* HEADER / NAVBAR */}
      <header className="site-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
              fontWeight: 900,
              color: 'white',
              fontSize: '1.25rem'
            }}>
              A
            </div>
            <span style={{ fontSize: '1.45rem', fontWeight: 900, letterSpacing: '-0.5px', color: '#0f172a' }}>
              ASRALI <span style={{ color: '#059669' }}>ERP</span>
            </span>
          </Link>
        </div>
        
        <nav className="desktop-nav">
          <a href="#xususiyyetler" className="nav-link">{t('nav_features')}</a>
          <a href="#is-prinsipi" className="nav-link">{t('nav_how_it_works')}</a>
          <a href="#teskilat-novleri" className="nav-link">{t('nav_organizations')}</a>
          <a href="#qiymetler" className="nav-link">{t('nav_pricing')}</a>
          <a href="#faq" className="nav-link">FAQ</a>
        </nav>

        <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
          <LanguageSwitcher />
          <Link href="/login" className="nav-btn-secondary">
            {t('nav_login')}
          </Link>
          <Link href="/register" className="nav-btn-primary">
            <span>{t('nav_register')}</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero-section">
        {/* Soft Ambient Light Glows */}
        <div className="glow-sphere glow-left" />
        <div className="glow-sphere glow-right" />
        <div className="glow-sphere glow-center" />

        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot" />
            <Sparkles size={14} style={{ color: '#059669' }} />
            <span>{t('hero_badge')}</span>
          </div>
          
          <h1 className="hero-title">
            Biznesinizi Daha Sadə və <br/>
            <span className="gradient-text">Nəzarətli İdarə Edin</span>
          </h1>
          
          <p className="hero-subtitle">
            {t('hero_desc')}
          </p>
          
          <div className="hero-actions">
            <Link href="/register" className="btn-emerald-primary">
              <span>{t('btn_register_now')}</span>
              <ArrowRight size={18} />
            </Link>
            <a href="#is-prinsipi" className="btn-light-secondary">
              <Zap size={17} style={{ color: '#059669' }} />
              <span>Necə İşləyir?</span>
            </a>
          </div>

          {/* Social Proof Mini Bar */}
          <div className="social-proof-strip">
            <div className="proof-rating">
              <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
                <Star size={15} fill="#f59e0b" />
                <Star size={15} fill="#f59e0b" />
                <Star size={15} fill="#f59e0b" />
                <Star size={15} fill="#f59e0b" />
                <Star size={15} fill="#f59e0b" />
              </div>
              <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>5.0 / 5.0</span>
            </div>
            <div className="proof-divider" />
            <span style={{ color: '#64748b', fontSize: '0.88rem', fontWeight: 500 }}>14 gün pulsuz sınaq • Kredit kartı tələb olunmur</span>
          </div>
        </div>

        {/* DASHBOARD PREVIEW MOCKUP */}
        <div className="mockup-container">
          <div className="mockup-frame">
            <div className="mockup-header-bar">
              <div style={{ display: 'flex', gap: '6px' }}>
                <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                <div style={{ width: '11px', height: '11px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              </div>
              <div className="mockup-url-pill">
                <span>https://app.asrali.com/erp/dashboard</span>
              </div>
              <div style={{ width: '33px' }} />
            </div>
            <Image 
              src="/dashboard_mockup.png" 
              alt="ASRALI ERP Dashboard Preview" 
              width={1240} 
              height={760} 
              style={{ width: '100%', height: 'auto', display: 'block' }}
              priority
            />
          </div>
        </div>
      </section>

      {/* METRICS STRIP */}
      <section className="metrics-section">
        <div className="metrics-card">
          <div className="metric-box">
            <div className="metric-num">10+</div>
            <div className="metric-label">Maliyyə və İdarəetmə Modulu</div>
          </div>
          <div className="metric-box">
            <div className="metric-num">1 Panel</div>
            <div className="metric-label">Satış, Alış və Hesabat Nəzarəti</div>
          </div>
          <div className="metric-box">
            <div className="metric-num">24/7</div>
            <div className="metric-label">Bulud Əsaslı Onlayn Çıxış</div>
          </div>
          <div className="metric-box">
            <div className="metric-num">99.9%</div>
            <div className="metric-label">Fasiləsiz Xidmət Zəmanəti</div>
          </div>
        </div>
      </section>

      {/* VALUE TICKER STRIP */}
      <section className="ticker-section">
        <div className="ticker-wrapper">
          <div className="ticker-content">
            <span className="ticker-item"><Check size={16} className="text-emerald" /> Multi-tenant struktur: hər biznes üçün ayrıca verilənlər bazası</span>
            <span className="ticker-item"><Check size={16} className="text-emerald" /> Müqavilə, qəbz və hesabatların ani ixrac imkanı</span>
            <span className="ticker-item"><Check size={16} className="text-emerald" /> Rol əsaslı təhlükəsiz giriş və ətraflı icazə sistemi</span>
            <span className="ticker-item"><Check size={16} className="text-emerald" /> Barkodlu satış və anbar qalıqlarının real-vaxt sinxronizasiyası</span>
            {/* Infinite loop copy */}
            <span className="ticker-item"><Check size={16} className="text-emerald" /> Multi-tenant struktur: hər biznes üçün ayrıca verilənlər bazası</span>
            <span className="ticker-item"><Check size={16} className="text-emerald" /> Müqavilə, qəbz və hesabatların ani ixrac imkanı</span>
            <span className="ticker-item"><Check size={16} className="text-emerald" /> Rol əsaslı təhlükəsiz giriş və ətraflı icazə sistemi</span>
            <span className="ticker-item"><Check size={16} className="text-emerald" /> Barkodlu satış və anbar qalıqlarının real-vaxt sinxronizasiyası</span>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION (Niyə ASRALI?) */}
      <section id="xususiyyetler" className="section-container">
        <div className="section-header">
          <div className="section-pill">Əsas İmkanlar</div>
          <h2 className="section-heading">Niyə ASRALI ERP?</h2>
          <p className="section-subtext">
            Biznesinizin gündəlik maliyyə, satış, anbar və idarəetmə əməliyyatlarını vahid və təhlükəsiz sistemdə birləşdirən modullar.
          </p>
        </div>

        <div className="features-grid">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="feature-card">
                <div className="feature-icon-wrapper" style={{ backgroundColor: f.bg, borderColor: f.border, color: f.color }}>
                  <Icon size={26} />
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
                <div className="feature-hover-indicator" style={{ backgroundColor: f.color }} />
              </div>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS (3 ADDIMDA BAŞLAYIN) */}
      <section id="is-prinsipi" className="section-container step-bg-pattern">
        <div className="section-header">
          <div className="section-pill">Sürətli Başlanğıc</div>
          <h2 className="section-heading">Biznesinizi İdarə Etməyə 3 Addımda Başlayın</h2>
          <p className="section-subtext">
            Qeydiyyatdan keçdiyiniz an sistem dərhal aktivləşir və 14 gün pulsuz sınaq istifadəsi başlayır.
          </p>
        </div>

        <div className="steps-grid">
          {[
            { 
              num: '01', 
              title: 'Sürətli Qeydiyyat', 
              desc: 'Email və ya Google hesabınızla cəmi 30 saniyəyə təşkilatınızı yaradın.',
              icon: Zap
            },
            { 
              num: '02', 
              title: 'Anında Aktivasiya', 
              desc: 'Sistem sizin üçün fərdi verilənlər bazasını qurur və 14 günlük pulsuz sınaq başlayır.',
              icon: Layers
            },
            { 
              num: '03', 
              title: 'Sistemdən İstifadə', 
              desc: 'İdarəetmə paneliniz hazırdır! Xərclər, satışlar və anbarı dərhal daxil edin.',
              icon: BarChart3
            }
          ].map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="step-card">
                <div className="step-top-row">
                  <div className="step-number-badge">{step.num}</div>
                  <div className="step-icon-bubble">
                    <Icon size={20} style={{ color: '#059669' }} />
                  </div>
                </div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
              </div>
            );
          })}
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
          <Link href="/register" className="btn-emerald-primary" style={{ display: 'inline-flex' }}>
            <span>İndi Qeydiyyatdan Keç</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* COMPATIBILITY (Təşkilat növləri) */}
      <section id="teskilat-novleri" className="section-container">
        <div className="section-header">
          <div className="section-pill">Uyğunluq</div>
          <h2 className="section-heading">Hər Təşkilat Növü Üçün Çevik Quruluş</h2>
          <p className="section-subtext">
            ASRALI müxtəlif ölçülü və fərqli iş modelinə sahib müəssisələrə asanlıqla inteqrasiya olunur.
          </p>
        </div>

        <div className="orgs-grid">
          {[
            { icon: Store, title: 'Pərakəndə Mağazalar', desc: 'Kassa satışları, barkodlu anbar izlənməsi, növbə və gündəlik kassa hesabatları.' },
            { icon: Building2, title: 'Topdansatış Şirkətləri', desc: 'Müştəri borcları, E-Faktura, anbarlararası kütləvi transferlər və təchizatçı ödənişləri.' },
            { icon: Wrench, title: 'Xidmət & Servis', desc: 'Müqaviləli ödənişlər, xidmət aktları, texniki servis jurnalı və personal uçotu.' },
            { icon: Cpu, title: 'İstehsalat & Sexlər', desc: 'Xammal qeydiyyatı, istehsalat xərcləri, maya dəyərinin avtomatlaşdırılmış hesablanması.' }
          ].map((org, i) => {
            const Icon = org.icon;
            return (
              <div key={i} className="org-card">
                <div className="org-icon-wrapper">
                  <Icon size={28} style={{ color: '#059669' }} />
                </div>
                <h3 className="org-title">{org.title}</h3>
                <p className="org-desc">{org.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* PRICING (Qiymətləndirmə) */}
      <section id="qiymetler" className="section-container pricing-bg">
        <div className="section-header">
          <div className="section-pill">Şəffaf Qiymətlər</div>
          <h2 className="section-heading">Sizə Uyğun Paketi Seçin</h2>
          <p className="section-subtext">
            Gizli xərclər yoxdur. Biznesinizin tələbatına uyğun sərfəli və elastik planlar.
          </p>
        </div>

        <div className="pricing-grid">
          
          {/* Sadə Paket */}
          <div className="pricing-card">
            <div className="pricing-top">
              <h3 className="pricing-name">SADƏ PAKET</h3>
              <p className="pricing-subtitle">Sistemi test etmək istəyənlər üçün</p>
              <div className="pricing-cost">
                <span className="price-big">Pulsuz</span>
              </div>
              <div className="price-term">14 GÜN SINAQ</div>
            </div>
            
            <ul className="pricing-features">
              <li><Check size={16} className="text-emerald" /> Bütün modullara tam çıxış</li>
              <li><Check size={16} className="text-emerald" /> Limitsiz satış və alış əməliyyatı</li>
              <li><Check size={16} className="text-emerald" /> Bulud əsaslı məlumat yaddaşı</li>
              <li><Check size={16} className="text-emerald" /> 1 İdarəçi hesabı</li>
            </ul>

            <div className="pricing-action">
              <Link href="/register" className="btn-plan-outline">
                İndi Yoxla
              </Link>
            </div>
          </div>

          {/* PRO Paket (POPULAR) */}
          <div className="pricing-card pricing-card-featured">
            <div className="featured-badge">ƏN ÇOX SEÇİLƏN</div>
            
            <div className="pricing-top">
              <h3 className="pricing-name" style={{ color: '#059669' }}>PRO PAKET</h3>
              <p className="pricing-subtitle">Kiçik və orta bizneslər üçün ideal seçim</p>
              <div className="pricing-cost">
                <span className="price-currency">{pricing.symbol}</span>
                <span className="price-big gradient-text">{pricing.amount}</span>
                <span className="price-period">/ ay</span>
              </div>
              <div className="price-term" style={{ color: '#059669' }}>Tam funksional paket</div>
            </div>
            
            <ul className="pricing-features">
              <li><Check size={16} className="text-emerald" /> Bütün PRO funksionallıqlar</li>
              <li><Check size={16} className="text-emerald" /> CRM və Müştəri İdarəetməsi</li>
              <li><Check size={16} className="text-emerald" /> E-Faktura və Bank Əməliyyatları</li>
              <li><Check size={16} className="text-emerald" /> Çoxistifadəçili giriş hüquqları</li>
              <li><Check size={16} className="text-emerald" /> Limitsiz sənəd və qaimə arxivi</li>
              <li><Check size={16} className="text-emerald" /> 7/24 Prioritetli texniki dəstək</li>
            </ul>

            <div className="pricing-action">
              <Link href="/register" className="btn-emerald-primary" style={{ width: '100%', justifyContent: 'center' }}>
                Abunə Ol
              </Link>
            </div>
          </div>

          {/* Korporativ Paket */}
          <div className="pricing-card">
            <div className="pricing-top">
              <h3 className="pricing-name">KORPORATİV</h3>
              <p className="pricing-subtitle">Böyük şirkətlər və holdinqlər üçün</p>
              <div className="pricing-cost">
                <span className="price-big" style={{ fontSize: '2.1rem' }}>Razılaşma ilə</span>
              </div>
              <div className="price-term">Fərdi yanaşma</div>
            </div>
            
            <ul className="pricing-features">
              <li><Check size={16} className="text-emerald" /> Fərdi funksionallıqların hazırlanması</li>
              <li><Check size={16} className="text-emerald" /> Xüsusi Server və Domen inteqrasiyası</li>
              <li><Check size={16} className="text-emerald" /> Mövcud proqramlara API inteqrasiyası</li>
              <li><Check size={16} className="text-emerald" /> Limitsiz istifadəçi hüquqları</li>
              <li><Check size={16} className="text-emerald" /> Şəxsi menecer və yerində təlim</li>
            </ul>

            <div className="pricing-action">
              <Link href="/login" className="btn-plan-outline">
                Əlaqə Saxla
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* FAQ SECTION (ACCORDION) */}
      <section id="faq" className="section-container">
        <div className="section-header">
          <div className="section-pill">Sual-Cavab</div>
          <h2 className="section-heading">Tez-Tez Verilən Suallar</h2>
          <p className="section-subtext">
            Sistem, qeydiyyat, təhlükəsizlik və istifadə ilə bağlı əsas cavablar.
          </p>
        </div>

        <div className="faq-container">
          {faqs.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div 
                key={i} 
                className={`faq-item ${isOpen ? 'faq-item-open' : ''}`}
                onClick={() => toggleFaq(i)}
              >
                <div className="faq-question">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <HelpCircle size={19} style={{ color: isOpen ? '#059669' : '#94a3b8' }} />
                    <span>{faq.q}</span>
                  </div>
                  <ChevronRight 
                    size={18} 
                    style={{ 
                      color: isOpen ? '#059669' : '#94a3b8', 
                      transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s ease'
                    }} 
                  />
                </div>
                {isOpen && (
                  <div className="faq-answer">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FEEDBACK SECTION */}
      <section id="feedback" className="section-container" style={{ paddingTop: '2rem' }}>
        <div className="section-header">
          <div className="section-pill">Geri Bildirim</div>
          <h2 className="section-heading">Fikirləriniz Bizim Üçün Dəyərlidir</h2>
          <p className="section-subtext">
            Təklif, irad və ya rəyinizi bizimlə bölüşün — komandamız hər mesajı diqqətlə nəzərdən keçirir.
          </p>
        </div>

        <div style={{ maxWidth: '720px', margin: '0 auto' }}>
          <FeedbackForm />
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-section">
        <div className="cta-container">
          <div className="cta-inner">
            <h2 className="cta-title">Biznesinizi Rəqəmsallaşdırmağa Hazırsınız?</h2>
            <p className="cta-desc">
              Bir neçə saniyəyə qeydiyyatdan keçin və 14 gün ərzində bütün ERP imkanlarını limitsiz yoxlayın.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/register" className="btn-cta-main">
                <span>İndi Qeydiyyatdan Keç</span>
                <ArrowRight size={18} />
              </Link>
              <Link href="/login" className="btn-cta-secondary">
                Daxil Ol
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="footer-inner">
          
          <div className="footer-brand-block">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                color: 'white',
                fontSize: '1.1rem'
              }}>
                A
              </div>
              <span style={{ fontSize: '1.45rem', fontWeight: 900, letterSpacing: '-0.5px', color: '#0f172a' }}>
                ASRALI <span style={{ color: '#059669' }}>ERP</span>
              </span>
            </div>
            <p className="footer-brand-desc">
              Azərbaycan biznesləri üçün maliyyə, satış və anbar idarəetməsini sadə, sürətli və şəffaf edən vahid bulud platforması.
            </p>
          </div>

          <div>
            <h4 className="footer-col-title">Keçidlər</h4>
            <ul className="footer-nav-list">
              <li><a href="#xususiyyetler" className="footer-link">Xüsusiyyətlər</a></li>
              <li><a href="#is-prinsipi" className="footer-link">İş prinsipi</a></li>
              <li><a href="#teskilat-novleri" className="footer-link">Təşkilat növləri</a></li>
              <li><a href="#qiymetler" className="footer-link">Qiymətlər</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Hesab</h4>
            <ul className="footer-nav-list">
              <li><Link href="/register" className="footer-link">Qeydiyyat</Link></li>
              <li><Link href="/login" className="footer-link">Daxil ol</Link></li>
              <li><a href="#faq" className="footer-link">Tez-tez verilən suallar</a></li>
              <li><a href="#feedback" className="footer-link">Rəy bildir</a></li>
            </ul>
          </div>

          <div>
            <h4 className="footer-col-title">Əlaqə</h4>
            <ul className="footer-contact-list">
              <li><Mail size={16} className="text-emerald" /> info@asrali.az</li>
              <li><Phone size={16} className="text-emerald" /> +994 55 594 51 00</li>
              <li><MapPin size={16} className="text-emerald" /> Bakı, Azərbaycan</li>
              <li><Clock size={16} className="text-emerald" /> 24/7 Dəstək Mərkəzi</li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          <div>&copy; {new Date().getFullYear()} ASRALI ERP. Bütün hüquqlar qorunur.</div>
          <div>
            Developed by{' '}
            <a 
              href="https://www.codfy.tech" 
              target="_blank" 
              rel="noopener noreferrer"
              className="codfy-link"
            >
              Codfy
            </a>
          </div>
        </div>
      </footer>

      {/* GLOBAL CSS STYLING - MODERN LIGHT LUXURY THEME */}
      <style dangerouslySetInnerHTML={{__html: `
        /* Reset & Base */
        html { scroll-behavior: smooth; }
        
        .text-emerald { color: #059669; }

        /* HEADER */
        .site-header {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 76px;
          padding: 0 5%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          z-index: 100;
          border-bottom: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }

        .desktop-nav {
          display: flex;
          gap: 2.2rem;
          align-items: center;
        }

        .nav-link {
          color: #475569;
          font-weight: 600;
          text-decoration: none;
          font-size: 0.92rem;
          transition: color 0.2s ease;
          position: relative;
        }
        .nav-link:hover {
          color: #059669;
        }

        .nav-btn-secondary {
          color: #334155;
          font-weight: 700;
          font-size: 0.92rem;
          text-decoration: none;
          padding: 0.6rem 1.25rem;
          border-radius: 12px;
          transition: all 0.2s;
        }
        .nav-btn-secondary:hover {
          color: #059669;
          background: #f1f5f9;
        }

        .nav-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.62rem 1.35rem;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border-radius: 12px;
          font-weight: 700;
          font-size: 0.92rem;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.35);
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .nav-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(16, 185, 129, 0.45);
        }

        /* HERO SECTION */
        .hero-section {
          padding: 9.5rem 5% 5rem;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          background: radial-gradient(ellipse at 50% 0%, #ecfdf5 0%, #f8fafc 70%);
        }

        .glow-sphere {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
          z-index: 1;
        }
        .glow-left {
          top: 10%;
          left: -5%;
          width: 45vw;
          height: 45vw;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(255, 255, 255, 0) 70%);
        }
        .glow-right {
          top: 15%;
          right: -5%;
          width: 40vw;
          height: 40vw;
          background: radial-gradient(circle, rgba(14, 165, 233, 0.1) 0%, rgba(255, 255, 255, 0) 70%);
        }
        .glow-center {
          top: 5%;
          left: 25%;
          width: 50vw;
          height: 50vw;
          background: radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, rgba(255, 255, 255, 0) 70%);
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 960px;
          margin: 0 auto;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.45rem 1.15rem;
          background: #ffffff;
          border: 1px solid #d1fae5;
          border-radius: 9999px;
          color: #065f46;
          font-size: 0.88rem;
          font-weight: 700;
          margin-bottom: 2rem;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.1);
        }

        .badge-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: #10b981;
          box-shadow: 0 0 8px #10b981;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }

        .hero-title {
          font-size: clamp(2.8rem, 5.5vw, 4.8rem);
          font-weight: 900;
          line-height: 1.12;
          letter-spacing: -1.5px;
          color: #0f172a;
          margin-bottom: 1.75rem;
        }

        .gradient-text {
          background: linear-gradient(135deg, #059669 0%, #10b981 50%, #0284c7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: clamp(1.05rem, 1.8vw, 1.25rem);
          color: #475569;
          max-width: 780px;
          margin: 0 auto 2.5rem;
          line-height: 1.7;
          font-weight: 400;
        }

        .hero-actions {
          display: flex;
          gap: 1.2rem;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 3.5rem;
        }

        .btn-emerald-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          padding: 1.05rem 2.25rem;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border-radius: 14px;
          font-weight: 800;
          font-size: 1.05rem;
          text-decoration: none;
          box-shadow: 0 8px 25px rgba(16, 185, 129, 0.35);
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .btn-emerald-primary:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 14px 35px rgba(16, 185, 129, 0.5);
        }

        .btn-light-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          padding: 1.05rem 2.25rem;
          background: #ffffff;
          color: #0f172a;
          border-radius: 14px;
          font-weight: 700;
          font-size: 1.05rem;
          text-decoration: none;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
          transition: all 0.25s ease;
        }
        .btn-light-secondary:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.07);
        }

        .social-proof-strip {
          display: inline-flex;
          align-items: center;
          gap: 1.25rem;
          padding: 0.7rem 1.6rem;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 9999px;
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.04);
        }
        .proof-rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .proof-divider {
          width: 1px;
          height: 18px;
          background: #e2e8f0;
        }

        /* DASHBOARD PREVIEW */
        .mockup-container {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1180px;
          margin: 4.5rem auto 0;
          perspective: 1200px;
        }

        .mockup-frame {
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          background: #ffffff;
          box-shadow: 0 25px 60px -15px rgba(15, 23, 42, 0.12), 0 0 40px rgba(16, 185, 129, 0.08);
          overflow: hidden;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s ease;
        }
        .mockup-frame:hover {
          transform: translateY(-6px);
          box-shadow: 0 35px 80px -10px rgba(15, 23, 42, 0.18), 0 0 50px rgba(16, 185, 129, 0.15);
        }

        .mockup-header-bar {
          background: #f8fafc;
          padding: 0.85rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e2e8f0;
        }

        .mockup-url-pill {
          background: #ffffff;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          padding: 0.3rem 1.25rem;
          color: #64748b;
          font-size: 0.78rem;
          font-family: monospace;
        }

        /* METRICS STRIP */
        .metrics-section {
          padding: 2rem 5% 5rem;
          position: relative;
          z-index: 5;
        }
        .metrics-card {
          max-width: 1100px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 2.75rem 2rem;
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.05);
        }
        .metric-box {
          text-align: center;
          padding: 0.5rem;
        }
        .metric-num {
          font-size: 2.8rem;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -1px;
          margin-bottom: 0.45rem;
          background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .metric-label {
          color: #64748b;
          font-size: 0.95rem;
          font-weight: 600;
        }

        /* VALUE TICKER */
        .ticker-section {
          padding: 1.75rem 0;
          background: #ffffff;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
          overflow: hidden;
          white-space: nowrap;
        }
        .ticker-wrapper {
          display: flex;
          width: 100%;
        }
        .ticker-content {
          display: flex;
          padding-left: 100%;
          animation: tickerSlide 35s linear infinite;
        }
        @keyframes tickerSlide {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        .ticker-item {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          margin-right: 4.5rem;
          color: #334155;
          font-size: 0.95rem;
          font-weight: 600;
          letter-spacing: 0.2px;
        }

        /* SECTION BASE */
        .section-container {
          padding: 7rem 5%;
          max-width: 1240px;
          margin: 0 auto;
          position: relative;
        }
        .section-header {
          text-align: center;
          margin-bottom: 4.5rem;
        }
        .section-pill {
          display: inline-block;
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #059669;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          padding: 0.35rem 1.1rem;
          border-radius: 9999px;
          margin-bottom: 1rem;
        }
        .section-heading {
          font-size: clamp(2.2rem, 4vw, 3.2rem);
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -1px;
          margin-bottom: 1rem;
        }
        .section-subtext {
          font-size: 1.1rem;
          color: #64748b;
          max-width: 650px;
          margin: 0 auto;
          line-height: 1.65;
        }

        /* FEATURES GRID */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
        }
        .feature-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 2.5rem;
          position: relative;
          overflow: hidden;
          transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
        }
        .feature-card:hover {
          transform: translateY(-8px);
          border-color: #cbd5e1;
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.08);
        }
        .feature-icon-wrapper {
          width: 58px;
          height: 58px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.75rem;
          border: 1px solid;
          transition: transform 0.3s ease;
        }
        .feature-card:hover .feature-icon-wrapper {
          transform: scale(1.08) rotate(3deg);
        }
        .feature-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.85rem;
          line-height: 1.35;
        }
        .feature-desc {
          color: #64748b;
          line-height: 1.65;
          font-size: 0.95rem;
        }
        .feature-hover-indicator {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 3px;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .feature-card:hover .feature-hover-indicator {
          opacity: 1;
        }

        /* STEPS GRID */
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }
        .step-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 24px;
          padding: 2.5rem;
          transition: all 0.3s ease;
          position: relative;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
        }
        .step-card:hover {
          transform: translateY(-6px);
          border-color: #a7f3d0;
          box-shadow: 0 15px 35px rgba(16, 185, 129, 0.1);
        }
        .step-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.75rem;
        }
        .step-number-badge {
          font-size: 1.85rem;
          font-weight: 900;
          color: #059669;
          letter-spacing: -1px;
        }
        .step-icon-bubble {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .step-title {
          font-size: 1.3rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.85rem;
        }
        .step-desc {
          color: #64748b;
          line-height: 1.65;
          font-size: 0.95rem;
        }

        /* ORGANIZATIONS GRID */
        .orgs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 2rem;
        }
        .org-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 22px;
          padding: 2.25rem 2rem;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
        }
        .org-card:hover {
          transform: translateY(-6px);
          border-color: #a7f3d0;
          box-shadow: 0 15px 35px rgba(16, 185, 129, 0.08);
        }
        .org-icon-wrapper {
          width: 54px;
          height: 54px;
          border-radius: 14px;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
        }
        .org-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.75rem;
        }
        .org-desc {
          color: #64748b;
          font-size: 0.92rem;
          line-height: 1.6;
        }

        /* PRICING GRID */
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          align-items: stretch;
        }
        .pricing-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 28px;
          padding: 3rem 2.25rem;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: all 0.35s ease;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }
        .pricing-card:hover {
          transform: translateY(-8px);
          border-color: #cbd5e1;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.08);
        }
        .pricing-card-featured {
          background: #ffffff;
          border: 2px solid #10b981;
          box-shadow: 0 20px 45px rgba(16, 185, 129, 0.12);
          transform: scale(1.02);
        }
        .pricing-card-featured:hover {
          transform: scale(1.02) translateY(-8px);
          box-shadow: 0 30px 60px rgba(16, 185, 129, 0.18);
        }
        .featured-badge {
          position: absolute;
          top: -14px;
          right: 2rem;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          font-size: 0.75rem;
          font-weight: 800;
          letter-spacing: 0.8px;
          padding: 0.35rem 1.15rem;
          border-radius: 9999px;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.35);
        }
        .pricing-name {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.4rem;
        }
        .pricing-subtitle {
          color: #64748b;
          font-size: 0.9rem;
          margin-bottom: 1.75rem;
        }
        .pricing-cost {
          display: flex;
          align-items: baseline;
          margin-bottom: 0.35rem;
        }
        .price-currency {
          font-size: 1.75rem;
          font-weight: 800;
          color: #0f172a;
          margin-right: 4px;
        }
        .price-big {
          font-size: 3.5rem;
          font-weight: 900;
          color: #0f172a;
          letter-spacing: -1.5px;
          line-height: 1;
        }
        .price-period {
          color: #94a3b8;
          font-size: 1.05rem;
          font-weight: 600;
          margin-left: 6px;
        }
        .price-term {
          font-size: 0.85rem;
          font-weight: 700;
          color: #94a3b8;
          margin-bottom: 2.25rem;
        }
        .pricing-features {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }
        .pricing-features li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #334155;
          font-size: 0.95rem;
          line-height: 1.4;
        }
        .pricing-action {
          margin-top: auto;
          padding-top: 2.5rem;
        }
        .btn-plan-outline {
          display: block;
          text-align: center;
          padding: 0.95rem 1.5rem;
          border-radius: 12px;
          border: 1px solid #cbd5e1;
          color: #0f172a;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.25s ease;
        }
        .btn-plan-outline:hover {
          background: #f8fafc;
          border-color: #94a3b8;
          transform: translateY(-2px);
        }

        /* FAQ ACCORDION */
        .faq-container {
          max-width: 820px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .faq-item {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 18px;
          padding: 1.4rem 1.75rem;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
        }
        .faq-item:hover {
          background: #ffffff;
          border-color: #cbd5e1;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        }
        .faq-item-open {
          border-color: #a7f3d0;
          background: #ffffff;
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.08);
        }
        .faq-question {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #0f172a;
          font-weight: 700;
          font-size: 1.05rem;
        }
        .faq-answer {
          margin-top: 1.15rem;
          padding-top: 1.15rem;
          border-top: 1px solid #f1f5f9;
          color: #475569;
          line-height: 1.7;
          font-size: 0.95rem;
        }

        /* CTA SECTION */
        .cta-section {
          padding: 4rem 5% 7rem;
        }
        .cta-container {
          max-width: 1140px;
          margin: 0 auto;
          background: linear-gradient(135deg, #ecfdf5 0%, #e0f2fe 100%);
          border: 1px solid #a7f3d0;
          border-radius: 32px;
          padding: 5rem 2rem;
          position: relative;
          overflow: hidden;
          box-shadow: 0 25px 60px -10px rgba(16, 185, 129, 0.15);
        }
        .cta-inner {
          position: relative;
          z-index: 2;
          max-width: 720px;
          margin: 0 auto;
          text-align: center;
        }
        .cta-title {
          font-size: clamp(2.2rem, 4vw, 3.2rem);
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 1.25rem;
          letter-spacing: -1px;
        }
        .cta-desc {
          color: #475569;
          font-size: 1.15rem;
          line-height: 1.65;
          margin-bottom: 2.75rem;
        }
        .btn-cta-main {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          padding: 1rem 2.5rem;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border-radius: 14px;
          font-weight: 800;
          font-size: 1.05rem;
          text-decoration: none;
          box-shadow: 0 10px 25px rgba(16, 185, 129, 0.35);
          transition: all 0.25s ease;
        }
        .btn-cta-main:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(16, 185, 129, 0.5);
        }
        .btn-cta-secondary {
          display: inline-flex;
          align-items: center;
          padding: 1rem 2.2rem;
          background: #ffffff;
          color: #0f172a;
          border-radius: 14px;
          font-weight: 700;
          font-size: 1.05rem;
          text-decoration: none;
          border: 1px solid #cbd5e1;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          transition: all 0.25s ease;
        }
        .btn-cta-secondary:hover {
          background: #f8fafc;
          transform: translateY(-2px);
        }

        /* FOOTER */
        .site-footer {
          background: #ffffff;
          border-top: 1px solid #e2e8f0;
          padding: 5rem 5% 2.5rem;
        }
        .footer-inner {
          max-width: 1240px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 3.5rem;
          padding-bottom: 4rem;
          border-bottom: 1px solid #f1f5f9;
        }
        .footer-brand-desc {
          color: #64748b;
          font-size: 0.95rem;
          line-height: 1.65;
          max-width: 320px;
        }
        .footer-col-title {
          color: #0f172a;
          font-size: 1.05rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }
        .footer-nav-list, .footer-contact-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .footer-link {
          color: #64748b;
          text-decoration: none;
          font-size: 0.92rem;
          transition: color 0.2s ease;
        }
        .footer-link:hover {
          color: #059669;
        }
        .footer-contact-list li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #64748b;
          font-size: 0.92rem;
        }
        .footer-bottom {
          max-width: 1240px;
          margin: 2.5rem auto 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #94a3b8;
          font-size: 0.88rem;
        }
        .codfy-link {
          color: #059669;
          font-weight: 700;
          text-decoration: none;
        }
        .codfy-link:hover {
          text-decoration: underline;
        }

        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .footer-inner {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }
          .site-header {
            height: 68px;
          }
          .hero-section {
            padding-top: 7.5rem;
          }
          .footer-inner {
            grid-template-columns: 1fr;
            gap: 2.5rem;
          }
          .footer-bottom {
            flex-direction: column;
            gap: 0.75rem;
            text-align: center;
          }
          .pricing-card-featured {
            transform: scale(1);
          }
        }
      `}} />
    </div>
  );
}

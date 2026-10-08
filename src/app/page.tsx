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
  Star,
  CheckCircle2
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

  const metricsData = [
    {
      num: '10+',
      title: 'Maliyyə & Resurs Modulları',
      desc: 'Satış, alış, anbar, kassa, bank, əməkdaşlar və e-qaimə tək mərkəzdə.'
    },
    {
      num: '1 Panel',
      title: 'Vahid İdarəetmə Nəzarəti',
      desc: 'Bütün filial və əməliyyatların gəlir-xərc dinamikasına canlı nəzarət.'
    },
    {
      num: '24/7',
      title: 'Kəsintisiz Bulud Çıxışı',
      desc: 'İstənilən cihazdan dərhal daxil olun — quraşdırma və server tələb olunmur.'
    },
    {
      num: '99.9%',
      title: 'SLA Məlumat Təhlükəsizliyi',
      desc: 'Hər şirkət üçün tam təcrid olunmuş baza və avtomatik gündəlik nüsxələmə.'
    }
  ];

  const features = [
    { 
      icon: BarChart3, 
      color: '#059669', 
      bg: 'rgba(5, 150, 105, 0.08)', 
      border: 'rgba(5, 150, 105, 0.22)',
      title: 'Müştəri və Satış İdarəetməsi', 
      desc: 'Müştəri bazası, borc xülasələri, cari hesab qalığı və real-vaxt ödəniş tarixçəsi tək idarəetmə panelində.' 
    },
    { 
      icon: FileText, 
      color: '#0284c7', 
      bg: 'rgba(2, 132, 199, 0.08)', 
      border: 'rgba(2, 132, 199, 0.22)',
      title: 'Avtomatlaşdırılmış Müqavilələr', 
      desc: 'Şablon əsaslı müqavilə yaratmaq, avtomatik nömrələmə, çap, QR təsdiqi və ani PDF ixrac funksiyaları.' 
    },
    { 
      icon: TrendingUp, 
      color: '#059669', 
      bg: 'rgba(5, 150, 105, 0.08)', 
      border: 'rgba(5, 150, 105, 0.22)',
      title: 'Maliyyə & Balans Analitikası', 
      desc: 'Gəlir-xərc nisbətləri, debitor-kreditor borc hesabatları, kassa və bank çıxarışları dəqiq göstəricilərlə.' 
    },
    { 
      icon: Package, 
      color: '#7c3aed', 
      bg: 'rgba(124, 58, 237, 0.08)', 
      border: 'rgba(124, 58, 237, 0.22)',
      title: 'İnventar & Stok İdarəetməsi', 
      desc: 'Çoxanbarlı stok izləmə, barkod, kritik limit xəbərdarlıqları, anbarlararası transfer və sayım prosesləri.' 
    },
    { 
      icon: Users, 
      color: '#d97706', 
      bg: 'rgba(217, 119, 6, 0.08)', 
      border: 'rgba(217, 119, 6, 0.22)',
      title: 'Əməkdaş və HR Uçotu', 
      desc: 'Əməkdaş məlumatları, vəzifələr, davamiyyət və məzuniyyətlər, toplu maaş hesablanması və bonus uçotu.' 
    },
    { 
      icon: ShieldCheck, 
      color: '#0891b2', 
      bg: 'rgba(8, 145, 178, 0.08)', 
      border: 'rgba(8, 145, 178, 0.22)',
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
    <div className="hex-root-container">
      {/* GLOBAL HEX.TECH CARTESIAN BLUEPRINT GRID & MESH BACKDROP (COVERS ENTIRE SITE) */}
      <div className="hex-global-backdrop" aria-hidden="true">
        <div className="hex-radial-spot hex-spot-violet" />
        <div className="hex-radial-spot hex-spot-rose" />
        <div className="hex-radial-spot hex-spot-emerald" />
        <div className="hex-radial-spot hex-spot-lower-amethyst" />
        <div className="hex-radial-spot hex-spot-lower-emerald" />
        <div className="hex-cartesian-grid" />
        <div className="hex-dot-pattern" />
      </div>

      {/* HEADER / NAVBAR */}
      <header className="site-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div className="brand-logo-hex">
              A
            </div>
            <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.5px', color: '#14141c' }}>
              ASRALI <span style={{ color: '#059669', fontWeight: 900 }}>ERP</span>
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
            <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
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
              <ArrowRight size={17} />
            </Link>
            <a href="#is-prinsipi" className="btn-light-secondary">
              <Zap size={16} style={{ color: '#059669' }} />
              <span>Necə İşləyir?</span>
            </a>
          </div>

          {/* Social Proof Mini Bar */}
          <div className="social-proof-strip">
            <div className="proof-rating">
              <div style={{ display: 'flex', gap: '2px', color: '#f59e0b' }}>
                <Star size={14} fill="#f59e0b" />
                <Star size={14} fill="#f59e0b" />
                <Star size={14} fill="#f59e0b" />
                <Star size={14} fill="#f59e0b" />
                <Star size={14} fill="#f59e0b" />
              </div>
              <span style={{ fontWeight: 800, color: '#14141c', fontSize: '0.85rem' }}>5.0 / 5.0</span>
            </div>
            <div className="proof-divider" />
            <span style={{ color: '#59535f', fontSize: '0.85rem', fontWeight: 500 }}>14 gün pulsuz sınaq • Kredit kartı tələb olunmur</span>
          </div>
        </div>

        {/* EXPANSIVE HERO MOCKUP (HEX.TECH STYLE) */}
        <div className="mockup-container">
          <div className="mockup-frame">
            <div className="mockup-header-bar">
              <div style={{ display: 'flex', gap: '7px', alignItems: 'center' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f43f5e' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              </div>
              <div className="mockup-url-pill">
                <span>https://app.asrali.com/erp/dashboard</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#059669' }}>Live</span>
              </div>
            </div>
            <div className="mockup-img-wrap">
              <Image 
                src="/dashboard_mockup.png" 
                alt="ASRALI ERP Dashboard Preview" 
                width={1920} 
                height={1080} 
                style={{ width: '100%', height: 'auto', display: 'block' }}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* METRICS STRIP (HEX.TECH MODULAR 4-COLUMN) */}
      <section className="metrics-section">
        <div className="metrics-card">
          {metricsData.map((m, idx) => (
            <div key={idx} className="metric-box">
              <div className="metric-num">{m.num}</div>
              <div className="metric-title">{m.title}</div>
              <div className="metric-desc">{m.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* VALUE TICKER STRIP */}
      <section className="ticker-section">
        <div className="ticker-wrapper">
          <div className="ticker-content">
            <span className="ticker-item"><CheckCircle2 size={16} className="text-emerald" /> Multi-tenant struktur: hər biznes üçün ayrıca verilənlər bazası</span>
            <span className="ticker-item"><CheckCircle2 size={16} className="text-emerald" /> Müqavilə, qəbz və hesabatların ani ixrac imkanı</span>
            <span className="ticker-item"><CheckCircle2 size={16} className="text-emerald" /> Rol əsaslı təhlükəsiz giriş və ətraflı icazə sistemi</span>
            <span className="ticker-item"><CheckCircle2 size={16} className="text-emerald" /> Barkodlu satış və anbar qalıqlarının real-vaxt sinxronizasiyası</span>
            {/* Infinite loop copy */}
            <span className="ticker-item"><CheckCircle2 size={16} className="text-emerald" /> Multi-tenant struktur: hər biznes üçün ayrıca verilənlər bazası</span>
            <span className="ticker-item"><CheckCircle2 size={16} className="text-emerald" /> Müqavilə, qəbz və hesabatların ani ixrac imkanı</span>
            <span className="ticker-item"><CheckCircle2 size={16} className="text-emerald" /> Rol əsaslı təhlükəsiz giriş və ətraflı icazə sistemi</span>
            <span className="ticker-item"><CheckCircle2 size={16} className="text-emerald" /> Barkodlu satış və anbar qalıqlarının real-vaxt sinxronizasiyası</span>
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
                  <Icon size={24} />
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
      <section id="is-prinsipi" className="section-container">
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
            <ArrowRight size={17} />
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
                  <Icon size={26} style={{ color: '#059669' }} />
                </div>
                <h3 className="org-title">{org.title}</h3>
                <p className="org-desc">{org.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* PRICING (Qiymətləndirmə) */}
      <section id="qiymetler" className="section-container">
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
                <span className="price-big" style={{ fontSize: '2rem' }}>Razılaşma ilə</span>
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
                    <HelpCircle size={18} style={{ color: isOpen ? '#059669' : '#888290' }} />
                    <span>{faq.q}</span>
                  </div>
                  <ChevronRight 
                    size={18} 
                    style={{ 
                      color: isOpen ? '#059669' : '#888290', 
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
                <ArrowRight size={17} />
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
              <div className="brand-logo-hex" style={{ width: '34px', height: '34px', fontSize: '1rem' }}>
                A
              </div>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.5px', color: '#14141c' }}>
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
              <li><Mail size={15} className="text-emerald" /> info@asrali.az</li>
              <li><Phone size={15} className="text-emerald" /> +994 55 594 51 00</li>
              <li><MapPin size={15} className="text-emerald" /> Bakı, Azərbaycan</li>
              <li><Clock size={15} className="text-emerald" /> 24/7 Dəstək Mərkəzi</li>
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

      {/* GLOBAL CSS STYLING - AUTHENTIC HEX.TECH WARM-OPAL & CARTESIAN GRID AESTHETIC */}
      <style dangerouslySetInnerHTML={{__html: `
        /* Reset & Base */
        html { scroll-behavior: smooth; }
        
        .text-emerald { color: #059669; }

        /* The authentic Hex.tech Opal warm canvas background */
        .hex-root-container {
          min-height: 100vh;
          background-color: #f7f5f6;
          background-image: 
            radial-gradient(at 0% 0%, rgba(245, 192, 192, 0.22) 0px, transparent 50%),
            radial-gradient(at 100% 0%, rgba(164, 119, 178, 0.16) 0px, transparent 50%),
            radial-gradient(at 50% 30%, rgba(92, 177, 152, 0.12) 0px, transparent 65%),
            radial-gradient(at 100% 100%, rgba(245, 192, 192, 0.15) 0px, transparent 50%);
          color: #14141c;
          overflow-x: hidden;
          font-family: inherit;
        }

        .brand-logo-hex {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: #14141c;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          color: white;
          font-size: 1.15rem;
          border: 1px solid rgba(0, 0, 0, 0.15);
          box-shadow: 0 2px 8px rgba(20, 20, 28, 0.12);
        }

        /* HEADER */
        .site-header {
          position: fixed;
          top: 0; left: 0; right: 0;
          height: 72px;
          padding: 0 6%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(247, 245, 246, 0.82);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          z-index: 100;
          border-bottom: 1px solid #e9e5e8;
        }

        .desktop-nav {
          display: flex;
          gap: 2.2rem;
          align-items: center;
        }

        .nav-link {
          color: #59535f;
          font-weight: 500;
          text-decoration: none;
          font-size: 0.92rem;
          transition: color 0.15s ease;
        }
        .nav-link:hover {
          color: #14141c;
        }

        .nav-btn-secondary {
          color: #2b252c;
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          padding: 0.55rem 1.15rem;
          border-radius: 9px;
          transition: all 0.15s;
        }
        .nav-btn-secondary:hover {
          color: #14141c;
          background: rgba(0, 0, 0, 0.04);
        }

        .nav-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.55rem 1.25rem;
          background: #14141c;
          color: white;
          border-radius: 9px;
          font-weight: 600;
          font-size: 0.9rem;
          text-decoration: none;
          transition: all 0.2s ease;
          border: 1px solid #2b252c;
        }
        .nav-btn-primary:hover {
          background: #252128;
          transform: translateY(-1px);
        }

        /* HERO SECTION */
        .hero-section {
          padding: 8.5rem 4% 5rem;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        /* Hex.tech Full-Page Cartesian Blueprint & Mesh Backdrop */
        .hex-global-backdrop {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          overflow: hidden;
          width: 100vw;
          height: 100vh;
        }
        .hex-radial-spot {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.55;
          pointer-events: none;
        }
        .hex-spot-violet {
          top: -5%;
          left: 15%;
          width: 50vw;
          height: 45vw;
          background: radial-gradient(circle, rgba(164, 119, 178, 0.22) 0%, transparent 70%);
        }
        .hex-spot-rose {
          top: 10%;
          right: -8%;
          width: 48vw;
          height: 42vw;
          background: radial-gradient(circle, rgba(245, 192, 192, 0.28) 0%, transparent 70%);
        }
        .hex-spot-emerald {
          top: 25%;
          left: -8%;
          width: 45vw;
          height: 40vw;
          background: radial-gradient(circle, rgba(92, 177, 152, 0.18) 0%, transparent 70%);
        }
        .hex-spot-lower-amethyst {
          bottom: 15%;
          right: 5%;
          width: 45vw;
          height: 40vw;
          background: radial-gradient(circle, rgba(164, 119, 178, 0.16) 0%, transparent 70%);
        }
        .hex-spot-lower-emerald {
          bottom: -5%;
          left: 10%;
          width: 50vw;
          height: 40vw;
          background: radial-gradient(circle, rgba(92, 177, 152, 0.15) 0%, transparent 70%);
        }
        /* Crisp Cartesian Blueprint Grid (Hex.tech style) */
        .hex-cartesian-grid {
          position: absolute;
          inset: 0;
          background-size: 32px 32px;
          background-image: 
            linear-gradient(to right, rgba(43, 37, 44, 0.055) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(43, 37, 44, 0.055) 1px, transparent 1px);
        }
        /* Subtle Dot Accent Pattern Overlay */
        .hex-dot-pattern {
          position: absolute;
          inset: 0;
          background-size: 32px 32px;
          background-position: 0 0;
          background-image: radial-gradient(rgba(43, 37, 44, 0.12) 1px, transparent 1px);
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 980px;
          margin: 0 auto;
        }

        .hero-title {
          font-size: clamp(2.8rem, 5.8vw, 5rem);
          font-weight: 800;
          line-height: 1.08;
          letter-spacing: -2px;
          color: #14141c;
          margin-bottom: 1.6rem;
        }

        .gradient-text {
          color: #059669;
        }

        .hero-subtitle {
          font-size: clamp(1.05rem, 1.8vw, 1.25rem);
          color: #59535f;
          max-width: 780px;
          margin: 0 auto 2.5rem;
          line-height: 1.65;
          font-weight: 400;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          margin-bottom: 2.75rem;
        }

        .btn-emerald-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.95rem 2.2rem;
          background: #059669;
          color: white;
          border-radius: 10px;
          font-weight: 700;
          font-size: 1.02rem;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(5, 150, 105, 0.25);
          transition: all 0.2s ease;
        }
        .btn-emerald-primary:hover {
          background: #047857;
          transform: translateY(-2px);
          box-shadow: 0 8px 22px rgba(5, 150, 105, 0.35);
        }

        .btn-light-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.95rem 2.2rem;
          background: #ffffff;
          color: #14141c;
          border-radius: 10px;
          font-weight: 600;
          font-size: 1.02rem;
          text-decoration: none;
          border: 1px solid #e9e5e8;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
          transition: all 0.2s ease;
        }
        .btn-light-secondary:hover {
          background: #fbf9fa;
          border-color: #dbd7da;
          transform: translateY(-2px);
        }

        .social-proof-strip {
          display: inline-flex;
          align-items: center;
          gap: 1.15rem;
          padding: 0.6rem 1.4rem;
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #e9e5e8;
          border-radius: 9999px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
          backdrop-filter: blur(8px);
        }
        .proof-rating {
          display: flex;
          align-items: center;
          gap: 0.45rem;
        }
        .proof-divider {
          width: 1px;
          height: 16px;
          background: #e9e5e8;
        }

        /* EXPANSIVE HERO MOCKUP (HEX.TECH STYLE) */
        .mockup-container {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 1320px;
          margin: 4.5rem auto 0;
          padding: 0 1rem;
        }

        .mockup-frame {
          border-radius: 16px;
          border: 1px solid #dbd7da;
          background: #ffffff;
          box-shadow: 0 25px 60px -15px rgba(20, 20, 28, 0.09), 0 0 1px rgba(0,0,0,0.1);
          overflow: hidden;
          transition: all 0.4s ease;
        }
        .mockup-frame:hover {
          box-shadow: 0 35px 80px -15px rgba(20, 20, 28, 0.14);
          border-color: #c9c5c8;
        }

        .mockup-header-bar {
          background: #faf8f9;
          padding: 0.75rem 1.25rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #e9e5e8;
        }

        .mockup-url-pill {
          background: #ffffff;
          border: 1px solid #e9e5e8;
          border-radius: 6px;
          padding: 0.25rem 1.25rem;
          color: #786065;
          font-size: 0.78rem;
          font-family: monospace;
        }

        .mockup-img-wrap {
          background: #ffffff;
          padding: 4px;
        }

        /* METRICS STRIP (HEX.TECH MODULAR 4-COLUMN) */
        .metrics-section {
          padding: 1.5rem 4% 5rem;
          position: relative;
          z-index: 5;
          max-width: 1360px;
          margin: 0 auto;
        }
        .metrics-card {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }
        .metric-box {
          background: #ffffff;
          border: 1px solid #e9e5e8;
          border-radius: 16px;
          padding: 2.25rem 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
          transition: all 0.25s ease;
          text-align: left;
        }
        .metric-box:hover {
          border-color: #a7f3d0;
          box-shadow: 0 8px 24px rgba(5, 150, 105, 0.08);
          transform: translateY(-3px);
        }
        .metric-num {
          font-size: 2.75rem;
          font-weight: 900;
          color: #059669;
          letter-spacing: -1.5px;
          line-height: 1;
          margin-bottom: 0.75rem;
        }
        .metric-title {
          font-size: 1.1rem;
          font-weight: 800;
          color: #14141c;
          margin-bottom: 0.45rem;
        }
        .metric-desc {
          color: #59535f;
          font-size: 0.9rem;
          line-height: 1.55;
        }

        /* VALUE TICKER */
        .ticker-section {
          padding: 1.5rem 0;
          background: rgba(255, 255, 255, 0.75);
          border-top: 1px solid #e9e5e8;
          border-bottom: 1px solid #e9e5e8;
          overflow: hidden;
          white-space: nowrap;
          backdrop-filter: blur(8px);
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
          color: #2b252c;
          font-size: 0.92rem;
          font-weight: 600;
          letter-spacing: 0.2px;
        }

        /* SECTION BASE */
        .section-container {
          padding: 7rem 5%;
          max-width: 1260px;
          margin: 0 auto;
          position: relative;
        }
        .section-header {
          text-align: center;
          margin-bottom: 4.5rem;
        }
        .section-pill {
          display: inline-block;
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          color: #059669;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          padding: 0.3rem 0.95rem;
          border-radius: 6px;
          margin-bottom: 1rem;
        }
        .section-heading {
          font-size: clamp(2.2rem, 4vw, 3.2rem);
          font-weight: 800;
          color: #14141c;
          letter-spacing: -1.2px;
          margin-bottom: 1rem;
        }
        .section-subtext {
          font-size: 1.1rem;
          color: #59535f;
          max-width: 650px;
          margin: 0 auto;
          line-height: 1.65;
        }

        /* FEATURES GRID (HEX.TECH MINIMAL CLEAN CARDS) */
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.75rem;
        }
        .feature-card {
          background: #ffffff;
          border: 1px solid #e9e5e8;
          border-radius: 16px;
          padding: 2.25rem;
          position: relative;
          overflow: hidden;
          transition: all 0.25s ease;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);
        }
        .feature-card:hover {
          border-color: #a7f3d0;
          box-shadow: 0 12px 30px rgba(5, 150, 105, 0.08);
          transform: translateY(-4px);
        }
        .feature-icon-wrapper {
          width: 52px;
          height: 52px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.5rem;
          border: 1px solid;
        }
        .feature-title {
          font-size: 1.2rem;
          font-weight: 800;
          color: #14141c;
          margin-bottom: 0.75rem;
          line-height: 1.35;
        }
        .feature-desc {
          color: #59535f;
          line-height: 1.65;
          font-size: 0.92rem;
        }
        .feature-hover-indicator {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .feature-card:hover .feature-hover-indicator {
          opacity: 1;
        }

        /* STEPS GRID */
        .steps-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.75rem;
        }
        .step-card {
          background: #ffffff;
          border: 1px solid #e9e5e8;
          border-radius: 16px;
          padding: 2.25rem;
          transition: all 0.25s ease;
          position: relative;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);
        }
        .step-card:hover {
          transform: translateY(-4px);
          border-color: #a7f3d0;
          box-shadow: 0 10px 25px rgba(5, 150, 105, 0.08);
        }
        .step-top-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .step-number-badge {
          font-size: 1.75rem;
          font-weight: 900;
          color: #059669;
          letter-spacing: -1px;
        }
        .step-icon-bubble {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .step-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: #14141c;
          margin-bottom: 0.75rem;
        }
        .step-desc {
          color: #59535f;
          line-height: 1.65;
          font-size: 0.92rem;
        }

        /* ORGANIZATIONS GRID */
        .orgs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.75rem;
        }
        .org-card {
          background: #ffffff;
          border: 1px solid #e9e5e8;
          border-radius: 16px;
          padding: 2rem;
          transition: all 0.25s;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.02);
        }
        .org-card:hover {
          transform: translateY(-4px);
          border-color: #a7f3d0;
          box-shadow: 0 10px 25px rgba(5, 150, 105, 0.08);
        }
        .org-icon-wrapper {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
        }
        .org-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #14141c;
          margin-bottom: 0.65rem;
        }
        .org-desc {
          color: #59535f;
          font-size: 0.9rem;
          line-height: 1.6;
        }

        /* PRICING GRID */
        .pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 1.75rem;
          align-items: stretch;
        }
        .pricing-card {
          background: #ffffff;
          border: 1px solid #e9e5e8;
          border-radius: 20px;
          padding: 2.75rem 2rem;
          display: flex;
          flex-direction: column;
          position: relative;
          transition: all 0.25s ease;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
        }
        .pricing-card:hover {
          transform: translateY(-5px);
          border-color: #dbd7da;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.06);
        }
        .pricing-card-featured {
          background: #ffffff;
          border: 2px solid #059669;
          box-shadow: 0 15px 40px rgba(5, 150, 105, 0.12);
        }
        .featured-badge {
          position: absolute;
          top: -13px;
          right: 1.75rem;
          background: #059669;
          color: white;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.8px;
          padding: 0.3rem 0.95rem;
          border-radius: 9999px;
        }
        .pricing-name {
          font-size: 1.3rem;
          font-weight: 800;
          color: #14141c;
          margin-bottom: 0.35rem;
        }
        .pricing-subtitle {
          color: #59535f;
          font-size: 0.88rem;
          margin-bottom: 1.5rem;
        }
        .pricing-cost {
          display: flex;
          align-items: baseline;
          margin-bottom: 0.35rem;
        }
        .price-currency {
          font-size: 1.6rem;
          font-weight: 800;
          color: #14141c;
          margin-right: 4px;
        }
        .price-big {
          font-size: 3.25rem;
          font-weight: 900;
          color: #14141c;
          letter-spacing: -1.5px;
          line-height: 1;
        }
        .price-period {
          color: #786065;
          font-size: 1rem;
          font-weight: 600;
          margin-left: 6px;
        }
        .price-term {
          font-size: 0.82rem;
          font-weight: 700;
          color: #786065;
          margin-bottom: 2rem;
        }
        .pricing-features {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .pricing-features li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #2b252c;
          font-size: 0.92rem;
          line-height: 1.4;
        }
        .pricing-action {
          margin-top: auto;
          padding-top: 2.25rem;
        }
        .btn-plan-outline {
          display: block;
          text-align: center;
          padding: 0.85rem 1.5rem;
          border-radius: 10px;
          border: 1px solid #e9e5e8;
          color: #14141c;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .btn-plan-outline:hover {
          background: #faf8f9;
          border-color: #dbd7da;
        }

        /* FAQ ACCORDION */
        .faq-container {
          max-width: 820px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }
        .faq-item {
          background: #ffffff;
          border: 1px solid #e9e5e8;
          border-radius: 14px;
          padding: 1.35rem 1.65rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .faq-item:hover {
          border-color: #dbd7da;
        }
        .faq-item-open {
          border-color: #a7f3d0;
          box-shadow: 0 4px 15px rgba(5, 150, 105, 0.05);
        }
        .faq-question {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #14141c;
          font-weight: 700;
          font-size: 1.02rem;
        }
        .faq-answer {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #f2edf0;
          color: #59535f;
          line-height: 1.7;
          font-size: 0.92rem;
        }

        /* CTA SECTION */
        .cta-section {
          padding: 4rem 5% 6.5rem;
        }
        .cta-container {
          max-width: 1140px;
          margin: 0 auto;
          background: #14141c;
          border: 1px solid #2b252c;
          border-radius: 24px;
          padding: 5rem 2rem;
          position: relative;
          overflow: hidden;
          box-shadow: 0 25px 60px rgba(20, 20, 28, 0.2);
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
          font-weight: 800;
          color: #ffffff;
          margin-bottom: 1.25rem;
          letter-spacing: -1.2px;
        }
        .cta-desc {
          color: #99797d;
          font-size: 1.15rem;
          line-height: 1.65;
          margin-bottom: 2.5rem;
        }
        .btn-cta-main {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.95rem 2.4rem;
          background: #059669;
          color: white;
          border-radius: 10px;
          font-weight: 700;
          font-size: 1.02rem;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .btn-cta-main:hover {
          background: #047857;
          transform: translateY(-2px);
        }
        .btn-cta-secondary {
          display: inline-flex;
          align-items: center;
          padding: 0.95rem 2.2rem;
          background: rgba(255, 255, 255, 0.08);
          color: white;
          border-radius: 10px;
          font-weight: 600;
          font-size: 1.02rem;
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.15);
          transition: all 0.2s ease;
        }
        .btn-cta-secondary:hover {
          background: rgba(255, 255, 255, 0.15);
        }

        /* FOOTER */
        .site-footer {
          position: relative;
          z-index: 2;
          background: rgba(247, 245, 246, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-top: 1px solid #e9e5e8;
          padding: 5rem 6% 2.5rem;
        }
        .footer-inner {
          max-width: 1260px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.5fr;
          gap: 3.5rem;
          padding-bottom: 4rem;
          border-bottom: 1px solid #e9e5e8;
        }
        .footer-brand-desc {
          color: #59535f;
          font-size: 0.92rem;
          line-height: 1.65;
          max-width: 320px;
        }
        .footer-col-title {
          color: #14141c;
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 1.35rem;
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
          color: #59535f;
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.15s ease;
        }
        .footer-link:hover {
          color: #059669;
        }
        .footer-contact-list li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          color: #59535f;
          font-size: 0.9rem;
        }
        .footer-bottom {
          max-width: 1260px;
          margin: 2.25rem auto 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #786065;
          font-size: 0.85rem;
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
          .metrics-card {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }
          .site-header {
            height: 64px;
            padding: 0 4%;
          }
          .hero-section {
            padding-top: 6.5rem;
          }
          .metrics-card {
            grid-template-columns: 1fr;
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
        }
      `}} />
    </div>
  );
}

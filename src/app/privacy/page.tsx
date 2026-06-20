'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '3rem 1rem', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#334155' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', borderRadius: '24px', padding: '3rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem' }}>
          <Link href="/erp/yardim" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#0f172a'} onMouseOut={e => e.currentTarget.style.color = '#64748b'}>
            <ArrowLeft size={18} /> Geri Qayıt
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981' }}>
            <ShieldCheck size={24} />
            <span style={{ fontWeight: 800, letterSpacing: '0.5px' }}>Təhlükəsizlik</span>
          </div>
        </div>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.5px' }}>Məxfilik Siyasəti</h1>
        <p style={{ color: '#64748b', marginBottom: '2.5rem', fontSize: '1.1rem' }}>Son yenilənmə tarixi: {new Date().toLocaleDateString('tr-TR')}</p>

        <div style={{ lineHeight: '1.8', fontSize: '1.05rem', color: '#475569' }}>
          <h2 style={{ color: '#1e293b', fontSize: '1.5rem', fontWeight: 700, marginTop: '2rem', marginBottom: '1rem' }}>1. Ümumi Müddəalar</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            "ASRALI" və "Nitrocalls" olaraq sizin məxfiliyiniz bizim üçün çox vacibdir. Bu Məxfilik Siyasəti platformamızdan istifadə etdiyiniz zaman hansı məlumatların toplandığını, necə istifadə edildiyini və qorunduğunu izah edir.
          </p>

          <h2 style={{ color: '#1e293b', fontSize: '1.5rem', fontWeight: 700, marginTop: '2rem', marginBottom: '1rem' }}>2. Toplanan Məlumatlar</h2>
          <p style={{ marginBottom: '1rem' }}>Biz aşağıdakı məlumatları toplaya bilərik:</p>
          <ul style={{ marginBottom: '1.5rem', paddingLeft: '1.5rem' }}>
            <li><strong>Şəxsi Məlumatlar:</strong> Ad, soyad, VÖEN, e-poçt ünvanı, əlaqə nömrələri.</li>
            <li><strong>Sistem Məlumatları:</strong> IP ünvanı, cihaz məlumatları, daxilolma vaxtları və platformadakı fəaliyyət tarixçəniz.</li>
            <li><strong>Biznes Məlumatları:</strong> Fakturalar, müştəri/təchizatçı siyahısı, anbar qalıqları və maliyyə məlumatları (bu məlumatlar yalnız sizin hesabınızın idarəedilməsi üçün saxlanılır).</li>
          </ul>

          <h2 style={{ color: '#1e293b', fontSize: '1.5rem', fontWeight: 700, marginTop: '2rem', marginBottom: '1rem' }}>3. Məlumatların İstifadəsı</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Toplanan məlumatlar əsasən sizə göstərilən ERP xidmətlərinin (faktura kəsimi, anbar idarəetməsi, hesabatlılıq) düzgün və kəsintisiz çalışması üçün istifadə olunur. Heç bir halda sizin maliyyə və ya müştəri bazanız üçüncü tərəflərə kommersiya məqsədilə satılmır və ya ötürülmür.
          </p>

          <h2 style={{ color: '#1e293b', fontSize: '1.5rem', fontWeight: 700, marginTop: '2rem', marginBottom: '1rem' }}>4. Məlumatların Qorunması</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Sistemimiz ən son təhlükəsizlik şifrələmə standartlarından (SSL/TLS) istifadə edir. Bütün verilənlər bazası mütəmadi olaraq arxivləşdirilir (backup) və kənar müdaxilələrdən qorunmaq üçün güvənli serverlərdə yerləşdirilir.
          </p>

          <h2 style={{ color: '#1e293b', fontSize: '1.5rem', fontWeight: 700, marginTop: '2rem', marginBottom: '1rem' }}>5. Üçüncü Tərəflərlə Paylaşım</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Biz yalnız qanunvericiliyin tələb etdiyi hallarda (məsələn, rəsmi dövlət qurumlarının sorğusu əsasında) məlumatlarınızı aidiyyatı qurumlara təqdim edə bilərik. Digər bütün hallarda məlumatlarınız tamamilə məxfi saxlanılır.
          </p>

          <h2 style={{ color: '#1e293b', fontSize: '1.5rem', fontWeight: 700, marginTop: '2rem', marginBottom: '1rem' }}>6. Əlaqə</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Məxfilik siyasətimizlə bağlı hər hansı sualınız olarsa, bizimlə əlaqə saxlamaqdan çəkinməyin:
            <br /><br />
            <strong>WhatsApp:</strong> +994 55 594 51 00<br />
            <strong>Vebsayt:</strong> <a href="https://nitrocalls.site" style={{ color: '#3b82f6', textDecoration: 'none' }}>nitrocalls.site</a>
          </p>
        </div>
      </div>
    </div>
  );
}

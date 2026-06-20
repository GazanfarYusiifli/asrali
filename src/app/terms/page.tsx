'use client';
import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '3rem 1rem', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#334155' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: 'white', borderRadius: '24px', padding: '3rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.5rem' }}>
          <Link href="/erp/yardim" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', textDecoration: 'none', fontWeight: 600, transition: 'color 0.2s' }} onMouseOver={e => e.currentTarget.style.color = '#0f172a'} onMouseOut={e => e.currentTarget.style.color = '#64748b'}>
            <ArrowLeft size={18} /> Geri Qayıt
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3b82f6' }}>
            <FileText size={24} />
            <span style={{ fontWeight: 800, letterSpacing: '0.5px' }}>İstifadə Şərtləri</span>
          </div>
        </div>

        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem', letterSpacing: '-0.5px' }}>İstifadə Şərtləri</h1>
        <p style={{ color: '#64748b', marginBottom: '2.5rem', fontSize: '1.1rem' }}>Son yenilənmə tarixi: {new Date().toLocaleDateString('tr-TR')}</p>

        <div style={{ lineHeight: '1.8', fontSize: '1.05rem', color: '#475569' }}>
          <h2 style={{ color: '#1e293b', fontSize: '1.5rem', fontWeight: 700, marginTop: '2rem', marginBottom: '1rem' }}>1. Qəbul Etmə</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Bu platformadan ("ASRALI" və ya "Nitrocalls" xidmətləri) istifadə edərək siz aşağıdakı istifadə şərtlərini oxuduğunuzu, anladığınızı və qəbul etdiyinizi təsdiq edirsiniz. Şərtlərlə razı deyilsinizsə, xahiş edirik sistemdən istifadə etməyin.
          </p>

          <h2 style={{ color: '#1e293b', fontSize: '1.5rem', fontWeight: 700, marginTop: '2rem', marginBottom: '1rem' }}>2. Xidmət Səviyyəsi</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Sistemimiz ERP, maliyyə və anbar idarəetməsini asanlaşdırmaq üçün yaradılmışdır. Biz xidmətlərin fasiləsiz və xətasız olacağına tam zəmanət verə bilməsək də, 99% uptime təmin etmək üçün maksimum səy göstəririk. Profilaktik tədbirlər zamanı əvvəlcədən bildirişlər göndərilir.
          </p>

          <h2 style={{ color: '#1e293b', fontSize: '1.5rem', fontWeight: 700, marginTop: '2rem', marginBottom: '1rem' }}>3. Hesab Təhlükəsizliyi</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            İstifadəçi profilinin qorunması qismən istifadəçinin öz məsuliyyətindədir. Siz hesabınıza aid giriş məlumatlarınızı (şifrəni) üçüncü şəxslərlə paylaşmamalısınız. Sizin hesabınızdan həyata keçirilən bütün əməliyyatlara görə məsuliyyət sizə aiddir.
          </p>

          <h2 style={{ color: '#1e293b', fontSize: '1.5rem', fontWeight: 700, marginTop: '2rem', marginBottom: '1rem' }}>4. Ödənişlər və Abunəliklər</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Sistem daxilindəki "PRO" xüsusiyyətlər, E-Ticarət inteqrasiyaları və digər ödənişli modullar abunəlik və ya tək ödəniş əsasında təqdim olunur. Xidmətlərin qiyməti və şərtləri xidmət müqaviləsində əks olunur. Abunəlik ləğv edilmədikcə ödənişlər dövri olaraq yenilənə bilər.
          </p>

          <h2 style={{ color: '#1e293b', fontSize: '1.5rem', fontWeight: 700, marginTop: '2rem', marginBottom: '1rem' }}>5. Məhdudiyyətlər</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            İstifadəçi platformadan qeyri-qanuni, fırıldaqçılıq, spamp, virusların yayılması və ya digər şirkətlərə zərər vurmaq məqsədilə istifadə edə bilməz. Belə hallar aşkarlandıqda profil dərhal və birdəfəlik bloklanacaqdır.
          </p>

          <h2 style={{ color: '#1e293b', fontSize: '1.5rem', fontWeight: 700, marginTop: '2rem', marginBottom: '1rem' }}>6. Dəyişikliklər</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            Nitrocalls bu İstifadə Şərtlərinə istənilən vaxt dəyişiklik etmək hüququnu özündə saxlayır. Dəyişikliklər saytda yayımlandığı andan etibarən qüvvəyə minir.
          </p>

          <h2 style={{ color: '#1e293b', fontSize: '1.5rem', fontWeight: 700, marginTop: '2rem', marginBottom: '1rem' }}>7. Əlaqə</h2>
          <p style={{ marginBottom: '1.5rem' }}>
            İstifadə şərtləri ilə bağlı daha ətraflı məlumat almaq üçün:
            <br /><br />
            <strong>WhatsApp:</strong> +994 55 594 51 00<br />
            <strong>Vebsayt:</strong> <a href="https://nitrocalls.site" style={{ color: '#3b82f6', textDecoration: 'none' }}>nitrocalls.site</a>
          </p>
        </div>
      </div>
    </div>
  );
}

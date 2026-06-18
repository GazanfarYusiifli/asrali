const fs = require('fs');
const path = require('path');

const routes = [
  // Müəssisələr
  { path: 'organizations/profile', title: 'Müəssisə profili', desc: 'Müəssisələrin detallı göstəriciləri və hesabatları.' },
  { path: 'organizations/status', title: 'Aktiv / qeyri-aktiv', desc: 'Sistemdə aktiv və dondurulmuş müəssisələrin status idarəetməsi.' },
  { path: 'organizations/compare', title: 'Müqayisə paneli', desc: 'Müəssisələri müxtəlif metrikalar üzrə yan-yana müqayisə edin.' },
  
  // Reportlar
  { path: 'reports/inventory', title: 'Anbar reportları', desc: 'Dərman və tibbi ləvazimatların hərəkəti.' },
  { path: 'reports/cash', title: 'Kassa reportları', desc: 'Nağd kassa əməliyyatlarının xülasəsi.' },
  { path: 'reports/general', title: 'Ümumi maliyyə', desc: 'Rayon səviyyəsində konsolidə edilmiş maliyyə hesabatları.' },
  { path: 'reports/daily', title: 'Günlük reportlar', desc: 'Günlük əməliyyatların detallı icmalı.' },
  { path: 'reports/monthly', title: 'Aylıq reportlar', desc: 'Aylıq dövriyyə və büdcə icrası.' },
  { path: 'reports/yearly', title: 'İllik reportlar', desc: 'İllik maliyyə bağlanış hesabatları.' },

  // Analitika
  { path: 'analytics/compare', title: 'Müəssisə müqayisəsi', desc: 'Statistik modellərlə müəssisələrarası müqayisə.' },
  { path: 'analytics/top-income', title: 'Ən çox gəlir gətirənlər', desc: 'Ən yüksək gəlirli obyektlərin siyahısı.' },
  { path: 'analytics/top-expense', title: 'Ən çox xərc edənlər', desc: 'Ən yüksək məxaricə malik obyektlər.' },
  { path: 'analytics/trends', title: 'Trend analizi', desc: 'Gəlir və xərclərin zaman oxunda trend qrafiki.' },
  { path: 'analytics/efficiency', title: 'Səmərəlilik', desc: 'Vəsaitin istifadə səmərəliliyi indeksi (ROI).' },

  // Nəzarət və Risklər
  { path: 'risks/debts', title: 'Borc siyahısı', desc: 'Kreditor borcları və ödənilməmiş öhdəliklər.' },
  { path: 'risks/loss', title: 'Zərər edən müəssisələr', desc: 'Mütəmadi zərər qeydə alan müəssisələrin siyahısı.' },
  { path: 'risks/suspicious', title: 'Şübhəli xərclər', desc: 'Süni intellekt əsaslı anomaliya və şübhəli əməliyyat xəbərdarlıqları.' },
  { path: 'risks/limits', title: 'Limit aşımı', desc: 'Aylıq büdcə limitini aşan müəssisələr.' },
  { path: 'risks/audit', title: 'Audit yoxlamaları', desc: 'Daxili nəzarət və audit qeydləri.' },

  // Anbar İcmalı
  { path: 'inventory/overview', title: 'Ümumi stok vəziyyəti', desc: 'Rayon üzrə bütün anbar qalıqlarının xülasəsi.' },
  { path: 'inventory/by-org', title: 'Müəssisə üzrə stok', desc: 'Xəstəxana və poliklinikalar üzrə spesifik qalıqlar.' },
  { path: 'inventory/shortage', title: 'Çatışmazlıq siyahısı', desc: 'Kritik səviyyəyə düşmüş ləvazimatlar.' },
  { path: 'inventory/excess', title: 'Artıq stoklar', desc: 'Həddən artıq sifariş verilmiş və istifadəsiz qalan ləvazimatlar.' },
  { path: 'inventory/usage', title: 'İstifadə hesabatı', desc: 'Hansı şöbənin nə qədər material işlətdiyi.' },

  // Maliyyə Axını
  { path: 'cashflow/cash', title: 'Kassa vəziyyəti', desc: 'Hazırkı kassa balansı və hərəkət.' },
  { path: 'cashflow/bank', title: 'Bank əməliyyatları', desc: 'Bank hesablarındakı tranzaksiyalar.' },
  { path: 'cashflow/balance', title: 'Nağd / nağdsız balans', desc: 'Ödəniş növlərinə görə ayrılmış balans.' },
  { path: 'cashflow/overview', title: 'Pul hərəkəti icmalı', desc: 'Cash Flow bəyannaməsi (Cash In / Cash Out).' },

  // Report İdarəetməsi
  { path: 'report-management/receive', title: 'Report qəbul etmə', desc: 'Tabelikdəki obyektlərdən gələn yeni hesabatlar.' },
  { path: 'report-management/approve', title: 'Report təsdiqləmə', desc: 'Yoxlanılmış və təsdiq gözləyən hesabatlar.' },
  { path: 'report-management/reject', title: 'Report geri qaytarma', desc: 'Düzəliş üçün obyektlərə geri qaytarılan hesabatlar.' },
  { path: 'report-management/filter-date', title: 'Tarixə görə filtr', desc: 'Tarix aralığı üzrə arxive edilmiş sənədlər.' },
  { path: 'report-management/filter-org', title: 'Müəssisə üzrə filtr', desc: 'Bir obyektə aid keçmiş hesabatların hamısı.' },

  // İstifadəçilər
  { path: 'users/org-users', title: 'Müəssisə istifadəçiləri', desc: 'Sistemə daxil olan istifadəçilərin siyahısı.' },
  { path: 'users/roles', title: 'Rollar', desc: 'Vəzifə və rolların təyinatı.' },
  { path: 'users/permissions', title: 'İcazələr', desc: 'Data oxuma/yazma (Read/Write) səlahiyyətləri.' },
  { path: 'users/logs', title: 'Aktivlik logları', desc: 'Sistemə giriş və edilən əməliyyatların audit izi.' },

  // Sistem İdarəetməsi
  { path: 'system/settings', title: 'Sistem parametrləri', desc: 'Qlobal ERP konfiqurasiyaları.' },
  { path: 'system/orgs', title: 'Müəssisə əlavə et / sil', desc: 'Struktur idarəetmə interfeysi.' },
  { path: 'system/formats', title: 'Report formatları', desc: 'PDF, Excel, Word export şablonları.' },
  { path: 'system/backup', title: 'Backup / bərpa', desc: 'Verilənlər bazasının (Database) ehtiyat nüsxəsi.' },

  // Servis
  { path: 'service/sync', title: 'Data sync', desc: 'Dövlət qurumları (Səhiyyə Nazirliyi və s.) ilə API inteqrasiyası.' },
  { path: 'service/logs', title: 'Loglar', desc: 'Texniki xəta və server logları.' },
  { path: 'service/health', title: 'Sistem yoxlaması', desc: 'Server, CPU və Yaddaş vəziyyəti.' }
];

const basePath = path.join(__dirname, 'src', 'app', 'tibb', 'dashboard');

routes.forEach(route => {
  const fullDirPath = path.join(basePath, route.path);
  fs.mkdirSync(fullDirPath, { recursive: true });
  
  const content = `'use client'
import React from 'react';

export default function Page() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-color)', marginBottom: '0.5rem' }}>${route.title}</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>${route.desc}</p>
      
      <div style={{ 
        backgroundColor: 'var(--surface-color)', 
        border: '1px dashed var(--border-color)', 
        borderRadius: '16px', 
        padding: '4rem 2rem', 
        textAlign: 'center',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🚧</div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Modul Tikinti Mərhələsindədir</h3>
        <p style={{ maxWidth: '500px', margin: '0 auto', lineHeight: 1.6 }}>Bu modul "SAP Light Control Panel" arxitekturasının bir parçasıdır. Tezliklə tam funksional formada aktivləşdiriləcəkdir.</p>
      </div>
    </div>
  );
}
`;
  
  fs.writeFileSync(path.join(fullDirPath, 'page.tsx'), content);
});

console.log('Successfully scaffolded ' + routes.length + ' pages.');

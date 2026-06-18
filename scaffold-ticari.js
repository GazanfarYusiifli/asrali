const fs = require('fs');
const path = require('path');

const basePath = '/Users/gazanfaryusifli/.gemini/antigravity/scratch/saas-erp/src/app/erp';

const routes = [
  { path: 'dashboard', title: 'Genel Bakış (Dashboard)' },
  { path: 'satislar/liste', title: 'Satış Listesi' },
  { path: 'satislar/anonim', title: 'Anonim Satış' },
  { path: 'satislar/hizli', title: 'Hızlı Satış' },
  { path: 'satislar/teklifler', title: 'Fiyat Teklifleri' },
  { path: 'satislar/takvim', title: 'İş Takvimi' },
  { path: 'satislar/smm', title: 'SMM' },
  { path: 'satislar/rapor', title: 'Satış Raporu' },
  { path: 'satislar/toplu-fatura', title: 'Toplu Fatura Kes' },
  { path: 'alislar/yeni', title: 'Alışlar' },
  { path: 'alislar/liste', title: 'Alış Listesi' },
  { path: 'alislar/rapor', title: 'Alış Raporu' },
  { path: 'giderler/liste', title: 'Gider Listesi' },
  { path: 'giderler/tekrarlayan', title: 'Tekrarlayan Giderler' },
  { path: 'giderler/personel', title: 'Personel Maaş ve İzin' },
  { path: 'giderler/proje', title: 'Proje Takibi' },
  { path: 'cari/musteriler', title: 'Müşteri Listesi' },
  { path: 'cari/tedarikciler', title: 'Tedarikçi Listesi' },
  { path: 'cari/arama', title: 'Arama Yap' },
  { path: 'finans/islemler', title: 'İşlem Listesi' },
  { path: 'finans/varliklar', title: 'Varlıklar' },
  { path: 'finans/entegrasyon', title: 'Banka Entegrasyonu' },
  { path: 'stok/urunler', title: 'Ürün Listesi' },
  { path: 'stok/sayim', title: 'Stok Sayımı' },
  { path: 'stok/transfer', title: 'Depolar Arası Haraket' },
  { path: 'stok/uretim', title: 'Üretim Yap' },
  { path: 'stok/depolar', title: 'Depo / Şube' },
  { path: 'stok/fiyat-guncelleme', title: 'Toplu Fiyat Değiştir' },
  { path: 'stok/ozel-fiyat', title: 'Özel Fiyat Listesi' },
  { path: 'diger/cek-senet', title: 'Çek / Senet' },
  { path: 'diger/servis', title: 'Teknik Servis' },
  { path: 'diger/icra', title: 'İcra Takip' },
  { path: 'diger/mutabakat', title: 'E-Mutabakat' },
  { path: 'efatura/gelen', title: 'Gelen E-Fatura' },
  { path: 'efatura/giden', title: 'Giden Fatura' },
  { path: 'efatura/red', title: 'Red Edilen E-Faturalar' },
  { path: 'efatura/hatali', title: 'Hatalı E-Faturalar' },
  { path: 'efatura/irsaliye', title: 'E-İrsaliye' },
  { path: 'eticaret/siparisler', title: 'Gelen Siparişler' },
  { path: 'eticaret/ayarlar', title: 'Ayarlar' },
  { path: 'raporlar', title: 'Raporlar' },
  { path: 'ayarlar', title: 'Sistem Ayarları' },
  { path: 'yardim', title: 'Yardım Merkezi' },
];

routes.forEach(route => {
  const fullDir = path.join(basePath, route.path);
  fs.mkdirSync(fullDir, { recursive: true });
  
  const fileContent = `'use client';
import React from 'react';

export default function Page() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#334155', marginBottom: '1rem' }}>
        ${route.title}
      </h1>
      <div style={{ padding: '2rem', backgroundColor: 'white', borderRadius: '12px', border: '1px dashed #cbd5e1', textAlign: 'center', color: '#64748b' }}>
        <p>Bu modul <strong>Ticari Bulut</strong> arxitekturasının bir parçası olaraq hazırlanır.</p>
        <p>Tezliklə burada canlı məlumatlar və funksionallıq əlavə ediləcəkdir.</p>
      </div>
    </div>
  );
}
`;

  fs.writeFileSync(path.join(fullDir, 'page.tsx'), fileContent);
});

console.log('Scaffold complete.');

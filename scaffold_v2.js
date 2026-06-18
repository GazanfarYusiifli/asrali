const fs = require('fs');
const path = require('path');

const routes = [
  // Dashboard
  { path: 'dashboard/daily-income-expense', title: 'Günlük gəlir / xərc', desc: 'Gün ərzində edilən mədaxil və məxaric əməliyyatlarının xülasəsi.' },
  { path: 'dashboard/cash-status', title: 'Kassa vəziyyəti', desc: 'Nağd pul vəsaitlərinin real vaxt qalığı.' },
  { path: 'dashboard/bank-balance', title: 'Bank balansı', desc: 'Bank hesablarındakı (nağdsız) vəsaitlərin qalığı.' },
  { path: 'dashboard/warehouse-status', title: 'Anbar vəziyyəti', desc: 'Anbardakı əsas tibbi ləvazimatların ümumi dəyəri və həcmi.' },
  { path: 'dashboard/debts', title: 'Borclar (debitor / kreditor)', desc: 'Bizə olan borclar (debitor) və bizim borclarımız (kreditor).' },
  { path: 'dashboard/general-overview', title: 'Ümumi maliyyə icmalı', desc: 'Aylıq/İllik mənfəət, xərc və balans hesabatlarının paneli.' },

  // Sorğu Kitabçaları
  { path: 'master-data/employees', title: 'İşçilər', desc: 'Müəssisədə çalışan tibbi və qeyri-tibbi personalın reyestri.' },
  { path: 'master-data/doctors', title: 'Həkimlər', desc: 'Həkimlərin ixtisas, şöbə və faiz bölgüsü üzrə məlumatları.' },
  { path: 'master-data/services', title: 'Xidmətlər (analiz, USM, əməliyyat)', desc: 'Xəstəxanada göstərilən pullu və sığortalı xidmətlərin kataloqu.' },
  { path: 'master-data/goods', title: 'Mallar (dərman, material)', desc: 'Anbara daxil olan və istifadə edilən bütün ləvazimatların nomenklaturası.' },
  { path: 'master-data/contractors', title: 'Kontragentlər (təchizatçılar)', desc: 'Mal aldığımız və ya xidmət göstərdiyimiz fiziki/hüquqi şəxslər.' },
  { path: 'master-data/patients', title: 'Pasiyentlər', desc: 'Klinikaya müraciət edən xəstələrin uçotu.' },
  { path: 'master-data/warehouses', title: 'Anbarlar', desc: 'Mərkəzi anbar, şöbə anbarları və apteklərin siyahısı.' },

  // Sənədlər
  { path: 'documents/service-act', title: 'Xidmət göstərilməsi (Service Act)', desc: 'Pasiyentə göstərilən xidmətlərin sənədləşdirilməsi.' },
  { path: 'documents/sales-invoice', title: 'Satış fakturası', desc: 'Hüquqi şəxslərə və sığorta şirkətlərinə kəsilən hesab-fakturalar.' },
  { path: 'documents/purchase-invoice', title: 'Alış fakturası', desc: 'Təchizatçılardan alınan mal və xidmətlərin fakturası.' },
  { path: 'documents/cash-in', title: 'Kassa mədaxil', desc: 'Kassaya nağd pulun mədaxil edilməsi sənədi (PKO).' },
  { path: 'documents/cash-out', title: 'Kassa məxaric', desc: 'Kassadan nağd pulun çıxarılması sənədi (RKO).' },
  { path: 'documents/bank-in', title: 'Bank mədaxil', desc: 'Bank hesabına daxil olan köçürmələr.' },
  { path: 'documents/bank-out', title: 'Bank məxaric', desc: 'Bank hesabından edilən ödənişlər.' },
  { path: 'documents/warehouse-in', title: 'Anbar qəbulu (dərman/mal)', desc: 'Malların anbara mədaxil edilməsi.' },
  { path: 'documents/warehouse-out', title: 'Anbar çıxışı', desc: 'Malların anbardar digər anbara və ya xaricə çıxışı.' },
  { path: 'documents/internal-use', title: 'Daxili istifadə (material sərfi)', desc: 'Şöbələr daxilində (məsələn, reanimasiyada) işlədilən materialların silinməsi.' },
  { path: 'documents/payroll', title: 'Əməkhaqqı hesablanması', desc: 'İşçilərin aylıq və sabit maaşlarının hesablanması sənədi.' },

  // Jurnallar
  { path: 'journals/all', title: 'Bütün sənədlər', desc: 'Sistemə daxil edilmiş bütün növ sənədlərin xronoloji siyahısı.' },
  { path: 'journals/services', title: 'Xidmət jurnalı', desc: 'Yalnız tibbi xidmət sənədlərinin siyahısı.' },
  { path: 'journals/cash', title: 'Kassa əməliyyatları jurnalı', desc: 'Kassa mədaxil və məxaric sənədləri.' },
  { path: 'journals/bank', title: 'Bank əməliyyatları jurnalı', desc: 'Bank hesabından çıxış və giriş sənədləri.' },
  { path: 'journals/warehouse', title: 'Anbar əməliyyatları jurnalı', desc: 'Anbar qəbul, çıxış və transfer sənədləri.' },

  // Mühasibat
  { path: 'accounting/chart-of-accounts', title: 'Hesablar planı', desc: 'Mühasibat hesablarının (Sub-hesabların) tam siyahısı.' },
  { path: 'accounting/postings', title: 'Mühasibat yazılışları (Postings)', desc: 'Sənədlər tərəfindən yaradılan Debit/Kredit ikili yazılışları.' },
  { path: 'accounting/trial-balance', title: 'Dövriyyə cədvəli (Trial Balance)', desc: 'Müəyyən dövr üçün hesabların dövriyyəsi və qalıqları (Şaxmatka).' },
  { path: 'accounting/balance-sheet', title: 'Balans hesabatı', desc: 'Aktivlər, Passivlər və Kapital üzrə yekun mühasibat balansı.' },

  // Kassa və Bank
  { path: 'finance/cash-balance', title: 'Kassa qalığı', desc: 'Valyutalar və kassalar üzrə nağd pul qalığı.' },
  { path: 'finance/cash-operations', title: 'Kassa əməliyyatları', desc: 'Nağd pulla bağlı əməliyyatların icmalı.' },
  { path: 'finance/bank-accounts', title: 'Bank hesabları', desc: 'Müəssisənin cari və depozit bank hesabları.' },
  { path: 'finance/cashflow', title: 'Pul hərəkəti', desc: 'Pul vəsaitlərinin hərəkəti hesabatı (Cashflow statement).' },

  // Anbar
  { path: 'warehouse/stock-balance', title: 'Stok qalığı', desc: 'Mövcud materialların və dərmanların real qalıq siyahısı.' },
  { path: 'warehouse/items', title: 'Dərman və materiallar', desc: 'Anbardakı nomenklaturaların siyahısı və qiymətləri.' },
  { path: 'warehouse/batches', title: 'Partiya / istifadə müddəti', desc: 'Dərmanların seriya nömrəsi və son istifadə tarixinin nəzarəti.' },
  { path: 'warehouse/incoming', title: 'Gələn mallar', desc: 'Mədaxil edilən malların qeydiyyatı.' },
  { path: 'warehouse/outgoing', title: 'Çıxan mallar', desc: 'Anbardan silinən və ya satılan mallar.' },
  { path: 'warehouse/minimum-stock', title: 'Minimum stok xəbərdarlığı', desc: 'Bitmək üzrə olan ləvazimatların siyahısı və avtomatik bildirişlər.' },

  // Tibbi Xidmətlər
  { path: 'medical-services/list', title: 'Xidmət siyahısı', desc: 'Təqdim olunan tibbi xidmətlərin qiymət cədvəli.' },
  { path: 'medical-services/by-doctor', title: 'Həkim üzrə xidmətlər', desc: 'Hər bir həkimin göstərdiyi xidmətlərin sayı və məbləği.' },
  { path: 'medical-services/daily-report', title: 'Gündəlik xidmət hesabatı', desc: 'Gün ərzində xəstələrə göstərilən prosedurların cəmi.' },
  { path: 'medical-services/income-analysis', title: 'Gəlir analizi (xidmətlər üzrə)', desc: 'Hansı xidmət növünün (USM, Laboratoriya) daha çox gəlir gətirdiyinin analizi.' },

  // Hesabatlar
  { path: 'reports/income-expense', title: 'Gəlir / xərc hesabatı', desc: 'Dövr üzrə mənfəət və zərər (P&L) hesabatı.' },
  { path: 'reports/cash', title: 'Kassa hesabatı', desc: 'Kassir hesabatı, mədaxil-məxaric qalıqları.' },
  { path: 'reports/bank', title: 'Bank hesabatı', desc: 'Bank çıxarışlarının xülasəsi.' },
  { path: 'reports/warehouse', title: 'Anbar hesabatı', desc: 'Dövriyyə cədvəli: Əvvəlki qalıq, mədaxil, məxaric, son qalıq.' },
  { path: 'reports/debts', title: 'Borc hesabatı', desc: 'Təchizatçılara borclar və sığortadan alınacaq vəsaitlər.' },
  { path: 'reports/services', title: 'Xidmət gəlirləri', desc: 'Şöbələr və ya xidmət tipləri üzrə əldə edilən daxilolmalar.' },
  { path: 'reports/periodic', title: 'Aylıq / günlük analiz', desc: 'Qrafiklər vasitəsilə göstəricilərin periodik müqayisəsi.' },

  // İstifadəçilər
  { path: 'users/list', title: 'İstifadəçilər', desc: 'Sistemə giriş icazəsi olan əməkdaşlar.' },
  { path: 'users/roles', title: 'Rollar', desc: 'İstifadəçi rolları (Admin, Mühasib, Kassir, Anbarçı, Həkim və s.).' },
  { path: 'users/permissions', title: 'İcazələr (Access control)', desc: 'Modullar və sənədlər üzrə oxuma/yazma/silmə hüquqları.' },
  { path: 'users/logs', title: 'Aktivlik logları', desc: 'İstifadəçilərin sistemdə etdikləri əməliyyatların izlənməsi.' },

  // İdarəetmə
  { path: 'management/settings', title: 'Sistem parametrləri', desc: 'Vergi faizləri, valyutalar, təşkilat parametrləri.' },
  { path: 'management/org-info', title: 'Müəssisə məlumatları', desc: 'Klinikanın rekvizitləri, bank hesabı məlumatları, loqosu.' },
  { path: 'management/backup', title: 'Backup / bərpa', desc: 'Məlumat bazasının təhlükəsizlik nüsxələrinin idarə edilməsi.' },
  { path: 'management/audit', title: 'Audit yoxlama', desc: 'Maliyyə xətalarının tapılması üçün daxili yoxlama modulu.' },

  // Servis
  { path: 'service/import-export', title: 'Data import/export', desc: 'Excel və XML ilə məlumatların yüklənməsi və çıxarılması.' },
  { path: 'service/logs', title: 'Loglar', desc: 'Sistem və server xətalarının qeydiyyatı.' },
  { path: 'service/tests', title: 'Sistem testləri', desc: 'ERP sisteminin bütövlüyünün və xürrəmliyinin avtomatik yoxlanması.' }
];

const basePath = path.join(__dirname, 'src', 'app', 'tibb');

routes.forEach(route => {
  const fullDirPath = path.join(basePath, route.path);
  fs.mkdirSync(fullDirPath, { recursive: true });
  
  const content = `'use client'
import React, { useState } from 'react';
import { Search, Plus, Filter, FileDown } from 'lucide-react';

export default function Page() {
  const [data, setData] = useState([]);

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-color)', marginBottom: '0.5rem' }}>${route.title}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>${route.desc}</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)', fontWeight: 600, cursor: 'pointer' }}>
            <FileDown size={18} />
            Export
          </button>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: 'var(--primary-color)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)' }}>
            <Plus size={18} />
            Yeni Yarat
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '20px', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
            <input 
              type="text" 
              placeholder="Axtarış..." 
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)', fontSize: '0.95rem' }}
            />
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}>
            <Filter size={18} />
            Filtrlər
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>ID / Sənəd No</th>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Tarix</th>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Məzmun</th>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Status</th>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textAlign: 'right' }}>Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  <div style={{ marginBottom: '1rem', opacity: 0.5 }}>
                    <Search size={48} style={{ margin: '0 auto' }} />
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Məlumat Tapılmadı</div>
                  <div>Sistemdə bu bölməyə aid heç bir məlumat və ya sənəd yoxdur. "Yeni Yarat" düyməsi ilə daxil edə bilərsiniz.</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
`;
  
  fs.writeFileSync(path.join(fullDirPath, 'page.tsx'), content);
});

console.log('Successfully scaffolded ' + routes.length + ' real UI empty-state pages.');

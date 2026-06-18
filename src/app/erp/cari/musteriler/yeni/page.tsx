'use client';
import React, { useState } from 'react';
import { Save, X, User, Phone, DollarSign, Users, ShieldCheck, FileText, Upload } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function YeniHesabPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('tanim'); // tanim, iletisim, finansal, yakinlar, kefil

  const tabs = [
    { id: 'tanim', label: 'Hesab Tərifi', icon: <FileText size={18} /> },
    { id: 'iletisim', label: 'Əlaqə', icon: <Phone size={18} /> },
    { id: 'finansal', label: 'Maliyyə', icon: <DollarSign size={18} /> },
    { id: 'yakinlar', label: 'Yaxınları', icon: <Users size={18} /> },
    { id: 'kefil', label: 'Zamin (Kefil)', icon: <ShieldCheck size={18} /> },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ backgroundColor: '#e0f2fe', padding: '0.5rem', borderRadius: '8px', color: '#0284c7' }}>
              <User size={24} />
            </div>
            YENİ HESAB
          </h1>
          <p style={{ color: '#64748b', marginTop: '0.25rem' }}>Sistemə yeni müştəri və ya təchizatçı əlavə edin</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={() => router.back()}
            style={{ padding: '0.6rem 1.2rem', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#475569', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <X size={18} /> Ləğv Et
          </button>
          <button 
            style={{ padding: '0.6rem 1.5rem', backgroundColor: '#3b82f6', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 6px -1px rgba(59,130,246,0.2)' }}
          >
            <Save size={18} /> Yadda Saxla
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        
        {/* TABS HEADER */}
        <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', overflowX: 'auto' }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '1rem 1.5rem',
                backgroundColor: 'transparent',
                border: 'none',
                borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent',
                color: activeTab === tab.id ? '#3b82f6' : '#64748b',
                fontWeight: activeTab === tab.id ? 700 : 500,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        <div style={{ padding: '2rem' }}>
          
          {/* 1. HESAB TƏRİFİ */}
          {activeTab === 'tanim' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <FormGroup label="Hesab Adı" placeholder="Müştəri və ya şirkət adı..." required />
                <FormGroup label="Hesab Növü (Listesi)" type="select" options={['Müştəri', 'Təchizatçı', 'Personel', 'Digər']} />
                <FormGroup label="Hesab Valyutası" type="select" options={['AZN - Manat', 'USD - Dollar', 'EUR - Avro', 'TRY - Türk Lirəsi']} />
                <FormGroup label="Hesab Kodu" placeholder="Avtomatik və ya əllə daxil edin" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <FormGroup label="Online Əməliyyatlar" type="select" options={['Aktiv', 'Passiv']} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>IBAN, Ünvanlar və digər qeydlər</label>
                  <textarea 
                    rows={6} 
                    placeholder="Banka məlumatları və xüsusi notlar bura yazılır..."
                    style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {/* 2. ƏLAQƏ */}
          {activeTab === 'iletisim' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <FormGroup label="Ölkə" type="select" options={['Azərbaycan', 'Türkiyə', 'Gürcüstan', 'Rusiya']} />
                <FormGroup label="Şəhər (İl)" placeholder="Bakı, Sumqayıt..." />
                <FormGroup label="Rayon (İlçe)" placeholder="Nərimanov, Nəsimi..." />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Tam Ünvan</label>
                  <textarea rows={3} placeholder="Küçə, bina, mənzil..." style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontFamily: 'inherit' }}></textarea>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <FormGroup label="Mobil Nömrə (Cep)" placeholder="+994 (__) ___ __ __" />
                <FormGroup label="E-Poçt Adresi" placeholder="ornek@mail.com" type="email" />
                <FormGroup label="Sabit Telefon" placeholder="+994 12 ___ __ __" />
              </div>
            </div>
          )}

          {/* 3. MALİYYƏ */}
          {activeTab === 'finansal' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem' }}>
              {/* Sütun 1 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '0.5rem', fontWeight: 700, color: '#334155' }}>Rəsmi Məlumatlar</div>
                <FormGroup label="Hesab Növü (Hüquqi/Fiziki)" type="select" options={['Hüquqi Şəxs', 'Fiziki Şəxs']} />
                <FormGroup label="VÖEN (Vergi No)" placeholder="1234567891" />
                <FormGroup label="Vergi Dairəsi" placeholder="Məs: Bakı şəhəri Lokal Gəlirlər" />
                <FormGroup label="Ş/V FİN (TC Kimlik)" placeholder="7 simvollu FİN" />
              </div>
              
              {/* Sütun 2 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '0.5rem', fontWeight: 700, color: '#334155' }}>Bakiye & Borc</div>
                <FormGroup label="Əvvəlki Qalıq (Önceki Bakiye)" placeholder="0.00" type="number" />
                <FormGroup label="Dövr Qalığı (Devir Bakiye)" placeholder="0.00" type="number" />
                <FormGroup label="Dövr Qalığının Növü" type="select" options={['Borclu (Bizə borcu var)', 'Alacaqlı (Bizim borcumuz var)']} />
                <FormGroup label="Vadə (Gün Sayı)" placeholder="Məs: 30" type="number" />
                <FormGroup label="Borc Limiti" placeholder="0.00" type="number" />
              </div>

              {/* Sütun 3 */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', marginBottom: '0.5rem', fontWeight: 700, color: '#334155' }}>Digər Tənzimləmələr</div>
                <FormGroup label="Satış Qiyməti Tipi" type="select" options={['Pərakəndə 1', 'Topdan 1', 'Özəl Təklif', 'Maya Dəyəri + 10%']} />
                <FormGroup label="Şöbə (Şube)" type="select" options={['Mərkəz Şöbə', 'Depo 1', 'Nərimanov Filialı']} />
                <FormGroup label="İşçi Təyin Et (Personel Ata)" type="select" options={['Seçilməyib', 'Əli Əliyev', 'Vəli Vəliyev']} />
                <FormGroup label="Ödəniş VÖEN-i" placeholder="Avtomatik olaraq VÖEN ilə eyni" />
              </div>
            </div>
          )}

          {/* 4. YAXINLARI */}
          {activeTab === 'yakinlar' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', color: '#64748b', fontSize: '0.9rem' }}>
                Burada şəxsin ailə üzvləri və ya şirkətin digər nümayəndələrini qeyd edə bilərsiniz.
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#334155' }}>1. Yaxın Məlumatı</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <FormGroup label="Ad Soyad" placeholder="Nümayəndə adı..." />
                    <FormGroup label="Mobil Nömrə" placeholder="+994..." />
                    <FormGroup label="Yaxınlıq Dərəcəsi" placeholder="Məs: Qardaşı / Mühasibi" />
                  </div>
                </div>
                <div style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#334155' }}>2. Yaxın Məlumatı</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <FormGroup label="Ad Soyad" placeholder="Nümayəndə adı..." />
                    <FormGroup label="Mobil Nömrə" placeholder="+994..." />
                    <FormGroup label="Yaxınlıq Dərəcəsi" placeholder="Məs: Qardaşı / Mühasibi" />
                  </div>
                </div>
                <div style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#334155' }}>3. Yaxın Məlumatı</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <FormGroup label="Ad Soyad" placeholder="Nümayəndə adı..." />
                    <FormGroup label="Mobil Nömrə" placeholder="+994..." />
                  </div>
                </div>
                <div style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#334155' }}>4. Yaxın Məlumatı</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <FormGroup label="Ad Soyad" placeholder="Nümayəndə adı..." />
                    <FormGroup label="Mobil Nömrə" placeholder="+994..." />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 5. ZAMİN (KEFİL) */}
          {activeTab === 'kefil' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '600px' }}>
              <div style={{ padding: '1rem', backgroundColor: '#fef2f2', borderRadius: '8px', color: '#991b1b', fontSize: '0.9rem', border: '1px solid #fecaca' }}>
                Borclanma üçün zamin (kefil) tələb olunursa, bu bölməni mütləq doldurun.
              </div>
              <FormGroup label="Zaminin Adı Soyadı" placeholder="Zaminin tam adı" />
              <FormGroup label="Ş/V FİN / VÖEN" placeholder="Zaminin sənəd nömrəsi" />
              <FormGroup label="Mobil Telefon" placeholder="+994..." />
              <FormGroup label="Zaminin İş Yeri" placeholder="Şirkət adı" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Sənəd Əlavə Et (Məsələn Ş/V Kopyası)</label>
                <button style={{ padding: '1rem', border: '1px dashed #cbd5e1', borderRadius: '8px', backgroundColor: '#f8fafc', color: '#64748b', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                  <Upload size={24} />
                  Faylı bura sürükləyin və ya klikləyib seçin
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// Reuseable Form Group Component
function FormGroup({ label, placeholder, type = "text", options, required }: { label: string, placeholder?: string, type?: string, options?: string[], required?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569', display: 'flex', gap: '0.25rem' }}>
        {label}
        {required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
      {type === 'select' ? (
        <select style={{ padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#f8fafc', fontSize: '0.9rem', color: '#334155' }}>
          {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : (
        <input 
          type={type} 
          placeholder={placeholder} 
          style={{ padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem', color: '#334155' }} 
        />
      )}
    </div>
  );
}

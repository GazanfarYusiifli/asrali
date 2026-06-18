'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wallet, Banknote, CreditCard, MonitorSmartphone, PieChart, Plus, Link as LinkIcon, X } from 'lucide-react';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';

export default function AktivlerPage() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currency, setCurrency] = useState('AZN');
  
  const [modalType, setModalType] = useState<'kassa' | 'banka' | 'kredi_karti' | 'pos' | null>(null);
  const [isBankIntegrationModalOpen, setIsBankIntegrationModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    ad: '',
    valyuta: 'AZN',
    mebleg: '',
    sobe: 'Mərkəz',
    aciklama: '',
    hesabNomresi: '',
    iban: '',
    bankAdi: ''
  });

  const [stats, setStats] = useState({
    kasalar: 0,
    bankalar: 0,
    krediKartlari: 0,
    posHesaplari: 0,
    toplam: 0
  });

  useEffect(() => {
    // İstifadəçinin istəyi ilə avtomatik sıfırlama (1 dəfəlik)
    if (!getAppStorage('erp_wiped_kassa_v1')) {
      removeAppStorage('erp_hesablar');
      removeAppStorage('erp_finans_islemleri');
      setAppStorage('erp_wiped_kassa_v1', 'true');
      window.location.reload();
      return;
    }

    const loadedHesablar = JSON.parse(getAppStorage('erp_hesablar') || '[]');
    const allTx = JSON.parse(getAppStorage('erp_finans_islemleri') || '[]');
    
    let kasalar = 0, bankalar = 0, krediKartlari = 0, posHesaplari = 0;
    const ratesToAzn: any = { AZN: 1, USD: 1.7, EUR: 1.8, TRY: 0.05 };

    // Hesabları tiplərinə görə qruplaşdırırıq ki, əməliyyatın hansı tipə aid olduğunu bilək
    const accountsByType: any = { kassa: [], banka: [], kredi_karti: [], pos: [] };
    loadedHesablar.forEach((h: any) => {
      if (accountsByType[h.type]) {
        accountsByType[h.type].push({ ad: h.ad, valyuta: h.valyuta });
      }
    });

    const getAccountInfo = (kassaAdi: string) => {
      for (const type in accountsByType) {
        const acc = accountsByType[type].find((a: any) => a.ad === kassaAdi);
        if (acc) return { type, valyuta: acc.valyuta };
      }
      return { type: 'kassa', valyuta: 'AZN' }; // Standart olaraq kassa sayılır
    };

    allTx.forEach((t: any) => {
      const info = getAccountInfo(t.kassaAdi);
      const val = Number(t.miktar) || 0;
      
      const valInAzn = val * (ratesToAzn[t.parabirimi || info.valyuta] || 1);
      const valInTarget = valInAzn / (ratesToAzn[currency] || 1);

      if (t.tur === 'Gəlir') {
        if (info.type === 'kassa') kasalar += valInTarget;
        else if (info.type === 'banka') bankalar += valInTarget;
        else if (info.type === 'kredi_karti') krediKartlari += valInTarget;
        else if (info.type === 'pos') posHesaplari += valInTarget;
      } else if (t.tur === 'Xərc' || t.tur === 'Para Çıkışı') {
        if (info.type === 'kassa') kasalar -= valInTarget;
        else if (info.type === 'banka') bankalar -= valInTarget;
        else if (info.type === 'kredi_karti') krediKartlari -= valInTarget;
        else if (info.type === 'pos') posHesaplari -= valInTarget;
      }
    });

    setStats({
      kasalar,
      bankalar,
      krediKartlari,
      posHesaplari,
      toplam: kasalar + bankalar + krediKartlari + posHesaplari
    });
  }, [currency, modalType]); // Recalculate if currency or modalType (meaning a save happened) changes

  const openModal = (type: any) => {
    setModalType(type);
    setFormData({ ad: '', valyuta: currency, mebleg: '', sobe: 'Mərkəz', aciklama: '', hesabNomresi: '', iban: '', bankAdi: '' });
    setIsDropdownOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const loaded = JSON.parse(getAppStorage('erp_hesablar') || '[]');
    loaded.push({ ...formData, id: Date.now().toString(), type: modalType });
    setAppStorage('erp_hesablar', JSON.stringify(loaded));

    if (Number(formData.mebleg) > 0) {
      const finansTx = JSON.parse(getAppStorage('erp_finans_islemleri') || '[]');
      finansTx.push({
        id: Date.now().toString() + '_devir',
        kassaAdi: formData.ad,
        tarih: new Date().toISOString().split('T')[0],
        tur: 'Gəlir',
        kayitTur: 'Devir (Başlanğıc)',
        kdv: '0',
        miktar: formData.mebleg,
        parabirimi: formData.valyuta || 'AZN',
        aciklama: `Yeni Hesabın Yaradılması - ${formData.aciklama || 'Açıqlama yoxdur'}`,
        isleyiYapan: 'Sistem'
      });
      setAppStorage('erp_finans_islemleri', JSON.stringify(finansTx));
    }

    setModalType(null); // This will trigger useEffect to recalculate
  };

  const Card = ({ title, amount, icon, color, bg, typeKey }: any) => (
    <div 
      onClick={() => router.push(`/erp/finans/detay/${typeKey}`)}
      style={{ backgroundColor: 'white', borderRadius: '24px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)', cursor: 'pointer', transition: 'all 0.2s' }}
      onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0,0,0,0.1)' }}
      onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.05)' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</h3>
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', backgroundColor: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a' }}>
        {amount.toLocaleString('az-AZ', {minimumFractionDigits: 2})} <span style={{fontSize: '1.25rem', color: '#94a3b8', fontWeight: 700}}>
          {currency === 'AZN' ? '₼' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₺'}
        </span>
      </div>
    </div>
  );

  return (
    <div style={{ padding: '3rem 2rem', height: '100%', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '2.2rem', color: '#1e293b', margin: 0, fontWeight: 900, letterSpacing: '-1px' }}>
            <PieChart size={36} color="#0ea5e9" /> Aktivlər (Maliyyə Varlıqları)
          </h1>
          <p style={{ margin: '0.5rem 0 0 0', color: '#64748b', fontSize: '1.1rem' }}>
            Bütün kassa, bank, POS və kart hesablarınızdakı ümumi vəziyyət
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', backgroundColor: 'white', color: '#0ea5e9', border: '1px solid #0ea5e9', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s' }} 
              onMouseOver={e=>e.currentTarget.style.backgroundColor='#f0f9ff'} 
              onMouseOut={e=>e.currentTarget.style.backgroundColor='white'}
            >
              <Plus size={20}/> Yeni Hesab Əlavə Et
            </button>
            {isDropdownOpen && (
              <div style={{ position: 'absolute', top: '110%', right: 0, backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', width: '220px', zIndex: 10 }}>
                <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <button onClick={() => openModal('kassa')} style={dropdownBtnStyle} onMouseOver={e=>e.currentTarget.style.backgroundColor='#f8fafc'} onMouseOut={e=>e.currentTarget.style.backgroundColor='transparent'}>Kassa Əlavə Et</button>
                  <button onClick={() => openModal('banka')} style={dropdownBtnStyle} onMouseOver={e=>e.currentTarget.style.backgroundColor='#f8fafc'} onMouseOut={e=>e.currentTarget.style.backgroundColor='transparent'}>Banka Hesabı Əlavə Et</button>
                  <button onClick={() => openModal('kredi_karti')} style={dropdownBtnStyle} onMouseOver={e=>e.currentTarget.style.backgroundColor='#f8fafc'} onMouseOut={e=>e.currentTarget.style.backgroundColor='transparent'}>Kredit Kartı Əlavə Et</button>
                  <button onClick={() => openModal('pos')} style={dropdownBtnStyle} onMouseOver={e=>e.currentTarget.style.backgroundColor='#f8fafc'} onMouseOut={e=>e.currentTarget.style.backgroundColor='transparent'}>POS Hesabı Əlavə Et</button>
                </div>
              </div>
            )}
          </div>

          <button onClick={() => setIsBankIntegrationModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', backgroundColor: '#0ea5e9', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(14, 165, 233, 0.39)', transition: 'transform 0.1s' }} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.96)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}>
            <LinkIcon size={20}/> Bank İnteqrasiyası Əlavə Et
          </button>
        </div>
      </div>

      {/* Currency Selector Header */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '-1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'white', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b' }}>Məzənnə Seçin:</span>
          <select value={currency} onChange={e => setCurrency(e.target.value)} style={{ border: 'none', outline: 'none', fontWeight: 800, color: '#0f172a', backgroundColor: 'transparent', cursor: 'pointer', fontSize: '0.95rem' }}>
            <option value="AZN">AZN (₼)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="TRY">TRY (₺)</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <Card 
          title="Kassalar" 
          amount={stats.kasalar} 
          icon={<Banknote size={24} />} 
          color="#10b981" 
          bg="#dcfce7" 
          typeKey="kassa"
        />
        <Card 
          title="Bankalar" 
          amount={stats.bankalar} 
          icon={<Wallet size={24} />} 
          color="#3b82f6" 
          bg="#dbeafe" 
          typeKey="banka"
        />
        <Card 
          title="Kredit Kartları" 
          amount={stats.krediKartlari} 
          icon={<CreditCard size={24} />} 
          color="#8b5cf6" 
          bg="#ede9fe" 
          typeKey="kredi_karti"
        />
        <Card 
          title="POS Hesabları" 
          amount={stats.posHesaplari} 
          icon={<MonitorSmartphone size={24} />} 
          color="#f59e0b" 
          bg="#fef3c7" 
          typeKey="pos"
        />
      </div>

      {/* Total Banner */}
      <div style={{ marginTop: '1rem', backgroundColor: '#0f172a', borderRadius: '32px', padding: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
        <div>
          <h2 style={{ margin: 0, color: '#94a3b8', fontSize: '1.25rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '0.5rem' }}>Cəmi Varlıqlar (Aktivlər)</h2>
          <div style={{ fontSize: '4rem', fontWeight: 900, color: 'white', letterSpacing: '-2px' }}>
            {stats.toplam.toLocaleString('az-AZ', {minimumFractionDigits: 2})} <span style={{fontSize: '2rem', color: '#38bdf8'}}>
              {currency === 'AZN' ? '₼' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '₺'}
            </span>
          </div>
        </div>
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
          <PieChart size={48} />
        </div>
      </div>

      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <button 
          onClick={() => {
            if(confirm('Bütün hesablar və maliyyə əməliyyatları tamamilə sıfırlanacaq. Əminsiniz?')) {
              removeAppStorage('erp_hesablar');
              removeAppStorage('erp_finans_islemleri');
              window.location.reload();
            }
          }}
          style={{ padding: '0.5rem 1rem', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, opacity: 0.7, transition: 'opacity 0.2s' }}
          onMouseOver={e=>e.currentTarget.style.opacity='1'}
          onMouseOut={e=>e.currentTarget.style.opacity='0.7'}
        >
          Sistemi Sıfırla (Bütün Hesabları Sil)
        </button>
      </div>

      {/* MODAL */}
      {modalType && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(4px)', padding: '2rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', width: '100%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
            
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
              <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.25rem', fontWeight: 800 }}>
                Yeni {modalType === 'kassa' ? 'Kassa' : modalType === 'banka' ? 'Banka Hesabı' : modalType === 'kredi_karti' ? 'Kredit Kartı' : 'POS Hesabı'} Əlavə Et
              </h2>
              <button type="button" onClick={() => setModalType(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="#64748b"/></button>
            </div>

            <form onSubmit={handleSave} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div style={formGroup}>
                <label style={labelStyle}>{modalType === 'kassa' ? 'Kasa Adı' : modalType === 'banka' ? 'Banka Adı' : modalType === 'kredi_karti' ? 'Kart Adı' : 'POS Adı'} *</label>
                <input type="text" name="ad" value={formData.ad} onChange={handleInputChange} required style={inputStyle} />
              </div>

              {(modalType === 'kassa' || modalType === 'banka') && (
                <div style={formGroup}>
                  <label style={labelStyle}>Para Birimi (Valyuta)</label>
                  <select name="valyuta" value={formData.valyuta} onChange={handleInputChange} style={inputStyle}>
                    <option value="AZN">AZN</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="TRY">TRY</option>
                  </select>
                </div>
              )}

              {modalType === 'banka' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={formGroup}>
                    <label style={labelStyle}>Hesap No</label>
                    <input type="text" name="hesabNomresi" value={formData.hesabNomresi} onChange={handleInputChange} style={inputStyle} />
                  </div>
                  <div style={formGroup}>
                    <label style={labelStyle}>İban</label>
                    <input type="text" name="iban" value={formData.iban} onChange={handleInputChange} style={inputStyle} />
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={formGroup}>
                  <label style={labelStyle}>Devir (Məbləğ)</label>
                  <input type="number" step="any" name="mebleg" value={formData.mebleg} onChange={handleInputChange} style={{...inputStyle, fontWeight: 800, fontSize: '1.1rem', color: '#10b981'}} required placeholder="0.00" />
                </div>
                <div style={formGroup}>
                  <label style={labelStyle}>Şube</label>
                  <input type="text" name="sobe" value={formData.sobe} onChange={handleInputChange} style={inputStyle} />
                </div>
              </div>

              <div style={formGroup}>
                <label style={labelStyle}>Açıklama</label>
                <input type="text" name="aciklama" value={formData.aciklama} onChange={handleInputChange} style={inputStyle} />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setModalType(null)} style={{ flex: 1, padding: '1rem', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '12px', color: '#475569', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>İmtina</button>
                <button type="submit" style={{ flex: 2, padding: '1rem', backgroundColor: '#0ea5e9', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>Yadda Saxla</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bank Integration Modal */}
      {isBankIntegrationModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(4px)', padding: '2rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', width: '100%', maxWidth: '600px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
              <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.25rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <LinkIcon size={24} color="#0ea5e9"/> Bank İnteqrasiyası Əlavə Et
              </h2>
              <button onClick={() => setIsBankIntegrationModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} color="#64748b"/></button>
            </div>
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '1.5rem' }}>
                <h3 style={{ margin: '0 0 1rem 0', color: '#1e40af', fontSize: '1.1rem', fontWeight: 800 }}>NECƏ İŞLƏYİR?</h3>
                <ul style={{ margin: 0, paddingLeft: '1.2rem', color: '#334155', fontSize: '0.95rem', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <li>İlk olaraq inteqrasiya etmək istədiyiniz bank filialına, aşağıdakı menyudan "İnteqrasiya Əlavə Et" düyməsini sıxdıqda; izah edildiyi kimi müraciət etməlisiniz.</li>
                  <li>Hesab hərəkətləriniz (Kassa və Bank + Bank İnteqrasiyası) səhifənizdə avtomatik olaraq siyahıya alınır.</li>
                  <li>Hesabınıza daxil olan və xaric olan pulları müştəri, tədarükçü, işçi, çek, sənəd və gəlir-xərc kateqoriyaları ilə uyğunlaşdırdıqda avtomatik olaraq hesablara işlənir.</li>
                  <li>Mühasib panelindən bank hərəkətlərinizi mühasibiniz istədiyi zaman əldə edə bilər.</li>
                  <li>Bütün banklarınızdakı cari balansları eyni ekranda görə bilərsiniz.</li>
                </ul>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Bank Seçin</label>
                <select style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', width: '100%', fontSize: '0.95rem', color: '#1e293b' }}>
                  <option value="">Seçim edin...</option>
                  <option value="kapital">Kapital Bank</option>
                  <option value="abb">ABB (Azərbaycan Beynəlxalq Bankı)</option>
                  <option value="pasha">PAŞA Bank</option>
                  <option value="unibank">Unibank</option>
                  <option value="leobank">Leobank</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={() => setIsBankIntegrationModalOpen(false)} style={{ flex: 1, padding: '1rem', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '12px', color: '#475569', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>İmtina</button>
                <button onClick={() => { alert('Müraciətiniz qeydə alındı! Bank tərəfindən təsdiq gözlənilir.'); setIsBankIntegrationModalOpen(false); }} style={{ flex: 2, padding: '1rem', backgroundColor: '#0ea5e9', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>İnteqrasiya Əlavə Et</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const dropdownBtnStyle: React.CSSProperties = {
  width: '100%',
  textAlign: 'left',
  padding: '0.75rem 1rem',
  backgroundColor: 'transparent',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '0.9rem',
  fontWeight: 600,
  color: '#334155',
  transition: 'background-color 0.2s'
};

const formGroup: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '0.5rem' };
const labelStyle: React.CSSProperties = { fontSize: '0.85rem', fontWeight: 700, color: '#475569' };
const inputStyle: React.CSSProperties = { padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', width: '100%', fontSize: '0.95rem', color: '#1e293b' };

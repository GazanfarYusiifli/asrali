'use client';
import React, { useState, useEffect } from 'react';
import { UserPlus, FileText, Save, Calculator, DollarSign, Phone, Users, Shield, Building, CreditCard } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';

export default function SmmPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    const searchParams = new URLSearchParams(window.location.search);
    const editId = searchParams.get('id');
    if (editId) {
      const existing = JSON.parse(getAppStorage('erp_smm_list') || '[]');
      const itemToEdit = existing.find((item: any) => item.id.toString() === editId);
      if (itemToEdit) {
        if (itemToEdit.accountData) setAccountData(itemToEdit.accountData);
        if (itemToEdit.smmData) setSmmData(itemToEdit.smmData);
      }
    }
  }, []);

  const [activeAccountTab, setActiveAccountTab] = useState('esas');
  
  // Account State
  const [accountData, setAccountData] = useState({
    hesabTipi: 'Fərdi',
    hesabAdi: '',
    hesabKodu: '',
    valyuta: 'AZN',
    elaqe: '',
    maliyye: '',
    yaxinlari: '',
    zamin: '',
    onlineEmeliyyatlar: '',
    iban: ''
  });

  // SMM State
  const [smmData, setSmmData] = useState({
    xidmetAciklamasi: '',
    tarix: new Date().toISOString().split('T')[0],
    tahsilatDurumu: 'Ödənildi',
    satici: 'Qəzənfər Yusifli',
    stopaj: 0,
    kdv: 18,
    tevkifat: 'Yox',
    meblegNovu: 'Net',
    mebleg: ''
  });

  // Calculate Net/Gross if needed (Optional feature for UI)
  const calculateTotal = () => {
    const raw = Number(smmData.mebleg) || 0;
    let net = raw;
    let brut = raw;
    let kdvAmount = 0;
    let stopajAmount = 0;

    if (smmData.meblegNovu === 'Net') {
      // Net to Brut
      // Brut = Net / (1 - Stopaj) 
      // Simplified example calculation:
      brut = raw / (1 - (smmData.stopaj / 100));
      kdvAmount = brut * (smmData.kdv / 100);
      stopajAmount = brut * (smmData.stopaj / 100);
    } else {
      // Brut to Net
      brut = raw;
      kdvAmount = brut * (smmData.kdv / 100);
      stopajAmount = brut * (smmData.stopaj / 100);
      net = brut - stopajAmount; // + KDV is separate
    }

    return { brut, net, kdvAmount, stopajAmount, totalPayable: net + kdvAmount };
  };

  const calc = calculateTotal();

  const handleSave = () => {
    if (!accountData.hesabAdi.trim()) {
      alert("XƏTA: Zəhmət olmasa 'Hesab Adı' xanasını doldurun.");
      return;
    }
    if (!smmData.xidmetAciklamasi.trim()) {
      alert("XƏTA: Zəhmət olmasa 'Xidmət Açıqlaması' xanasını doldurun.");
      return;
    }
    if (!smmData.mebleg.toString().trim() || Number(smmData.mebleg) <= 0) {
      alert("XƏTA: Zəhmət olmasa etibarlı 'Məbləğ' daxil edin.");
      return;
    }

    const existing = JSON.parse(getAppStorage('erp_smm_list') || '[]');
    const searchParams = new URLSearchParams(window.location.search);
    const editId = searchParams.get('id');

    if (editId) {
      const updatedList = existing.map((item: any) => {
        if (item.id.toString() === editId) {
          return { ...item, accountData, smmData, calc };
        }
        return item;
      });
      setAppStorage('erp_smm_list', JSON.stringify(updatedList));
    } else {
      const newSmm = {
        id: Date.now(),
        accountData,
        smmData,
        calc
      };
      setAppStorage('erp_smm_list', JSON.stringify([newSmm, ...existing]));
    }
    
    alert("SMM Qəbzi Uğurla Yadda Saxlanıldı!");
    router.push('/erp/satislar/smm');
  };

  if (!isMounted) return null;

  return (
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', height: '100%', gap: '2rem' }}>
      
      {/* Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{ backgroundColor: '#e0e7ff', padding: '0.6rem', borderRadius: '8px', color: '#4f46e5' }}>
            <FileText size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b' }}>SMM - Sərbəst Peşə Qəbzi (SPQ)</h1>
            <p style={{ color: '#64748b' }}>Yeni Hesab yaradın və ya seçilmiş hesaba Sərbəst Peşə Makbuzu kəsin.</p>
          </div>
        </div>
      </div>

      {/* Main Content Split */}
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
        
        {/* LEFT PANE: Yeni Hesab */}
        <div style={{ flex: '1 1 400px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserPlus size={20} color="#3b82f6" /> Yeni Hesab Məlumatları
            </h2>
          </div>
          
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={labelStyle}>Hesab Adı <span style={{color: '#ef4444'}}>*</span></label>
                <input type="text" value={accountData.hesabAdi} onChange={e => setAccountData({...accountData, hesabAdi: e.target.value})} style={inputStyle} placeholder="Müştəri / Firma adı..." required />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={labelStyle}>Hesab Kodu</label>
                <input type="text" value={accountData.hesabKodu} onChange={e => setAccountData({...accountData, hesabKodu: e.target.value})} style={inputStyle} placeholder="Məs: HES-001" />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={labelStyle}>Hesab Növü</label>
                <select value={accountData.hesabTipi} onChange={e => setAccountData({...accountData, hesabTipi: e.target.value})} style={inputStyle}>
                  <option>Fərdi</option>
                  <option>Korporativ</option>
                  <option>Digər</option>
                </select>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={labelStyle}>Valyuta</label>
                <select value={accountData.valyuta} onChange={e => setAccountData({...accountData, valyuta: e.target.value})} style={inputStyle}>
                  <option>AZN</option>
                  <option>USD</option>
                  <option>EUR</option>
                  <option>TRY</option>
                </select>
              </div>
            </div>

            <hr style={{ borderTop: '1px solid #f1f5f9', margin: '0' }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <Phone size={18} color="#64748b" style={{ marginTop: '0.6rem' }} />
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Əlaqə</label>
                  <input type="text" value={accountData.elaqe} onChange={e => setAccountData({...accountData, elaqe: e.target.value})} style={inputStyle} placeholder="Telefon, Email..." />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <CreditCard size={18} color="#64748b" style={{ marginTop: '0.6rem' }} />
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>İBAN və Digər Qeydlər</label>
                  <textarea rows={2} value={accountData.iban} onChange={e => setAccountData({...accountData, iban: e.target.value})} style={{...inputStyle, resize: 'none'}} placeholder="Bank məlumatları..."></textarea>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <DollarSign size={18} color="#64748b" style={{ marginTop: '0.6rem' }} />
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>Maliyyə</label>
                  <input type="text" value={accountData.maliyye} onChange={e => setAccountData({...accountData, maliyye: e.target.value})} style={inputStyle} placeholder="Vergi No, VÖEN..." />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={labelStyle}>Yaxınları</label>
                  <input type="text" value={accountData.yaxinlari} onChange={e => setAccountData({...accountData, yaxinlari: e.target.value})} style={inputStyle} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={labelStyle}>Zamin</label>
                  <input type="text" value={accountData.zamin} onChange={e => setAccountData({...accountData, zamin: e.target.value})} style={inputStyle} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={labelStyle}>Onlayn Əməliyyatlar</label>
                <input type="text" value={accountData.onlineEmeliyyatlar} onChange={e => setAccountData({...accountData, onlineEmeliyyatlar: e.target.value})} style={inputStyle} placeholder="Sistem ID və s." />
              </div>
            </div>

          </div>
        </div>


        {/* RIGHT PANE: SMM OLUŞTUR */}
        <div style={{ flex: '1.5 1 500px', backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f0fdf4', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#065f46', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calculator size={20} color="#10b981" /> Sərbəst Peşə Qəbzi Yarat (SMM)
            </h2>
          </div>
          
          <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelStyle}>Xidmət Açıqlaması <span style={{color: '#ef4444'}}>*</span></label>
              <textarea rows={2} value={smmData.xidmetAciklamasi} onChange={e => setSmmData({...smmData, xidmetAciklamasi: e.target.value})} style={{...inputStyle, resize: 'none'}} placeholder="Göstərilən xidmətin detalları..." required></textarea>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={labelStyle}>Tənzimlənmə Tarixi</label>
                <input type="date" value={smmData.tarix} onChange={e => setSmmData({...smmData, tarix: e.target.value})} style={inputStyle} />
              </div>
              <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={labelStyle}>Satışı Edən</label>
                <input type="text" value={smmData.satici} onChange={e => setSmmData({...smmData, satici: e.target.value})} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={labelStyle}>Ödəniş Vəziyyəti</label>
              <div style={{ display: 'flex', gap: '1rem', backgroundColor: '#f8fafc', padding: '0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                {['Ödənildi', 'Ödənilmədi', 'Açıq Hesab'].map((status) => (
                  <label key={status} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600, color: '#334155' }}>
                    <input 
                      type="radio" 
                      name="tahsilat" 
                      value={status} 
                      checked={smmData.tahsilatDurumu === status}
                      onChange={(e) => setSmmData({...smmData, tahsilatDurumu: e.target.value})}
                      style={{ accentColor: '#10b981', width: '16px', height: '16px' }}
                    />
                    {status}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={labelStyle}>Məbləğ Növü</label>
                <select value={smmData.meblegNovu} onChange={e => setSmmData({...smmData, meblegNovu: e.target.value})} style={inputStyle}>
                  <option value="Net">Net (Xalis)</option>
                  <option value="Brut">Brüt (Ümumi)</option>
                </select>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={labelStyle}>Məbləğ <span style={{color: '#ef4444'}}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <input type="number" value={smmData.mebleg} onChange={e => setSmmData({...smmData, mebleg: e.target.value})} style={{...inputStyle, paddingLeft: '2rem', fontWeight: 700}} placeholder="0.00" required />
                  <span style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontWeight: 700 }}>₼</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={labelStyle}>Stopaj Faizi (%)</label>
                <input type="number" value={smmData.stopaj} onChange={e => setSmmData({...smmData, stopaj: Number(e.target.value)})} style={inputStyle} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={labelStyle}>ƏDV Faizi (%)</label>
                <input type="number" value={smmData.kdv} onChange={e => setSmmData({...smmData, kdv: Number(e.target.value)})} style={inputStyle} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={labelStyle}>Tevkifat</label>
                <select value={smmData.tevkifat} onChange={e => setSmmData({...smmData, tevkifat: e.target.value})} style={inputStyle}>
                  <option value="Yox">Tevkifat Yoxdur</option>
                  <option value="Var">Tevkifat Var</option>
                </select>
              </div>
            </div>

          </div>
          
          {/* SMM Footer Summary */}
          <div style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '200px', fontSize: '0.9rem', color: '#64748b' }}>
                <span>Brüt Məbləğ:</span> <strong>{calc.brut.toFixed(2)} ₼</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '200px', fontSize: '0.9rem', color: '#64748b' }}>
                <span>Stopaj (-):</span> <strong>{calc.stopajAmount.toFixed(2)} ₼</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '200px', fontSize: '0.9rem', color: '#64748b' }}>
                <span>ƏDV (+):</span> <strong>{calc.kdvAmount.toFixed(2)} ₼</strong>
              </div>
              <div style={{ borderTop: '1px solid #cbd5e1', paddingTop: '0.5rem', marginTop: '0.2rem', display: 'flex', justifyContent: 'space-between', width: '200px', fontSize: '1.1rem', color: '#0f172a', fontWeight: 800 }}>
                <span>CƏMİ:</span> <span>{calc.totalPayable.toFixed(2)} ₼</span>
              </div>
            </div>
            <button onClick={handleSave} style={{ backgroundColor: '#10b981', color: 'white', border: 'none', padding: '0.8rem 2rem', borderRadius: '8px', fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(16, 185, 129, 0.2)', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <Save size={20} /> Qəbzi Yarat
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

const labelStyle = { fontSize: '0.85rem', fontWeight: 700, color: '#475569' };
const inputStyle = { padding: '0.7rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', color: '#0f172a', fontWeight: 500, backgroundColor: 'white', transition: 'all 0.2s', width: '100%' };

'use client';
import React, { useState, useEffect } from 'react';
import { Save, X, ArrowLeft, Receipt, Calculator } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';
import { createClient } from '@/utils/supabase/client';

export default function YeniXercPage() {
  const router = useRouter();
  
  const [docData, setDocData] = useState({
    tarix: new Date().toISOString().split('T')[0],
    kateqoriya: 'Ofis Xərcləri',
    kassaBanka: 'Əsas Bank Hesabı',
    tekrarla: 'Təkrarlanmır',
    aciqlama: '',
    mebleg: '',
    edv: '0',
    valyuta: 'AZN',
    veziyyet: 'Ödənilib'
  });

  useEffect(() => {
    const fetchEditData = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const editId = searchParams.get('id');
      if (editId) {
        const supabase = createClient();
        const { data, error } = await supabase.from('erp_expenses').select('*').eq('id', editId).single();
        if (data && !error) {
          setDocData({
            tarix: data.tarix || new Date().toISOString().split('T')[0],
            kateqoriya: data.kateqoriya || 'Ofis Xərcləri',
            kassaBanka: data.kassa_banka || 'Əsas Bank Hesabı',
            tekrarla: data.tekrarla || 'Təkrarlanmır',
            aciqlama: data.aciqlama || '',
            mebleg: data.mebleg?.toString() || '',
            edv: '0', // edv not explicitly stored in our basic schema, default to 0
            valyuta: data.valyuta || 'AZN',
            veziyyet: data.veziyyet || 'Ödənilib'
          });
        }
      }
    };
    fetchEditData();
  }, []);

  const handleSave = async () => {
    // Validation
    if (!docData.mebleg || Number(docData.mebleg) <= 0) {
      alert("XƏTA: Zəhmət olmasa düzgün məbləğ daxil edin.");
      return;
    }
    if (!docData.aciqlama.trim()) {
      alert("XƏTA: Zəhmət olmasa açıqlama daxil edin.");
      return;
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert("İstifadəçi tapılmadı, daxil olun.");
      return;
    }

    const searchParams = new URLSearchParams(window.location.search);
    const editId = searchParams.get('id');
    
    const newDoc = {
      user_id: user.id,
      tarix: docData.tarix,
      kateqoriya: docData.kateqoriya,
      kassa_banka: docData.kassaBanka,
      tekrarla: docData.tekrarla,
      aciqlama: docData.aciqlama,
      mebleg: Number(docData.mebleg),
      valyuta: docData.valyuta,
      veziyyet: docData.veziyyet
    };

    if (editId) {
      const { error } = await supabase.from('erp_expenses').update(newDoc).eq('id', editId);
      if (error) {
        console.error(error);
        alert("Xərc yenilənərkən xəta baş verdi.");
        return;
      }
    } else {
      const { error } = await supabase.from('erp_expenses').insert([newDoc]);
      if (error) {
        console.error(error);
        alert("Xərc yaradılarkən xəta baş verdi.");
        return;
      }
    }

    alert(editId ? "Xərc məlumatları uğurla yeniləndi!" : "Xərc uğurla qeydə alındı!");
    router.push('/erp/giderler/liste');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#f8fafc' }}>
      {/* Action Bar */}
      <div style={{ backgroundColor: 'white', padding: '1rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748b' }}>
            <ArrowLeft size={24} />
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ backgroundColor: '#ffedd5', padding: '0.5rem', borderRadius: '8px', color: '#f97316' }}>
              <Receipt size={24} />
            </div>
            {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('id') ? 'XƏRCƏ DÜZƏLİŞ ET' : 'YENİ XƏRC'}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => router.push('/erp/giderler/liste')} style={{ padding: '0.6rem 1.2rem', backgroundColor: 'transparent', border: '1px solid #cbd5e1', color: '#475569', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f1f5f9'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
            <X size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/> İmtina Et
          </button>
          <button onClick={handleSave} style={{ padding: '0.6rem 1.5rem', backgroundColor: '#f97316', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(249, 115, 22, 0.2)' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <Save size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/> Yadda Saxla
          </button>
        </div>
      </div>

      <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: '0 0 1rem 0', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem' }}>Ümumi Məlumatlar</h2>
            </div>
            
            <FormGroup label="Tarix" type="date" value={docData.tarix} onChange={(e:any) => setDocData({...docData, tarix: e.target.value})} required />
            <FormGroup label="Vəziyyət" type="select" options={['Ödənilib', 'Ödənilməyib']} value={docData.veziyyet} onChange={(e:any) => setDocData({...docData, veziyyet: e.target.value})} />
            
            <FormGroup label="Kateqoriya" type="select" options={['Ofis Xərcləri', 'Kommunal', 'İcarə (Arenda)', 'Nəqliyyat / Yanacaq', 'Maaş', 'Vergi / Rüsum', 'Digər']} value={docData.kateqoriya} onChange={(e:any) => setDocData({...docData, kateqoriya: e.target.value})} required />
            <FormGroup label="Kassa / Banka" type="select" options={['Əsas Bank Hesabı', 'Nəğd Kassa', 'Şəxsi Hesab']} value={docData.kassaBanka} onChange={(e:any) => setDocData({...docData, kassaBanka: e.target.value})} required />
            
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <FormGroup label="Təkrarla" type="select" options={['Təkrarlanmır', 'Hər Həftə', 'Hər Ay', 'Hər 3 Aydan Bir', 'Hər İl']} value={docData.tekrarla} onChange={(e:any) => setDocData({...docData, tekrarla: e.target.value})} />
              </div>
              <div style={{ flex: 2 }}>
                <FormGroup label="Açıqlama" placeholder="Xərcin təyinatını yazın..." value={docData.aciqlama} onChange={(e:any) => setDocData({...docData, aciqlama: e.target.value})} required />
              </div>
            </div>

            <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: '0 0 1rem 0', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calculator size={18} color="#f97316"/> Məbləğ və ƏDV
              </h2>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 2 }}>
                  <FormGroup label="Məbləğ" type="number" placeholder="0.00" value={docData.mebleg} onChange={(e:any) => setDocData({...docData, mebleg: e.target.value})} required />
                </div>
                <div style={{ flex: 1 }}>
                  <FormGroup label="ƏDV (%)" type="select" options={['0', '8', '18']} value={docData.edv} onChange={(e:any) => setDocData({...docData, edv: e.target.value})} />
                </div>
                <div style={{ flex: 1 }}>
                  <FormGroup label="Valyuta" type="select" options={['AZN', 'USD', 'EUR']} value={docData.valyuta} onChange={(e:any) => setDocData({...docData, valyuta: e.target.value})} />
                </div>
              </div>
            </div>

          </div>

          <button onClick={handleSave} style={{ width: '100%', padding: '1.2rem', backgroundColor: '#f97316', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(249, 115, 22, 0.2)' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#ea580c'} onMouseOut={e => e.currentTarget.style.backgroundColor = '#f97316'}>
            Yadda Saxla
          </button>

        </div>
      </div>
    </div>
  );
}

function FormGroup({ label, placeholder, type = "text", options, required, value, onChange }: { label: string, placeholder?: string, type?: string, options?: string[], required?: boolean, value?: any, onChange?: any }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>
        {label} {required && <span style={{color: '#ef4444'}}>*</span>}
      </label>
      {type === 'select' ? (
        <select 
          value={value} onChange={onChange}
          style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#f8fafc', fontSize: '0.95rem', color: '#0f172a', fontWeight: 500, transition: 'all 0.2s', cursor: 'pointer' }}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#f97316'; e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.1)' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.boxShadow = 'none' }}
        >
          {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : (
        <input 
          type={type} 
          placeholder={placeholder} 
          value={value} onChange={onChange}
          required={required}
          step={type === 'number' ? '0.01' : undefined}
          style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', color: '#0f172a', fontWeight: 500, backgroundColor: '#f8fafc', transition: 'all 0.2s' }} 
          onFocus={(e) => { e.currentTarget.style.borderColor = '#f97316'; e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(249, 115, 22, 0.1)' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.boxShadow = 'none' }}
        />
      )}
    </div>
  );
}

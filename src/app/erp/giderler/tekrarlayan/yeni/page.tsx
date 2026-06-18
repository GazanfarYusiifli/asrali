'use client';
import React, { useState, useEffect } from 'react';
import { Save, X, ArrowLeft, RefreshCw, Calculator } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';

export default function YeniTekrarlananXercPage() {
  const router = useRouter();
  
  const [docData, setDocData] = useState({
    veziyyet: 'Ödənilib',
    tarix: new Date().toISOString().split('T')[0],
    kateqoriya: 'Ofis Xərcləri',
    tekrarla: 'Hər Ay', // Hər Həftə, Hər Ay, Hər İl
    aciqlama: '',
    mebleg: '',
    valyuta: 'AZN'
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const editId = searchParams.get('id');
    if (editId) {
      const existing = JSON.parse(getAppStorage('erp_recurring_expenses') || '[]');
      const toEdit = existing.find((s: any) => s.id?.toString() === editId);
      if (toEdit) {
        setDocData({
          veziyyet: toEdit.veziyyet || 'Ödənilib',
          tarix: toEdit.tarix || new Date().toISOString().split('T')[0],
          kateqoriya: toEdit.kateqoriya || 'Ofis Xərcləri',
          tekrarla: toEdit.tekrarla || 'Hər Ay',
          aciqlama: toEdit.aciqlama || '',
          mebleg: toEdit.mebleg || '',
          valyuta: toEdit.valyuta || 'AZN'
        });
      }
    }
  }, []);

  const handleSave = () => {
    if (!docData.mebleg || Number(docData.mebleg) <= 0) {
      alert("XƏTA: Zəhmət olmasa düzgün məbləğ daxil edin.");
      return;
    }
    if (!docData.aciqlama.trim()) {
      alert("XƏTA: Zəhmət olmasa açıqlama daxil edin.");
      return;
    }

    const existing = JSON.parse(getAppStorage('erp_recurring_expenses') || '[]');
    const searchParams = new URLSearchParams(window.location.search);
    const editId = searchParams.get('id');
    
    const newDoc = {
      id: editId ? Number(editId) : Date.now(),
      veziyyet: docData.veziyyet,
      tarix: docData.tarix,
      kateqoriya: docData.kateqoriya,
      tekrarla: docData.tekrarla,
      aciqlama: docData.aciqlama,
      mebleg: Number(docData.mebleg),
      valyuta: docData.valyuta
    };

    if (editId) {
      const updated = existing.map((s: any) => s.id?.toString() === editId ? newDoc : s);
      setAppStorage('erp_recurring_expenses', JSON.stringify(updated));
    } else {
      setAppStorage('erp_recurring_expenses', JSON.stringify([newDoc, ...existing]));
    }

    alert(editId ? "Təkrarlanan xərc uğurla yeniləndi!" : "Təkrarlanan xərc uğurla qeydə alındı!");
    router.push('/erp/giderler/tekrarlayan');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#f8fafc' }}>
      <div style={{ backgroundColor: 'white', padding: '1rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748b' }}>
            <ArrowLeft size={24} />
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ backgroundColor: '#ffedd5', padding: '0.5rem', borderRadius: '8px', color: '#f97316' }}>
              <RefreshCw size={24} />
            </div>
            {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('id') ? 'DÜZƏLİŞ ET' : 'YENİ TƏKRARLANAN XƏRC'}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => router.push('/erp/giderler/tekrarlayan')} style={{ padding: '0.6rem 1.2rem', backgroundColor: 'transparent', border: '1px solid #cbd5e1', color: '#475569', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
            <X size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/> İmtina Et
          </button>
          <button onClick={handleSave} style={{ padding: '0.6rem 1.5rem', backgroundColor: '#f97316', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(249, 115, 22, 0.2)' }}>
            <Save size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/> Yadda Saxla
          </button>
        </div>
      </div>

      <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            
            <FormGroup label="Vəziyyət (Durum)" type="select" options={['Ödənilib', 'Ödənilməyib']} value={docData.veziyyet} onChange={(e:any) => setDocData({...docData, veziyyet: e.target.value})} />
            <FormGroup label="Tarix" type="date" value={docData.tarix} onChange={(e:any) => setDocData({...docData, tarix: e.target.value})} required />
            
            <FormGroup label="Kateqoriya (Gider Türü)" type="select" options={['Ofis Xərcləri', 'Kommunal', 'İcarə (Arenda)', 'Nəqliyyat', 'Digər']} value={docData.kateqoriya} onChange={(e:any) => setDocData({...docData, kateqoriya: e.target.value})} required />
            <FormGroup label="Təkrarla (Tekrarla)" type="select" options={['Hər Həftə', 'Hər Ay', 'Hər 3 Aydan Bir', 'Hər İl']} value={docData.tekrarla} onChange={(e:any) => setDocData({...docData, tekrarla: e.target.value})} required />
            
            <div style={{ gridColumn: '1 / -1' }}>
              <FormGroup label="Açıqlama" placeholder="Məsələn: Aylıq ofis kirayəsi..." value={docData.aciqlama} onChange={(e:any) => setDocData({...docData, aciqlama: e.target.value})} required />
            </div>

            <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: '0 0 1rem 0', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calculator size={18} color="#f97316"/> Məbləğ
              </h2>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 3 }}>
                  <FormGroup label="Məbləğ (Miktar)" type="number" placeholder="0.00" value={docData.mebleg} onChange={(e:any) => setDocData({...docData, mebleg: e.target.value})} required />
                </div>
                <div style={{ flex: 1 }}>
                  <FormGroup label="Valyuta" type="select" options={['AZN', 'USD', 'EUR']} value={docData.valyuta} onChange={(e:any) => setDocData({...docData, valyuta: e.target.value})} />
                </div>
              </div>
            </div>

          </div>
          <button onClick={handleSave} style={{ width: '100%', padding: '1.2rem', backgroundColor: '#f97316', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1.1rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(249, 115, 22, 0.2)' }}>
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
        <select value={value} onChange={onChange} style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#f8fafc', fontSize: '0.95rem', color: '#0f172a', fontWeight: 500, cursor: 'pointer' }}>
          {options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : (
        <input type={type} placeholder={placeholder} value={value} onChange={onChange} required={required} step={type === 'number' ? '0.01' : undefined} style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', color: '#0f172a', fontWeight: 500, backgroundColor: '#f8fafc' }} />
      )}
    </div>
  );
}

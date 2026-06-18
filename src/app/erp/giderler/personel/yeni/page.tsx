'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { ArrowLeft, UserPlus, Save, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';

function YeniIsciPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');
  const [isMounted, setIsMounted] = useState(false);
  
  const [formData, setFormData] = useState({
    ad: '',
    veziyyet: 'İşləyir',
    vezife: '',
    filial: 'Mərkəz Filial',
    tc: '',
    maas: '',
    prim: '',
    baslama: new Date().toISOString().split('T')[0],
    ayrilma: '',
    iban: ''
  });

  useEffect(() => {
    setIsMounted(true);
    if (editId) {
      const existingData = JSON.parse(getAppStorage('erp_personnel') || '[]');
      const itemToEdit = existingData.find((item: any) => item.id.toString() === editId);
      if (itemToEdit) {
        setFormData({
          ad: itemToEdit.ad || '',
          veziyyet: itemToEdit.veziyyet || 'İşləyir',
          vezife: itemToEdit.vezife || '',
          filial: itemToEdit.filial || 'Mərkəz Filial',
          tc: itemToEdit.tc || '',
          maas: itemToEdit.maas?.toString() || '',
          prim: itemToEdit.prim?.toString() || '',
          baslama: itemToEdit.baslama || new Date().toISOString().split('T')[0],
          ayrilma: itemToEdit.ayrilma || '',
          iban: itemToEdit.iban || ''
        });
      }
    }
  }, [editId]);

  const handleSave = () => {
    if (!formData.ad.trim()) {
      alert("XƏTA: Adı Soyadı xanası məcburidir!");
      return;
    }

    const existing = JSON.parse(getAppStorage('erp_personnel') || '[]');
    
    if (editId) {
      // Edit existing
      const updatedData = existing.map((item: any) => 
        item.id.toString() === editId ? {
          ...item,
          ad: formData.ad,
          veziyyet: formData.veziyyet,
          vezife: formData.vezife || 'Təyin edilməyib',
          filial: formData.filial,
          maas: Number(formData.maas || 0),
          prim: Number(formData.prim || 0),
          tc: formData.tc,
          baslama: formData.baslama,
          ayrilma: formData.ayrilma,
          iban: formData.iban
        } : item
      );
      setAppStorage('erp_personnel', JSON.stringify(updatedData));
      alert("İşçi məlumatları uğurla yeniləndi!");
    } else {
      // Add new
      const newIsci = {
        id: Date.now(),
        ad: formData.ad,
        veziyyet: formData.veziyyet,
        vezife: formData.vezife || 'Təyin edilməyib',
        filial: formData.filial,
        yetki: 'İstifadəçi', // Default yetki
        maas: Number(formData.maas || 0),
        prim: Number(formData.prim || 0),
        tc: formData.tc,
        baslama: formData.baslama,
        ayrilma: formData.ayrilma,
        iban: formData.iban
      };
      setAppStorage('erp_personnel', JSON.stringify([newIsci, ...existing]));
      alert("Yeni işçi uğurla sistemə əlavə edildi!");
    }
    
    router.push('/erp/giderler/personel');
  };
  
  if (!isMounted) return null;

  return (
    <div style={{ padding: '2rem', height: '100%', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto' }}>
      
      {/* Header Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white', padding: '1rem 2rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontWeight: 600, transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='#1e293b'} onMouseOut={e=>e.currentTarget.style.color='#64748b'}>
          <ArrowLeft size={20} /> Geri Qayıt
        </button>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => router.back()} style={{ padding: '0.6rem 1.2rem', backgroundColor: 'transparent', border: '1px solid #cbd5e1', color: '#475569', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e=>e.currentTarget.style.backgroundColor='#f1f5f9'} onMouseOut={e=>e.currentTarget.style.backgroundColor='transparent'}>
            <X size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/> İmtina Et
          </button>
          <button onClick={handleSave} style={{ padding: '0.6rem 1.5rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.3)', transition: 'all 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>
            <Save size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }}/> Yadda Saxla
          </button>
        </div>
      </div>

      {/* Main Form Area */}
      <div style={{ backgroundColor: 'white', padding: '2.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', maxWidth: '900px', margin: '0 auto', width: '100%', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}>
        <div style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem', marginBottom: '2rem' }}>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '1.8rem', color: '#1e293b', margin: '0 0 0.5rem 0', fontWeight: 800 }}>
            <div style={{ backgroundColor: '#e0e7ff', padding: '0.6rem', borderRadius: '10px' }}><UserPlus size={26} color="#4f46e5" /></div>
            {editId ? 'İşçi Məlumatlarını Yenilə' : 'Yeni İşçi Əlavə Et'}
          </h1>
          <p style={{ color: '#ef4444', fontSize: '0.9rem', fontWeight: 600, margin: 0 }}>Sadece * işarəli sahələr məcburidir</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Adı Soyadı <span style={{color:'#ef4444'}}>*</span></label>
            <input type="text" value={formData.ad} onChange={e => setFormData({...formData, ad: e.target.value})} style={inputStyle} placeholder="Məs: Əli Əliyev" required />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={labelStyle}>Vəziyyəti (Durumu)</label>
            <select value={formData.veziyyet} onChange={e => setFormData({...formData, veziyyet: e.target.value})} style={inputStyle}>
              <option value="İşləyir">İşləyir</option>
              <option value="Məzuniyyətdə">Məzuniyyətdə</option>
              <option value="İşdən Çıxıb">İşdən Çıxıb</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={labelStyle}>Vəzifəsi (Görevi)</label>
            <input type="text" value={formData.vezife} onChange={e => setFormData({...formData, vezife: e.target.value})} style={inputStyle} placeholder="Məs: Satış Təmsilçisi" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={labelStyle}>İşlədiyi Filial (Çalıştığı Şube)</label>
            <select value={formData.filial} onChange={e => setFormData({...formData, filial: e.target.value})} style={inputStyle}>
              <option value="Mərkəz Filial">Mərkəz Filial</option>
              <option value="Depo 1">Depo 1</option>
              <option value="Xətai Filialı">Xətai Filialı</option>
            </select>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={labelStyle}>FİN / ŞV Nömrəsi (TC Numarası)</label>
            <input type="text" value={formData.tc} onChange={e => setFormData({...formData, tc: e.target.value})} style={inputStyle} placeholder="7 simvollu FİN və ya AZE Nömrə" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={labelStyle}>Xalis Maaşı (Net Maaşı)</label>
            <div style={{ position: 'relative' }}>
              <input type="number" value={formData.maas} onChange={e => setFormData({...formData, maas: e.target.value})} style={{...inputStyle, paddingRight: '4rem'}} placeholder="0.00" />
              <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontWeight: 700 }}>AZN</span>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={labelStyle}>Satış Primi (%)</label>
            <div style={{ position: 'relative' }}>
              <input type="number" value={formData.prim} onChange={e => setFormData({...formData, prim: e.target.value})} style={{...inputStyle, paddingRight: '3rem'}} placeholder="0" />
              <span style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontWeight: 700 }}>%</span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={labelStyle}>İşə Başlama Tarixi</label>
            <input type="date" value={formData.baslama} onChange={e => setFormData({...formData, baslama: e.target.value})} style={inputStyle} />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={labelStyle}>İşdən Ayrılma Tarixi</label>
            <input type="date" value={formData.ayrilma} onChange={e => setFormData({...formData, ayrilma: e.target.value})} style={inputStyle} />
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={labelStyle}>İban ünvanları və qeydlər</label>
            <textarea value={formData.iban} onChange={e => setFormData({...formData, iban: e.target.value})} style={{...inputStyle, height: '120px', resize: 'vertical'}} placeholder="İşçinin bank hesab məlumatları və əlavə notlar buraya yazılır..."></textarea>
          </div>

        </div>

        <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end' }}>
           <button onClick={handleSave} style={{ padding: '1rem 3rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 800, fontSize: '1.1rem', cursor: 'pointer', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.4)', transition: 'all 0.2s' }} onMouseOver={e=>e.currentTarget.style.backgroundColor='#4338ca'} onMouseOut={e=>e.currentTarget.style.backgroundColor='#4f46e5'}>
            Yadda Saxla
          </button>
        </div>

      </div>
    </div>
  );
}

export default function YeniIsciPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem' }}>Yüklənir...</div>}>
      <YeniIsciPageInner />
    </Suspense>
  );
}

const labelStyle: React.CSSProperties = { display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569' };
const inputStyle: React.CSSProperties = { width: '100%', padding: '0.9rem 1rem', borderRadius: '10px', border: '2px solid #e2e8f0', outline: 'none', backgroundColor: '#f8fafc', fontSize: '1rem', color: '#1e293b', transition: 'all 0.2s', fontWeight: 500 };

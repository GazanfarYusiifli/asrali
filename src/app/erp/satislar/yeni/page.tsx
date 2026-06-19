'use client';
import React, { useState, useEffect } from 'react';
import { Save, X, ShoppingCart, Plus, Trash2, Calculator, ArrowLeft, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';
import { createClient } from '@/utils/supabase/client';

export default function YeniSatisPage() {
  const router = useRouter();
  
  const [docData, setDocData] = useState({
    tarix: new Date().toISOString().split('T')[0],
    aciqlama: '',
    fakturaNo: '',
    musteri: 'Müştəri Seçilməyib (Anonim Satış)',
    teslimDurumu: 'Təslim Edilməyib'
  });

  const [rows, setRows] = useState([
    { id: 1, itemName: '', quantity: 1, vat: 18, price: 0, includeVat: true, total: 0 }
  ]);

  useEffect(() => {
    const fetchEditData = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const editId = searchParams.get('id');
      
      if (editId) {
        const supabase = createClient();
        const { data, error } = await supabase.from('erp_sales').select('*').eq('id', editId).single();
        
        if (data && !error) {
          setDocData({
            tarix: data.tarih || new Date().toISOString().split('T')[0],
            aciqlama: data.aciklama || '',
            fakturaNo: data.fatura_no || '',
            musteri: data.hesap_adi || 'Müştəri Seçilməyib (Anonim Satış)',
            teslimDurumu: data.teslim_durumu || 'Təslim Edilməyib'
          });
          
          if (data.satirlar && data.satirlar.length > 0) {
            setRows(data.satirlar);
          } else if (data.miktar) {
            setRows([{
              id: Date.now(),
              itemName: 'Bərpa edilmiş məhsul (Köhnə qeyd)',
              quantity: 1,
              vat: 0,
              price: Number(data.miktar),
              includeVat: true,
              total: Number(data.miktar)
            }]);
          }
        }
      }
    };
    
    fetchEditData();
  }, []);

  const addRow = () => {
    setRows([...rows, { id: Date.now(), itemName: '', quantity: 1, vat: 18, price: 0, includeVat: true, total: 0 }]);
  };

  const updateRow = (id: number, field: string, value: any) => {
    setRows(rows.map(row => {
      if (row.id === id) {
        const newRow = { ...row, [field]: value };
        
        // Calculate Total
        let basePrice = Number(newRow.price);
        if (!newRow.includeVat) {
          // If price does not include VAT, add VAT to base price to get total unit price
          basePrice = basePrice * (1 + Number(newRow.vat) / 100);
        }
        newRow.total = Number(newRow.quantity) * basePrice;
        
        return newRow;
      }
      return row;
    }));
  };

  const removeRow = (id: number) => {
    if (rows.length > 1) {
      setRows(rows.filter(r => r.id !== id));
    }
  };

  // Calculations
  const subTotal = rows.reduce((acc, row) => {
    let p = Number(row.price);
    if (row.includeVat) {
       p = p / (1 + Number(row.vat) / 100); // Extract base price without VAT
    }
    return acc + (p * Number(row.quantity));
  }, 0);

  const totalVat = rows.reduce((acc, row) => {
    let p = Number(row.price);
    let vatAmount = 0;
    if (row.includeVat) {
      vatAmount = p - (p / (1 + Number(row.vat) / 100));
    } else {
      vatAmount = p * (Number(row.vat) / 100);
    }
    return acc + (vatAmount * Number(row.quantity));
  }, 0);

  const grandTotal = rows.reduce((acc, row) => acc + row.total, 0);

  const handleSave = async () => {
    // Validation
    if (!docData.fakturaNo.trim()) {
      alert("XƏTA: Zəhmət olmasa 'Faktura Nömrəsi' xanasını doldurun.");
      return;
    }
    if (rows.length === 0 || !rows[0].itemName.trim()) {
      alert("XƏTA: Satışı tamamlamaq üçün ən azı 1 məhsul əlavə edilməli və 'Məhsulun Adı' doldurulmalıdır.");
      return;
    }
    if (grandTotal <= 0) {
      alert("XƏTA: Yekun məbləğ 0 ola bilməz. Zəhmət olmasa qiymət daxil edin.");
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
    
    const newSale = {
      user_id: user.id,
      tarih: docData.tarix,
      evrak_no: editId ? undefined : 'EVR-' + Math.floor(Math.random() * 10000), // Only set for new
      fatura_no: docData.fakturaNo,
      hesap_adi: docData.musteri,
      aciklama: docData.aciqlama || 'Yeni satış əməliyyatı',
      teslim_durumu: docData.teslimDurumu,
      miktar: grandTotal,
      satirlar: rows
    };

    if (editId) {
      // Don't overwrite evrak_no on update
      delete newSale.evrak_no;
      const { error } = await supabase.from('erp_sales').update(newSale).eq('id', editId);
      if (error) {
        console.error(error);
        alert("Satış yenilənərkən xəta baş verdi.");
        return;
      }
    } else {
      const { error } = await supabase.from('erp_sales').insert([newSale]);
      if (error) {
        console.error(error);
        alert(`Satış yaradılarkən xəta baş verdi: ${error.message} \n\nDetallar: ${error.details || ''} ${error.hint || ''}`);
        return;
      }
    }

    alert(editId ? "Satış məlumatları uğurla yeniləndi!" : "Satış uğurla tamamlandı və qeydə alındı!");
    router.push('/erp/satislar/liste');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: '100%' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', marginBottom: '0.5rem', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Geriyə
          </button>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ backgroundColor: '#dcfce7', padding: '0.5rem', borderRadius: '8px', color: '#16a34a' }}>
              <ShoppingCart size={24} />
            </div>
            {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('id') ? 'SATIŞA DÜZƏLİŞ ET' : 'YENİ SATIŞ'}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => router.back()} style={{ padding: '0.6rem 1.2rem', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#475569', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <X size={18} /> Ləğv Et
          </button>
          <button onClick={handleSave} style={{ padding: '0.6rem 1.5rem', backgroundColor: '#10b981', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 6px -1px rgba(16,185,129,0.2)' }}>
            <Save size={18} /> Təsdiqlə (Satış Et)
          </button>
        </div>
      </div>

      {/* Main Form Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left Column: Document Header & Tabular Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Doc Header */}
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <FormGroup label="Sənəd Tarixi" type="date" value={docData.tarix} onChange={(e:any) => setDocData({...docData, tarix: e.target.value})} />
              <FormGroup label="Sənəd Açıqlaması" placeholder="Satış barədə qeydiniz..." value={docData.aciqlama} onChange={(e:any) => setDocData({...docData, aciqlama: e.target.value})} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <FormGroup label="Faktura Nömrəsi" placeholder="Məs: INV-0001" required value={docData.fakturaNo} onChange={(e:any) => setDocData({...docData, fakturaNo: e.target.value})} />
              <FormGroup label="Müştəri (Cari Hesab)" type="select" options={['Müştəri Seçilməyib (Anonim Satış)', 'Kontakt Home MMC', 'Baku Electronics', 'Fərdi Müştəri (Nəğd)']} value={docData.musteri} onChange={(e:any) => setDocData({...docData, musteri: e.target.value})} required />
              <FormGroup label="Təslim Vəziyyəti" type="select" options={['Təslim Edilməyib', 'Təslim Edildi']} value={docData.teslimDurumu} onChange={(e:any) => setDocData({...docData, teslimDurumu: e.target.value})} />
            </div>
          </div>

          {/* Tabular Section */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#334155' }}>Məhsul / Xidmət Detalları</h3>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                    <th style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b', width: '40px', fontWeight: 600 }}>#</th>
                    <th style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b', minWidth: '250px', fontWeight: 600 }}>Məhsul / Xidmət Adı <span style={{color: '#ef4444'}}>*</span></th>
                    <th style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b', width: '100px', fontWeight: 600 }}>Miqdar <span style={{color: '#ef4444'}}>*</span></th>
                    <th style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b', width: '100px', fontWeight: 600 }}>ƏDV (%)</th>
                    <th style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b', width: '150px', fontWeight: 600 }}>Vahid Qiymət (₼)</th>
                    <th style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b', width: '100px', textAlign: 'center', fontWeight: 600 }}>ƏDV Daxil</th>
                    <th style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b', width: '150px', textAlign: 'right', fontWeight: 600 }}>Toplam (₼)</th>
                    <th style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b', width: '50px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={row.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '1rem', color: '#94a3b8', fontWeight: 600 }}>{index + 1}</td>
                      <td style={{ padding: '0.5rem 1rem' }}>
                        <div style={{ position: 'relative' }}>
                          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                          <input 
                            type="text" 
                            placeholder="Kataloqdan seçin..."
                            value={row.itemName}
                            onChange={(e) => updateRow(row.id, 'itemName', e.target.value)}
                            style={{ width: '100%', padding: '0.6rem 0.6rem 0.6rem 2.2rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', color: '#0f172a', fontSize: '0.95rem', fontWeight: 500, backgroundColor: '#f8fafc', transition: 'all 0.2s' }}
                            onFocus={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)' }}
                            onBlur={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.boxShadow = 'none' }}
                          />
                        </div>
                      </td>
                      <td style={{ padding: '0.5rem 1rem' }}>
                        <input 
                          type="number" min="1"
                          value={row.quantity}
                          onChange={(e) => updateRow(row.id, 'quantity', e.target.value)}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', textAlign: 'center', color: '#0f172a', fontSize: '0.95rem', fontWeight: 500, backgroundColor: '#f8fafc', transition: 'all 0.2s' }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)' }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.boxShadow = 'none' }}
                        />
                      </td>
                      <td style={{ padding: '0.5rem 1rem' }}>
                        <select 
                          value={row.vat}
                          onChange={(e) => updateRow(row.id, 'vat', e.target.value)}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', color: '#0f172a', fontSize: '0.95rem', fontWeight: 500, backgroundColor: '#f8fafc', transition: 'all 0.2s', cursor: 'pointer' }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)' }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.boxShadow = 'none' }}
                        >
                          <option value="0">0%</option>
                          <option value="2">2%</option>
                          <option value="8">8%</option>
                          <option value="18">18%</option>
                        </select>
                      </td>
                      <td style={{ padding: '0.5rem 1rem' }}>
                        <input 
                          type="number" min="0" step="0.01"
                          value={row.price}
                          onChange={(e) => updateRow(row.id, 'price', e.target.value)}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', textAlign: 'right', color: '#0f172a', fontSize: '0.95rem', fontWeight: 500, backgroundColor: '#f8fafc', transition: 'all 0.2s' }}
                          onFocus={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)' }}
                          onBlur={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.boxShadow = 'none' }}
                        />
                      </td>
                      <td style={{ padding: '0.5rem 1rem', textAlign: 'center' }}>
                        <input 
                          type="checkbox"
                          checked={row.includeVat}
                          onChange={(e) => updateRow(row.id, 'includeVat', e.target.checked)}
                          style={{ width: '18px', height: '18px', accentColor: '#10b981', cursor: 'pointer' }}
                        />
                      </td>
                      <td style={{ padding: '1rem', fontWeight: 700, color: '#1e293b', textAlign: 'right', fontSize: '1.05rem' }}>
                        {row.total.toFixed(2)}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <button onClick={() => removeRow(row.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Sətiri Sil">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ padding: '1rem' }}>
              <button 
                onClick={addRow}
                style={{ width: '100%', padding: '1rem', backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'background 0.2s' }}
              >
                <Plus size={18} /> Sətir Əlavə Et
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Totals Sidebar */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)', position: 'sticky', top: '2rem', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(226, 232, 240, 0.5)', background: 'linear-gradient(to right, #f8fafc, #ffffff)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ backgroundColor: '#eff6ff', padding: '0.4rem', borderRadius: '8px' }}>
              <Calculator size={20} color="#10b981" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>Yekun Hesablama</h3>
          </div>
          
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '1rem', alignItems: 'center' }}>
              <span style={{ fontWeight: 500 }}>Ara Toplam (ƏDV Xaric):</span>
              <span style={{ fontWeight: 700, color: '#334155', fontSize: '1.1rem' }}>{subTotal.toFixed(2)} ₼</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '1rem', alignItems: 'center' }}>
              <span style={{ fontWeight: 500 }}>Yekun ƏDV:</span>
              <span style={{ fontWeight: 700, color: '#334155', fontSize: '1.1rem' }}>{totalVat.toFixed(2)} ₼</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '1rem', borderBottom: '1px dashed #cbd5e1', paddingBottom: '1.25rem', alignItems: 'center' }}>
              <span style={{ fontWeight: 500 }}>Endirim:</span>
              <span style={{ fontWeight: 700, color: '#10b981', fontSize: '1.1rem' }}>0.00 ₼</span>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', alignItems: 'flex-end' }}>
              <span style={{ fontWeight: 800, color: '#1e293b', fontSize: '1.2rem' }}>Ümumi Yekun:</span>
              <span style={{ fontWeight: 900, color: '#10b981', fontSize: '2rem', lineHeight: 1 }}>{grandTotal.toFixed(2)} <span style={{ fontSize: '1.2rem', color: '#94a3b8', fontWeight: 600 }}>₼</span></span>
            </div>
          </div>
          
          <div style={{ padding: '1.5rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
             <button onClick={handleSave} style={{ width: '100%', padding: '1.2rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 800, fontSize: '1.15rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)', transition: 'transform 0.2s, box-shadow 0.2s' }}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px 0 rgba(16, 185, 129, 0.39)'; }}
             >
              <Save size={22} /> Satışı Tamamla
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// Reuseable Form Group Component
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
          onFocus={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)' }}
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
          style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', color: '#0f172a', fontWeight: 500, backgroundColor: '#f8fafc', transition: 'all 0.2s' }} 
          onFocus={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.boxShadow = 'none' }}
        />
      )}
    </div>
  );
}

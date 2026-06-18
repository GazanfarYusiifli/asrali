'use client';
import React, { useState, useEffect } from 'react';
import { Save, X, ShoppingCart, Plus, Trash2, Calculator, ArrowLeft, Search, PackageOpen } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';

export default function YeniAlisPage() {
  const router = useRouter();
  
  const [docData, setDocData] = useState({
    tarix: new Date().toISOString().split('T')[0],
    aciqlama: '',
    fakturaNo: '',
    musteri: 'Təchizatçı Seçilməyib',
    teslimDurumu: 'Təslim Edilməyib'
  });

  const [rows, setRows] = useState([
    { id: 1, itemName: '', quantity: 1, vat: 18, price: 0, includeVat: true, total: 0 }
  ]);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const editId = searchParams.get('id');
    if (editId) {
      const existingPurchases = JSON.parse(getAppStorage('erp_purchases') || '[]');
      const purchaseToEdit = existingPurchases.find((s: any) => s.id.toString() === editId);
      if (purchaseToEdit) {
        setDocData({
          tarix: purchaseToEdit.tarih || new Date().toISOString().split('T')[0],
          aciqlama: purchaseToEdit.aciklama || '',
          fakturaNo: purchaseToEdit.faturaNo || '',
          musteri: purchaseToEdit.hesapAdi || 'Təchizatçı Seçilməyib',
          teslimDurumu: purchaseToEdit.teslimDurumu || 'Təslim Edilməyib'
        });
        if (purchaseToEdit.rows && purchaseToEdit.rows.length > 0) {
          setRows(purchaseToEdit.rows);
        } else if (purchaseToEdit.miktar) {
          // Legacy records that didn't have rows saved, restore them from total amount
          setRows([{
            id: Date.now(),
            itemName: 'Bərpa edilmiş məhsul (Köhnə qeyd)',
            quantity: 1,
            vat: 0,
            price: Number(purchaseToEdit.miktar),
            includeVat: true,
            total: Number(purchaseToEdit.miktar)
          }]);
        }
      }
    }
  }, []);

  const addRow = () => {
    setRows([...rows, { id: Date.now(), itemName: '', quantity: 1, vat: 18, price: 0, includeVat: true, total: 0 }]);
  };

  const removeRow = (id: number) => {
    if (rows.length > 1) {
      setRows(rows.filter(r => r.id !== id));
    }
  };

  const updateRow = (id: number, field: string, value: any) => {
    setRows(rows.map(row => {
      if (row.id === id) {
        const updated = { ...row, [field]: value };
        // Recalculate row total
        let basePrice = updated.price;
        if (!updated.includeVat) {
          basePrice = updated.price * (1 + updated.vat / 100);
        }
        updated.total = basePrice * updated.quantity;
        return updated;
      }
      return row;
    }));
  };

  // Calculations
  const subTotal = rows.reduce((acc, row) => {
    const basePrice = row.includeVat ? row.price / (1 + row.vat/100) : row.price;
    return acc + (basePrice * row.quantity);
  }, 0);

  const totalVat = rows.reduce((acc, row) => {
    const basePrice = row.includeVat ? row.price / (1 + row.vat/100) : row.price;
    return acc + (basePrice * (row.vat/100) * row.quantity);
  }, 0);

  const grandTotal = rows.reduce((acc, row) => acc + row.total, 0);

  const handleSave = () => {
    // Validation
    if (!docData.fakturaNo.trim()) {
      alert("XƏTA: Zəhmət olmasa 'Faktura Nömrəsi' xanasını doldurun.");
      return;
    }
    if (!docData.musteri || docData.musteri === 'Təchizatçı Seçilməyib') {
      alert("XƏTA: Zəhmət olmasa 'Təchizatçı (Cari Hesab)' xanasından təchizatçı seçin.");
      return;
    }
    if (rows.length === 0 || !rows[0].itemName.trim()) {
      alert("XƏTA: Alışı tamamlamaq üçün ən azı 1 məhsul əlavə edilməli və 'Məhsulun Adı' doldurulmalıdır.");
      return;
    }
    if (grandTotal <= 0) {
      alert("XƏTA: Yekun məbləğ 0 ola bilməz. Zəhmət olmasa qiymət daxil edin.");
      return;
    }

    // Save to localStorage
    const existingPurchases = JSON.parse(getAppStorage('erp_purchases') || '[]');
    const searchParams = new URLSearchParams(window.location.search);
    const editId = searchParams.get('id');
    
    // Create new purchase object
    const newPurchase = {
      id: editId ? Number(editId) : Date.now(),
      tarih: docData.tarix,
      evrakNo: editId ? (existingPurchases.find((s:any) => s.id.toString() === editId)?.evrakNo || 'EVR-P' + Math.floor(Math.random() * 10000)) : 'EVR-P' + Math.floor(Math.random() * 10000),
      faturaNo: docData.fakturaNo,
      hesapAdi: docData.musteri,
      aciklama: docData.aciqlama || 'Yeni alış əməliyyatı',
      teslimDurumu: docData.teslimDurumu,
      miktar: grandTotal,
      rows: rows
    };

    if (editId) {
      const updatedPurchases = existingPurchases.map((s: any) => s.id.toString() === editId ? newPurchase : s);
      setAppStorage('erp_purchases', JSON.stringify(updatedPurchases));
    } else {
      setAppStorage('erp_purchases', JSON.stringify([newPurchase, ...existingPurchases]));
    }

    alert(editId ? "Alış məlumatları uğurla yeniləndi!" : "Alış uğurla tamamlandı və qeydə alındı!");
    router.push('/erp/alislar/liste');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#f8fafc' }}>
      {/* Top Navigation / Action Bar */}
      <div style={{ backgroundColor: 'white', padding: '1rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748b' }}>
            <ArrowLeft size={24} />
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ backgroundColor: '#fee2e2', padding: '0.5rem', borderRadius: '8px', color: '#ef4444' }}>
              <PackageOpen size={24} />
            </div>
            {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('id') ? 'ALIŞA DÜZƏLİŞ ET' : 'YENİ ALIŞ'}
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => router.push('/erp/alislar/liste')} style={{ padding: '0.6rem 1.2rem', backgroundColor: 'transparent', border: '1px solid #cbd5e1', color: '#475569', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f1f5f9'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
            <X size={18} /> İmtina Et
          </button>
          <button onClick={handleSave} style={{ padding: '0.6rem 1.5rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.2)', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <Save size={18} /> Alışı Tamamla
          </button>
        </div>
      </div>

      <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Doc Header */}
          <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <FormGroup label="Sənəd Tarixi" type="date" value={docData.tarix} onChange={(e:any) => setDocData({...docData, tarix: e.target.value})} />
              <FormGroup label="Sənəd Açıqlaması" placeholder="Alış barədə qeydiniz..." value={docData.aciqlama} onChange={(e:any) => setDocData({...docData, aciqlama: e.target.value})} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <FormGroup label="Faktura Nömrəsi" placeholder="Məs: INV-0001" required value={docData.fakturaNo} onChange={(e:any) => setDocData({...docData, fakturaNo: e.target.value})} />
              <FormGroup label="Təchizatçı (Cari Hesab)" type="select" options={['Təchizatçı Seçilməyib', 'Topdan Satış Mərkəzi', 'Baku Electronics MMC', 'Fərdi Şəxs']} value={docData.musteri} onChange={(e:any) => setDocData({...docData, musteri: e.target.value})} required />
              <FormGroup label="Təslim Vəziyyəti" type="select" options={['Təslim Edilməyib', 'Təslim Edildi']} value={docData.teslimDurumu} onChange={(e:any) => setDocData({...docData, teslimDurumu: e.target.value})} />
            </div>
          </div>

          {/* Line Items */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Məhsul / Xidmət Detalları
              </h2>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                    <th style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b', width: '40px', fontWeight: 600 }}>#</th>
                    <th style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b', minWidth: '250px', fontWeight: 600 }}>Məhsul / Xidmət Adı <span style={{color: '#ef4444'}}>*</span></th>
                    <th style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b', width: '100px', fontWeight: 600 }}>Miqdar <span style={{color: '#ef4444'}}>*</span></th>
                    <th style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b', width: '100px', fontWeight: 600 }}>ƏDV (%)</th>
                    <th style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b', width: '150px', fontWeight: 600 }}>Vahid Qiymət (₼)</th>
                    <th style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b', width: '100px', textAlign: 'center', fontWeight: 600 }}>ƏDV Daxil</th>
                    <th style={{ padding: '1rem', fontSize: '0.85rem', color: '#64748b', width: '150px', textAlign: 'right', fontWeight: 600 }}>Toplam (₼)</th>
                    <th style={{ padding: '1rem', width: '60px' }}></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '1rem', color: '#64748b', fontWeight: 500 }}>{index + 1}</td>
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                          <Search size={16} style={{ position: 'absolute', left: '10px', color: '#94a3b8' }} />
                          <input 
                            type="text" 
                            placeholder="Məhsul axtar və ya yaz..." 
                            value={row.itemName}
                            onChange={(e) => updateRow(row.id, 'itemName', e.target.value)}
                            style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.2rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem' }}
                          />
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <input 
                          type="number" 
                          min="1"
                          value={row.quantity}
                          onChange={(e) => updateRow(row.id, 'quantity', Number(e.target.value))}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem', textAlign: 'center' }}
                        />
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <select 
                          value={row.vat}
                          onChange={(e) => updateRow(row.id, 'vat', Number(e.target.value))}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem' }}
                        >
                          <option value="18">18%</option>
                          <option value="8">8%</option>
                          <option value="0">0%</option>
                        </select>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <input 
                          type="number" 
                          step="0.01"
                          value={row.price}
                          onChange={(e) => updateRow(row.id, 'price', Number(e.target.value))}
                          style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem', textAlign: 'right' }}
                        />
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <input 
                          type="checkbox" 
                          checked={row.includeVat}
                          onChange={(e) => updateRow(row.id, 'includeVat', e.target.checked)}
                          style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#ef4444' }}
                        />
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700, color: '#0f172a', fontSize: '1rem' }}>
                        {row.total.toLocaleString('az-AZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'center' }}>
                        <button 
                          onClick={() => removeRow(row.id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: rows.length > 1 ? 1 : 0.3 }}
                          disabled={rows.length <= 1}
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div style={{ padding: '1rem', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
              <button 
                onClick={addRow}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: 'white', border: '1px solid #cbd5e1', color: '#475569', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.9rem' }}
                onMouseOver={e => {e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444'}}
                onMouseOut={e => {e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.color = '#475569'}}
              >
                <Plus size={16} /> Sətir Əlavə Et
              </button>
            </div>
          </div>

          {/* Totals Box */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', width: '350px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#1e293b', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                <Calculator size={18} color="#ef4444" /> Yekun Hesablama
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.95rem' }}>
                  <span>Ara Toplam (ƏDV Xaric):</span>
                  <span style={{ fontWeight: 600, color: '#334155' }}>{subTotal.toLocaleString('az-AZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₼</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.95rem' }}>
                  <span>Yekun ƏDV:</span>
                  <span style={{ fontWeight: 600, color: '#334155' }}>{totalVat.toLocaleString('az-AZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₼</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.95rem' }}>
                  <span>Endirim:</span>
                  <span style={{ fontWeight: 600, color: '#334155' }}>0.00 ₼</span>
                </div>
                
                <div style={{ borderTop: '2px dashed #e2e8f0', margin: '0.5rem 0' }}></div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                  <span>Ümumi Yekun:</span>
                  <span style={{ color: '#ef4444' }}>{grandTotal.toLocaleString('az-AZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₼</span>
                </div>
              </div>

              <button 
                onClick={handleSave}
                style={{ width: '100%', padding: '1rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', transition: 'all 0.2s', marginTop: '1.5rem', boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.2)' }}
                onMouseOver={e => e.currentTarget.style.backgroundColor = '#dc2626'}
                onMouseOut={e => e.currentTarget.style.backgroundColor = '#ef4444'}
              >
                Alışı Tamamla
              </button>
            </div>
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
          onFocus={(e) => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)' }}
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
          onFocus={(e) => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)' }}
          onBlur={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.boxShadow = 'none' }}
        />
      )}
    </div>
  );
}

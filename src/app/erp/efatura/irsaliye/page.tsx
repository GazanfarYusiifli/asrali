'use client';
import React, { useState } from 'react';
import { Save, Send, Plus, Trash2, FilePlus, Building2, PackageSearch, Calculator, AlertTriangle, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';

export default function YeniFakturaYarat() {
  const router = useRouter();
  const [voen, setVoen] = useState('');
  const [customerName, setCustomerName] = useState('');
  const invoiceType = 'OUTGOING';
  
  const [items, setItems] = useState([
    { id: 1, name: '', quantity: 1, price: 0, vatRate: 18 }
  ]);

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), name: '', quantity: 1, price: 0, vatRate: 18 }]);
  };

  const handleRemoveItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handleItemChange = (id: number, field: string, value: any) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const totalVat = items.reduce((sum, item) => sum + (item.quantity * item.price * (item.vatRate / 100)), 0);
  const grandTotal = subtotal + totalVat;

  const handleSaveAndSend = () => {
    if (!voen || !customerName) {
      alert('VÖEN və Qarşı Tərəfin Adı mütləq daxil edilməlidir.');
      return;
    }
    
    const newInvoice = {
      id: Date.now().toString(),
      invoiceNumber: `EQ-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      issueDate: new Date().toLocaleDateString('tr-TR'),
      voen,
      customerName,
      type: invoiceType,
      status: 'SENT',
      items,
      subtotal,
      vat: totalVat,
      grandTotal,
      history: [
        { status: 'DRAFT', date: new Date().toLocaleString('tr-TR'), note: 'Sənəd yaradıldı' },
        { status: 'SENT', date: new Date().toLocaleString('tr-TR'), note: 'ASAN/SİMA ilə imzalanıb DVX-yə göndərildi (Simulyasiya)' }
      ]
    };

    const existingData = getAppStorage('erp_e_invoices');
    const invoices = existingData ? JSON.parse(existingData) : [];
    invoices.push(newInvoice);
    setAppStorage('erp_e_invoices', JSON.stringify(invoices));
    
    alert('Qaimə uğurla imzalandı və Vergi Sisteminə (DVX) göndərildi!');
    router.push('/erp/efatura/giden');
  };

  return (
    <div style={{ padding: '2.5rem', minHeight: '100%', backgroundColor: '#f4f7f6', fontFamily: 'system-ui, -apple-system, sans-serif', boxSizing: 'border-box', overflowX: 'hidden' }}>
      
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 25px -5px rgba(59, 130, 246, 0.4)' }}>
            <FilePlus size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: '#0f172a', margin: 0, fontWeight: 800, letterSpacing: '-0.5px' }}>Yeni E-Qaimə Yarat</h1>
            <p style={{ margin: '0.3rem 0 0 0', color: '#64748b', fontSize: '0.95rem' }}>Vergi standartlarına uyğun elektron faktura yarat və rəsmiləşdir.</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', alignItems: 'start' }}>
          
          {/* Left Form Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', minWidth: 0 }}>
          
          {/* Company Details Card */}
          <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem' }}>
              <Building2 size={22} color="#475569" />
              <h3 style={{ margin: 0, color: '#334155', fontSize: '1.1rem', fontWeight: 700 }}>Qarşı Tərəf Məlumatları</h3>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Qarşı Tərəfin VÖEN-i <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="text" value={voen} onChange={e => setVoen(e.target.value)} placeholder="Məs: 1500000001" style={{ padding: '0.9rem 1.2rem', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1rem', transition: 'all 0.2s', backgroundColor: '#f8fafc' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Qarşı Tərəfin Adı <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} placeholder="Məs: Fidan MMC" style={{ padding: '0.9rem 1.2rem', borderRadius: '12px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '1rem', transition: 'all 0.2s', backgroundColor: '#f8fafc' }} />
              </div>
            </div>
          </div>

          {/* Items Card */}
          <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem' }}>
              <PackageSearch size={22} color="#475569" />
              <h3 style={{ margin: 0, color: '#334155', fontSize: '1.1rem', fontWeight: 700 }}>Məhsul və Xidmətlər</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1.5fr 1fr 40px', gap: '1rem', padding: '0 1rem', color: '#64748b', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                <div style={{ minWidth: 0 }}>Məhsul / Xidmət Adı</div>
                <div style={{ minWidth: 0 }}>Miqdar</div>
                <div style={{ minWidth: 0 }}>Qiymət (AZN)</div>
                <div style={{ minWidth: 0 }}>ƏDV (%)</div>
                <div></div>
              </div>
              
              {items.map((item) => (
                <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1.5fr 1fr 40px', gap: '1rem', alignItems: 'center', backgroundColor: '#f8fafc', padding: '0.8rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <input type="text" value={item.name} onChange={e => handleItemChange(item.id, 'name', e.target.value)} placeholder="Noutbuk..." style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                  <input type="number" min="1" value={item.quantity} onChange={e => handleItemChange(item.id, 'quantity', parseFloat(e.target.value) || 0)} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                  <input type="number" min="0" step="0.01" value={item.price} onChange={e => handleItemChange(item.id, 'price', parseFloat(e.target.value) || 0)} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
                  <select value={item.vatRate} onChange={e => handleItemChange(item.id, 'vatRate', parseFloat(e.target.value))} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: 'white', width: '100%', boxSizing: 'border-box' }}>
                    <option value="18">18%</option>
                    <option value="0">0%</option>
                    <option value="2">2%</option>
                    <option value="8">8%</option>
                  </select>
                  <button onClick={() => handleRemoveItem(item.id)} style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#fca5a5'} onMouseOut={e => e.currentTarget.style.backgroundColor = '#fee2e2'}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              
              <button onClick={handleAddItem} style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.2rem', backgroundColor: '#e0e7ff', color: '#4f46e5', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', marginTop: '0.5rem', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#c7d2fe'} onMouseOut={e => e.currentTarget.style.backgroundColor = '#e0e7ff'}>
                <Plus size={18} /> Yeni Sətir Əlavə Et
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Calculations & Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: '2rem' }}>
          
          <div style={{ backgroundColor: '#0f172a', color: 'white', borderRadius: '24px', padding: '2rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
              <Calculator size={22} color="#94a3b8" />
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: 'white' }}>Yekun Hesablama</h3>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.95rem' }}>
                <span>Cəmi (ƏDV xaric):</span>
                <span style={{ color: 'white', fontWeight: 600 }}>{subtotal.toFixed(2)} AZN</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '0.95rem' }}>
                <span>ƏDV məbləği:</span>
                <span style={{ color: 'white', fontWeight: 600 }}>{totalVat.toFixed(2)} AZN</span>
              </div>
              <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.1)', margin: '0.5rem 0' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, color: '#e2e8f0', fontSize: '1.1rem' }}>YEKUN:</span>
                <span style={{ color: '#34d399', fontWeight: 900, fontSize: '1.5rem' }}>{grandTotal.toFixed(2)} AZN</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1.2rem', backgroundColor: 'white', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '16px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', fontSize: '1rem' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}>
              <Save size={20} /> Qaralama Kimi Saxla
            </button>
            <button onClick={handleSaveAndSend} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1.2rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', border: 'none', borderRadius: '16px', fontWeight: 700, cursor: 'pointer', fontSize: '1rem', boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.4)', transition: 'transform 0.1s' }} onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'} onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}>
              <Send size={20} /> İmzala və Göndər
            </button>
          </div>

          <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '16px', padding: '1.2rem', display: 'flex', gap: '1rem', color: '#b45309', alignItems: 'flex-start' }}>
            <AlertTriangle size={24} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
              <strong>Diqqət:</strong> "İmzala və Göndər" seçimi ASAN/SİMA simulyasiyası edərək məlumatları rəsmiləşdirəcək.
            </span>
          </div>

        </div>
      </div>
      </div>

      {/* Rəsmi Portallara Keçid - Landscape Banner */}
      <div style={{ maxWidth: '1400px', margin: '2rem auto 0 auto', backgroundColor: 'white', borderRadius: '20px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.03)' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.2rem', fontWeight: 800 }}>Rəsmi Portallara Keçid</h3>
          <p style={{ margin: '0.5rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>ASAN İmza və ya DVX portalına keçid edərək məlumatlarınızı rəsmi sistemdə yoxlayın.</p>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <a href="https://portal.asxm.gov.az/login" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', padding: '1rem 2rem', backgroundColor: '#f0f9ff', color: '#0284c7', border: '1px solid #bae6fd', borderRadius: '14px', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s', minWidth: '250px' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#e0f2fe'} onMouseOut={e => e.currentTarget.style.backgroundColor = '#f0f9ff'}>
            ASAN İmza Portalı <ExternalLink size={18} />
          </a>
          <a href="https://new.e-taxes.gov.az/eportal/login" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', padding: '1rem 2rem', backgroundColor: '#ecfdf5', color: '#059669', border: '1px solid #a7f3d0', borderRadius: '14px', fontWeight: 700, textDecoration: 'none', transition: 'all 0.2s', minWidth: '250px' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#d1fae5'} onMouseOut={e => e.currentTarget.style.backgroundColor = '#ecfdf5'}>
            DVX Portalı (e-taxes) <ExternalLink size={18} />
          </a>
        </div>
      </div>

    </div>
  );
}

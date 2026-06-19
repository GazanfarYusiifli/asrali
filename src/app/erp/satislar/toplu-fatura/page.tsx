'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { Users, FileText, CheckCircle2, ArrowLeft, Loader2, Save, Calculator, Search, CheckSquare, Square } from 'lucide-react';

const MOCK_CUSTOMERS = [
  { id: '1', name: 'Kontakt Home MMC', group: 'Korporativ', balance: '0.00' },
  { id: '2', name: 'Baku Electronics', group: 'Korporativ', balance: '120.50' },
  { id: '3', name: 'Azercell Telecom', group: 'VIP', balance: '500.00' },
  { id: '4', name: 'Bakcell MMC', group: 'VIP', balance: '0.00' },
  { id: '5', name: 'Bravo Supermarket', group: 'Korporativ', balance: '45.00' },
  { id: '6', name: 'Araz Market', group: 'Korporativ', balance: '0.00' },
  { id: '7', name: 'Fərdi Müştəri (Nəğd)', group: 'Fərdi', balance: '0.00' },
  { id: '8', name: 'Ali Vəliyev', group: 'Fərdi', balance: '15.00' },
  { id: '9', name: 'Məmməd Məmmədov', group: 'Fərdi', balance: '0.00' },
  { id: '10', name: 'Global Tech LLC', group: 'VIP', balance: '0.00' },
];

export default function TopluFaturaPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Selection state
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [docData, setDocData] = useState({
    tarix: new Date().toISOString().split('T')[0],
    faturaItem: 'Aylıq Xidmət Haqqı',
    mebleg: '',
    edv: '0',
    aciqlama: 'Avtomatik kəsilmiş toplu faktura'
  });

  useEffect(() => {
    async function checkUser() {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
      }
      setIsLoading(false);
    }
    checkUser();
  }, [supabase]);

  const filteredCustomers = MOCK_CUSTOMERS.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.group.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleCustomer = (id: string) => {
    setSelectedCustomers(prev => 
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const handleToggleAll = () => {
    if (selectedCustomers.length === filteredCustomers.length) {
      setSelectedCustomers([]);
    } else {
      setSelectedCustomers(filteredCustomers.map(c => c.id));
    }
  };

  const handleCreateInvoices = async () => {
    if (!user) {
      alert('Sistemə daxil olmamısınız!');
      return;
    }
    if (selectedCustomers.length === 0) {
      alert('XƏTA: Ən azı 1 müştəri seçilməlidir!');
      return;
    }
    if (!docData.mebleg || Number(docData.mebleg) <= 0) {
      alert('XƏTA: Qiymət düzgün daxil edilməyib!');
      return;
    }
    if (!docData.faturaItem.trim()) {
      alert('XƏTA: Xidmət və ya məhsul adı qeyd edilməlidir!');
      return;
    }

    setIsSubmitting(true);

    try {
      const edvPercentage = Number(docData.edv);
      const basePrice = Number(docData.mebleg);
      const edvAmount = (basePrice * edvPercentage) / 100;
      const totalPerCustomer = basePrice + edvAmount;

      const salesToInsert = selectedCustomers.map(cId => {
        const customer = MOCK_CUSTOMERS.find(c => c.id === cId);
        return {
          user_id: user.id,
          tarih: docData.tarix,
          evrak_no: 'TPL-' + Math.floor(10000 + Math.random() * 90000),
          fatura_no: '',
          hesap_adi: customer?.name || 'Naməlum Müştəri',
          aciklama: docData.aciqlama,
          teslim_durumu: 'Təslim Edildi',
          miktar: totalPerCustomer,
          satirlar: [
            {
              id: Date.now().toString() + Math.random().toString(),
              itemName: docData.faturaItem,
              qty: 1,
              price: basePrice,
              edv: edvPercentage,
              total: totalPerCustomer
            }
          ]
        };
      });

      const { error } = await supabase.from('erp_sales').insert(salesToInsert);
      
      if (error) {
        console.error(error);
        alert(`Xəta baş verdi: ${error.message}`);
        setIsSubmitting(false);
        return;
      }

      alert(`UĞURLU! Seçilmiş ${selectedCustomers.length} müştəri üçün cəmi ${totalPerCustomer * selectedCustomers.length} AZN məbləğində toplu faktura yaradıldı.`);
      router.push('/erp/satislar/liste');

    } catch (err) {
      console.error(err);
      alert('Gözlənilməz xəta baş verdi.');
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    const qty = selectedCustomers.length;
    const basePrice = Number(docData.mebleg || 0);
    const edvAmount = (basePrice * Number(docData.edv)) / 100;
    return (basePrice + edvAmount) * qty;
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', flexDirection: 'column', gap: '1rem', color: '#64748b' }}>
        <div style={{ width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        <p>Yüklənir...</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#f8fafc' }}>
      
      {/* Header */}
      <div style={{ backgroundColor: 'white', padding: '1rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#64748b', transition: 'color 0.2s' }} onMouseOver={e=>e.currentTarget.style.color='#1e293b'} onMouseOut={e=>e.currentTarget.style.color='#64748b'}>
            <ArrowLeft size={24} />
          </button>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b', margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ backgroundColor: '#e0e7ff', padding: '0.5rem', borderRadius: '8px', color: '#4f46e5' }}>
              <Users size={24} />
            </div>
            Toplu Faktura Kəs
          </h1>
        </div>
      </div>

      <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem', alignItems: 'start' }}>
          
          {/* Left Column: Invoice Config */}
          <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: 0 }}>
                <FileText size={18} color="#4f46e5" />
                Faktura Tənzimləmələri
              </h3>
            </div>
            
            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Sənəd Tarixi <span style={{color: '#ef4444'}}>*</span></label>
                <input 
                  type="date" 
                  value={docData.tarix} 
                  onChange={(e) => setDocData({...docData, tarix: e.target.value})}
                  style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#f8fafc', fontSize: '0.95rem', fontWeight: 500, transition: 'all 0.2s' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#4f46e5'}
                  onBlur={e => e.currentTarget.style.borderColor = '#cbd5e1'}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Xidmət / Məhsul Adı <span style={{color: '#ef4444'}}>*</span></label>
                <input 
                  type="text" 
                  value={docData.faturaItem} 
                  onChange={(e) => setDocData({...docData, faturaItem: e.target.value})}
                  placeholder="Məs: Aylıq Abunəlik Haqqı"
                  style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#f8fafc', fontSize: '0.95rem', fontWeight: 500, transition: 'all 0.2s' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#4f46e5'}
                  onBlur={e => e.currentTarget.style.borderColor = '#cbd5e1'}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Məbləğ (Vahid qiymət) <span style={{color: '#ef4444'}}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b', fontWeight: 600 }}>₼</span>
                  <input 
                    type="number" 
                    value={docData.mebleg} 
                    onChange={(e) => setDocData({...docData, mebleg: e.target.value})}
                    placeholder="0.00"
                    style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#f8fafc', fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', transition: 'all 0.2s' }}
                    onFocus={e => e.currentTarget.style.borderColor = '#4f46e5'}
                    onBlur={e => e.currentTarget.style.borderColor = '#cbd5e1'}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>ƏDV (%)</label>
                <select 
                  value={docData.edv} 
                  onChange={(e) => setDocData({...docData, edv: e.target.value})}
                  style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#f8fafc', fontSize: '0.95rem', fontWeight: 500, transition: 'all 0.2s', cursor: 'pointer' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#4f46e5'}
                  onBlur={e => e.currentTarget.style.borderColor = '#cbd5e1'}
                >
                  <option value="0">0% (ƏDV-siz)</option>
                  <option value="8">8%</option>
                  <option value="18">18%</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Açıqlama</label>
                <textarea 
                  value={docData.aciqlama} 
                  onChange={(e) => setDocData({...docData, aciqlama: e.target.value})}
                  placeholder="Sənəd üçün əlavə açıqlama..."
                  rows={3}
                  style={{ padding: '0.8rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#f8fafc', fontSize: '0.95rem', fontWeight: 500, transition: 'all 0.2s', resize: 'vertical' }}
                  onFocus={e => e.currentTarget.style.borderColor = '#4f46e5'}
                  onBlur={e => e.currentTarget.style.borderColor = '#cbd5e1'}
                ></textarea>
              </div>

            </div>
          </div>

          {/* Right Column: Customer Selection */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ position: 'relative', width: '300px' }}>
                <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                <input 
                  type="text" 
                  placeholder="Müştəri axtar..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem 1rem 0.7rem 2.5rem', borderRadius: '99px', border: '1px solid #e2e8f0', outline: 'none', fontSize: '0.9rem', backgroundColor: 'white', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                />
              </div>
              
              <div style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>
                Seçilmiş: <span style={{ color: '#4f46e5', fontSize: '1.1rem', fontWeight: 800 }}>{selectedCustomers.length}</span> / {filteredCustomers.length}
              </div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              
              {/* Table Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '60px 2fr 1fr 1fr', padding: '1rem 1.5rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <button onClick={handleToggleAll} style={{ background: 'none', border: 'none', cursor: 'pointer', color: selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0 ? '#4f46e5' : '#cbd5e1' }}>
                    {selectedCustomers.length === filteredCustomers.length && filteredCustomers.length > 0 ? <CheckSquare size={20} /> : <Square size={20} />}
                  </button>
                </div>
                <div>MÜŞTƏRİ ADI</div>
                <div>QRUP</div>
                <div style={{ textAlign: 'right' }}>CARİ BORC</div>
              </div>

              {/* Table Body */}
              <div style={{ overflowY: 'auto', maxHeight: '500px' }}>
                {filteredCustomers.length > 0 ? filteredCustomers.map(customer => {
                  const isSelected = selectedCustomers.includes(customer.id);
                  return (
                    <div 
                      key={customer.id} 
                      onClick={() => handleToggleCustomer(customer.id)}
                      style={{ 
                        display: 'grid', gridTemplateColumns: '60px 2fr 1fr 1fr', padding: '1rem 1.5rem', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', transition: 'all 0.2s',
                        backgroundColor: isSelected ? '#eef2ff' : 'white'
                      }}
                      onMouseOver={e => !isSelected && (e.currentTarget.style.backgroundColor = '#f8fafc')}
                      onMouseOut={e => !isSelected && (e.currentTarget.style.backgroundColor = 'white')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ color: isSelected ? '#4f46e5' : '#cbd5e1' }}>
                          {isSelected ? <CheckSquare size={20} /> : <Square size={20} />}
                        </div>
                      </div>
                      <div style={{ fontWeight: 600, color: isSelected ? '#4f46e5' : '#1e293b' }}>{customer.name}</div>
                      <div>
                        <span style={{ padding: '0.2rem 0.6rem', backgroundColor: '#f1f5f9', color: '#64748b', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600 }}>
                          {customer.group}
                        </span>
                      </div>
                      <div style={{ textAlign: 'right', fontWeight: 600, color: Number(customer.balance) > 0 ? '#ef4444' : '#64748b' }}>
                        {customer.balance} ₼
                      </div>
                    </div>
                  );
                }) : (
                  <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                    Müştəri tapılmadı.
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Floating Sticky Footer for Actions */}
      <div style={{ backgroundColor: 'white', borderTop: '1px solid #e2e8f0', padding: '1.5rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 -4px 6px -1px rgba(0,0,0,0.05)', position: 'sticky', bottom: 0, zIndex: 20 }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Cəmi Seçilən Müştəri</span>
            <span style={{ fontSize: '1.2rem', color: '#1e293b', fontWeight: 800 }}>{selectedCustomers.length} Nəfər</span>
          </div>
          <div style={{ width: '1px', height: '40px', backgroundColor: '#e2e8f0' }}></div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>Təxmini Toplam Məbləğ</span>
            <span style={{ fontSize: '1.5rem', color: '#10b981', fontWeight: 800 }}>
              {calculateTotal().toLocaleString('az-AZ', { minimumFractionDigits: 2 })} ₼
            </span>
          </div>
        </div>

        <button 
          onClick={handleCreateInvoices}
          disabled={isSubmitting || selectedCustomers.length === 0}
          style={{ 
            padding: '1rem 2.5rem', 
            backgroundColor: selectedCustomers.length === 0 ? '#cbd5e1' : '#4f46e5', 
            color: 'white', 
            border: 'none', 
            borderRadius: '12px', 
            fontWeight: 700, 
            fontSize: '1.1rem', 
            cursor: selectedCustomers.length === 0 || isSubmitting ? 'not-allowed' : 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            transition: 'all 0.2s', 
            boxShadow: selectedCustomers.length > 0 ? '0 10px 15px -3px rgba(79, 70, 229, 0.3)' : 'none' 
          }}
          onMouseOver={e => !isSubmitting && selectedCustomers.length > 0 && (e.currentTarget.style.backgroundColor = '#4338ca')}
          onMouseOut={e => !isSubmitting && selectedCustomers.length > 0 && (e.currentTarget.style.backgroundColor = '#4f46e5')}
        >
          {isSubmitting ? <Loader2 size={22} className="spin" /> : <Save size={22} />}
          {isSubmitting ? 'Fakturalar Yaradılır...' : 'Toplu Faktura Kəs'}
        </button>

      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}

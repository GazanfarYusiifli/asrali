'use client';
import React, { useState } from 'react';
import { Search, Save, Trash2, ClipboardCheck, Package, RefreshCcw, CheckCircle2 } from 'lucide-react';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';

export default function StokSayimPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [hideToday, setHideToday] = useState(false);
  const [hideZero, setHideZero] = useState(false);
  const [selectedDepo, setSelectedDepo] = useState('');
  const [warehouses, setWarehouses] = useState<string[]>(['Mərkəz Şöbə', 'Baku Branch', 'Gəncə Filialı']);

  // Today's date string for comparison
  const todayDate = new Date();
  const todayStr = `${todayDate.getDate().toString().padStart(2, '0')}.${(todayDate.getMonth() + 1).toString().padStart(2, '0')}.${todayDate.getFullYear()}`;

  // Default Mock Data
  const defaultProducts = [
    { id: 1, kod: '1223', ad: 'Test Məhsul A', merkezSobe: -1, toplam: -1, alisFiyati: 0.00, satisFiyati: 2.00, img: null,
      tur: 'Məhsul', izleme: 'İzlənməyəcək', vahid: 'Ədəd', depo: 'Mərkəz Şöbə', b2bGoster: true, kritikSeviyye: 5, aciqlama: 'Test aciqlama A',
      edv: 18, satisValyuta: 'AZN', satisNovu: 'ƏDV Daxil', alisValyuta: 'AZN', alisNovu: 'ƏDV Daxil', barkod: '8691234567890', techizatciKodu: 'TECH-A-1', refKodu: 'A-1',
      etiketler: ['Yeni', 'Populyar'], sonSayimTarixi: '12.06.2026', sayimNeticesi: ''
    },
    { id: 2, kod: '789', ad: 'Test Məhsul B', merkezSobe: -1, toplam: -1, alisFiyati: 0.00, satisFiyati: 0.00, img: null,
      tur: 'Məhsul', izleme: 'Seriya No ilə', vahid: 'Kg', depo: 'Mərkəz Şöbə', b2bGoster: false, kritikSeviyye: 10, aciqlama: 'Test aciqlama B',
      edv: 8, satisValyuta: 'AZN', satisNovu: 'ƏDV Xaric', alisValyuta: 'AZN', alisNovu: 'ƏDV Xaric', barkod: '8690987654321', techizatciKodu: 'TECH-B-2', refKodu: 'B-2',
      etiketler: ['Endirimdə'], sonSayimTarixi: '-', sayimNeticesi: ''
    },
    { id: 3, kod: '112', ad: 'Test Məhsul C', merkezSobe: 1, toplam: 1, alisFiyati: 0.00, satisFiyati: 0.00, img: null,
      tur: 'Xidmət', izleme: 'İzlənməyəcək', vahid: 'Ədəd', depo: 'Baku Branch', b2bGoster: true, kritikSeviyye: 0, aciqlama: 'Xidmət növü',
      edv: 18, satisValyuta: 'USD', satisNovu: 'ƏDV Daxil', alisValyuta: 'USD', alisNovu: 'ƏDV Daxil', barkod: '', techizatciKodu: '', refKodu: '',
      etiketler: [], sonSayimTarixi: '-', sayimNeticesi: ''
    },
    { id: 4, kod: 'YII', ad: 'Test Məhsul D', merkezSobe: 1, toplam: 1, alisFiyati: 0.00, satisFiyati: 0.00, img: null,
      tur: 'Məhsul', izleme: 'Partiya ilə', vahid: 'Litr', depo: 'Mərkəz Şöbə', b2bGoster: false, kritikSeviyye: 20, aciqlama: 'Maye məhsul',
      edv: 18, satisValyuta: 'AZN', satisNovu: 'ƏDV Daxil', alisValyuta: 'AZN', alisNovu: 'ƏDV Daxil', barkod: '8691122334455', techizatciKodu: 'TECH-D-4', refKodu: 'D-4',
      etiketler: ['Stokda Az', 'Populyar'], sonSayimTarixi: '10.05.2026', sayimNeticesi: ''
    },
  ];

  const [inventory, setInventory] = useState(defaultProducts);

  React.useEffect(() => {
    const stored = getAppStorage('erp_products');
    if (stored) {
      setInventory(JSON.parse(stored));
    } else {
      setAppStorage('erp_products', JSON.stringify(defaultProducts));
    }

    const storedWarehouses = getAppStorage('erp_warehouses');
    if (storedWarehouses) {
      setWarehouses(JSON.parse(storedWarehouses));
    }
  }, []);

  const updateInventory = (newInv: any) => {
    setInventory(newInv);
    setAppStorage('erp_products', JSON.stringify(newInv));
  };

  const handleSayimChange = (id: number, val: string) => {
    updateInventory(inventory.map((item: any) => item.id === id ? { ...item, sayimNeticesi: val } : item));
  };

  const handleSave = (id: number) => {
    updateInventory(inventory.map((item: any) => {
      if (item.id === id && item.sayimNeticesi !== '') {
        return { 
          ...item, 
          merkezSobe: Number(item.sayimNeticesi),
          toplam: Number(item.sayimNeticesi),
          sonSayimTarixi: todayStr, 
          sayimNeticesi: '' 
        };
      }
      return item;
    }));
  };

  const handleClear = (id: number) => {
    updateInventory(inventory.map((item: any) => item.id === id ? { ...item, sayimNeticesi: '' } : item));
  };

  const handleSaveAll = () => {
    updateInventory(inventory.map((item: any) => {
      if (item.sayimNeticesi !== '') {
        return { 
          ...item, 
          merkezSobe: Number(item.sayimNeticesi), 
          toplam: Number(item.sayimNeticesi),
          sonSayimTarixi: todayStr, 
          sayimNeticesi: '' 
        };
      }
      return item;
    }));
  };

  const filteredInventory = inventory.filter((item: any) => {
    if (selectedDepo && item.depo !== selectedDepo) return false;
    if (hideToday && item.sonSayimTarixi === todayStr) return false;
    if (hideZero && item.merkezSobe === 0) return false;
    if (searchTerm && !item.ad.toLowerCase().includes(searchTerm.toLowerCase()) && !item.kod?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ padding: '2rem', height: '100%', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#eef2ff', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ClipboardCheck size={32} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: '#0f172a', margin: 0, fontWeight: 900, letterSpacing: '-0.5px' }}>
              Anbar Sayımı
            </h1>
            <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.95rem' }}>Məhsulların anbardakı faktiki mövcudluğunu yoxlayın və uyğunlaşdırın</p>
          </div>
        </div>

        <button onClick={handleSaveAll} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>
          <Save size={20}/> Bütün Sayımları Yadda Saxla
        </button>
      </div>

      {/* Filters Toolbar */}
      <div style={{ backgroundColor: 'white', padding: '1.2rem 1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', gap: '2rem', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <Search size={18} color="#64748b" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Məhsul Axtar (Ad və ya Kod)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', backgroundColor: '#f8fafc', transition: 'border-color 0.2s' }}
            onFocus={e=>e.target.style.borderColor='#6366f1'}
            onBlur={e=>e.target.style.borderColor='#cbd5e1'}
          />
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          
          <select 
            value={selectedDepo}
            onChange={(e) => setSelectedDepo(e.target.value)}
            style={{ padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.9rem', backgroundColor: '#f8fafc', color: '#334155', fontWeight: 600, cursor: 'pointer' }}
          >
            <option value="">Bütün Anbarlar</option>
            {warehouses.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '6px', border: hideToday ? 'none' : '2px solid #cbd5e1', backgroundColor: hideToday ? '#6366f1' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {hideToday && <CheckCircle2 size={14} color="white" />}
            </div>
            <input type="checkbox" checked={hideToday} onChange={(e) => setHideToday(e.target.checked)} style={{ display: 'none' }} />
            Bugünkü sayımları göstərmə
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600, color: '#334155' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '6px', border: hideZero ? 'none' : '2px solid #cbd5e1', backgroundColor: hideZero ? '#6366f1' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {hideZero && <CheckCircle2 size={14} color="white" />}
            </div>
            <input type="checkbox" checked={hideZero} onChange={(e) => setHideZero(e.target.checked)} style={{ display: 'none' }} />
            Sıfır olanları göstərmə
          </label>
        </div>
      </div>

      {/* Table Area */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
        <div style={{ overflowX: 'auto', minHeight: '400px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>ƏN SON SAYIM TARİXİ</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>MƏHSUL ADI</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>MƏRKƏZ ŞÖBƏ</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569', textAlign: 'center' }}>MÖVCUD MİQDAR</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569', textAlign: 'center', width: '180px' }}>SAYIM NƏTİCƏSİ</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569', width: '100px' }}>VAHİD</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569', textAlign: 'right', width: '140px' }}>ƏMƏLİYYAT</th>
              </tr>
            </thead>
            <tbody>
              {filteredInventory.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: item.sayimNeticesi !== '' ? '#f0fdf4' : 'white', transition: 'background-color 0.2s' }} onMouseOver={e=> {if(item.sayimNeticesi === '') e.currentTarget.style.backgroundColor='#f8fafc'}} onMouseOut={e=> {if(item.sayimNeticesi === '') e.currentTarget.style.backgroundColor='white'}}>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', fontWeight: 600, color: item.sonSayimTarixi === todayStr ? '#10b981' : '#64748b' }}>
                    {item.sonSayimTarixi === todayStr ? 'Bu gün' : item.sonSayimTarixi}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                        <Package size={16} />
                      </div>
                      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e293b' }}>{item.ad}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: '#475569', fontWeight: 500 }}>
                    {item.depo}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                    <span style={{ display: 'inline-block', padding: '0.3rem 0.8rem', borderRadius: '20px', backgroundColor: item.merkezSobe <= 0 ? '#fef2f2' : '#eff6ff', color: item.merkezSobe <= 0 ? '#ef4444' : '#3b82f6', fontSize: '0.9rem', fontWeight: 800 }}>
                      {item.merkezSobe}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                    <input 
                      type="number" 
                      value={item.sayimNeticesi}
                      onChange={(e) => handleSayimChange(item.id, e.target.value)}
                      placeholder="Miqdar"
                      style={{ 
                        width: '100%', 
                        padding: '0.6rem', 
                        borderRadius: '8px', 
                        border: '2px solid',
                        borderColor: item.sayimNeticesi !== '' ? '#10b981' : '#cbd5e1', 
                        outline: 'none', 
                        fontSize: '0.95rem', 
                        textAlign: 'center',
                        fontWeight: 700,
                        color: '#0f172a',
                        backgroundColor: item.sayimNeticesi !== '' ? '#ecfdf5' : 'white',
                        transition: 'all 0.2s'
                      }}
                      onFocus={e=> {if(item.sayimNeticesi === '') e.target.style.borderColor='#6366f1'}}
                      onBlur={e=> {if(item.sayimNeticesi === '') e.target.style.borderColor='#cbd5e1'}}
                    />
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>
                    {item.vahid}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleSave(item.id)}
                        disabled={item.sayimNeticesi === ''}
                        style={{ 
                          padding: '0.5rem', 
                          borderRadius: '8px', 
                          border: 'none', 
                          backgroundColor: item.sayimNeticesi !== '' ? '#10b981' : '#f1f5f9', 
                          color: item.sayimNeticesi !== '' ? 'white' : '#94a3b8', 
                          cursor: item.sayimNeticesi !== '' ? 'pointer' : 'not-allowed',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}
                        title="Yadda Saxla"
                      >
                        <Save size={18} />
                      </button>
                      <button 
                        onClick={() => handleClear(item.id)}
                        disabled={item.sayimNeticesi === ''}
                        style={{ 
                          padding: '0.5rem', 
                          borderRadius: '8px', 
                          border: 'none', 
                          backgroundColor: item.sayimNeticesi !== '' ? '#fef2f2' : '#f1f5f9', 
                          color: item.sayimNeticesi !== '' ? '#ef4444' : '#94a3b8', 
                          cursor: item.sayimNeticesi !== '' ? 'pointer' : 'not-allowed',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.2s'
                        }}
                        title="Təmizlə"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {filteredInventory.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                    <RefreshCcw size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                    <p style={{ fontSize: '1.1rem', fontWeight: 600, margin: 0 }}>Uyğun məhsul tapılmadı</p>
                    <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>Filtrləri və ya axtarış sözünü dəyişdirin.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}

'use client';
import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Plus, Trash2, Save, Store, FileText, PackagePlus, AlertCircle } from 'lucide-react';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';

export default function TransferPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<string[]>(['Mərkəz Şöbə', 'Baku Branch', 'Gəncə Filialı']);
  
  // Form State
  const [gonderenDepo, setGonderenDepo] = useState('');
  const [aliciDepo, setAliciDepo] = useState('');
  const [aciqlama, setAciqlama] = useState('');
  
  // Rows State
  const [rows, setRows] = useState([{ id: Date.now(), productId: '', miktar: 1 }]);
  
  // New Warehouse Modal State
  const [isDepoModalOpen, setIsDepoModalOpen] = useState(false);
  const [newDepoName, setNewDepoName] = useState('');
  const [depoTarget, setDepoTarget] = useState<'gonderen' | 'alici'>('gonderen');

  useEffect(() => {
    // Load products
    const storedProducts = getAppStorage('erp_products');
    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    }

    // Load warehouses if saved previously (optional, but good for UX)
    const storedWarehouses = getAppStorage('erp_warehouses');
    if (storedWarehouses) {
      setWarehouses(JSON.parse(storedWarehouses));
    } else {
      setAppStorage('erp_warehouses', JSON.stringify(warehouses));
    }
  }, []);

  const handleAddRow = () => {
    setRows([...rows, { id: Date.now(), productId: '', miktar: 1 }]);
  };

  const handleRemoveRow = (id: number) => {
    if (rows.length > 1) {
      setRows(rows.filter(row => row.id !== id));
    }
  };

  const handleRowChange = (id: number, field: string, value: any) => {
    setRows(rows.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const handleCreateWarehouse = () => {
    if (newDepoName.trim() === '') return;
    
    const updatedWarehouses = [...warehouses, newDepoName.trim()];
    setWarehouses(updatedWarehouses);
    setAppStorage('erp_warehouses', JSON.stringify(updatedWarehouses));
    
    if (depoTarget === 'gonderen') setGonderenDepo(newDepoName.trim());
    else setAliciDepo(newDepoName.trim());
    
    setNewDepoName('');
    setIsDepoModalOpen(false);
  };

  const handleSaveTransfer = () => {
    if (!gonderenDepo || !aliciDepo) {
      alert("Zəhmət olmasa Göndərən və Alıcı anbarı seçin.");
      return;
    }
    if (gonderenDepo === aliciDepo) {
      alert("Göndərən və Alıcı anbar eyni ola bilməz.");
      return;
    }

    const invalidRows = rows.filter(r => !r.productId || r.miktar <= 0);
    if (invalidRows.length > 0) {
      alert("Zəhmət olmasa bütün sətirlərdə məhsulu seçin və miqdarı daxil edin.");
      return;
    }

    // Check stock availability
    let isLastItemWarningNeeded = false;
    for (const row of rows) {
      const product = products.find(p => p.id.toString() === row.productId);
      if (product) {
        if (Number(row.miktar) > Number(product.merkezSobe)) {
          alert(`XƏTA! "${product.ad}" məhsulundan ${gonderenDepo} anbarında sadəcə ${product.merkezSobe} ədəd qalıb. Siz isə ${row.miktar} ədəd transfer etmək istəyirsiniz.`);
          return;
        }
        if (Number(row.miktar) === Number(product.merkezSobe)) {
          isLastItemWarningNeeded = true;
        }
      }
    }

    // Warning for transferring the last item
    if (isLastItemWarningNeeded) {
      const confirmLast = window.confirm("Diqqət! Bəzi məhsulların anbarda qalan sonuncu qalığını göndərirsiniz. Sonuncunu göndərməyə razısınız?");
      if (!confirmLast) return;
    }

    // Process Transfer: Deduct from source warehouse, Add/Create in target warehouse
    let updatedProducts = [...products];
    
    rows.forEach(row => {
      const sourceProduct = updatedProducts.find(p => p.id.toString() === row.productId);
      if (!sourceProduct) return;

      const transferQty = Number(row.miktar);

      // 1. Deduct from source
      updatedProducts = updatedProducts.map(p => {
        if (p.id.toString() === row.productId) {
          return { ...p, merkezSobe: Number(p.merkezSobe) - transferQty, toplam: Number(p.toplam) - transferQty };
        }
        return p;
      });

      // 2. Add to target
      const targetProductIndex = updatedProducts.findIndex(p => p.kod === sourceProduct.kod && p.depo === aliciDepo);
      
      if (targetProductIndex !== -1) {
        // Exists in target warehouse, just increase quantity
        const targetProduct = updatedProducts[targetProductIndex];
        updatedProducts[targetProductIndex] = {
          ...targetProduct,
          merkezSobe: Number(targetProduct.merkezSobe) + transferQty,
          toplam: Number(targetProduct.toplam) + transferQty
        };
      } else {
        // Doesn't exist in target warehouse, create a new stock line (clone)
        const newProduct = {
          ...sourceProduct,
          id: Date.now() + Math.random(), // Unique ID for the new stock line
          depo: aliciDepo,
          merkezSobe: transferQty,
          toplam: transferQty,
          sayimNeticesi: '',
          sonSayimTarixi: '-'
        };
        updatedProducts.push(newProduct);
      }
    });

    setAppStorage('erp_products', JSON.stringify(updatedProducts));
    setProducts(updatedProducts);

    alert("Anbarlararası hərəkət uğurla yadda saxlanıldı! Məhsul Siyahısı və Anbar Sayımı avtomatik yeniləndi.");
    
    // Reset form
    setGonderenDepo('');
    setAliciDepo('');
    setAciqlama('');
    setRows([{ id: Date.now(), productId: '', miktar: 1 }]);
  };

  return (
    <div style={{ padding: '2rem', height: '100%', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#fff7ed', color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ArrowRightLeft size={32} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: '#0f172a', margin: 0, fontWeight: 900, letterSpacing: '-0.5px' }}>
              Anbarlararası Hərəkət
            </h1>
            <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.95rem' }}>Anbarlar arasında məhsul transferi girişlərini idarə edin</p>
          </div>
        </div>

        <button onClick={handleSaveTransfer} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', backgroundColor: '#f97316', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(249, 115, 22, 0.39)', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>
          <Save size={20}/> Köçürməni Yadda Saxla
        </button>
      </div>

      {/* Main Form Container */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Top Section: Warehouses & Desc */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Store size={16}/> Göndərən Anbar *
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select value={gonderenDepo} onChange={e=>setGonderenDepo(e.target.value)} style={{ flex: 1, padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', backgroundColor: '#f8fafc' }}>
                  <option value="">Seçin...</option>
                  {warehouses.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
                <button onClick={() => { setDepoTarget('gonderen'); setIsDepoModalOpen(true); }} style={{ padding: '0 1rem', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '10px', color: '#475569', cursor: 'pointer', fontWeight: 600 }} title="Yeni Anbar Yarat">
                  <Plus size={18} />
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Store size={16}/> Alıcı Anbar *
              </label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <select value={aliciDepo} onChange={e=>setAliciDepo(e.target.value)} style={{ flex: 1, padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', backgroundColor: '#f8fafc' }}>
                  <option value="">Seçin...</option>
                  {warehouses.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
                <button onClick={() => { setDepoTarget('alici'); setIsDepoModalOpen(true); }} style={{ padding: '0 1rem', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '10px', color: '#475569', cursor: 'pointer', fontWeight: 600 }} title="Yeni Anbar Yarat">
                  <Plus size={18} />
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <FileText size={16}/> Açıqlama
            </label>
            <textarea 
              value={aciqlama} 
              onChange={e=>setAciqlama(e.target.value)} 
              placeholder="Transfer haqqında əlavə qeydlər..."
              style={{ width: '100%', height: '100%', minHeight: '120px', padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', backgroundColor: '#f8fafc', resize: 'none' }}
            />
          </div>
          
        </div>

        {/* Divider */}
        <div style={{ height: '1px', backgroundColor: '#e2e8f0' }}></div>

        {/* Dynamic Table Section */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PackagePlus size={20} color="#f97316" /> Transfer Ediləcək Məhsullar
          </h3>
          
          <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569', width: '50px' }}>#</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>MƏHSUL / XİDMƏT ADI</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569', width: '150px' }}>MİQDAR</th>
                  <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569', width: '80px', textAlign: 'center' }}>SİL</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: 'white' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#94a3b8' }}>{index + 1}</td>
                    <td style={{ padding: '0.5rem 1.5rem' }}>
                      <select 
                        value={row.productId} 
                        onChange={(e) => handleRowChange(row.id, 'productId', e.target.value)}
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }}
                        disabled={!gonderenDepo}
                      >
                        <option value="">{gonderenDepo ? 'Məhsul Seçin...' : 'Əvvəlcə Göndərən Anbarı seçin'}</option>
                        {products.filter(p => p.depo === gonderenDepo && p.merkezSobe > 0).map(p => (
                          <option key={p.id} value={p.id}>{p.kod} - {p.ad} (Mövcud: {p.merkezSobe})</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '0.5rem 1.5rem' }}>
                      <input 
                        type="number" 
                        min="1"
                        value={row.miktar}
                        onChange={(e) => handleRowChange(row.id, 'miktar', e.target.value)}
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', textAlign: 'center', fontWeight: 700 }}
                      />
                    </td>
                    <td style={{ padding: '0.5rem 1.5rem', textAlign: 'center' }}>
                      <button 
                        onClick={() => handleRemoveRow(row.id)}
                        disabled={rows.length === 1}
                        style={{ padding: '0.5rem', backgroundColor: rows.length === 1 ? '#f8fafc' : '#fef2f2', border: 'none', borderRadius: '8px', color: rows.length === 1 ? '#cbd5e1' : '#ef4444', cursor: rows.length === 1 ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <button onClick={handleAddRow} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.2rem', backgroundColor: 'white', color: '#3b82f6', border: '2px dashed #bfdbfe', borderRadius: '10px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e=>{e.currentTarget.style.backgroundColor='#eff6ff'; e.currentTarget.style.borderColor='#3b82f6'}} onMouseOut={e=>{e.currentTarget.style.backgroundColor='white'; e.currentTarget.style.borderColor='#bfdbfe'}}>
              <Plus size={18}/> Yeni Sətir Əlavə Et
            </button>
          </div>
        </div>

      </div>

      {/* New Warehouse Modal */}
      {isDepoModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.5)', zIndex: 999, backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', width: '100%', maxWidth: '400px', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                <Store size={20} />
              </div>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Yeni Anbar Yarat</h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Anbarın Adı</label>
              <input 
                type="text" 
                value={newDepoName}
                onChange={e=>setNewDepoName(e.target.value)}
                autoFocus
                placeholder="Məsələn: Sumqayıt Filialı"
                style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }}
                onKeyDown={e => { if(e.key === 'Enter') handleCreateWarehouse(); }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button onClick={() => setIsDepoModalOpen(false)} style={{ flex: 1, padding: '0.8rem', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>
                İmtina
              </button>
              <button onClick={handleCreateWarehouse} style={{ flex: 1, padding: '0.8rem', backgroundColor: '#0f172a', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(15,23,42,0.2)' }}>
                Yarat
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

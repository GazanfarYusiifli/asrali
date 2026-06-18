'use client';
import React, { useState, useEffect } from 'react';
import { Tag, Plus, Save, Edit2, Trash2, X, Search, CheckCircle2 } from 'lucide-react';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';

export default function OzelFiyatPage() {
  // Main state
  const [priceLists, setPriceLists] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  
  // UI State
  const [isAddListModalOpen, setIsAddListModalOpen] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  
  const [editingList, setEditingList] = useState<any | null>(null);
  
  // Product Selection Modal inside Edit List
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load lists
    const storedLists = getAppStorage('erp_price_lists');
    if (storedLists) {
      setPriceLists(JSON.parse(storedLists));
    }

    // Load products
    const storedProducts = getAppStorage('erp_products');
    if (storedProducts) {
      setAllProducts(JSON.parse(storedProducts));
    }
  }, []);

  const saveLists = (lists: any[]) => {
    setPriceLists(lists);
    setAppStorage('erp_price_lists', JSON.stringify(lists));
  };

  // --- List CRUD ---
  const handleCreateList = () => {
    if (!newListTitle.trim()) return;
    const newList = {
      id: Date.now(),
      name: newListTitle,
      items: [] // array of { itemId, productId, kod, ad, fiy, valyuta }
    };
    saveLists([...priceLists, newList]);
    setNewListTitle('');
    setIsAddListModalOpen(false);
  };

  const handleDeleteList = (id: number) => {
    if (window.confirm("Bu siyahını silmək istədiyinizə əminsiniz?")) {
      const updated = priceLists.filter(l => l.id !== id);
      saveLists(updated);
      if (editingList && editingList.id === id) {
        setEditingList(null);
      }
    }
  };

  const openEditList = (list: any) => {
    setEditingList(list);
  };

  // --- Inside List CRUD ---
  const handleAddProductToList = (product: any) => {
    if (!editingList) return;
    
    // Check if already in list
    if (editingList.items.some((i: any) => i.productId === product.id)) {
      alert("Bu məhsul artıq siyahıdadır.");
      return;
    }

    const newItem = {
      itemId: Date.now(),
      productId: product.id,
      kod: product.kod,
      ad: product.ad,
      fiy: product.satisFiyati || 0,
      valyuta: product.satisValyuta || 'AZN',
      isEditing: true // start in edit mode
    };

    const updatedList = {
      ...editingList,
      items: [...editingList.items, newItem]
    };

    setEditingList(updatedList);
    
    const updatedLists = priceLists.map(l => l.id === updatedList.id ? updatedList : l);
    saveLists(updatedLists);
    
    setIsAddProductModalOpen(false);
    setSearchTerm('');
  };

  const handleUpdateItemValue = (itemId: number, field: string, value: any) => {
    const updatedItems = editingList.items.map((i: any) => 
      i.itemId === itemId ? { ...i, [field]: value } : i
    );
    setEditingList({ ...editingList, items: updatedItems });
  };

  const handleSaveItem = (itemId: number) => {
    const updatedItems = editingList.items.map((i: any) => 
      i.itemId === itemId ? { ...i, isEditing: false } : i
    );
    const updatedList = { ...editingList, items: updatedItems };
    setEditingList(updatedList);
    
    const updatedLists = priceLists.map(l => l.id === updatedList.id ? updatedList : l);
    saveLists(updatedLists);
  };

  const handleDeleteItem = (itemId: number) => {
    const updatedItems = editingList.items.filter((i: any) => i.itemId !== itemId);
    const updatedList = { ...editingList, items: updatedItems };
    setEditingList(updatedList);
    
    const updatedLists = priceLists.map(l => l.id === updatedList.id ? updatedList : l);
    saveLists(updatedLists);
  };

  // Render variables
  const filteredProducts = allProducts.filter(p => 
    p.ad.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.kod.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // If in edit mode, show the list details
  if (editingList) {
    return (
      <div style={{ padding: '2rem', height: '100%', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif', overflowY: 'auto' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => setEditingList(null)} style={{ padding: '0.6rem 1.2rem', backgroundColor: '#e2e8f0', color: '#475569', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer' }}>
              &larr; Geri
            </button>
            <h1 style={{ fontSize: '1.8rem', color: '#0f172a', margin: 0, fontWeight: 900 }}>
              {editingList.name}
            </h1>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => setIsAddProductModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)' }}>
              <Plus size={20}/> Məhsul Əlavə Et (Ürün Ekle)
            </button>
            <button onClick={() => handleDeleteList(editingList.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', backgroundColor: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
              <Trash2 size={20}/> Siyahını Sil (Listeyi Sil)
            </button>
          </div>
        </div>

        {/* List Items Table */}
        <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>KODU</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>MƏHSUL ADI</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>XÜSUSİ QİYMƏT (FİYAT)</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569', textAlign: 'right' }}>ƏMƏLİYYATLAR</th>
              </tr>
            </thead>
            <tbody>
              {editingList.items.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Hələ məhsul əlavə edilməyib.</td></tr>
              ) : (
                editingList.items.map((item: any) => (
                  <tr key={item.itemId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '0.95rem', fontWeight: 700, color: '#475569' }}>{item.kod}</td>
                    <td style={{ padding: '1rem 1.5rem', fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>{item.ad}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      {item.isEditing ? (
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                          <input 
                            type="number" 
                            value={item.fiy} 
                            onChange={(e) => handleUpdateItemValue(item.itemId, 'fiy', Number(e.target.value))}
                            style={{ width: '100px', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', fontWeight: 700 }}
                          />
                          <select 
                            value={item.valyuta} 
                            onChange={(e) => handleUpdateItemValue(item.itemId, 'valyuta', e.target.value)}
                            style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', backgroundColor: '#f8fafc', fontWeight: 700, color: '#475569' }}
                          >
                            <option>AZN</option>
                            <option>USD</option>
                            <option>EUR</option>
                            <option>TL</option>
                          </select>
                        </div>
                      ) : (
                        <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981' }}>{item.fiy} {item.valyuta}</span>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        {item.isEditing ? (
                          <button onClick={() => handleSaveItem(item.itemId)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', backgroundColor: '#ecfdf5', color: '#10b981', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                            <Save size={16} /> Yadda Saxla (Kaydet)
                          </button>
                        ) : (
                          <button onClick={() => handleUpdateItemValue(item.itemId, 'isEditing', true)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', backgroundColor: '#f1f5f9', color: '#10b981', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                            <Edit2 size={16} /> Düzəliş (Düzenle)
                          </button>
                        )}
                        <button onClick={() => handleDeleteItem(item.itemId)} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', backgroundColor: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                          <Trash2 size={16} /> Sil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Add Product Modal inside Edit View */}
        {isAddProductModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.5)', zIndex: 999, backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div style={{ backgroundColor: 'white', borderRadius: '20px', width: '100%', maxWidth: '600px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Məhsul Əlavə Et</h2>
                <button onClick={() => setIsAddProductModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={24} /></button>
              </div>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text" 
                    placeholder="Məhsul adı və ya kodu ilə axtar..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} 
                  />
                </div>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
                {filteredProducts.map(p => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #f1f5f9' }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 700 }}>{p.kod}</div>
                      <div style={{ fontSize: '1.05rem', color: '#0f172a', fontWeight: 800 }}>{p.ad}</div>
                    </div>
                    <button onClick={() => handleAddProductToList(p)} style={{ padding: '0.6rem 1.2rem', backgroundColor: '#ecfdf5', color: '#10b981', border: '1px solid #a7f3d0', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
                      Seç
                    </button>
                  </div>
                ))}
                {filteredProducts.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>Məhsul tapılmadı.</div>}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main Lists View
  return (
    <div style={{ padding: '2rem', height: '100%', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif', overflowY: 'auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#d1fae5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Tag size={32} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: '#0f172a', margin: 0, fontWeight: 900, letterSpacing: '-0.5px' }}>
              Xüsusi Qiymət Siyahıları
            </h1>
            <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.95rem' }}>Müştərilər və ya kampaniyalar üçün xüsusi qiymət siyahıları yaradın</p>
          </div>
        </div>
        
        <button onClick={() => setIsAddListModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)', transition: 'all 0.2s' }} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.backgroundColor='#059669'}} onMouseOut={e=>{e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.backgroundColor='#10b981'}}>
          <Plus size={20}/> YENİ ÖZƏL QİYMƏT SİYAHISI YARAT (YENİ ÖZEL FİYAT LİSTESİ OLUŞTUR)
        </button>
      </div>

      {/* Lists Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {priceLists.map(list => (
          <div key={list.id} style={{ backgroundColor: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)', transition: 'all 0.3s ease', cursor: 'pointer' }} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow='0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.05)'}} onMouseOut={e=>{e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 10px 25px -5px rgba(0,0,0,0.05), 0 8px 10px -6px rgba(0,0,0,0.01)'}}>
            
            <div style={{ padding: '1.5rem', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.6rem', backgroundColor: '#d1fae5', color: '#047857', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 800, width: 'fit-content' }}>
                  <Tag size={12} /> QİYMƏT SİYAHISI
                </span>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.5px' }}>{list.name}</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'white', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#10b981' }}>{list.items.length}</span>
              </div>
            </div>

            <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Bu siyahıya hazırda <strong>{list.items.length} məhsul</strong> daxil edilib. Müştərilər üçün xüsusi qiymətlər təyin olunub.
              </p>
              
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', paddingTop: '1rem' }}>
                <button onClick={() => openEditList(list)} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', padding: '0.8rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseOver={e=>e.currentTarget.style.backgroundColor='#059669'} onMouseOut={e=>e.currentTarget.style.backgroundColor='#10b981'}>
                  Düzəliş Et &rarr;
                </button>
                <button onClick={() => handleDeleteList(list.id)} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0.8rem', backgroundColor: 'white', color: '#ef4444', border: '1px solid #fca5a5', borderRadius: '12px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e=>{e.currentTarget.style.backgroundColor='#fef2f2'; e.currentTarget.style.borderColor='#ef4444'}} onMouseOut={e=>{e.currentTarget.style.backgroundColor='white'; e.currentTarget.style.borderColor='#fca5a5'}} title="Siyahını Sil">
                  <Trash2 size={20}/>
                </button>
              </div>
            </div>

          </div>
        ))}

        {priceLists.length === 0 && (
          <div style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center', backgroundColor: 'white', borderRadius: '16px', border: '2px dashed #cbd5e1' }}>
            <Tag size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#334155', fontSize: '1.2rem', fontWeight: 800 }}>Hələ heç bir siyahı yoxdur</h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.95rem' }}>Yeni özəl qiymət siyahısı yaratmaqla başlayın.</p>
          </div>
        )}
      </div>

      {/* New List Modal */}
      {isAddListModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.5)', zIndex: 999, backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', width: '100%', maxWidth: '450px', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
            
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Yeni Siyahı (Yeni Liste)</h2>
              <button onClick={() => setIsAddListModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Siyahının Adı (Liste Adı) <span style={{color: '#ef4444'}}>*</span></label>
                <input type="text" value={newListTitle} onChange={e=>setNewListTitle(e.target.value)} placeholder="Məsələn: VIP Müştərilər Üçün" autoFocus style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} onKeyDown={e => e.key === 'Enter' && handleCreateList()}/>
              </div>
            </div>

            <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button onClick={() => setIsAddListModalOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', backgroundColor: 'white', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>
                Kapat
              </button>
              <button onClick={handleCreateList} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)', transition: 'background-color 0.2s' }} onMouseOver={e=>e.currentTarget.style.backgroundColor='#059669'} onMouseOut={e=>e.currentTarget.style.backgroundColor='#10b981'}>
                <Save size={20}/> Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

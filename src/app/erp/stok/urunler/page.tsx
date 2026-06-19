'use client';
import React, { useState } from 'react';
import { Package, Search, Tag, Plus, Filter, MoreHorizontal, Image as ImageIcon, X, Save, Trash2, Edit2, CheckCircle2 } from 'lucide-react';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';
import { createClient } from '@/utils/supabase/client';
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isTagsDropdownOpen, setIsTagsDropdownOpen] = useState(false);
  const [selectedDepo, setSelectedDepo] = useState('');
  const [warehouses, setWarehouses] = useState<string[]>(['Mərkəz Şöbə', 'Baku Branch', 'Gəncə Filialı']);
  const [isMounted, setIsMounted] = useState(false);
  
  const [activeTab, setActiveTab] = useState('tanim'); // tanim, fiyat, kodlar
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Expanded Dummy Data
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

  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    setIsMounted(true);
    
    const fetchProducts = async () => {
      setIsLoading(true);
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('erp_products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Supabase fetch error (erp_products):", error);
        setProducts([]);
      } else if (data) {
        // Map snake_case from DB back to camelCase used in the UI
        const mappedData = data.map(item => ({
          id: item.id,
          kod: item.kod,
          ad: item.ad,
          merkezSobe: item.merkezSobe || 0,
          toplam: item.toplam || 0,
          alisFiyati: Number(item.alis_fiyati),
          satisFiyati: Number(item.satis_fiyati),
          img: item.img || null,
          tur: item.tur || 'Məhsul',
          izleme: item.izleme || 'İzlənməyəcək',
          vahid: item.vahid || 'Ədəd',
          depo: item.depo || 'Mərkəz Şöbə',
          b2bGoster: item.b2bgoster || false,
          kritikSeviyye: item.kritikseviyye || 0,
          aciqlama: item.aciqlama || '',
          edv: item.edv || 18,
          satisValyuta: item.satisvalyuta || 'AZN',
          satisNovu: item.satisnovu || 'ƏDV Daxil',
          alisValyuta: item.alisvalyuta || 'AZN',
          alisNovu: item.alisnovu || 'ƏDV Daxil',
          barkod: item.barkod || '',
          techizatciKodu: item.techizatcikodu || '',
          refKodu: item.refkodu || '',
          etiketler: item.etiketler || [],
          sonSayimTarixi: item.sonsayimtarixi || '-',
          sayimNeticesi: item.sayimneticesi || ''
        }));
        setProducts(mappedData);
      }
      setIsLoading(false);
    };
    
    fetchProducts();
    
    try {
      const storedWarehouses = getAppStorage('erp_warehouses');
      if (storedWarehouses) {
        setWarehouses(JSON.parse(storedWarehouses));
      }
    } catch(e) {}
  }, []);

  if (!isMounted) return null;

  const updateProducts = (newProducts: any) => {
    setProducts(newProducts);
    // Legacy storage backup removed, rely on Supabase
  };

  const defaultForm = {
    ad: '', tur: 'Məhsul', izleme: 'İzlənməyəcək', miqdar: 0, vahid: 'Ədəd', depo: 'Mərkəz Şöbə',
    b2bGoster: false, kritikSeviyye: 0, aciqlama: '', etiketler: [] as string[],
    edv: 18, satisFiyati: 0, satisValyuta: 'AZN', satisNovu: 'ƏDV Daxil',
    alisFiyati: 0, alisValyuta: 'AZN', alisNovu: 'ƏDV Daxil',
    barkod: '', stokKodu: '', techizatciKodu: '', refKodu: ''
  };

  const [formData, setFormData] = useState(defaultForm);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const availableTags = ['Yeni', 'Endirimdə', 'Populyar', 'Stokda Az', 'Kampaniya'];

  const handleToggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleToggleFormTag = (tag: string) => {
    if (formData.etiketler.includes(tag)) {
      setFormData({...formData, etiketler: formData.etiketler.filter(t => t !== tag)});
    } else {
      setFormData({...formData, etiketler: [...formData.etiketler, tag]});
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setFormData(defaultForm);
    setActiveTab('tanim');
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingId(item.id);
    setFormData({
      ad: item.ad, tur: item.tur || 'Məhsul', izleme: item.izleme || 'İzlənməyəcək', miqdar: item.merkezSobe, vahid: item.vahid || 'Ədəd', depo: item.depo || 'Mərkəz Şöbə',
      b2bGoster: item.b2bGoster || false, kritikSeviyye: item.kritikSeviyye || 0, aciqlama: item.aciqlama || '', etiketler: item.etiketler || [],
      edv: item.edv || 18, satisFiyati: item.satisFiyati, satisValyuta: item.satisValyuta || 'AZN', satisNovu: item.satisNovu || 'ƏDV Daxil',
      alisFiyati: item.alisFiyati, alisValyuta: item.alisValyuta || 'AZN', alisNovu: item.alisNovu || 'ƏDV Daxil',
      barkod: item.barkod || '', stokKodu: item.kod, techizatciKodu: item.techizatciKodu || '', refKodu: item.refKodu || ''
    });
    setOpenDropdownId(null);
    setActiveTab('tanim');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string | number) => {
    if (window.confirm('Bu məhsulu silmək istədiyinizə əminsiniz?')) {
      const supabase = createClient();
      const { error } = await supabase.from('erp_products').delete().eq('id', id);
      if (!error) {
        setProducts(products.filter(p => p.id !== id));
      } else {
        alert("Silinərkən xəta baş verdi.");
      }
    }
    setOpenDropdownId(null);
  };

  const handleSaveProduct = async () => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert("İstifadəçi tapılmadı, daxil olun.");
      return;
    }

    const dbProduct = {
      user_id: user.id,
      kod: formData.stokKodu || `YENI-${Math.floor(Math.random() * 1000)}`,
      ad: formData.ad || 'Adsız Məhsul',
      alis_fiyati: Number(formData.alisFiyati),
      satis_fiyati: Number(formData.satisFiyati),
      tur: formData.tur,
      vahid: formData.vahid,
      depo: formData.depo,
      aciqlama: formData.aciqlama,
      // Extra custom fields specific to the UI (can be added as JSONB or exact columns if extended)
      merkezSobe: Number(formData.miqdar),
      toplam: Number(formData.miqdar),
      izleme: formData.izleme,
      b2bgoster: formData.b2bGoster,
      kritikseviyye: formData.kritikSeviyye,
      etiketler: formData.etiketler,
      edv: formData.edv,
      satisvalyuta: formData.satisValyuta,
      satisnovu: formData.satisNovu,
      alisvalyuta: formData.alisValyuta,
      alisnovu: formData.alisNovu,
      barkod: formData.barkod,
      techizatcikodu: formData.techizatciKodu,
      refkodu: formData.refKodu
    };

    if (editingId) {
      // Update
      const { error } = await supabase.from('erp_products').update(dbProduct).eq('id', editingId);
      if (!error) {
        setProducts(products.map(p => p.id === editingId ? { ...p, ...formData, stokKodu: dbProduct.kod, alisFiyati: dbProduct.alis_fiyati, satisFiyati: dbProduct.satis_fiyati } : p));
      } else {
        console.error(error);
        alert("Yenilənərkən xəta baş verdi.");
        return;
      }
    } else {
      // Create new
      const { data, error } = await supabase.from('erp_products').insert([dbProduct]).select();
      if (!error && data) {
        const p = data[0];
        setProducts([{
          id: p.id,
          kod: p.kod,
          ad: p.ad,
          alisFiyati: p.alis_fiyati,
          satisFiyati: p.satis_fiyati,
          tur: p.tur, vahid: p.vahid, depo: p.depo, aciqlama: p.aciqlama,
          merkezSobe: p.merkezSobe, toplam: p.toplam, izleme: p.izleme, b2bGoster: p.b2bgoster, kritikSeviyye: p.kritikseviyye,
          etiketler: p.etiketler, edv: p.edv, satisValyuta: p.satisvalyuta, satisNovu: p.satisnovu, alisValyuta: p.alisvalyuta, alisNovu: p.alisnovu, barkod: p.barkod, techizatciKodu: p.techizatcikodu, refKodu: p.refkodu
        }, ...products]);
      } else {
        console.error(error);
        alert("Yaradılarkən xəta baş verdi.");
        return;
      }
    }
    
    setIsModalOpen(false);
    setFormData(defaultForm);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.ad.toLowerCase().includes(searchTerm.toLowerCase()) || p.kod.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => p.etiketler?.includes(tag));
    const matchesDepo = !selectedDepo || p.depo === selectedDepo;
    return matchesSearch && matchesTags && matchesDepo;
  });

  return (
    <div style={{ padding: '2rem', height: '100%', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: 'system-ui, -apple-system, sans-serif', position: 'relative' }}>
      
      {/* Header Area */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#e0f2fe', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Package size={32} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: '#0f172a', margin: 0, fontWeight: 900, letterSpacing: '-0.5px' }}>
              Məhsul Siyahısı
            </h1>
            <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.95rem' }}>Anbardakı bütün məhsulların qalıq və qiymət məlumatları</p>
          </div>
        </div>

        <button onClick={openCreateModal} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', backgroundColor: '#0ea5e9', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(14, 165, 233, 0.39)', transition: 'transform 0.2s' }} onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={e=>e.currentTarget.style.transform='translateY(0)'}>
          <Plus size={20}/> Yeni Məhsul Əlavə Et
        </button>
      </div>

      {/* Toolbar */}
      <div style={{ backgroundColor: 'white', padding: '1rem 1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', gap: '1rem', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} color="#64748b" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text" 
            placeholder="Axtarış Et (Kod və ya Ad ilə)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', backgroundColor: '#f8fafc', transition: 'border-color 0.2s' }}
            onFocus={e=>e.target.style.borderColor='#0ea5e9'}
            onBlur={e=>e.target.style.borderColor='#cbd5e1'}
          />
        </div>
        
        <select 
          value={selectedDepo}
          onChange={(e) => setSelectedDepo(e.target.value)}
          style={{ padding: '0.8rem 1rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', backgroundColor: '#f8fafc', color: '#475569', fontWeight: 600, cursor: 'pointer' }}
        >
          <option value="">Bütün Anbarlar</option>
          {warehouses.map(w => <option key={w} value={w}>{w}</option>)}
        </select>
        
        {/* Tags Button & Dropdown */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setIsTagsDropdownOpen(!isTagsDropdownOpen)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.2rem', backgroundColor: selectedTags.length > 0 ? '#eff6ff' : 'white', color: selectedTags.length > 0 ? '#3b82f6' : '#475569', border: selectedTags.length > 0 ? '1px solid #bfdbfe' : '1px solid #cbd5e1', borderRadius: '10px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'background-color 0.2s' }}>
            <Tag size={18} color={selectedTags.length > 0 ? '#3b82f6' : '#64748b'}/> Etiketlər {selectedTags.length > 0 ? `(${selectedTags.length})` : ''}
          </button>
          
          {isTagsDropdownOpen && (
            <div style={{ position: 'absolute', top: '110%', left: 0, width: '220px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', padding: '0.5rem', zIndex: 50 }}>
              <div style={{ padding: '0.5rem', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Etiket Seçin</div>
              {availableTags.map(tag => (
                <div key={tag} onClick={() => handleToggleTag(tag)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0.8rem', cursor: 'pointer', borderRadius: '8px', backgroundColor: selectedTags.includes(tag) ? '#f0fdf4' : 'transparent', color: selectedTags.includes(tag) ? '#166534' : '#334155', fontWeight: 600, fontSize: '0.9rem' }} onMouseOver={e=> {if(!selectedTags.includes(tag)) e.currentTarget.style.backgroundColor='#f8fafc'}} onMouseOut={e=> {if(!selectedTags.includes(tag)) e.currentTarget.style.backgroundColor='transparent'}}>
                  <span>{tag}</span>
                  {selectedTags.includes(tag) && <CheckCircle2 size={16} color="#10b981"/>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Filter Button */}
        <button onClick={() => setIsFilterModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.2rem', backgroundColor: 'white', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '10px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseOver={e=>e.currentTarget.style.backgroundColor='#f1f5f9'} onMouseOut={e=>e.currentTarget.style.backgroundColor='white'}>
          <Filter size={18} color="#64748b"/> Ətraflı Filtr
        </button>
      </div>

      {/* Table Area */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
        <div style={{ overflowX: 'auto', minHeight: '300px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569', width: '50px' }}></th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>KODU</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>MƏHSUL ADI</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>ANBAR</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>MİQDAR</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569', textAlign: 'right' }}>ALIŞ QİYMƏTİ<br/><span style={{fontSize:'0.7rem', color:'#94a3b8'}}>(ƏDV Daxil)</span></th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569', textAlign: 'right' }}>SATIŞ QİYMƏTİ<br/><span style={{fontSize:'0.7rem', color:'#94a3b8'}}>(ƏDV Daxil)</span></th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569', width: '60px' }}></th>
              </tr>
            </thead>
            {isLoading ? (
              <tr>
                <td colSpan={9} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                  <div style={{ display: 'inline-block', width: '24px', height: '24px', border: '3px solid #e2e8f0', borderTopColor: '#0ea5e9', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  <div style={{ marginTop: '0.5rem' }}>Məlumatlar Buluddan (Supabase) Yüklənir...</div>
                </td>
              </tr>
            ) : (
            <tbody>
              {filteredProducts.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: 'white', transition: 'background-color 0.2s' }} onMouseOver={e=>e.currentTarget.style.backgroundColor='#f8fafc'} onMouseOut={e=>e.currentTarget.style.backgroundColor='white'}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                      <ImageIcon size={20} />
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.95rem', fontWeight: 700, color: '#0ea5e9' }}>{item.kod}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1e293b' }}>{item.ad}</div>
                    {item.etiketler && item.etiketler.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.3rem', flexWrap: 'wrap' }}>
                        {item.etiketler.map(t => (
                          <span key={t} style={{ padding: '0.1rem 0.4rem', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 600, border: '1px solid #e2e8f0' }}>{t}</span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.8rem', backgroundColor: '#f1f5f9', color: '#475569', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700 }}>
                      {item.depo}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ display: 'inline-block', padding: '0.3rem 0.8rem', borderRadius: '20px', backgroundColor: item.merkezSobe <= 0 ? '#fef2f2' : '#eff6ff', color: item.merkezSobe <= 0 ? '#ef4444' : '#3b82f6', fontSize: '0.9rem', fontWeight: 800 }}>
                      {item.merkezSobe} {item.vahid}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.95rem', fontWeight: 700, color: '#64748b', textAlign: 'right' }}>
                    {item.alisFiyati.toFixed(2).replace('.', ',')} {item.alisValyuta === 'AZN' ? '₼' : item.alisValyuta}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', textAlign: 'right' }}>
                    {item.satisFiyati.toFixed(2).replace('.', ',')} {item.satisValyuta === 'AZN' ? '₼' : item.satisValyuta}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: '#94a3b8', textAlign: 'right', position: 'relative' }}>
                    <button onClick={() => setOpenDropdownId(openDropdownId === item.id ? null : item.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.3rem', borderRadius: '6px' }} onMouseOver={e=>e.currentTarget.style.backgroundColor='#e2e8f0'} onMouseOut={e=>e.currentTarget.style.backgroundColor='transparent'}>
                      <MoreHorizontal size={20} />
                    </button>
                    {openDropdownId === item.id && (
                      <div style={{ position: 'absolute', right: '30px', top: '50%', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.2rem', zIndex: 10 }}>
                        <button onClick={() => openEditModal(item)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#3b82f6', fontWeight: 600, fontSize: '0.9rem', textAlign: 'left' }} onMouseOver={e=>e.currentTarget.style.backgroundColor='#eff6ff'} onMouseOut={e=>e.currentTarget.style.backgroundColor='transparent'}>
                          <Edit2 size={16} /> Düzəliş Et
                        </button>
                        <button onClick={() => handleDelete(item.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: 'none', border: 'none', borderRadius: '8px', cursor: 'pointer', color: '#ef4444', fontWeight: 600, fontSize: '0.9rem', textAlign: 'left' }} onMouseOver={e=>e.currentTarget.style.backgroundColor='#fef2f2'} onMouseOut={e=>e.currentTarget.style.backgroundColor='transparent'}>
                          <Trash2 size={16} /> Sil
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
            )}
          </table>
        </div>

        {/* Footer info */}
        <div style={{ marginTop: 'auto', padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#64748b' }}>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <span>Toplam qeyd: <strong>{filteredProducts.length}</strong></span>
            <span>Axtarış müddəti: <strong style={{ color: '#10b981' }}>0,04 Sn</strong></span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button style={{ padding: '0.4rem 0.8rem', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}>Əvvəlki</button>
            <button style={{ padding: '0.4rem 0.8rem', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer' }}>Növbəti</button>
          </div>
        </div>
      </div>

      {/* Creation / Edit Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.5)', zIndex: 999, backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', width: '100%', maxWidth: '900px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }}>
              <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.4rem', fontWeight: 800 }}>{editingId ? 'Məhsula Düzəliş Et' : 'Yeni Məhsul Kartı'}</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}><X size={24} color="#64748b"/></button>
            </div>

            {/* Modal Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', padding: '0 2rem' }}>
              {[
                { id: 'tanim', label: 'Məhsul Məlumatları' },
                { id: 'fiyat', label: 'Qiymətləndirmə' },
                { id: 'kodlar', label: 'Kodlar' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{ padding: '1rem 1.5rem', background: 'none', border: 'none', borderBottom: activeTab === tab.id ? '3px solid #0ea5e9' : '3px solid transparent', color: activeTab === tab.id ? '#0ea5e9' : '#64748b', fontWeight: 800, fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s' }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div style={{ padding: '2rem', flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {activeTab === 'tanim' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Məhsul və ya Xidmət Adı *</label>
                    <input type="text" value={formData.ad} onChange={e=>setFormData({...formData, ad: e.target.value})} style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} placeholder="Məhsulun tam adı" />
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Etiketlər Seçin</label>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {availableTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => handleToggleFormTag(tag)}
                          style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '20px',
                            border: formData.etiketler.includes(tag) ? '1px solid #0ea5e9' : '1px solid #cbd5e1',
                            backgroundColor: formData.etiketler.includes(tag) ? '#e0f2fe' : 'white',
                            color: formData.etiketler.includes(tag) ? '#0ea5e9' : '#475569',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            transition: 'all 0.2s'
                          }}
                        >
                          {tag} {formData.etiketler.includes(tag) && <CheckCircle2 size={14} />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Ehtiyat Növü</label>
                    <select value={formData.tur} onChange={e=>setFormData({...formData, tur: e.target.value})} style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }}>
                      <option>Məhsul</option><option>Xidmət</option><option>Yarım-fabrikat</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>İzləmə</label>
                    <select value={formData.izleme} onChange={e=>setFormData({...formData, izleme: e.target.value})} style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }}>
                      <option>İzlənməyəcək</option><option>Seriya No ilə</option><option>Partiya ilə</option>
                    </select>
                  </div>

                  {/* Devir Islemleri */}
                  <div style={{ gridColumn: 'span 2', backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#334155' }}>Dövr Əməliyyatları (Başlanğıc Qalıq)</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Miqdar</label>
                        <input type="number" value={formData.miqdar} onChange={e=>setFormData({...formData, miqdar: Number(e.target.value)})} style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Ölçü Vahidi</label>
                        <select value={formData.vahid} onChange={e=>setFormData({...formData, vahid: e.target.value})} style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }}>
                          <option>Ədəd</option><option>Kg</option><option>Metr</option><option>Litr</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Anbar / Şöbə</label>
                        <select value={formData.depo} onChange={e=>setFormData({...formData, depo: e.target.value})} style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }}>
                          <option>Mərkəz Şöbə</option><option>Baku Branch</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Kritik Qalıq Səviyyəsi</label>
                    <input type="number" value={formData.kritikSeviyye} onChange={e=>setFormData({...formData, kritikSeviyye: Number(e.target.value)})} style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.8rem' }}>
                    <input type="checkbox" id="b2b" checked={formData.b2bGoster} onChange={e=>setFormData({...formData, b2bGoster: e.target.checked})} style={{ width: '18px', height: '18px', cursor: 'pointer' }}/>
                    <label htmlFor="b2b" style={{ fontSize: '0.9rem', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>B2B Satış portalında (E-ticarət) görünsün</label>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Qeyd / Açıqlama</label>
                    <textarea rows={3} value={formData.aciqlama} onChange={e=>setFormData({...formData, aciqlama: e.target.value})} style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', resize: 'none' }} placeholder="Əlavə məlumatlar..."></textarea>
                  </div>
                </div>
              )}

              {activeTab === 'fiyat' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', gridColumn: 'span 2', width: '50%' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>ƏDV (%)</label>
                    <select value={formData.edv} onChange={e=>setFormData({...formData, edv: Number(e.target.value)})} style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }}>
                      <option value="0">0%</option><option value="8">8%</option><option value="18">18%</option>
                    </select>
                  </div>

                  {/* Satis */}
                  <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', padding: '1.5rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#1e40af' }}>Satış Qiyməti</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e3a8a' }}>Məbləğ</label>
                      <input type="number" value={formData.satisFiyati} onChange={e=>setFormData({...formData, satisFiyati: Number(e.target.value)})} style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #bfdbfe', outline: 'none', fontSize: '0.95rem' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e3a8a' }}>Valyuta</label>
                        <select value={formData.satisValyuta} onChange={e=>setFormData({...formData, satisValyuta: e.target.value})} style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #bfdbfe', outline: 'none', fontSize: '0.95rem' }}>
                          <option>AZN</option><option>USD</option><option>EUR</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1e3a8a' }}>Qiymət Növü</label>
                        <select value={formData.satisNovu} onChange={e=>setFormData({...formData, satisNovu: e.target.value})} style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #bfdbfe', outline: 'none', fontSize: '0.95rem' }}>
                          <option>ƏDV Daxil</option><option>ƏDV Xaric</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Alis */}
                  <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '1.5rem', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#991b1b' }}>Alış Qiyməti</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#7f1d1d' }}>Məbləğ</label>
                      <input type="number" value={formData.alisFiyati} onChange={e=>setFormData({...formData, alisFiyati: Number(e.target.value)})} style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #fecaca', outline: 'none', fontSize: '0.95rem' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#7f1d1d' }}>Valyuta</label>
                        <select value={formData.alisValyuta} onChange={e=>setFormData({...formData, alisValyuta: e.target.value})} style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #fecaca', outline: 'none', fontSize: '0.95rem' }}>
                          <option>AZN</option><option>USD</option><option>EUR</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#7f1d1d' }}>Qiymət Növü</label>
                        <select value={formData.alisNovu} onChange={e=>setFormData({...formData, alisNovu: e.target.value})} style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #fecaca', outline: 'none', fontSize: '0.95rem' }}>
                          <option>ƏDV Daxil</option><option>ƏDV Xaric</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'kodlar' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Barkod Nömrəsi</label>
                    <input type="text" value={formData.barkod} onChange={e=>setFormData({...formData, barkod: e.target.value})} style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} placeholder="Barkod oxuyucu ilə oxudun və ya yazın" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Məhsul Kodu (SKU)</label>
                    <input type="text" value={formData.stokKodu} onChange={e=>setFormData({...formData, stokKodu: e.target.value})} style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} placeholder="Sistem kodu (məs: STOK-001)" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Təchizatçıdakı Məhsul Kodu</label>
                    <input type="text" value={formData.techizatciKodu} onChange={e=>setFormData({...formData, techizatciKodu: e.target.value})} style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} placeholder="Tədarükçünün daxili kodu" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Rəf Kodu / Ünvanı</label>
                    <input type="text" value={formData.refKodu} onChange={e=>setFormData({...formData, refKodu: e.target.value})} style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} placeholder="Anbardakı fiziki ünvan (məs: A-Blok-Rəf2)" />
                  </div>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '1rem', backgroundColor: '#f8fafc', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: '0.8rem 1.5rem', backgroundColor: 'white', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>İmtina</button>
              <button onClick={handleSaveProduct} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 2rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 14px -2px rgba(16, 185, 129, 0.4)' }}>
                <Save size={18}/> Yadda Saxla
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.4)', zIndex: 999, backdropFilter: 'blur(2px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc', borderTopLeftRadius: '24px', borderTopRightRadius: '24px' }}>
              <h2 style={{ margin: 0, color: '#0f172a', fontSize: '1.2rem', fontWeight: 800 }}>Ətraflı Filtr</h2>
              <button onClick={() => setIsFilterModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}><X size={20} color="#64748b"/></button>
            </div>
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Anbar / Şöbə Seçin</label>
                <select style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }}>
                  <option>Bütün Şöbələr</option><option>Mərkəz Şöbə</option><option>Baku Branch</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Qiymət Aralığı (₼)</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input type="number" placeholder="Min" style={{ flex: 1, padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none' }} />
                  <input type="number" placeholder="Max" style={{ flex: 1, padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none' }} />
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Qalıq Vəziyyəti</label>
                <select style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }}>
                  <option>Hamısı</option><option>Qalıq var (&gt;0)</option><option>Tükənib (&lt;=0)</option><option>Kritik Səviyyədə</option>
                </select>
              </div>
            </div>
            <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', gap: '1rem', backgroundColor: '#f8fafc', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
              <button onClick={() => setIsFilterModalOpen(false)} style={{ padding: '0.8rem 1.5rem', backgroundColor: 'white', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>Təmizlə</button>
              <button onClick={() => setIsFilterModalOpen(false)} style={{ padding: '0.8rem 2rem', backgroundColor: '#0ea5e9', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}>Filtrlə</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

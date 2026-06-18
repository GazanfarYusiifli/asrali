'use client'

import { useState } from 'react';

type Product = {
  id: string;
  name: string;
  category: string;
  stock: number;
  minStock: number;
  unitPrice: number;
};

const INITIAL_INVENTORY: Product[] = [
  { id: 'SKU-1001', name: 'A4 Kağız (Double A)', category: 'Ofis Ləvazimatları', stock: 150, minStock: 20, unitPrice: 8.5 },
  { id: 'SKU-1002', name: 'Ağıllı Lövhə (Promethean)', category: 'Elektronika', stock: 4, minStock: 2, unitPrice: 2500 },
  { id: 'SKU-1003', name: 'Lövhə Markeri (Qara)', category: 'Ofis Ləvazimatları', stock: 12, minStock: 15, unitPrice: 1.2 },
  { id: 'SKU-1004', name: 'Riyaziyyat Test Toplusu', category: 'Kitablar', stock: 450, minStock: 50, unitPrice: 12 },
  { id: 'SKU-1005', name: 'Müəllim Noutbuku (Lenovo)', category: 'Elektronika', stock: 1, minStock: 3, unitPrice: 1200 },
];

const EditIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const TrashIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>;

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>(INITIAL_INVENTORY);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Bütün Kateqoriyalar');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Product>>({});

  // Stats
  const totalItems = products.reduce((sum, p) => sum + p.stock, 0);
  const totalValue = products.reduce((sum, p) => sum + (p.stock * p.unitPrice), 0);
  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'Bütün Kateqoriyalar' ? true : p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['Bütün Kateqoriyalar', ...Array.from(new Set(products.map(p => p.category)))];

  const handleOpenAdd = () => {
    setFormData({ category: 'Ofis Ləvazimatları', stock: 0, minStock: 10, unitPrice: 0 });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name) return alert('Məhsul adı daxil edilməlidir');
    const newProduct: Product = {
      id: formData.id || `SKU-${1000 + products.length + 1}`,
      name: formData.name,
      category: formData.category || 'Ofis Ləvazimatları',
      stock: Number(formData.stock) || 0,
      minStock: Number(formData.minStock) || 0,
      unitPrice: Number(formData.unitPrice) || 0,
    };
    
    if (formData.id) {
      setProducts(products.map(p => p.id === formData.id ? newProduct : p));
    } else {
      setProducts([newProduct, ...products]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if(confirm('Məhsulu anbardam silmək istədiyinizə əminsiniz?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '0.25rem' }}>Anbar və Logistika</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Məktəb/Kurs avadanlıqlarının uçotu</p>
        </div>
        <button onClick={handleOpenAdd} style={{ 
          padding: '0.65rem 1.25rem', backgroundColor: 'var(--primary-color)', color: 'white', 
          borderRadius: '10px', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
        }}>
          + Məhsul Əlavə Et
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', borderLeft: '4px solid var(--primary-color)' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>Anbardakı Ümumi Məhsul</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{totalItems.toLocaleString('en-US')}</div>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', borderLeft: '4px solid #ef4444' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>Azalan Ehtiyat Bildirişləri</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: lowStockCount > 0 ? '#ef4444' : 'var(--text-primary)' }}>{lowStockCount}</div>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', borderLeft: '4px solid #10b981' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>Anbarın Dəyəri</h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>{totalValue.toLocaleString('en-US')} ₼</div>
        </div>
      </div>

      <div className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Məhsul Siyahısı</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={{ padding: '0.6rem 1rem', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', outline: 'none', fontWeight: 600 }}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input 
              type="text" 
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="SKU və ya Məhsul axtar..." 
              style={{ padding: '0.6rem 1rem', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', outline: 'none', width: '250px' }}
            />
          </div>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>ID (SKU)</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Məhsul Adı</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Kateqoriya</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'right' }}>Stok / Limit</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'right' }}>Vahid Qiymət</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'right' }}>Ümumi Dəyər</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'center' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem', textAlign: 'right' }}>Əməliyyat</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(p => {
                const isLow = p.stock <= p.minStock;
                const isOut = p.stock === 0;
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', transition: 'background 0.2s' }} className="table-row-modern">
                    <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{p.id}</td>
                    <td style={{ padding: '1.25rem 1.5rem', fontWeight: 700 }}>{p.name}</td>
                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      <span style={{ backgroundColor: 'var(--bg-color)', padding: '0.3rem 0.6rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>{p.category}</span>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right', fontWeight: 800, color: isLow ? '#ef4444' : 'var(--text-primary)' }}>
                      {p.stock} <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>/ {p.minStock}</span>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right', fontWeight: 600 }}>{p.unitPrice.toLocaleString('en-US')} ₼</td>
                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right', fontWeight: 800, color: '#10b981' }}>{(p.stock * p.unitPrice).toLocaleString('en-US')} ₼</td>
                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'center' }}>
                      {isOut ? (
                        <span style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.3rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>Bitib</span>
                      ) : isLow ? (
                        <span style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '0.3rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>Azalır</span>
                      ) : (
                        <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.3rem 0.6rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700 }}>Kifayətdir</span>
                      )}
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button onClick={() => { setFormData(p); setIsModalOpen(true); }} style={actionBtnStyle('var(--bg-color)', 'var(--text-secondary)')}><EditIcon /></button>
                        <button onClick={() => handleDelete(p.id)} style={actionBtnStyle('rgba(239,68,68,0.1)', '#ef4444')}><TrashIcon /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr><td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)', fontWeight: 600 }}>Məhsul tapılmadı.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .table-row-modern:hover { background-color: var(--bg-color); }
      `}} />

      {/* YENİ/REDƏKTƏ MODALI */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
        }}>
          <div style={{ backgroundColor: 'var(--surface-color)', width: '100%', maxWidth: '500px', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>{formData.id ? 'Məhsulu Redaktə Et' : 'Yeni Məhsul Əlavə Et'}</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Məhsulun Adı</label>
                <input value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Məs: A4 Kağız, Marker..." style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Kateqoriya</label>
                <input value={formData.category || ''} onChange={e => setFormData({...formData, category: e.target.value})} placeholder="Məs: Kitablar, Elektronika..." style={inputStyle} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Hazırkı Stok (Say)</label>
                  <input type="number" value={formData.stock || 0} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} style={inputStyle} />
                </div>
                <div>
                  <label style={{...labelStyle, color: '#f59e0b'}}>Azalma Limiti (Min)</label>
                  <input type="number" value={formData.minStock || 0} onChange={e => setFormData({...formData, minStock: Number(e.target.value)})} style={inputStyle} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Vahid Qiyməti (₼)</label>
                <input type="number" value={formData.unitPrice || 0} onChange={e => setFormData({...formData, unitPrice: Number(e.target.value)})} style={inputStyle} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: '0.85rem 1.5rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}>İmtina</button>
              <button onClick={handleSave} style={{ padding: '0.85rem 2rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}>Yadda Saxla</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const labelStyle = { display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' };
const inputStyle = {
  width: '100%', padding: '0.85rem 1rem', borderRadius: '10px',
  border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)',
  color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s',
};

const actionBtnStyle = (bg: string, color: string) => ({
  width: '34px', height: '34px', borderRadius: '8px', backgroundColor: bg, color: color,
  border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', transition: 'transform 0.1s'
});

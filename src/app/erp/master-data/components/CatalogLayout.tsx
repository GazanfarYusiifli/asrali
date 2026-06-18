'use client'
import React, { useState, useEffect } from 'react';
import { Search, Plus, Folder, FileText, X, Save } from 'lucide-react';
import { getCatalog, addCatalogItem, updateCatalogItem, CatalogName, CatalogItem } from '../../utils/masterData';

interface CatalogLayoutProps {
  title: string;
  catalogName: CatalogName;
  prefix: string; // e.g., 'D' for doctors, 'M' for materials
  renderExtraColumns?: (item: CatalogItem) => React.ReactNode;
  extraHeaders?: React.ReactNode;
  renderExtraFields?: (props: { properties: any, setProperties: (val: any) => void }) => React.ReactNode;
}

export default function CatalogLayout({ title, catalogName, prefix, renderExtraColumns, extraHeaders, renderExtraFields }: CatalogLayoutProps) {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [search, setSearch] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [properties, setProperties] = useState<any>({});

  const loadData = () => {
    setItems(getCatalog(catalogName));
  };

  useEffect(() => {
    loadData();
  }, [catalogName]);

  const openModal = (item?: CatalogItem) => {
    if (item) {
      setEditingItem(item);
      setName(item.name);
      setGroup(item.group || '');
      setProperties(item.properties || {});
    } else {
      setEditingItem(null);
      setName('');
      setGroup('');
      setProperties({});
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = () => {
    if (!name.trim()) return alert("Ad qeyd olunmalıdır!");
    
    if (editingItem) {
      updateCatalogItem(catalogName, { ...editingItem, name, group, properties });
    } else {
      addCatalogItem(catalogName, prefix, name, group, properties);
    }
    loadData();
    closeModal();
  };

  const filtered = items.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    i.code.includes(search) ||
    (i.group && i.group.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ padding: '2rem', height: '100%', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-color)', marginBottom: '0.5rem' }}>{title}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Sorğu kitabçası (Справочник).</p>
        </div>
        <button onClick={() => openModal()} style={{ backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '12px', padding: '0.75rem 1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }}>
          <Plus size={20} /> Yeni Yarat
        </button>
      </div>

      <div style={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '20px', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
            <input 
              type="text" 
              placeholder="Kod, ad və ya qrupa görə axtar..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)' }}
            />
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Qrup (Qovluq)</th>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Kod</th>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Adı</th>
                {extraHeaders}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} onClick={() => openModal(item)} style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      <Folder size={16} color="#f59e0b" fill="#f59e0b" opacity={0.2} /> {item.group || 'Kök'}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--primary-color)' }}>{item.code}</td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <FileText size={16} color="var(--text-secondary)" /> {item.name}
                    </div>
                  </td>
                  {renderExtraColumns && renderExtraColumns(item)}
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Məlumat tapılmadı</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ITEM FORM MODAL (1C Element Forması) */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: 'var(--surface-color)', width: '100%', maxWidth: '600px', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
            
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-color)' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{editingItem ? `${title} (Düzəliş)` : `Yeni ${title}`}</h2>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={24} /></button>
            </div>

            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '1rem', alignItems: 'center' }}>
                <label style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Adı</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} autoFocus style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontWeight: 600 }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '1rem', alignItems: 'center' }}>
                <label style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Qrup (Qovluq)</label>
                <input type="text" value={group} onChange={e => setGroup(e.target.value)} placeholder="Məsələn: Rəhbərlik, Dərmanlar..." style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
              </div>

              {editingItem && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '1rem', alignItems: 'center' }}>
                  <label style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Kod (Avtomatik)</label>
                  <input type="text" value={editingItem.code} disabled style={{ width: '100%', padding: '0.75rem', backgroundColor: 'rgba(0,0,0,0.05)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-secondary)' }} />
                </div>
              )}

              {renderExtraFields && renderExtraFields({ properties, setProperties })}

            </div>

            <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '1rem', backgroundColor: 'var(--bg-color)' }}>
              <button onClick={closeModal} style={{ padding: '0.75rem 1.5rem', backgroundColor: 'transparent', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}>Ləğv et</button>
              <button onClick={handleSave} style={{ padding: '0.75rem 1.5rem', backgroundColor: '#10b981', border: 'none', borderRadius: '12px', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <Save size={18} /> Yadda Saxla
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

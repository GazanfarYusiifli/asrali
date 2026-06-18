'use client'
import React, { useState } from 'react';
import DocumentLayout, { DocumentRow } from '../components/DocumentLayout';
import { addPosting } from '../../utils/accounting';
import { Plus, Trash2, Search } from 'lucide-react';
import LookupModal from '../components/LookupModal';
import { CatalogItem } from '../../utils/masterData';

function ServiceActCreate({ onClose }: { onClose: () => void }) {
  const [activeRowId, setActiveRowId] = useState<string | null>(null);

  const handlePost = (totalAmount: number, docName: string, rows: DocumentRow[], counterparty?: CatalogItem) => {
    const cpName = counterparty ? counterparty.name : 'Naməlum';
    rows.forEach(r => {
      if (r.amount > 0) {
        addPosting({ date: new Date().toISOString(), dt: '211', ct: '601', amount: r.amount, document: docName, desc: `${cpName} - ${r.catalogItem?.name || r.desc}` });
      }
    });
  };

  return (
    <DocumentLayout title="Xidmət Aktı" type="SERVICE" prefix="XA" counterpartyCatalog="patients" onPost={handlePost} onClose={onClose}>
      {({ rows, setRows }) => {
        const addRow = () => setRows([...rows, { id: Date.now().toString(), desc: '', qty: 1, price: 0, amount: 0 }]);
        const removeRow = (id: string) => setRows(rows.filter(r => r.id !== id));
        const updateRow = (id: string, field: keyof DocumentRow, value: any) => {
          setRows(rows.map(r => {
            if (r.id !== id) return r;
            const updated = { ...r, [field]: value };
            if (field === 'qty' || field === 'price') updated.amount = updated.qty * updated.price;
            return updated;
          }));
        };

        return (
          <div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--surface-color)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)', width: '50px' }}>#</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Xidmət (Nomenklatura)</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)', width: '100px' }}>Sayı</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)', width: '150px' }}>Qiymət (₼)</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)', width: '150px' }}>Məbləğ (₼)</th>
                  <th style={{ padding: '1rem', width: '60px' }}></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{index + 1}</td>
                    <td style={{ padding: '0.5rem 1rem' }}>
                      <div style={{ position: 'relative' }}>
                        <input 
                          type="text" 
                          readOnly 
                          value={row.catalogItem ? `${row.catalogItem.code} - ${row.catalogItem.name}` : ''} 
                          placeholder="🔍 Seçmək üçün klikləyin..."
                          onClick={() => setActiveRowId(row.id)}
                          style={{ width: '100%', padding: '0.6rem 2rem 0.6rem 1rem', backgroundColor: row.catalogItem ? 'var(--bg-color)' : '#eff6ff', border: row.catalogItem ? '1px solid var(--border-color)' : '1px dashed #3b82f6', borderRadius: '8px', color: row.catalogItem ? 'var(--text-primary)' : '#3b82f6', fontWeight: 600, cursor: 'pointer', textAlign: 'left' }} 
                        />
                        <Search size={16} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
                      </div>
                    </td>
                    <td style={{ padding: '0.5rem 1rem' }}>
                      <input type="number" min="1" value={row.qty} onChange={e => updateRow(row.id, 'qty', Number(e.target.value))} style={{ width: '100%', padding: '0.6rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '6px' }} />
                    </td>
                    <td style={{ padding: '0.5rem 1rem' }}>
                      <input type="number" min="0" value={row.price} onChange={e => updateRow(row.id, 'price', Number(e.target.value))} style={{ width: '100%', padding: '0.6rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '6px' }} />
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{row.amount.toFixed(2)}</td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>
                      <button onClick={() => removeRow(row.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '1rem' }}>
              <button onClick={addRow} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.5rem', backgroundColor: 'var(--surface-color)', border: '2px dashed var(--primary-color)', borderRadius: '12px', color: 'var(--primary-color)', fontWeight: 700, cursor: 'pointer', width: '100%', justifyContent: 'center', transition: 'all 0.2s', marginTop: '1rem' }}>
                <Plus size={18} /> Sətir Əlavə Et
              </button>
            </div>

            {activeRowId && (
              <LookupModal 
                catalogName="services"
                title="Xidmətlər"
                onClose={() => setActiveRowId(null)}
                onSelect={(item) => {
                  setRows(rows.map(r => {
                    if (r.id !== activeRowId) return r;
                    const price = item.properties?.price || 0;
                    return { ...r, catalogItem: item, desc: item.name, price, amount: r.qty * price };
                  }));
                  setActiveRowId(null);
                }}
              />
            )}
          </div>
        );
      }}
    </DocumentLayout>
  );
}


import DocumentList from '../components/DocumentList';
export default function ServiceActPage() {
  const [view, setView] = React.useState<'list' | 'create'>('list');
  if (view === 'create') return <ServiceActCreate onClose={() => setView('list')} />;
  return <DocumentList title="Xidmət Aktı" onCreate={() => setView('create')} />;
}

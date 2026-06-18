'use client'
import React from 'react';
import DocumentLayout, { DocumentRow } from '../components/DocumentLayout';
import { addPosting } from '../../utils/accounting';
import { Plus, Trash2 } from 'lucide-react';
import { CatalogItem } from '../../utils/masterData';

function CashInCreate({ onClose }: { onClose: () => void }) {
  const handlePost = (totalAmount: number, docName: string, rows: DocumentRow[], counterparty?: CatalogItem) => {
    const cpName = counterparty ? counterparty.name : 'Naməlum';
    rows.forEach(r => {
      if (r.amount > 0) {
        addPosting({ date: new Date().toISOString(), dt: '221', ct: '211', amount: r.amount, document: docName, desc: `${cpName} - ${r.desc}` });
      }
    });
  };

  return (
    <DocumentLayout title="Kassa Mədaxil Orderi" type="CASH" prefix="KMD" counterpartyCatalog="patients" onPost={handlePost} onClose={onClose}>
      {({ rows, setRows }) => {
        const addRow = () => setRows([...rows, { id: Date.now().toString(), desc: '', qty: 1, price: 0, amount: 0 }]);
        const removeRow = (id: string) => setRows(rows.filter(r => r.id !== id));
        const updateRow = (id: string, field: keyof DocumentRow, value: any) => {
          setRows(rows.map(r => {
            if (r.id !== id) return r;
            return { ...r, [field]: value };
          }));
        };

        return (
          <div>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--surface-color)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)', width: '50px' }}>#</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Ödənişin Təyinatı</th>
                  <th style={{ padding: '1rem', color: 'var(--text-secondary)', width: '200px' }}>Məbləğ (₼)</th>
                  <th style={{ padding: '1rem', width: '60px' }}></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{index + 1}</td>
                    <td style={{ padding: '0.5rem 1rem' }}>
                      <input type="text" value={row.desc} onChange={e => updateRow(row.id, 'desc', e.target.value)} placeholder="Məs: Borcun ödənişi" style={{ width: '100%', padding: '0.6rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '6px' }} />
                    </td>
                    <td style={{ padding: '0.5rem 1rem' }}>
                      <input type="number" min="0" value={row.amount} onChange={e => updateRow(row.id, 'amount', Number(e.target.value))} style={{ width: '100%', padding: '0.6rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '6px', color: '#10b981', fontWeight: 800 }} />
                    </td>
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
          </div>
        );
      }}
    </DocumentLayout>
  );
}


import DocumentList from '../components/DocumentList';
export default function CashInPage() {
  const [view, setView] = React.useState<'list' | 'create'>('list');
  if (view === 'create') return <CashInCreate onClose={() => setView('list')} />;
  return <DocumentList title="Kassa Mədaxil Orderi" onCreate={() => setView('create')} />;
}

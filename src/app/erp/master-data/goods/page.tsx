'use client'
import React from 'react';
import CatalogLayout from '../components/CatalogLayout';

export default function GoodsCatalog() {
  return (
    <CatalogLayout 
      title="Mallar və Materiallar (Nomenklatura)" 
      catalogName="goods" 
      prefix="M"
      extraHeaders={
        <>
          <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Ölçü Vahidi</th>
          <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Alış Dəyəri (Maya)</th>
        </>
      }
      renderExtraColumns={(item) => (
        <>
          <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{item.properties?.unit || '-'}</td>
          <td style={{ padding: '1rem 1.5rem', color: '#f59e0b', fontWeight: 700 }}>
            {item.properties?.cost ? `${item.properties.cost} ₼` : '-'}
          </td>
        </>
      )}
      renderExtraFields={({ properties, setProperties }) => (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <label style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Ölçü Vahidi</label>
            <input 
              type="text" 
              value={properties.unit || ''} 
              onChange={e => setProperties({ ...properties, unit: e.target.value })} 
              placeholder="Məsələn: ədəd, qutu, litr..." 
              style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} 
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '1rem', alignItems: 'center' }}>
            <label style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Alış Qiyməti (₼)</label>
            <input 
              type="number" 
              min="0"
              step="0.01"
              value={properties.cost || ''} 
              onChange={e => setProperties({ ...properties, cost: Number(e.target.value) })} 
              placeholder="0.00" 
              style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} 
            />
          </div>
        </>
      )}
    />
  );
}

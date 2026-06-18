'use client'
import React from 'react';
import CatalogLayout from '../components/CatalogLayout';

export default function ServicesCatalog() {
  return (
    <CatalogLayout 
      title="Xidmətlər (Nomenklatura)" 
      catalogName="services" 
      prefix="S"
      extraHeaders={
        <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Standart Qiymət (₼)</th>
      }
      renderExtraColumns={(item) => (
        <td style={{ padding: '1rem 1.5rem', color: '#10b981', fontWeight: 700 }}>
          {item.properties?.price ? `${item.properties.price} ₼` : '-'}
        </td>
      )}
      renderExtraFields={({ properties, setProperties }) => (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '1rem', alignItems: 'center' }}>
          <label style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Standart Qiymət (₼)</label>
          <input 
            type="number" 
            min="0"
            value={properties.price || ''} 
            onChange={e => setProperties({ ...properties, price: Number(e.target.value) })} 
            placeholder="0.00" 
            style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} 
          />
        </div>
      )}
    />
  );
}

'use client'
import React from 'react';
import CatalogLayout from '../components/CatalogLayout';

export default function CounterpartiesCatalog() {
  return (
    <CatalogLayout 
      title="Kontragentlər (Təchizatçılar, Müştərilər)" 
      catalogName="counterparties" 
      prefix="K"
      extraHeaders={
        <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>VÖEN</th>
      }
      renderExtraColumns={(item) => (
        <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{item.properties?.voen || '-'}</td>
      )}
      renderExtraFields={({ properties, setProperties }) => (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '1rem', alignItems: 'center' }}>
          <label style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>VÖEN</label>
          <input 
            type="text" 
            value={properties.voen || ''} 
            onChange={e => setProperties({ ...properties, voen: e.target.value })} 
            placeholder="Məsələn: 1234567891" 
            style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} 
          />
        </div>
      )}
    />
  );
}

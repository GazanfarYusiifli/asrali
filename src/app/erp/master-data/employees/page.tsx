'use client'
import React from 'react';
import CatalogLayout from '../components/CatalogLayout';

export default function EmployeesCatalog() {
  return (
    <CatalogLayout 
      title="İşçilər (Fiziki şəxslər)" 
      catalogName="employees" 
      prefix="E"
      extraHeaders={
        <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Vəzifə</th>
      }
      renderExtraColumns={(item) => (
        <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{item.properties?.role || '-'}</td>
      )}
      renderExtraFields={({ properties, setProperties }) => (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '1rem', alignItems: 'center' }}>
          <label style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Vəzifə</label>
          <input 
            type="text" 
            value={properties.role || ''} 
            onChange={e => setProperties({ ...properties, role: e.target.value })} 
            placeholder="Məsələn: Müdir, Tibb bacısı..." 
            style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} 
          />
        </div>
      )}
    />
  );
}

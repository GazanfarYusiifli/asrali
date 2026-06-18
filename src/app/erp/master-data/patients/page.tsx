'use client'
import React from 'react';
import CatalogLayout from '../components/CatalogLayout';

export default function PatientsCatalog() {
  return (
    <CatalogLayout 
      title="Pasiyentlər" 
      catalogName="patients" 
      prefix="P"
      extraHeaders={
        <>
          <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>FİN Kod</th>
          <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Telefon</th>
        </>
      }
      renderExtraColumns={(item) => (
        <>
          <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{item.properties?.fin || '-'}</td>
          <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{item.properties?.phone || '-'}</td>
        </>
      )}
      renderExtraFields={({ properties, setProperties }) => (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
            <label style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>FİN Kod</label>
            <input 
              type="text" 
              value={properties.fin || ''} 
              onChange={e => setProperties({ ...properties, fin: e.target.value })} 
              placeholder="Məsələn: 7ABC123" 
              style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} 
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '1rem', alignItems: 'center' }}>
            <label style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Telefon</label>
            <input 
              type="text" 
              value={properties.phone || ''} 
              onChange={e => setProperties({ ...properties, phone: e.target.value })} 
              placeholder="050-XXX-XX-XX" 
              style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} 
            />
          </div>
        </>
      )}
    />
  );
}

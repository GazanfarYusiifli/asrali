'use client'
import React from 'react';
import CatalogLayout from '../components/CatalogLayout';

export default function DoctorsCatalog() {
  return (
    <CatalogLayout 
      title="Həkimlər" 
      catalogName="doctors" 
      prefix="D"
      extraHeaders={
        <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>İxtisas</th>
      }
      renderExtraColumns={(item) => (
        <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{item.properties?.specialty || '-'}</td>
      )}
      renderExtraFields={({ properties, setProperties }) => (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr', gap: '1rem', alignItems: 'center' }}>
          <label style={{ fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>İxtisas</label>
          <input 
            type="text" 
            value={properties.specialty || ''} 
            onChange={e => setProperties({ ...properties, specialty: e.target.value })} 
            placeholder="Məsələn: Kardioloq, Cərrah..." 
            style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} 
          />
        </div>
      )}
    />
  );
}

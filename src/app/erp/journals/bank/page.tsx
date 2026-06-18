'use client'
import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { getDocuments, ErpDocument } from '../../utils/accounting';

export default function BankJournal() {
  const [documents, setDocuments] = useState<ErpDocument[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const docs = getDocuments()
      .filter(d => d.type === 'BANK')
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setDocuments(docs);
  }, []);

  const filtered = documents.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-color)', marginBottom: '0.5rem' }}>Bank əməliyyatları</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Bank mədaxil və məxaric (Nağdsız) əməliyyatları.</p>
        </div>
      </div>

      <div style={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '20px', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
            <input 
              type="text" 
              placeholder="Bank çıxarışı axtar..." 
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
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Tarix</th>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Sənəd</th>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Şirkət/Filial</th>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textAlign: 'right' }}>Məbləğ</th>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr key={doc.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{new Date(doc.date).toLocaleString('az-AZ')}</td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: doc.name.includes('çıxarışı') ? '#3b82f6' : '#ef4444' }}>{doc.name}</td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{doc.org}</td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 800 }}>{doc.amount.toLocaleString('az-AZ')} ₼</td>
                  <td style={{ padding: '1rem 1.5rem', color: doc.status === 'Keçirilib' ? '#10b981' : '#f59e0b', fontWeight: 600, fontSize: '0.85rem' }}>{doc.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

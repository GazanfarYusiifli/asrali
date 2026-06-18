'use client'
import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, FileText, CheckCircle, Clock } from 'lucide-react';
import { getDocuments, ErpDocument } from '../../utils/accounting';

export default function AllDocumentsJournal() {
  const [documents, setDocuments] = useState<ErpDocument[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const docs = getDocuments().sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setDocuments(docs);
  }, []);

  const filtered = documents.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.org.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-color)', marginBottom: '0.5rem' }}>Bütün sənədlər</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Sistemdəki bütün əməliyyat sənədlərinin ümumi jurnalı.</p>
        </div>
        <button style={{ backgroundColor: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '12px', padding: '0.75rem 1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }}>
          <Plus size={20} /> Yeni Sənəd
        </button>
      </div>

      <div style={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '20px', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} size={20} />
            <input 
              type="text" 
              placeholder="Sənəd nömrəsi və ya müəssisə üzrə axtar..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-primary)' }}
            />
          </div>
          <button style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}>
            <Filter size={18} /> Filtrlər
          </button>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Tarix</th>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Sənəd</th>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Müəssisə (Şöbə)</th>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem', textAlign: 'right' }}>Məbləğ</th>
                <th style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.85rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr key={doc.id} style={{ borderBottom: '1px solid var(--border-color)', cursor: 'pointer' }}>
                  <td style={{ padding: '1rem 1.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {new Date(doc.date).toLocaleString('az-AZ')}
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ padding: '0.5rem', backgroundColor: 'var(--bg-color)', borderRadius: '8px', color: 'var(--primary-color)' }}>
                        <FileText size={16} />
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{doc.name}</span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>{doc.org}</td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: 800, color: 'var(--text-primary)' }}>
                    {doc.amount.toLocaleString('az-AZ')} ₼
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: doc.status === 'Keçirilib' ? '#10b981' : '#f59e0b', fontWeight: 600, fontSize: '0.85rem' }}>
                      {doc.status === 'Keçirilib' ? <CheckCircle size={14} /> : <Clock size={14} />}
                      {doc.status}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Sənəd tapılmadı
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

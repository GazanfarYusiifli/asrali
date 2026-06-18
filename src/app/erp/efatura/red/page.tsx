'use client';
import React, { useState, useEffect } from 'react';
import { XCircle, Search, Eye } from 'lucide-react';
import Link from 'next/link';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';

export default function ReddEdilenFakturalar() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const data = getAppStorage('erp_e_invoices');
    if (data) {
      const parsed = JSON.parse(data);
      // Both incoming and outgoing can be rejected
      setInvoices(parsed.filter((inv: any) => inv.status === 'REJECTED'));
    }
  }, []);

  const filteredInvoices = invoices.filter(inv => {
    return inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
           inv.voen.includes(searchTerm) || 
           inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div style={{ padding: '2rem', height: '100%', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <XCircle size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', color: '#0f172a', margin: 0, fontWeight: 800 }}>Rədd Edilən E-Fakturalar</h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Qarşı tərəfdən imtina edilmiş və ya ləğv olunmuş sənədlər</p>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Sənəd nömrəsi, VÖEN və ya Ad ilə axtar..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} 
            />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f8fafc', zIndex: 10 }}>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '1rem 1.5rem', color: '#475569', fontWeight: 700, fontSize: '0.85rem' }}>Sənəd Nömrəsi</th>
                <th style={{ padding: '1rem 1.5rem', color: '#475569', fontWeight: 700, fontSize: '0.85rem' }}>Növü</th>
                <th style={{ padding: '1rem 1.5rem', color: '#475569', fontWeight: 700, fontSize: '0.85rem' }}>Müştəri / Təchizatçı</th>
                <th style={{ padding: '1rem 1.5rem', color: '#475569', fontWeight: 700, fontSize: '0.85rem' }}>Məbləğ</th>
                <th style={{ padding: '1rem 1.5rem', color: '#475569', fontWeight: 700, fontSize: '0.85rem', textAlign: 'center' }}>Əməliyyat</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                    Rədd edilən qaimə tapılmadı.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background-color 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f1f5f9'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#334155' }}>{inv.invoiceNumber}</td>
                    <td style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.9rem' }}>
                      {inv.type === 'OUTGOING' ? 'Gedən' : 'Gələn'}
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{inv.customerName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>VÖEN: {inv.voen}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 800, color: '#ef4444' }}>{inv.grandTotal.toFixed(2)} AZN</td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                      <Link href={`/erp/efatura/${inv.id}`} style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: 'white', border: '1px solid #e2e8f0', color: '#3b82f6', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#eff6ff'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}>
                        <Eye size={18} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

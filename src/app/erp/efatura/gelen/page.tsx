'use client';
import React, { useState, useEffect } from 'react';
import { FileDown, Search, Eye, Filter, Edit, Trash2, AlertOctagon, RefreshCw } from 'lucide-react';
import Link from 'next/link';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';

export default function GelenFakturalar() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    const data = getAppStorage('erp_e_invoices');
    let parsed = data ? JSON.parse(data) : [];
    
    // Auto-generate one incoming invoice for demonstration if none exists
    const incomingInvoices = parsed.filter((inv: any) => inv.type === 'INCOMING');
    if (incomingInvoices.length === 0) {
      const mockIncoming = {
        id: 'mock-incoming-1',
        invoiceNumber: 'EQ-2026-99999',
        type: 'INCOMING',
        voen: '9900000000',
        customerName: 'Təchizatçı MMC',
        items: [{ id: 1, name: 'Server Avadanlığı', quantity: 2, price: 500, vatRate: 18 }],
        subtotal: 1000,
        vat: 180,
        grandTotal: 1180,
        status: 'RECEIVED',
        issueDate: new Date().toLocaleDateString('tr-TR'),
        history: [{ status: 'RECEIVED', date: new Date().toLocaleString('tr-TR'), note: 'Təchizatçıdan vergi sistemi vasitəsilə daxil oldu' }]
      };
      parsed = [mockIncoming, ...parsed];
      setAppStorage('erp_e_invoices', JSON.stringify(parsed));
    }

    setInvoices(parsed.filter((inv: any) => inv.type === 'INCOMING'));
  }, []);

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || inv.voen.includes(searchTerm) || inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDelete = (id: string) => {
    if (confirm('Bu fakturanı silmək istədiyinizə əminsiniz?')) {
      const updated = invoices.filter(inv => inv.id !== id);
      setInvoices(updated);
      const allData = JSON.parse(getAppStorage('erp_e_invoices') || '[]');
      setAppStorage('erp_e_invoices', JSON.stringify(allData.filter((i: any) => i.id !== id)));
    }
  };

  const handleMarkError = (id: string) => {
    if (confirm('Bu fakturanı xətalı olaraq işarələmək istədiyinizə əminsiniz?')) {
      const allData = JSON.parse(getAppStorage('erp_e_invoices') || '[]');
      const updatedAll = allData.map((inv: any) => {
        if (inv.id === id) {
          return { ...inv, status: 'ERROR', history: [...inv.history, { status: 'ERROR', date: new Date().toLocaleString('tr-TR'), note: 'İstifadəçi tərəfindən xətalı kimi işarələndi' }] };
        }
        return inv;
      });
      setAppStorage('erp_e_invoices', JSON.stringify(updatedAll));
      setInvoices(updatedAll.filter((inv: any) => inv.type === 'INCOMING'));
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RECEIVED': return <span style={{ padding: '0.3rem 0.8rem', borderRadius: '20px', backgroundColor: '#fef3c7', color: '#d97706', fontSize: '0.8rem', fontWeight: 700 }}>Təzə Daxil Olub</span>;
      case 'ACCEPTED': return <span style={{ padding: '0.3rem 0.8rem', borderRadius: '20px', backgroundColor: '#d1fae5', color: '#10b981', fontSize: '0.8rem', fontWeight: 700 }}>Qəbul Edildi</span>;
      case 'REJECTED': return <span style={{ padding: '0.3rem 0.8rem', borderRadius: '20px', backgroundColor: '#fee2e2', color: '#ef4444', fontSize: '0.8rem', fontWeight: 700 }}>İmtina Edildi</span>;
      default: return <span>{status}</span>;
    }
  };

  return (
    <div style={{ padding: '2rem', height: '100%', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#fce7f3', color: '#db2777', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileDown size={24} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', color: '#0f172a', margin: 0, fontWeight: 800 }}>Gələn E-Fakturalar</h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>Təchizatçılardan sizə göndərilən qaimələr</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <a href="https://new.e-taxes.gov.az/eportal/login" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.2rem', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '10px', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s', fontSize: '0.9rem' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#e2e8f0'} onMouseOut={e => e.currentTarget.style.backgroundColor = '#f1f5f9'}>
            Portalda Bax (e-taxes)
          </a>
          <button onClick={() => {
            alert('DVX API ilə sinxronlaşdırma (Simulyasiya) başladıldı. Yeni qaimələr yoxlanılır...');
            setTimeout(() => {
              alert('Yeni qaimə tapılmadı. Sistem artıq ən son məlumatları göstərir.');
            }, 1500);
          }} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.39)', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#2563eb'} onMouseOut={e => e.currentTarget.style.backgroundColor = '#3b82f6'}>
            <RefreshCw size={18} /> DVX-dən Yenilə
          </button>
        </div>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Sənəd nömrəsi, VÖEN və ya Təchizatçı adı ilə axtar..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} 
            />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '0.8rem 1.5rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', backgroundColor: '#f8fafc', fontWeight: 600, color: '#475569' }}>
            <option value="ALL">Bütün Statuslar</option>
            <option value="RECEIVED">Təzə Daxil Olanlar</option>
            <option value="ACCEPTED">Qəbul Edilənlər</option>
            <option value="REJECTED">Rədd Edilənlər</option>
          </select>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f8fafc', zIndex: 10 }}>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '1rem 1.5rem', color: '#475569', fontWeight: 700, fontSize: '0.85rem' }}>Sənəd Nömrəsi</th>
                <th style={{ padding: '1rem 1.5rem', color: '#475569', fontWeight: 700, fontSize: '0.85rem' }}>Tarix</th>
                <th style={{ padding: '1rem 1.5rem', color: '#475569', fontWeight: 700, fontSize: '0.85rem' }}>Təchizatçı / VÖEN</th>
                <th style={{ padding: '1rem 1.5rem', color: '#475569', fontWeight: 700, fontSize: '0.85rem' }}>Məbləğ (ƏDV daxil)</th>
                <th style={{ padding: '1rem 1.5rem', color: '#475569', fontWeight: 700, fontSize: '0.85rem' }}>Status</th>
                <th style={{ padding: '1rem 1.5rem', color: '#475569', fontWeight: 700, fontSize: '0.85rem', textAlign: 'center' }}>Əməliyyat</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                    Qaimə tapılmadı.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background-color 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f1f5f9'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#334155' }}>{inv.invoiceNumber}</td>
                    <td style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '0.9rem' }}>{inv.issueDate}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>{inv.customerName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>VÖEN: {inv.voen}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 800, color: '#db2777' }}>{inv.grandTotal.toFixed(2)} AZN</td>
                    <td style={{ padding: '1rem 1.5rem' }}>{getStatusBadge(inv.status)}</td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <Link href={`/erp/efatura/${inv.id}`} title="Bax" style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: 'white', border: '1px solid #e2e8f0', color: '#3b82f6', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#eff6ff'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}>
                          <Eye size={18} />
                        </Link>
                        <button onClick={() => handleMarkError(inv.id)} title="Xətalı kimi saxla" style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: 'white', border: '1px solid #e2e8f0', color: '#d97706', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#fef3c7'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}>
                          <AlertOctagon size={18} />
                        </button>
                        <button onClick={() => handleDelete(inv.id)} title="Sil" style={{ padding: '0.5rem', borderRadius: '8px', backgroundColor: 'white', border: '1px solid #e2e8f0', color: '#ef4444', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#fee2e2'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}>
                          <Trash2 size={18} />
                        </button>
                      </div>
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

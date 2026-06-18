'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Download, FileCode, CheckCircle, XCircle, FileText, ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';

export default function FakturaDetay() {
  const { id } = useParams();
  const router = useRouter();
  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    const data = getAppStorage('erp_e_invoices');
    if (data) {
      const parsed = JSON.parse(data);
      const found = parsed.find((inv: any) => inv.id === id);
      if (found) {
        setInvoice(found);
      }
    }
  }, [id]);

  const updateStatus = (newStatus: string) => {
    if (!invoice) return;
    const data = getAppStorage('erp_e_invoices');
    if (data) {
      let parsed = JSON.parse(data);
      parsed = parsed.map((inv: any) => {
        if (inv.id === invoice.id) {
          const newHistory = [
            ...inv.history,
            { status: newStatus, date: new Date().toLocaleString('tr-TR'), note: `Status dəyişdirildi: ${newStatus}` }
          ];
          return { ...inv, status: newStatus, history: newHistory };
        }
        return inv;
      });
      setAppStorage('erp_e_invoices', JSON.stringify(parsed));
      setInvoice(parsed.find((inv: any) => inv.id === invoice.id));
      alert(`Status müvəffəqiyyətlə dəyişdirildi: ${newStatus}`);
    }
  };

  const handleDownloadXML = () => {
    if (!invoice) return;
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<Invoice>
  <InvoiceNumber>${invoice.invoiceNumber}</InvoiceNumber>
  <IssueDate>${invoice.issueDate}</IssueDate>
  <AccountingCustomerParty>
    <PartyName>${invoice.customerName}</PartyName>
    <PartyTaxScheme>
      <CompanyID>${invoice.voen}</CompanyID>
    </PartyTaxScheme>
  </AccountingCustomerParty>
  <LegalMonetaryTotal>
    <LineExtensionAmount>${invoice.subtotal}</LineExtensionAmount>
    <TaxExclusiveAmount>${invoice.subtotal}</TaxExclusiveAmount>
    <TaxInclusiveAmount>${invoice.grandTotal}</TaxInclusiveAmount>
  </LegalMonetaryTotal>
</Invoice>`;
    
    const blob = new Blob([xmlContent], { type: 'application/xml' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${invoice.invoiceNumber}.xml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT': return <span style={{ padding: '0.4rem 1rem', borderRadius: '20px', backgroundColor: '#f1f5f9', color: '#64748b', fontSize: '0.9rem', fontWeight: 700 }}>Qaralama</span>;
      case 'SENT': return <span style={{ padding: '0.4rem 1rem', borderRadius: '20px', backgroundColor: '#dbeafe', color: '#3b82f6', fontSize: '0.9rem', fontWeight: 700 }}>Göndərilib</span>;
      case 'RECEIVED': return <span style={{ padding: '0.4rem 1rem', borderRadius: '20px', backgroundColor: '#fef3c7', color: '#d97706', fontSize: '0.9rem', fontWeight: 700 }}>Təzə Daxil Olub</span>;
      case 'ACCEPTED': return <span style={{ padding: '0.4rem 1rem', borderRadius: '20px', backgroundColor: '#d1fae5', color: '#10b981', fontSize: '0.9rem', fontWeight: 700 }}>Qəbul Edildi</span>;
      case 'REJECTED': return <span style={{ padding: '0.4rem 1rem', borderRadius: '20px', backgroundColor: '#fee2e2', color: '#ef4444', fontSize: '0.9rem', fontWeight: 700 }}>Rədd Edilib</span>;
      case 'ERROR': return <span style={{ padding: '0.4rem 1rem', borderRadius: '20px', backgroundColor: '#fee2e2', color: '#b91c1c', fontSize: '0.9rem', fontWeight: 700 }}>Xəta Məlumatı</span>;
      default: return <span>{status}</span>;
    }
  };

  if (!invoice) return <div style={{ padding: '2rem' }}>Qaimə yüklənir və ya tapılmadı...</div>;

  return (
    <div style={{ padding: '2rem', height: '100%', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif', overflowY: 'auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => router.back()} style={{ background: 'none', border: '1px solid #cbd5e1', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'white' }}>
            <ArrowLeft size={20} color="#475569" />
          </button>
          <div>
            <h1 style={{ fontSize: '1.5rem', color: '#0f172a', margin: 0, fontWeight: 800 }}>Faktura: {invoice.invoiceNumber}</h1>
            <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.9rem' }}>Növ: {invoice.type === 'OUTGOING' ? 'Gedən' : 'Gələn'} / Yaradılıb: {invoice.issueDate}</p>
          </div>
        </div>
        <div>
          {getStatusBadge(invoice.status)}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
             <h3 style={{ margin: '0 0 1.5rem 0', color: '#334155', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.8rem' }}>Qarşı Tərəf</h3>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
               <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>{invoice.customerName}</div>
               <div style={{ color: '#64748b' }}>VÖEN: <span style={{ fontWeight: 600, color: '#334155' }}>{invoice.voen}</span></div>
             </div>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
             <h3 style={{ margin: '0 0 1.5rem 0', color: '#334155', borderBottom: '2px solid #f1f5f9', paddingBottom: '0.8rem' }}>Məhsullar və Xidmətlər</h3>
             <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
               <thead>
                 <tr style={{ color: '#64748b', fontSize: '0.85rem' }}>
                   <th style={{ paddingBottom: '1rem' }}>Adı</th>
                   <th style={{ paddingBottom: '1rem' }}>Miqdar</th>
                   <th style={{ paddingBottom: '1rem' }}>Qiymət</th>
                   <th style={{ paddingBottom: '1rem' }}>ƏDV (%)</th>
                   <th style={{ paddingBottom: '1rem' }}>Məbləğ</th>
                 </tr>
               </thead>
               <tbody>
                 {invoice.items.map((item: any, idx: number) => (
                   <tr key={idx} style={{ borderTop: '1px solid #f1f5f9' }}>
                     <td style={{ padding: '1rem 0', fontWeight: 600, color: '#334155' }}>{item.name}</td>
                     <td style={{ padding: '1rem 0' }}>{item.quantity}</td>
                     <td style={{ padding: '1rem 0' }}>{item.price.toFixed(2)} AZN</td>
                     <td style={{ padding: '1rem 0' }}>{item.vatRate}%</td>
                     <td style={{ padding: '1rem 0', fontWeight: 700 }}>{(item.quantity * item.price).toFixed(2)} AZN</td>
                   </tr>
                 ))}
               </tbody>
             </table>
          </div>

        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div style={{ backgroundColor: '#1e293b', color: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem', fontWeight: 800 }}>Yekun Məbləğ</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>Subtotal:</span>
                <span style={{ color: 'white', fontWeight: 600 }}>{invoice.subtotal.toFixed(2)} AZN</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                <span>ƏDV məbləği:</span>
                <span style={{ color: 'white', fontWeight: 600 }}>{invoice.vat.toFixed(2)} AZN</span>
              </div>
              <div style={{ height: '1px', backgroundColor: '#334155', margin: '0.5rem 0' }}></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem' }}>
                <span style={{ fontWeight: 600 }}>YEKUN:</span>
                <span style={{ color: '#10b981', fontWeight: 900 }}>{invoice.grandTotal.toFixed(2)} AZN</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {invoice.type === 'OUTGOING' && invoice.status === 'DRAFT' && (
              <button onClick={() => updateStatus('SENT')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
                <Send size={20} /> İmzala və Göndər
              </button>
            )}

            {invoice.type === 'INCOMING' && invoice.status === 'RECEIVED' && (
              <>
                <button onClick={() => updateStatus('ACCEPTED')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
                  <CheckCircle size={20} /> Qəbul Et (Uçota Al)
                </button>
                <button onClick={() => updateStatus('REJECTED')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer' }}>
                  <XCircle size={20} /> Rədd Et
                </button>
              </>
            )}

            <button onClick={handleDownloadXML} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', backgroundColor: 'white', color: '#4f46e5', border: '1px solid #4f46e5', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#eef2ff'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}>
              <FileCode size={20} /> XML Yüklə (UBL 2.1)
            </button>
            <button style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '1rem', backgroundColor: 'white', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'white'}>
              <FileText size={20} /> Çap üçün PDF
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#475569', fontSize: '0.9rem' }}>Rəsmi Portallara Keçid (İnteqrasiyasız)</h4>
            <a href="https://portal.asxm.gov.az/login" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.8rem', backgroundColor: '#f8fafc', color: '#0ea5e9', border: '1px solid #bae6fd', borderRadius: '10px', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#e0f2fe'} onMouseOut={e => e.currentTarget.style.backgroundColor = '#f8fafc'}>
              ASAN İmza Portalına Keç
            </a>
            <a href="https://new.e-taxes.gov.az/eportal/login" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.8rem', backgroundColor: '#f8fafc', color: '#10b981', border: '1px solid #a7f3d0', borderRadius: '10px', fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#d1fae5'} onMouseOut={e => e.currentTarget.style.backgroundColor = '#f8fafc'}>
              DVX Portalına (e-taxes) Keç
            </a>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#334155' }}>Status Tarixçəsi</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {invoice.history?.map((h: any, idx: number) => (
                <div key={idx} style={{ display: 'flex', gap: '0.8rem' }}>
                  <div style={{ width: '2px', backgroundColor: '#e2e8f0', position: 'relative' }}>
                    <div style={{ position: 'absolute', top: 0, left: '-4px', width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3b82f6' }}></div>
                  </div>
                  <div style={{ paddingBottom: '1rem' }}>
                    <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>{h.status}</div>
                    <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.2rem' }}>{h.note}</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.2rem' }}>{h.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

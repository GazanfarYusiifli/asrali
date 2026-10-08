'use client';
import React from 'react';
import { FileCheck2, Plus, Download, RefreshCw } from 'lucide-react';
import PageHeaderBanner from '@/components/PageHeaderBanner';

export default function Page() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}>
      <PageHeaderBanner
        title="Çek və Veksəl Portfeli"
        description="Alınmış və verilmiş çeklərin, veksellərin müddət və ödəniş statusu izlənməsi."
        icon={FileCheck2}
        theme="indigo"
        badge="Ödəniş Vasitələri"
        primaryAction={{
          label: "Yeni Çek/Veksəl",
          onClick: () => alert("Yeni çek qeydiyyatı pəncərəsi açılır..."),
          icon: Plus
        }}
        secondaryAction={{
          label: "Eksport",
          onClick: () => alert("Məlumatlar eksport edilir..."),
          icon: Download
        }}
      />

      <div style={{ 
        padding: '3.5rem 2rem', 
        backgroundColor: 'white', 
        borderRadius: '16px', 
        border: '1px solid #e2e8f0', 
        textAlign: 'center', 
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' 
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '16px',
          backgroundColor: '#e0e7ff',
          color: '#4338ca',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto'
        }}>
          <FileCheck2 size={32} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
          Çek və Veksəl İdarəetməsi
        </h3>
        <p style={{ color: '#64748b', maxWidth: '520px', margin: '0 auto', fontSize: '0.95rem', lineHeight: 1.6 }}>
          Bu bölmə üzərindən müştərilərdən alınan və tədarükçülərə verilən borc sənədlərinin (çek və veksellərin) inkasso və ödəniş mərhələləri izlənilir.
        </p>
      </div>
    </div>
  );
}

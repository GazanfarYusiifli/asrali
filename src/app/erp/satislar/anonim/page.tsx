'use client';
import React from 'react';
import { RotateCcw, Plus, ShoppingCart, RefreshCw } from 'lucide-react';
import PageHeaderBanner from '@/components/PageHeaderBanner';
import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  return (
    <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}>
      <PageHeaderBanner
        title="Qaytarmalar və Anonim Satış"
        description="Satışların geri qaytarılması və anonim kassa çeklərinin idarə edilməsi."
        icon={RotateCcw}
        theme="emerald"
        badge="Satış Qaytarması"
        primaryAction={{
          label: "Yeni Qaytarma",
          onClick: () => router.push('/erp/satislar/yeni'),
          icon: Plus
        }}
        secondaryAction={{
          label: "Yenilə",
          onClick: () => window.location.reload(),
          icon: RefreshCw
        }}
      />

      <div style={{ 
        padding: '3rem 2rem', 
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
          backgroundColor: '#ecfdf5',
          color: '#059669',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto'
        }}>
          <RotateCcw size={32} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
          Qaytarmalar və Anonim Əməliyyatlar
        </h3>
        <p style={{ color: '#64748b', maxWidth: '500px', margin: '0 auto 1.5rem auto', fontSize: '0.95rem', lineHeight: 1.6 }}>
          Bu bölmə üzərindən geri qaytarılmış malların qəbulu, məxaric qaimələri və pərakəndə anonim satışların uçotu aparılır.
        </p>
      </div>
    </div>
  );
}

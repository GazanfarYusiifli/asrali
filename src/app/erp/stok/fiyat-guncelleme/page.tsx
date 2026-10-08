'use client';
import React from 'react';
import { RefreshCw, Tag, SlidersHorizontal, Check } from 'lucide-react';
import PageHeaderBanner from '@/components/PageHeaderBanner';

export default function Page() {
  return (
    <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}>
      <PageHeaderBanner
        title="Stok Düzəlişi və Qiymət Yeniləmə"
        description="Məhsul maya dəyərlərinin, satış qiymətlərinin və anbar qalıqlarının toplu düzəlişi."
        icon={SlidersHorizontal}
        theme="blue"
        badge="Stok Düzəlişi"
        primaryAction={{
          label: "Düzəlişləri Tətbiq Et",
          onClick: () => alert("Qiymət dəyişiklikləri qeydə alınır..."),
          icon: Check
        }}
        secondaryAction={{
          label: "Yenilə",
          onClick: () => window.location.reload(),
          icon: RefreshCw
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
          backgroundColor: '#eff6ff',
          color: '#2563eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto'
        }}>
          <Tag size={32} />
        </div>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
          Toplu Qiymət və Qalıq Redaktəsi
        </h3>
        <p style={{ color: '#64748b', maxWidth: '520px', margin: '0 auto', fontSize: '0.95rem', lineHeight: 1.6 }}>
          Buradan seçilmiş kateqoriyalar üzrə məhsulların satış və alış qiymətlərini faizlə və ya sabit məbləğlə kütləvi şəkildə dəyişə bilərsiniz.
        </p>
      </div>
    </div>
  );
}

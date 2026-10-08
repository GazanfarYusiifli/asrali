'use client';

import React, { useState } from 'react';
import { Search, Plus, Filter, FileDown, Coins } from 'lucide-react';
import PageHeaderBanner from '@/components/PageHeaderBanner';

export default function Page() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div style={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Modern Banner Header */}
      <PageHeaderBanner
        title="Kassa qalığı"
        description="Valyutalar və filial kassaları üzrə faktiki nağd pul qalıqlarının real vaxt icmalı."
        icon={Coins}
        theme="indigo"
        badge="Maliyyə & Kassa"
        primaryAction={{
          label: "Yeni Kassa Əlavə Et",
          onClick: () => alert("Yeni kassa yaratma modulu açılır..."),
          icon: Plus
        }}
        secondaryAction={{
          label: "Eksport",
          onClick: () => alert("Məlumatlar eksport edilir..."),
          icon: FileDown
        }}
      />

      {/* Main Table Card */}
      <div style={{ 
        backgroundColor: '#ffffff', 
        borderRadius: '16px', 
        border: '1px solid rgba(226, 232, 240, 0.8)', 
        overflow: 'hidden', 
        boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.04)' 
      }}>
        {/* Toolbar */}
        <div style={{ 
          padding: '1.15rem 1.75rem', 
          borderBottom: '1px solid #f1f5f9', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          backgroundColor: '#fafbfc',
          gap: '1rem',
          flexWrap: 'wrap'
        }}>
          <div style={{ position: 'relative', width: '380px', maxWidth: '100%' }}>
            <Search size={17} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Kassa adı, Valyuta, Məsul şəxs ilə axtar..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.65rem 1rem 0.65rem 2.6rem', 
                borderRadius: '10px', 
                border: '1px solid #e2e8f0', 
                outline: 'none', 
                fontSize: '0.88rem', 
                color: '#0f172a',
                backgroundColor: '#ffffff',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
              }}
              onFocus={(e) => { 
                e.currentTarget.style.borderColor = '#10b981'; 
                e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.12)';
              }}
              onBlur={(e) => { 
                e.currentTarget.style.borderColor = '#e2e8f0'; 
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>

          <button style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.5rem', 
            padding: '0.6rem 1.15rem', 
            backgroundColor: '#ffffff', 
            border: '1px solid #e2e8f0', 
            borderRadius: '10px', 
            color: '#475569', 
            fontSize: '0.88rem', 
            fontWeight: 600, 
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}>
            <Filter size={15} style={{ color: '#64748b' }} />
            Filtrlər
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0, textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '0.9rem 1.5rem', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0' }}>Kassa Adı</th>
                <th style={{ padding: '0.9rem 1.5rem', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0' }}>Valyuta</th>
                <th style={{ padding: '0.9rem 1.5rem', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0' }}>Məsul Şəxs</th>
                <th style={{ padding: '0.9rem 1.5rem', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #e2e8f0' }}>Cari Qalıq</th>
                <th style={{ padding: '0.9rem 1.5rem', fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right', borderBottom: '1px solid #e2e8f0' }}>Əməliyyatlar</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} style={{ padding: '3.5rem 2rem' }}>
                  {/* Empty state banner */}
                  <div style={{ 
                    maxWidth: '680px', 
                    margin: '0 auto', 
                    padding: '2.5rem 2rem', 
                    borderRadius: '16px', 
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.04) 0%, rgba(209, 250, 229, 0.3) 100%)',
                    border: '1px dashed rgba(16, 185, 129, 0.35)',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.85rem'
                  }}>
                    <div style={{ 
                      width: '56px', 
                      height: '56px', 
                      borderRadius: '16px', 
                      background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: '#059669',
                      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
                    }}>
                      <Coins size={28} />
                    </div>
                    <div style={{ fontWeight: 800, color: '#1e293b', fontSize: '1.15rem', letterSpacing: '-0.01em' }}>
                      Kassa məlumatı tapılmadı
                    </div>
                    <p style={{ margin: 0, color: '#64748b', fontSize: '0.88rem', maxWidth: '420px', lineHeight: 1.5 }}>
                      Sistemdə hələ ki aktiv kassa hesabı müəyyən edilməyib. "Yeni Kassa Əlavə Et" düyməsi ilə daxil edə bilərsiniz.
                    </p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


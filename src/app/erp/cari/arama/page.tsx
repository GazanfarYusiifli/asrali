'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Search, ArrowRight, Building2, Users, Phone, MapPin, Mail, Clock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';

export default function GlobalSearchPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [allCustomers, setAllCustomers] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<any[]>([]);

  useEffect(() => {
    // Load all customers
    const localCustomers = JSON.parse(getAppStorage('erp_customers') || '[]');
    setAllCustomers(localCustomers);

    // Get 3 random recent ones as mock history (or just pick first 3)
    if (localCustomers.length > 0) {
      setRecentSearches(localCustomers.slice(0, 3));
    }
  }, []);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase();
    
    return allCustomers.filter(c => 
      c.hesabAdi?.toLowerCase().includes(term) ||
      c.hesabKodu?.toLowerCase().includes(term) ||
      c.voen?.includes(term) ||
      c.mobil?.includes(term) ||
      c.epoct?.toLowerCase().includes(term)
    );
  }, [searchTerm, allCustomers]);

  return (
    <div style={{ minHeight: '100%', backgroundColor: '#f8fafc', padding: '3rem 2rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Search Header Container */}
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', backgroundColor: '#e0e7ff', borderRadius: '20px', marginBottom: '1.5rem', boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.2)' }}>
          <Search size={32} color="#4f46e5" />
        </div>
        
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#0f172a', margin: '0 0 1rem 0', letterSpacing: '-1px' }}>
          Qlobal Cari Axtarış
        </h1>
        <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '2.5rem' }}>
          Sistemdəki bütün müştəri və təchizatçıları anında tapın. Ad, kod, VÖEN və ya nömrə yaza bilərsiniz.
        </p>

        {/* Big Search Input */}
        <div style={{ position: 'relative', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', borderRadius: '24px' }}>
          <div style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)' }}>
            <Search size={24} color="#94a3b8" />
          </div>
          <input
            autoFocus
            type="text"
            placeholder="Müştəri adı və ya hesab kodu daxil edin..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '1.5rem 1.5rem 1.5rem 4rem',
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#1e293b',
              border: '2px solid transparent',
              borderRadius: '24px',
              outline: 'none',
              backgroundColor: 'white',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = '#4f46e5'}
            onBlur={e => e.target.style.borderColor = 'transparent'}
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#64748b' }}
            >
              Sil
            </button>
          )}
        </div>

      </div>

      {/* Results Container */}
      <div style={{ maxWidth: '800px', margin: '3rem auto 0 auto' }}>
        
        {!searchTerm && recentSearches.length > 0 && (
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={16} /> Son Baxılanlar
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
              {recentSearches.map(c => (
                <Link key={c.id} href={`/erp/cari/musteriler/${c.id}`} style={{ textDecoration: 'none' }}>
                  <div style={{ backgroundColor: 'white', padding: '1rem', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }} onMouseOver={e=>e.currentTarget.style.transform='translateY(-2px)'} onMouseOut={e=>e.currentTarget.style.transform='none'}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: c.hesabNovu === 'Müştəri' ? '#e0e7ff' : '#fef3c7', color: c.hesabNovu === 'Müştəri' ? '#4f46e5' : '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                      {c.hesabAdi.charAt(0)}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                      <div style={{ fontWeight: 700, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.hesabAdi}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.hesabKodu || 'Kodsuz'}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {searchTerm && searchResults.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'white', borderRadius: '24px', border: '1px dashed #cbd5e1' }}>
            <Search size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#334155', fontWeight: 700 }}>Axtarışa uyğun nəticə tapılmadı</h3>
            <p style={{ margin: '0.5rem 0 0 0', color: '#94a3b8' }}>Daha fərqli bir sözlə axtarış etməyi yoxlayın.</p>
          </div>
        )}

        {searchTerm && searchResults.length > 0 && (
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748b', marginBottom: '1rem' }}>
              {searchResults.length} nəticə tapıldı
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {searchResults.map(c => (
                <div key={c.id} onClick={() => router.push(`/erp/cari/musteriler/${c.id}`)} style={{ backgroundColor: 'white', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }} onMouseOver={e=>{e.currentTarget.style.borderColor='#818cf8'; e.currentTarget.style.transform='translateX(4px)'}} onMouseOut={e=>{e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.transform='none'}}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: c.hesabNovu === 'Müştəri' ? '#e0e7ff' : c.hesabNovu === 'Təchizatçı' ? '#fef3c7' : '#fce7f3', color: c.hesabNovu === 'Müştəri' ? '#4f46e5' : c.hesabNovu === 'Təchizatçı' ? '#d97706' : '#db2777', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {c.hesabNovu === 'Müştəri' ? <Users size={24}/> : <Building2 size={24}/>}
                    </div>
                    
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>{c.hesabAdi}</h3>
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: '12px', backgroundColor: '#f1f5f9', color: '#64748b' }}>
                          {c.hesabKodu || 'KOD YOXDUR'}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '1.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Phone size={14}/> {c.mobil || '-'}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><MapPin size={14}/> {c.seher || 'Ünvan yoxdur'}</span>
                        {c.voen && <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>VÖEN: {c.voen}</span>}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>Cari Qalıq</span>
                      <span style={{ fontSize: '1.2rem', fontWeight: 800, color: c.dovrQaliqNovu === 'Borc' ? '#ef4444' : '#10b981' }}>
                        {Number(c.dovrQaligi).toLocaleString('az-AZ',{minimumFractionDigits:2})} ₼
                      </span>
                    </div>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                      <ArrowRight size={20} />
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

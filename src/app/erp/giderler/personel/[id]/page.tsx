'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Camera, Activity, PlusCircle, CreditCard, Coins, Plus, Calendar, Edit, Trash2, X } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';

export default function IsciProfilPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [isci, setIsci] = useState<any>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('hereketler');

  useEffect(() => {
    const existing = JSON.parse(getAppStorage('erp_personnel') || '[]');
    const tapilan = existing.find((item: any) => item.id.toString() === id);
    if (tapilan) {
      setIsci(tapilan);
    }
  }, [id]);

  if (!isci) return <div style={{ padding: '2rem' }}>Yüklənir...</div>;

  // Get Initials
  const initials = isci.ad.split(' ').map((n: string) => n[0]).join('').substring(0, 3).toUpperCase();

  const handleAction = (action: string) => {
    setIsMenuOpen(false);
    if (action === 'duzenle') {
      router.push(`/erp/giderler/personel/yeni?id=${id}`);
    } else if (action === 'sil') {
      if (confirm("İşçini silmək istədiyinizə əminsiniz?")) {
        const existing = JSON.parse(getAppStorage('erp_personnel') || '[]');
        const newData = existing.filter((item: any) => item.id.toString() !== id);
        setAppStorage('erp_personnel', JSON.stringify(newData));
        router.push('/erp/giderler/personel');
      }
    } else {
      alert(`Tezliklə: ${action} əməliyyatı üçün modal açılacaq.`);
    }
  };

  return (
    <div style={{ padding: '2rem', height: '100%', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
      <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontWeight: 600, alignSelf: 'flex-start' }}>
        <ArrowLeft size={20} /> Geri Qayıt
      </button>

      {/* Top Profile Card */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', fontSize: '2rem', fontWeight: 800, position: 'relative', cursor: 'pointer', border: '3px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            {initials}
            <div style={{ position: 'absolute', bottom: '-5px', right: '-5px', backgroundColor: '#cbd5e1', borderRadius: '50%', padding: '0.3rem', border: '2px solid white' }}>
              <Camera size={14} color="#475569" />
            </div>
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#1e293b', fontWeight: 800 }}>{isci.ad}</h1>
            <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '1rem', fontWeight: 500 }}>{isci.vezife} • {isci.filial}</p>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase' }}>Cari Hesab (Net Maaş)</p>
          <h2 style={{ margin: 0, fontSize: '2.5rem', color: '#10b981', fontWeight: 800 }}>{isci.maas.toLocaleString('az-AZ')} AZN <span style={{fontSize:'1.2rem', color:'#64748b'}}>(A)</span></h2>
        </div>
      </div>

      {/* Action Tabs & Buttons */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem', position: 'relative' }}>
        <button 
          onClick={() => setActiveTab('hereketler')}
          style={{ ...tabBtn, borderBottom: activeTab === 'hereketler' ? '3px solid #4f46e5' : '3px solid transparent', color: activeTab === 'hereketler' ? '#4f46e5' : '#64748b', fontWeight: activeTab === 'hereketler' ? 800 : 600 }}
        >
          <Activity size={18}/> Hərəkətlər
        </button>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ ...tabBtn, backgroundColor: isMenuOpen ? '#e0e7ff' : '#f1f5f9', color: '#4f46e5', fontWeight: 800, borderRadius: '8px', border: '1px solid #c7d2fe' }}
        >
          <PlusCircle size={18}/> Əməliyyat Daxil Et (İşlem Girişi)
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div style={{ position: 'absolute', top: '110%', left: '150px', backgroundColor: 'white', borderRadius: '12px', padding: '0.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', width: '250px', zIndex: 50, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            <button onClick={() => handleAction('Ödəniş Et')} style={menuItem}><CreditCard size={16} color="#10b981"/> Ödəniş Et</button>
            <button onClick={() => handleAction('Maaş Daxil Et')} style={menuItem}><Coins size={16} color="#3b82f6"/> Maaş Daxil Et</button>
            <button onClick={() => handleAction('Ekstra')} style={menuItem}><Plus size={16} color="#f59e0b"/> Ekstra</button>
            <button onClick={() => handleAction('İcazə Daxil Et')} style={menuItem}><Calendar size={16} color="#8b5cf6"/> İcazə Daxil Et</button>
            <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '0.3rem 0' }}></div>
            <button onClick={() => handleAction('duzenle')} style={menuItem}><Edit size={16} color="#475569"/> Məlumatları Düzənlə</button>
            <button onClick={() => handleAction('sil')} style={{...menuItem, color: '#ef4444'}}><Trash2 size={16} color="#ef4444"/> İşçini Sil</button>
            <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '0.3rem 0' }}></div>
            <button onClick={() => setIsMenuOpen(false)} style={{...menuItem, justifyContent: 'center', backgroundColor: '#f1f5f9', fontWeight: 700}}><X size={16}/> Menyunu Bağla</button>
          </div>
        )}
      </div>

      {/* Content Area */}
      {activeTab === 'hereketler' && (
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          
          {/* Header row in hereketler */}
          <div style={{ padding: '1.5rem', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <input type="date" style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
              <span style={{ color: '#64748b', fontWeight: 700 }}>-</span>
              <input type="date" style={{ padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} />
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', fontWeight: 800, border: '2px solid white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>{initials}</div>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#1e293b', fontWeight: 800 }}>Maaş Durum : <span style={{ color: '#10b981' }}>{Number(isci.maas).toLocaleString('az-AZ')} AZN (A)</span></h3>
              <p style={{ margin: '0.4rem 0 0 0', color: '#64748b', fontWeight: 600, fontSize: '0.95rem' }}>Aldığı: 0.00 AZN &nbsp;-&nbsp; Hakediş: 0.00 AZN</p>
            </div>
          </div>

          <div style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8', fontWeight: 600, fontSize: '1.1rem' }}>
             Qeyd Yoxdur (Kayıt Yok)
          </div>

        </div>
      )}

    </div>
  );
}

const tabBtn: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.2rem', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s', border: 'none' };
const menuItem: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.8rem 1rem', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s', border: 'none', textAlign: 'left', width: '100%', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600, color: '#334155' };

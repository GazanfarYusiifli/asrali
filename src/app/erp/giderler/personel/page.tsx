'use client';
import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Coins, CalendarDays, LineChart, Award, Search, Edit, Trash2, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';

export default function IsciMaasveIcazePage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [actionModal, setActionModal] = useState<{type: string, isciId: number} | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const existing = getAppStorage('erp_personnel');
    if (existing) {
      setData(JSON.parse(existing));
    } else {
      const defaultData = [
        { id: 1, ad: 'Əhməd Həsənov', veziyyet: 'İşləyir', vezife: 'Satış Təmsilçisi', filial: 'Mərkəz Filial', yetki: 'Satış (Məhdud)', maas: 800 },
        { id: 2, ad: 'Aygün Məmmədova', veziyyet: 'İşləyir', vezife: 'Mühasib', filial: 'Mərkəz Filial', yetki: 'Mühasib (Tam)', maas: 1200 },
        { id: 3, ad: 'Rəşad Əliyev', veziyyet: 'İşdən Çıxıb', vezife: 'Anbardar', filial: 'Depo 1', yetki: 'Anbar Yetkisi', maas: 600 }
      ];
      setData(defaultData);
      setAppStorage('erp_personnel', JSON.stringify(defaultData));
    }
  }, []);

  if (!isMounted) return null;

  const handleDelete = (id: number) => {
    if (confirm("Bu işçini silmək istədiyinizə əminsiniz?")) {
      const newData = data.filter(item => item.id !== id);
      setData(newData);
      setAppStorage('erp_personnel', JSON.stringify(newData));
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/erp/giderler/personel/yeni?id=${id}`);
  };

  const filteredData = data.filter(item => item.ad.toLowerCase().includes(searchTerm.toLowerCase()) || item.vezife.toLowerCase().includes(searchTerm.toLowerCase()));

  // Group by Filial
  const groupedData = filteredData.reduce((acc, item) => {
    const filial = item.filial || 'Filialsız';
    if (!acc[filial]) acc[filial] = [];
    acc[filial].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  const handleModalSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    
    if (actionModal?.type === 'icaze') {
      const baslama = fd.get('baslama') as string;
      const gunSayi = parseInt(fd.get('gunSayi') as string, 10);
      const nov = fd.get('icazeNovu') as string;
      const aciqlama = fd.get('aciqlama') as string;

      // Calculate end date based on days (inclusive: 1 day means start == end)
      const baslamaDate = new Date(baslama);
      baslamaDate.setDate(baslamaDate.getDate() + (gunSayi - 1));
      const bitis = baslamaDate.getFullYear() + '-' + String(baslamaDate.getMonth() + 1).padStart(2, '0') + '-' + String(baslamaDate.getDate()).padStart(2, '0');

      const newLeave = { baslama, bitis, nov, aciqlama };

      const updatedData = data.map(item => {
        if (item.id === actionModal.isciId) {
          return {
             ...item,
             icazeler: [...(item.icazeler || []), newLeave]
          };
        }
        return item;
      });
      
      setData(updatedData);
      setAppStorage('erp_personnel', JSON.stringify(updatedData));
      alert("İcazə uğurla qeydə alındı! (Sistem hər gün tarixi yoxlayacaq və vaxtı çatanda statusu 'Məzuniyyətdə' edəcək).");
    } else {
      alert("Əməliyyat uğurla yadda saxlanıldı!");
    }
    
    setActionModal(null);
  };

  return (
    <div style={{ padding: '2rem', height: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: '#f8fafc' }}>
      
      {/* Header & Top Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ backgroundColor: '#e0e7ff', padding: '0.5rem', borderRadius: '8px', color: '#4f46e5' }}>
            <Users size={24} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b' }}>İşçi Maaş və İcazə Sistemi</h1>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <button style={actionBtnStyle('#4f46e5')} onClick={() => router.push('/erp/giderler/personel/yeni')} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            <UserPlus size={18} style={{ marginRight: '6px' }}/> Yeni İşçi Əlavə Et
          </button>
          <button style={actionBtnStyle('#10b981')} onClick={() => router.push('/erp/giderler/personel/toplu-maas')} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            <Coins size={18} style={{ marginRight: '6px' }}/> Toplu Maaş Daxil Et
          </button>
          <button style={actionBtnStyle('#f59e0b')} onClick={() => router.push('/erp/giderler/personel/icazeler')} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            <CalendarDays size={18} style={{ marginRight: '6px' }}/> İcazə Vəziyyətləri
          </button>
          <button style={actionBtnStyle('#0ea5e9')} onClick={() => router.push('/erp/giderler/personel/performans')} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            <LineChart size={18} style={{ marginRight: '6px' }}/> Satış Performansı
          </button>
          <button style={actionBtnStyle('#f43f5e')} onClick={() => router.push('/erp/giderler/personel/satish-primi')} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            <Award size={18} style={{ marginRight: '6px' }}/> Satış Primi
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div style={{ backgroundColor: 'white', padding: '1.2rem', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1, minWidth: '150px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Vəziyyət (Durum)</label>
          <select style={selectStyle}>
            <option value="">Bütün İşçilər</option>
            <option value="İşləyir">İşləyir</option>
            <option value="İşdən Çıxıb">İşdən Çıxıb</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1, minWidth: '150px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Vəzifəsi (Görevi)</label>
          <select style={selectStyle}>
            <option value="">Hamısı</option>
            <option value="Mühasib">Mühasib</option>
            <option value="Satış Təmsilçisi">Satış Təmsilçisi</option>
            <option value="Kassir">Kassir</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1, minWidth: '150px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Filial (Şubesi)</label>
          <select style={selectStyle}>
            <option value="">Bütün Filiallar</option>
            <option value="Mərkəz Filial">Mərkəz Filial</option>
            <option value="Depo 1">Depo 1</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1, minWidth: '150px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>ASRALI Yetkisi</label>
          <select style={selectStyle}>
            <option value="">Bütün Yetkilər</option>
            <option value="Satış (Məhdud)">Satış (Məhdud)</option>
            <option value="Mühasib (Tam)">Mühasib (Tam)</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 2, minWidth: '250px' }}>
          <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#64748b' }}>Axtar (Arama)</label>
          <div style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Ad, Soyad və ya Vəzifə..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ ...selectStyle, paddingLeft: '2.2rem', width: '100%' }}
            />
          </div>
        </div>

      </div>

      {/* Grouped Card View */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {Object.keys(groupedData).length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', color: '#94a3b8', fontWeight: 500 }}>
            Axtarışa uyğun işçi tapılmadı.
          </div>
        ) : (
          Object.keys(groupedData).map(filial => (
            <div key={filial}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#334155', marginBottom: '1rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '0.5rem' }}>
                {filial}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {groupedData[filial].map((row: any) => {
                  const initials = row.ad.split(' ').map((n: string) => n[0]).join('').substring(0, 3).toUpperCase();
                  
                  // Dynamic status check based on date
                  let currentVeziyyet = row.veziyyet;
                  if (currentVeziyyet === 'İşləyir' && row.icazeler) {
                    const today = new Date().toISOString().split('T')[0];
                    const isCurrentlyOnLeave = row.icazeler.some((icaze: any) => icaze.baslama <= today && icaze.bitis >= today);
                    if (isCurrentlyOnLeave) {
                      currentVeziyyet = 'Məzuniyyətdə';
                    }
                  }

                  let badgeBg = '#fee2e2';
                  let badgeColor = '#991b1b';
                  if (currentVeziyyet === 'İşləyir') { badgeBg = '#dcfce7'; badgeColor = '#166534'; }
                  else if (currentVeziyyet === 'Məzuniyyətdə') { badgeBg = '#fef3c7'; badgeColor = '#b45309'; }

                  return (
                    <div 
                      key={row.id} 
                      onClick={() => router.push(`/erp/giderler/personel/${row.id}`)}
                      style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '1.5rem', cursor: 'pointer', transition: 'all 0.3s', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}
                      onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0,0,0,0.1)'; e.currentTarget.style.borderColor = '#c7d2fe'; }}
                      onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.02)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5', fontSize: '1.4rem', fontWeight: 800 }}>
                          {initials}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ display: 'inline-block', backgroundColor: badgeBg, color: badgeColor, padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                            {currentVeziyyet}
                          </span>
                        </div>
                      </div>

                      <div style={{ marginTop: '1.2rem' }}>
                        <h3 style={{ margin: '0 0 0.3rem 0', fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>{row.ad}</h3>
                        <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', fontWeight: 600 }}>{row.vezife}</p>
                      </div>

                      <div style={{ marginTop: '1.2rem', display: 'flex', justifyContent: 'flex-end' }}>
                          <h4 style={{ margin: 0, fontSize: '1.5rem', color: '#10b981', fontWeight: 800 }}>{Number(row.maas).toLocaleString('az-AZ')} AZN <span style={{ fontSize: '1rem', color: '#64748b', fontWeight: 700 }}>(A)</span></h4>
                      </div>

                      <div style={{ marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '0.5rem', position: 'relative' }}>
                          <button 
                            onClick={(e) => { e.stopPropagation(); router.push(`/erp/giderler/personel/${row.id}`); }}
                            style={{ flex: 1, padding: '0.6rem', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#475569', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}
                            onMouseOver={e=>e.currentTarget.style.backgroundColor='#e2e8f0'}
                            onMouseOut={e=>e.currentTarget.style.backgroundColor='#f1f5f9'}
                          >
                            Hərəkətlər
                          </button>
                          
                          <button 
                            onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === row.id ? null : row.id); }}
                            style={{ flex: 1, padding: '0.6rem', backgroundColor: openMenuId === row.id ? '#e0e7ff' : 'white', border: openMenuId === row.id ? '1px solid #4f46e5' : '1px solid #cbd5e1', borderRadius: '8px', color: openMenuId === row.id ? '#4f46e5' : '#475569', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s' }}
                          >
                            İşlem Girişi
                          </button>

                          {/* Dropdown Menu */}
                          {openMenuId === row.id && (
                            <div style={{ position: 'absolute', bottom: '110%', right: '0', backgroundColor: 'white', borderRadius: '12px', padding: '0.5rem', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0', width: '220px', zIndex: 50, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                              <button onClick={(e) => { e.stopPropagation(); setActionModal({type: 'odeme', isciId: row.id}); setOpenMenuId(null); }} style={menuItem}>Ödəniş Et</button>
                              <button onClick={(e) => { e.stopPropagation(); setActionModal({type: 'maas', isciId: row.id}); setOpenMenuId(null); }} style={menuItem}>Maaş Daxil Et</button>
                              <button onClick={(e) => { e.stopPropagation(); setActionModal({type: 'ekstra', isciId: row.id}); setOpenMenuId(null); }} style={menuItem}>Ekstra</button>
                              <button onClick={(e) => { e.stopPropagation(); setActionModal({type: 'icaze', isciId: row.id}); setOpenMenuId(null); }} style={menuItem}>İcazə Daxil Et</button>
                              <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '0.3rem 0' }}></div>
                              <button onClick={(e) => { e.stopPropagation(); handleEdit(row.id); }} style={menuItem}>Məlumatları Düzənlə</button>
                              <button onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }} style={{...menuItem, color: '#ef4444'}}>İşçini Sil</button>
                              <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '0.3rem 0' }}></div>
                              <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(null); }} style={{...menuItem, justifyContent: 'center', backgroundColor: '#f1f5f9'}}>Menyunu Bağla</button>
                            </div>
                          )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ACTION MODALS */}
      {actionModal && (() => {
        const selectedIsci = data.find(i => i.id === actionModal.isciId);
        
        let displayVeziyyet = selectedIsci?.veziyyet;
        if (displayVeziyyet === 'İşləyir' && selectedIsci?.icazeler) {
          const today = new Date().toISOString().split('T')[0];
          const isCurrentlyOnLeave = selectedIsci.icazeler.some((icaze: any) => icaze.baslama <= today && icaze.bitis >= today);
          if (isCurrentlyOnLeave) {
            displayVeziyyet = 'Məzuniyyətdə';
          }
        }

        return (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
            <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '2rem', width: '100%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
              <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', borderBottom: '2px solid #f1f5f9', paddingBottom: '1rem' }}>
                {actionModal.type === 'odeme' && 'Ödəniş Et'}
                {actionModal.type === 'maas' && 'Maaş Daxil Et'}
                {actionModal.type === 'ekstra' && 'Ekstra (Prim/Bonus) Daxil Et'}
                {actionModal.type === 'icaze' && 'İcazə Daxil Et'}
              </h2>
              
              <form onSubmit={handleModalSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {actionModal.type === 'odeme' && (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Kassa / Hesab</label>
                    <select style={selectStyle} required><option>Nəğd Kassa</option><option>Əsas Bank Hesabı</option></select>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Məbləğ (AZN)</label>
                    <input type="number" style={selectStyle} required placeholder="0.00" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Açıqlama</label>
                    <input type="text" style={selectStyle} placeholder="Ödəniş təfərrüatı..." />
                  </div>
                </>
              )}

              {actionModal.type === 'maas' && (
                <>
                  {displayVeziyyet !== 'İşləyir' && (
                    <div style={{ padding: '1rem', backgroundColor: '#fee2e2', border: '1px solid #f87171', borderRadius: '8px', color: '#991b1b', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      ⚠️ Diqqət: Bu işçi hal-hazırda <strong>"{displayVeziyyet}"</strong> statusundadır. Qaydalara görə maaş hesablanmır!
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '1rem', opacity: displayVeziyyet !== 'İşləyir' ? 0.6 : 1, pointerEvents: displayVeziyyet !== 'İşləyir' ? 'none' : 'auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>İl (Yıl)</label>
                      <select style={selectStyle} required><option>2026</option></select>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Ay</label>
                      <select style={selectStyle} required defaultValue="İyun">
                        <option>Yanvar</option><option>Fevral</option><option>Mart</option>
                        <option>Aprel</option><option>May</option><option>İyun</option>
                      </select>
                    </div>
                  </div>
                  
                  <div style={{ padding: '1rem', backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', color: '#92400e', fontWeight: 700, fontSize: '0.95rem' }}>
                    Ücretsiz İzin + Rapor : 0 Gün
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Açıqlama</label>
                    <input type="text" style={selectStyle} placeholder="Maaş ödənişi təfərrüatları..." />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Net Maaş</label>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <input type="number" style={{...selectStyle, flex: 1}} required placeholder="0.00" />
                      <div style={{ padding: '0.8rem 1.2rem', backgroundColor: '#e2e8f0', borderRadius: '8px', fontWeight: 800, color: '#475569', display: 'flex', alignItems: 'center' }}>AZN</div>
                    </div>
                  </div>
                </>
              )}

              {actionModal.type === 'ekstra' && (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Tarix</label>
                    <input type="date" style={selectStyle} required defaultValue={new Date().toISOString().split('T')[0]} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Məbləğ (AZN)</label>
                    <input type="number" style={selectStyle} required placeholder="0.00" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Açıqlama</label>
                    <input type="text" style={selectStyle} placeholder="Ekstra gəlirin açıqlaması..." />
                  </div>
                </>
              )}

              {actionModal.type === 'icaze' && (
                <>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>İcazə Növü</label>
                    <select name="icazeNovu" style={selectStyle} required>
                      <option>Doğum</option>
                      <option>1 İllik</option>
                      <option>Ölüm</option>
                      <option>Xəstəlik</option>
                      <option>Ödənişli</option>
                      <option>Ödənişsiz</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Başlama Tarixi</label>
                      <input name="baslama" type="date" style={selectStyle} required />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                      <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Gün Sayı</label>
                      <input name="gunSayi" type="number" min="1" style={selectStyle} required placeholder="Məs: 3" />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Açıqlama</label>
                    <input name="aciqlama" type="text" style={selectStyle} placeholder="İcazə ilə bağlı qeydlər..." />
                  </div>
                </>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setActionModal(null)} style={{ flex: 1, padding: '0.8rem', backgroundColor: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#475569', fontWeight: 700, cursor: 'pointer' }}>İmtina</button>
                <button 
                  type="submit" 
                  disabled={actionModal.type === 'maas' && displayVeziyyet !== 'İşləyir'}
                  style={{ flex: 2, padding: '0.8rem', backgroundColor: (actionModal.type === 'maas' && displayVeziyyet !== 'İşləyir') ? '#94a3b8' : '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: (actionModal.type === 'maas' && displayVeziyyet !== 'İşləyir') ? 'not-allowed' : 'pointer', boxShadow: '0 4px 6px -1px rgba(79,70,229,0.3)' }}
                >
                  Təsdiqlə və Yadda Saxla
                </button>
              </div>
            </form>
          </div>
        </div>
        );
      })()}

    </div>
  );
}

const actionBtnStyle = (color: string): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
  padding: '0.8rem 1.4rem', 
  backgroundColor: 'white', 
  color: color, 
  border: `1px solid ${color}`, 
  borderRadius: '8px', 
  fontWeight: 700, 
  fontSize: '0.9rem',
  cursor: 'pointer', 
  transition: 'all 0.3s ease', 
  boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
  position: 'relative',
  overflow: 'hidden'
});

const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.transform = 'translateY(-2px)';
  e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.1)';
  e.currentTarget.style.backgroundColor = e.currentTarget.style.color;
  e.currentTarget.style.color = 'white';
};

const handleMouseOut = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.currentTarget.style.transform = 'translateY(0)';
  e.currentTarget.style.boxShadow = '0 2px 5px rgba(0,0,0,0.05)';
  e.currentTarget.style.color = e.currentTarget.style.backgroundColor;
  e.currentTarget.style.backgroundColor = 'white';
};

const menuItem: React.CSSProperties = { display: 'flex', alignItems: 'center', gap: '0.8rem', padding: '0.6rem 1rem', background: 'transparent', cursor: 'pointer', transition: 'all 0.2s', border: 'none', textAlign: 'left', width: '100%', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, color: '#334155' };

const selectStyle: React.CSSProperties = {
  padding: '0.6rem 0.8rem',
  borderRadius: '8px',
  border: '1px solid #cbd5e1',
  backgroundColor: '#f8fafc',
  outline: 'none',
  fontWeight: 500,
  fontSize: '0.9rem',
  color: '#1e293b',
  cursor: 'pointer'
};

const thStyle: React.CSSProperties = { padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' };
const tdStyle: React.CSSProperties = { padding: '1rem', color: '#334155', fontSize: '0.95rem', whiteSpace: 'nowrap', verticalAlign: 'middle' };

'use client';
import React, { useState, useEffect } from 'react';
import { FileSignature, Plus, Mail, Download, X, Printer, CheckCircle, XCircle } from 'lucide-react';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';

export default function MutabakatPage() {
  const [mutabakats, setMutabakats] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewingDoc, setViewingDoc] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    hesapAdi: '',
    mailAdresi: '',
    notlar: '',
    donem: ''
  });

  useEffect(() => {
    const stored = getAppStorage('erp_mutabakats');
    if (stored) {
      setMutabakats(JSON.parse(stored));
    }
  }, []);

  const saveToStorage = (data: any[]) => {
    setMutabakats(data);
    setAppStorage('erp_mutabakats', JSON.stringify(data));
  };

  const handlePreview = () => {
    if (!formData.mailAdresi || !formData.donem || !formData.hesapAdi) {
      alert("Zəhmət olmasa Hesab Adı, Mail Adresi və Dönəm xanalarını doldurun.");
      return;
    }

    const previewM = {
      id: Date.now().toString(),
      hesapAdi: formData.hesapAdi,
      mailAdresi: formData.mailAdresi,
      notlar: formData.notlar,
      donem: formData.donem,
      gonderildigiTarih: new Date().toLocaleDateString('tr-TR'),
      cevap: 'Gözləyir',
      cevapTarihi: '-',
      cevapVerenKisi: '-',
      cevapAciklamasi: '-',
      hesapEkstrasi: '-',
      alis: { adet: 0, kdvH: '0.00', kdvD: '0.00' },
      alisIade: { adet: 0, kdvH: '0.00', kdvD: '0.00' },
      satis: { adet: 0, kdvH: '0.00', kdvD: '0.00' },
      satisIade: { adet: 0, kdvH: '0.00', kdvD: '0.00' },
      isUnsaved: true
    };

    setViewingDoc(previewM);
    setIsModalOpen(false);
  };

  const handleSaveAndSend = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/email/mutabakat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(viewingDoc),
      });

      const result = await response.json();

      if (result.success) {
        const newDoc = { ...viewingDoc };
        delete newDoc.isUnsaved;
        saveToStorage([newDoc, ...mutabakats]);
        setViewingDoc(newDoc);
        setFormData({ hesapAdi: '', mailAdresi: '', notlar: '', donem: '' });
        alert(`Üzləşmə tələbi ${newDoc.mailAdresi} ünvanına uğurla göndərildi!`);
      } else {
        alert("E-poçt göndərilərkən xəta baş verdi:\n" + result.message);
      }
    } catch (error) {
      alert("Sistem xətası baş verdi.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCevap = (cevapText: string) => {
    if (viewingDoc.isUnsaved) {
      alert("Zəhmət olmasa, əvvəlcə üzləşmə tələbini göndərin.");
      return;
    }
    const today = new Date().toLocaleDateString('tr-TR');
    const updated = mutabakats.map(m => {
      if (m.id === viewingDoc.id) {
        return { ...m, cevap: cevapText, cevapTarihi: today };
      }
      return m;
    });
    saveToStorage(updated);
    setViewingDoc({ ...viewingDoc, cevap: cevapText, cevapTarihi: today });
    alert(`Cari tərəfindən cavab qeyd edildi: ${cevapText}`);
  };

  const sendRealEmail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/email/mutabakat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(viewingDoc),
      });

      const result = await response.json();

      if (result.success) {
        alert(`Üzləşmə tələbi yenidən ${viewingDoc.mailAdresi} ünvanına göndərildi!`);
      } else {
        alert("E-poçt göndərilərkən xəta baş verdi:\n" + result.message);
      }
    } catch (error) {
      alert("Sistem xətası baş verdi.");
    } finally {
      setIsLoading(false);
    }
  };

  const printDocument = () => {
    window.print();
  };

  // ----------------------------------------------------
  // PREVIEW (DOCUMENT) VIEW
  // ----------------------------------------------------
  if (viewingDoc) {
    return (
      <div style={{ padding: '2rem', minHeight: '100%', backgroundColor: '#f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Print-hide UI actions */}
        <div className="no-print" style={{ width: '100%', maxWidth: '800px', display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <button onClick={() => setViewingDoc(null)} style={{ padding: '0.6rem 1.2rem', backgroundColor: 'white', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
            &larr; Geri Qayıt
          </button>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {viewingDoc.isUnsaved ? (
              <button onClick={handleSaveAndSend} disabled={isLoading} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.2rem', backgroundColor: isLoading ? '#94a3b8' : '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: isLoading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)' }}>
                <CheckCircle size={16} /> {isLoading ? 'Göndərilir...' : 'Yadda Saxla və Göndər'}
              </button>
            ) : (
              <>
                <button onClick={printDocument} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.2rem', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                  <Printer size={16} /> PDF Yüklə / Çap Et
                </button>
                <button onClick={sendRealEmail} disabled={isLoading} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1.2rem', backgroundColor: isLoading ? '#94a3b8' : '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: isLoading ? 'not-allowed' : 'pointer' }}>
                  <Mail size={16} /> {isLoading ? 'Göndərilir...' : 'E-mail Göndər'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* A4 Document Simulation */}
        <div className="printable-doc" style={{ width: '100%', maxWidth: '800px', backgroundColor: 'white', padding: '3rem', borderRadius: '4px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', fontFamily: 'Arial, sans-serif', color: '#333' }}>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginBottom: '2rem' }}>
            <button style={{ padding: '0.3rem 0.6rem', border: '1px solid #ccc', background: 'transparent', fontSize: '0.8rem', cursor: 'pointer' }}>Dili Dəyiş</button>
            <button style={{ padding: '0.3rem 0.6rem', border: 'none', backgroundColor: '#ef4444', color: 'white', fontSize: '0.8rem', fontWeight: 'bold', borderRadius: '4px' }}>SOS</button>
          </div>

          <h2 style={{ textAlign: 'center', margin: '0 0 2rem 0', color: '#1e293b', fontSize: '1.5rem', borderBottom: '2px solid #1e293b', paddingBottom: '1rem' }}>
            Üzləşmə Tələbi
          </h2>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', fontWeight: 'bold', fontSize: '1rem' }}>
            <span>Hörmətli {viewingDoc.hesapAdi},</span>
            <span>Göndərilmə Tarixi: {viewingDoc.gonderildigiTarih}</span>
          </div>

          <p style={{ lineHeight: '1.6', marginBottom: '2rem' }}>
            {viewingDoc.donem} dövrü üzrə üzləşmə cədvəldə təqdim edilmişdir. Üzləşib-üzləşmədiyimizi bildirməyinizi, üzləşmədiyimiz təqdirdə cari hesab çıxarışınızı göndərməyinizi xahiş edirik.
          </p>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderTop: '2px solid #e2e8f0', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '0.8rem', borderRight: '1px solid #e2e8f0' }}>Əməliyyat Növü</th>
                <th style={{ padding: '0.8rem', borderRight: '1px solid #e2e8f0' }}>Qaimə Sayı</th>
                <th style={{ padding: '0.8rem', borderRight: '1px solid #e2e8f0' }}>ƏDV Xaric</th>
                <th style={{ padding: '0.8rem' }}>ƏDV Daxil</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.8rem', fontWeight: 'bold', borderRight: '1px solid #e2e8f0' }}>Alış</td>
                <td style={{ padding: '0.8rem', borderRight: '1px solid #e2e8f0' }}>{viewingDoc.alis.adet} Ədəd</td>
                <td style={{ padding: '0.8rem', borderRight: '1px solid #e2e8f0' }}>{viewingDoc.alis.kdvH}</td>
                <td style={{ padding: '0.8rem' }}>{viewingDoc.alis.kdvD}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.8rem', fontWeight: 'bold', borderRight: '1px solid #e2e8f0' }}>Alış Qaytarma</td>
                <td style={{ padding: '0.8rem', borderRight: '1px solid #e2e8f0' }}>{viewingDoc.alisIade.adet} Ədəd</td>
                <td style={{ padding: '0.8rem', borderRight: '1px solid #e2e8f0' }}>{viewingDoc.alisIade.kdvH}</td>
                <td style={{ padding: '0.8rem' }}>{viewingDoc.alisIade.kdvD}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.8rem', fontWeight: 'bold', borderRight: '1px solid #e2e8f0' }}>Satış</td>
                <td style={{ padding: '0.8rem', borderRight: '1px solid #e2e8f0' }}>{viewingDoc.satis.adet} Ədəd</td>
                <td style={{ padding: '0.8rem', borderRight: '1px solid #e2e8f0' }}>{viewingDoc.satis.kdvH}</td>
                <td style={{ padding: '0.8rem' }}>{viewingDoc.satis.kdvD}</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={{ padding: '0.8rem', fontWeight: 'bold', borderRight: '1px solid #e2e8f0' }}>Satış Qaytarma</td>
                <td style={{ padding: '0.8rem', borderRight: '1px solid #e2e8f0' }}>{viewingDoc.satisIade.adet} Ədəd</td>
                <td style={{ padding: '0.8rem', borderRight: '1px solid #e2e8f0' }}>{viewingDoc.satisIade.kdvH}</td>
                <td style={{ padding: '0.8rem' }}>{viewingDoc.satisIade.kdvD}</td>
              </tr>
            </tbody>
          </table>

          <div style={{ textAlign: 'center', margin: '2rem 0' }}>
            <a href="#" style={{ color: '#2563eb', textDecoration: 'underline', fontWeight: 'bold' }}>Hesab Çıxarışınızı İncələmək üçün Buraya Klikləyin</a>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
            <button onClick={() => handleCevap('Üzləşdik')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 2rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
              <CheckCircle size={20} /> Üzləşdik (Təsdiqləyirik)
            </button>
            <button onClick={() => handleCevap('Üzləşmədik')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 2rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer' }}>
              <XCircle size={20} /> Üzləşmədik (Təsdiqləmirik)
            </button>
          </div>

          <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.5', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
            <p>Üzləşmə barədə bir ay ərzində məlumat vermədiyiniz təqdirdə qanunvericiliyə əsasən üzləşmiş sayılacağımızı xatırladırıq.</p>
            <p>Qalıq məbləğlə üzləşmədiyiniz təqdirdə hesab çıxarışınızı təcili olaraq bizə göndərməklə bu formanı rədd edə bilərsiniz.</p>
            <p>Zəhmət olmasa, ünvan və əlaqə məlumatlarınızdakı dəyişiklikləri bizə bildirin.</p>
            <p>Bu üzləşmə məktubu elektron formada göndərilir.</p>
            <p>Səhvlər və unudulmuş hallar istisnadır.</p>
          </div>

        </div>

        {/* CSS for printing */}
        <style dangerouslySetInnerHTML={{__html: `
          @media print {
            body * { visibility: hidden; }
            .printable-doc, .printable-doc * { visibility: visible; }
            .printable-doc { position: absolute; left: 0; top: 0; width: 100%; box-shadow: none !important; }
            .no-print { display: none !important; }
          }
        `}} />
      </div>
    );
  }

  // ----------------------------------------------------
  // MAIN LIST VIEW
  // ----------------------------------------------------
  return (
    <div style={{ padding: '2rem', height: '100%', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '2rem', fontFamily: 'system-ui, -apple-system, sans-serif', overflowY: 'auto' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#d1fae5', color: '#047857', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileSignature size={32} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', color: '#0f172a', margin: 0, fontWeight: 900, letterSpacing: '-0.5px' }}>
              E-Üzləşmə
            </h1>
            <p style={{ margin: '0.2rem 0 0 0', color: '#64748b', fontSize: '0.95rem' }}>Müştərilərlə qarşılıqlı hesablaşma təsdiqləri</p>
          </div>
        </div>
        
        <button onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)', transition: 'all 0.2s' }} onMouseOver={e=>{e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.backgroundColor='#059669'}} onMouseOut={e=>{e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.backgroundColor='#10b981'}}>
          <Plus size={20}/> Yeni Üzləşmə Əlavə Et
        </button>
      </div>

      {/* Main Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', whiteSpace: 'nowrap' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>Hesab / Cari Adı</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>Göndərilmə Tarixi</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>Üzləşmə Dönəmi</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>Cavab</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>Cavab Tarixi</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>Cavab Verən Şəxs</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>Cavab Açıqlaması</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569' }}>Hesab Çıxarışı</th>
                <th style={{ padding: '1rem 1.5rem', fontSize: '0.85rem', fontWeight: 800, color: '#475569', textAlign: 'center' }}>Əməliyyat</th>
              </tr>
            </thead>
            <tbody>
              {mutabakats.length === 0 ? (
                <tr><td colSpan={9} style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8', fontSize: '1.1rem', fontWeight: 700 }}>Mutabakat Talebi Yok</td></tr>
              ) : (
                mutabakats.map(m => (
                  <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 800, color: '#0f172a' }}>{m.hesapAdi}</td>
                    <td style={{ padding: '1rem 1.5rem', color: '#64748b' }}>{m.gonderildigiTarih}</td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 700, color: '#334155' }}>{m.donem}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <span style={{ padding: '0.3rem 0.8rem', borderRadius: '20px', backgroundColor: '#fef3c7', color: '#d97706', fontSize: '0.85rem', fontWeight: 800 }}>{m.cevap}</span>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', color: '#64748b' }}>{m.cevapTarihi}</td>
                    <td style={{ padding: '1rem 1.5rem', color: '#64748b' }}>{m.cevapVerenKisi}</td>
                    <td style={{ padding: '1rem 1.5rem', color: '#64748b' }}>{m.cevapAciklamasi}</td>
                    <td style={{ padding: '1rem 1.5rem', color: '#64748b' }}>{m.hesapEkstrasi}</td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                      <button onClick={() => setViewingDoc(m)} style={{ padding: '0.5rem 1rem', backgroundColor: '#f1f5f9', color: '#10b981', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
                        Görüntülə
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEW MUTABAKAT MODAL */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.5)', zIndex: 999, backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
            
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Yeni Mutabakat Talebi</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Hesab / Cari Adı</label>
                <input type="text" value={formData.hesapAdi} onChange={e=>setFormData({...formData, hesapAdi: e.target.value})} placeholder="Məs: Fidan MMC" style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Göndəriləcək E-poçt Ünvanı</label>
                <input type="email" value={formData.mailAdresi} onChange={e=>setFormData({...formData, mailAdresi: e.target.value})} placeholder="ornek@firma.com" style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Üzləşmə Dönəmi</label>
                <input type="text" value={formData.donem} onChange={e=>setFormData({...formData, donem: e.target.value})} placeholder="Məs: 2026/06" style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Əlavə Qeydlər</label>
                <textarea value={formData.notlar} onChange={e=>setFormData({...formData, notlar: e.target.value})} placeholder="Xüsusi qeydlər..." style={{ padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem', minHeight: '80px', resize: 'vertical' }} />
              </div>
            </div>

            <div style={{ padding: '1.5rem 2rem', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handlePreview} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.5rem', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', boxShadow: '0 4px 14px 0 rgba(16, 185, 129, 0.39)' }}>
                Ön İzləmə Yarat (Öz İzleme Oluştur)
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Printer, Save, Download, FileText, Search, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';

export default function TekliflerPage() {
  const router = useRouter();
  
  // State for Quote Data
  const [quoteData, setQuoteData] = useState({
    companyName: 'Örnək Firma MMC',
    date: new Date().toISOString().split('T')[0],
    docNo: 'TEK-' + Math.floor(Math.random() * 10000),
    address: 'Nümunəvi Məh., Nümunəvi Küç. No:34\nBakı / Azərbaycan',
    greeting: 'Hazırladığımız qiymət təklifini dəyərləndirmənizə təqdim edirik.',
    note: 'Təklif 15 gün müddətində qüvvədədir.',
    footerGreeting: 'Sizinlə işləməkdən məmnunluq duyarıq.\nTəklifimizlə bağlı suallarınızı cavablandırmağa hazır olduğumuzu bildirir, işlərinizdə uğurlar diləyirik.',
    sender: 'Hörmətlə,\nASRALI Komandası'
  });

  const [rows, setRows] = useState([
    { id: 1, name: 'Ağıllı Telefon', desc: 'Məhsul kartındakı açıqlama məlumatı bura gəlir.', quantity: 1, price: 3717.00 },
    { id: 2, name: 'İdman Ayaqqabısı', desc: 'Məhsul kartındakı açıqlama məlumatı bura gəlir.', quantity: 1, price: 212.40 }
  ]);

  const updateQuoteData = (field: string, value: string) => {
    setQuoteData(prev => ({ ...prev, [field]: value }));
  };

  const addRow = () => {
    setRows([...rows, { id: Date.now(), name: '', desc: '', quantity: 1, price: 0 }]);
  };

  const updateRow = (id: number, field: string, value: string | number) => {
    setRows(rows.map(row => {
      if (row.id === id) {
        return { ...row, [field]: value };
      }
      return row;
    }));
  };

  const removeRow = (id: number) => {
    if (rows.length > 1) {
      setRows(rows.filter(row => row.id !== id));
    }
  };

  const grandTotal = rows.reduce((acc, row) => acc + (Number(row.quantity) * Number(row.price)), 0);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('quote-document');
      
      // Temporarily enforce fixed width for perfect PDF rendering
      const originalWidth = element?.style.width;
      const originalMaxWidth = element?.style.maxWidth;
      if (element) {
        element.style.width = '794px'; // Exactly 210mm at 96 DPI
        element.style.maxWidth = '794px';
      }

      const opt = {
        margin:       10, // 10mm margins all around
        filename:     `Təklif_${quoteData.docNo}.pdf`,
        image:        { type: 'jpeg' as const, quality: 1 },
        html2canvas:  { scale: 2, useCORS: true, width: 794 },
        jsPDF:        { unit: 'mm' as const, format: 'a4', orientation: 'portrait' as const }
      };
      
      if (!element) throw new Error('PDF element not found');
      await html2pdf().set(opt).from(element).save();

      // Restore original styles
      if (element) {
        element.style.width = originalWidth || '100%';
        element.style.maxWidth = originalMaxWidth || '210mm';
      }
    } catch (e) {
      console.error(e);
      alert('PDF yaradılarkən xəta baş verdi. Zəhmət olmasa "Çap Et" düyməsindən (Save as PDF) istifadə edin.');
    }
  };

  const handleSave = () => {
    if (!quoteData.companyName.trim()) {
      alert("XƏTA: Zəhmət olmasa 'Firma / Müştəri Adı' xanasını doldurun.");
      return;
    }
    if (rows.length === 0 || !rows[0].name.trim()) {
      alert("XƏTA: Təklifə ən azı 1 məhsul əlavə edilməli və 'Məhsul adı' doldurulmalıdır.");
      return;
    }

    const existingQuotes = JSON.parse(getAppStorage('erp_quotes') || '[]');
    const searchParams = new URLSearchParams(window.location.search);
    const editId = searchParams.get('id');

    if (editId) {
      const updatedQuotes = existingQuotes.map((q: any) => {
        if (q.id.toString() === editId) {
          return { ...q, ...quoteData, rows, grandTotal };
        }
        return q;
      });
      setAppStorage('erp_quotes', JSON.stringify(updatedQuotes));
    } else {
      const newQuote = {
        id: Date.now(),
        ...quoteData,
        rows,
        grandTotal
      };
      setAppStorage('erp_quotes', JSON.stringify([newQuote, ...existingQuotes]));
    }
    
    alert("Qiymət təklifi uğurla yadda saxlanıldı!");
    router.push('/erp/satislar/teklifler');
  };

  const handleSend = async () => {
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('quote-document');
      
      const originalWidth = element?.style.width;
      const originalMaxWidth = element?.style.maxWidth;
      if (element) {
        element.style.width = '794px';
        element.style.maxWidth = '794px';
      }

      const opt = {
        margin:       10,
        filename:     `Təklif_${quoteData.docNo}.pdf`,
        image:        { type: 'jpeg' as const, quality: 1 },
        html2canvas:  { scale: 2, useCORS: true, width: 794 },
        jsPDF:        { unit: 'mm' as const, format: 'a4', orientation: 'portrait' as const }
      };
      
      // Generate PDF as Blob
      if (!element) throw new Error('PDF element not found');
      const pdfBlob = await html2pdf().set(opt).from(element).output('blob');

      // Restore original styles
      if (element) {
        element.style.width = originalWidth || '100%';
        element.style.maxWidth = originalMaxWidth || '210mm';
      }

      const file = new File([pdfBlob], `Təklif_${quoteData.docNo}.pdf`, { type: 'application/pdf' });
      const text = `Hörmətli ${quoteData.companyName},\n\nSizə ${quoteData.docNo} nömrəli, ${Number(grandTotal).toLocaleString('az-AZ', { minimumFractionDigits: 2 })} ₼ məbləğində qiymət təklifimizi təqdim edirik.\n\n${quoteData.sender}`;

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Qiymət Təklifi - ${quoteData.docNo}`,
          text: text,
        });
      } else {
        // Fallback: Download PDF and open WhatsApp
        alert("Cihazınız və ya brauzeriniz faylı birbaşa paylaşmağı dəstəkləmir. PDF avtomatik yüklənəcək, dərhal sonra açılan WhatsApp pəncərəsində sənədi əlavə edərək göndərə bilərsiniz.");
        const url = URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Təklif_${quoteData.docNo}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
        window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // User cancelled the share dialog, do nothing
        return;
      }
      console.error(err);
      alert('Göndərilərkən xəta baş verdi.');
    }
  };

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
    
    const searchParams = new URLSearchParams(window.location.search);
    const editId = searchParams.get('id');

    if (editId) {
      const existingQuotes = JSON.parse(getAppStorage('erp_quotes') || '[]');
      const quoteToEdit = existingQuotes.find((q: any) => q.id.toString() === editId);
      if (quoteToEdit) {
        setQuoteData({
          companyName: quoteToEdit.companyName || '',
          date: quoteToEdit.date || new Date().toISOString().split('T')[0],
          docNo: quoteToEdit.docNo || '',
          address: quoteToEdit.address || '',
          greeting: quoteToEdit.greeting || '',
          note: quoteToEdit.note || '',
          footerGreeting: quoteToEdit.footerGreeting || '',
          sender: quoteToEdit.sender || ''
        });
        if (quoteToEdit.rows && quoteToEdit.rows.length > 0) {
          setRows(quoteToEdit.rows);
        }
      }
    }
  }, []);

  if (!isMounted) return null;

  return (
    <div style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', height: '100%', alignItems: 'flex-start', flexWrap: 'wrap' }} className="print-container">
      
      {/* Left Pane: Controls / Form (Hidden during print) */}
      <div style={{ flex: '1 1 400px', minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="hide-on-print">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{ backgroundColor: '#dcfce7', padding: '0.5rem', borderRadius: '8px', color: '#10b981' }}>
            <FileText size={24} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e293b' }}>
            Qiymət Təklifi Yarat
          </h1>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#334155', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Əsas Məlumatlar</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Firma / Müştəri Adı <span style={{color: '#ef4444'}}>*</span></label>
              <input type="text" value={quoteData.companyName} onChange={(e) => updateQuoteData('companyName', e.target.value)} style={inputStyle} />
            </div>
            <FormGroup label="Tarix" type="date" value={quoteData.date} onChange={(e) => updateQuoteData('date', e.target.value)} />
            <FormGroup label="Sənəd Nömrəsi" value={quoteData.docNo} onChange={(e) => updateQuoteData('docNo', e.target.value)} />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Ünvan</label>
            <textarea rows={2} value={quoteData.address} onChange={(e) => updateQuoteData('address', e.target.value)} style={inputStyle}></textarea>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Giriş Mətni</label>
            <input type="text" value={quoteData.greeting} onChange={(e) => updateQuoteData('greeting', e.target.value)} style={inputStyle} />
          </div>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#334155' }}>Məhsullar</h3>
            <button onClick={addRow} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}><Plus size={16}/> Sətir Əlavə Et</button>
          </div>

          {rows.map((row, index) => (
            <div key={row.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', position: 'relative' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" placeholder="Məhsul adı*" value={row.name} onChange={(e) => updateRow(row.id, 'name', e.target.value)} style={{ ...inputStyle, flex: 2 }} />
                <input type="number" placeholder="Miqdar" value={row.quantity} onChange={(e) => updateRow(row.id, 'quantity', e.target.value)} style={{ ...inputStyle, flex: 1, textAlign: 'center' }} />
                <input type="number" placeholder="Qiymət" value={row.price} onChange={(e) => updateRow(row.id, 'price', e.target.value)} style={{ ...inputStyle, flex: 1, textAlign: 'right' }} />
                <button onClick={() => removeRow(row.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem' }}><Trash2 size={18}/></button>
              </div>
              <input type="text" placeholder="Açıqlama" value={row.desc} onChange={(e) => updateRow(row.id, 'desc', e.target.value)} style={{ ...inputStyle, fontSize: '0.85rem' }} />
            </div>
          ))}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Yekun Açıqlama / Şərtlər</label>
            <textarea rows={2} value={quoteData.note} onChange={(e) => updateQuoteData('note', e.target.value)} style={inputStyle}></textarea>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Yekun Mətn</label>
            <textarea rows={2} value={quoteData.footerGreeting} onChange={(e) => updateQuoteData('footerGreeting', e.target.value)} style={inputStyle}></textarea>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Göndərən (İmza)</label>
            <textarea rows={2} value={quoteData.sender} onChange={(e) => updateQuoteData('sender', e.target.value)} style={inputStyle}></textarea>
          </div>
        </div>
      </div>

      {/* Right Pane: Live Document Preview */}
      <div className="print-pane-wrapper" style={{ flex: '1.2 1 500px', minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'sticky', top: '1.5rem' }}>
        
        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap' }} className="hide-on-print">
          <button onClick={handleSend} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', backgroundColor: '#e0e7ff', border: '1px solid #c7d2fe', borderRadius: '8px', color: '#4f46e5', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#c7d2fe'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = '#e0e7ff'; }}
          >
            <Send size={18} /> Göndər
          </button>
          <button onClick={handlePrint} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#475569', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#94a3b8'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
          >
            <Printer size={18} /> Çap Et
          </button>
          <button onClick={handleDownloadPDF} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#475569', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.borderColor = '#94a3b8'; }}
            onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.borderColor = '#cbd5e1'; }}
          >
            <Download size={18} /> PDF Yüklə
          </button>
          <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.5rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)', transition: 'transform 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Save size={18} /> Yadda Saxla
          </button>
        </div>

        <div 
          id="quote-document"
          className="print-paper"
          style={{ 
            backgroundColor: 'white', 
            padding: '20mm', // exact A4 standard margins
            borderRadius: '4px', 
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
            minHeight: '297mm', // Exact A4 height
            width: '100%', 
            maxWidth: '210mm', // Max A4 width for screen
            boxSizing: 'border-box',
            margin: '0 auto', // Centered in screen
            color: 'black',
            fontFamily: '"Times New Roman", Times, serif',
            overflowX: 'hidden'
          }}
        >
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '2px solid black', paddingBottom: '1rem' }}>
            <h1 style={{ fontSize: '24px', letterSpacing: '2px', fontWeight: 'bold' }}>TƏKLİF FORMASI</h1>
          </div>

          {/* Meta Data */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', fontSize: '14px', lineHeight: '1.6' }}>
            <div>
              <strong style={{ fontSize: '16px' }}>{quoteData.companyName || '____________________'}</strong><br />
              <div style={{ whiteSpace: 'pre-line' }}>{quoteData.address || '____________________\n____________________'}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div><strong>Tarix:</strong> {quoteData.date.split('-').reverse().join('.')}</div>
              <div><strong>Sənəd No:</strong> {quoteData.docNo}</div>
            </div>
          </div>

          <div style={{ marginBottom: '2rem', fontSize: '14px', fontStyle: 'italic' }}>
            {quoteData.greeting}
          </div>

          {/* Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem', fontSize: '14px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid black', padding: '0.5rem', backgroundColor: '#f3f4f6', width: '40px' }}>#</th>
                <th style={{ border: '1px solid black', padding: '0.5rem', backgroundColor: '#f3f4f6', textAlign: 'left' }}>Açıqlama</th>
                <th style={{ border: '1px solid black', padding: '0.5rem', backgroundColor: '#f3f4f6', width: '100px', textAlign: 'center' }}>Miqdar</th>
                <th style={{ border: '1px solid black', padding: '0.5rem', backgroundColor: '#f3f4f6', width: '120px', textAlign: 'right' }}>Vahid Qiymət<br/><span style={{fontSize:'10px'}}>(ƏDV Daxil)</span></th>
                <th style={{ border: '1px solid black', padding: '0.5rem', backgroundColor: '#f3f4f6', width: '120px', textAlign: 'right' }}>Toplam<br/><span style={{fontSize:'10px'}}>(ƏDV Daxil)</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr key={row.id}>
                  <td style={{ border: '1px solid black', padding: '0.5rem', textAlign: 'center' }}>{index + 1}</td>
                  <td style={{ border: '1px solid black', padding: '0.5rem' }}>
                    <strong>{row.name}</strong>
                    {row.desc && <div style={{ fontSize: '12px', color: '#4b5563', marginTop: '4px' }}>{row.desc}</div>}
                  </td>
                  <td style={{ border: '1px solid black', padding: '0.5rem', textAlign: 'center' }}>{row.quantity} Ədəd</td>
                  <td style={{ border: '1px solid black', padding: '0.5rem', textAlign: 'right' }}>{Number(row.price).toLocaleString('az-AZ', { minimumFractionDigits: 2 })} ₼</td>
                  <td style={{ border: '1px solid black', padding: '0.5rem', textAlign: 'right' }}>{(Number(row.quantity) * Number(row.price)).toLocaleString('az-AZ', { minimumFractionDigits: 2 })} ₼</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={4} style={{ border: '1px solid black', padding: '0.5rem', textAlign: 'right', fontWeight: 'bold' }}>Ümumi Yekun :</td>
                <td style={{ border: '1px solid black', padding: '0.5rem', textAlign: 'right', fontWeight: 'bold' }}>{grandTotal.toLocaleString('az-AZ', { minimumFractionDigits: 2 })} ₼</td>
              </tr>
            </tfoot>
          </table>

          {/* Footer Note */}
          <div style={{ marginTop: '2rem' }}>
            <strong style={{ fontSize: '14px', textDecoration: 'underline' }}>Açıqlama / Şərtlər:</strong>
            <div style={{ fontSize: '14px', marginTop: '0.5rem', whiteSpace: 'pre-line' }}>
              {quoteData.note}
            </div>
          </div>

          {/* Final Greeting & Sender */}
          <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontSize: '14px', whiteSpace: 'pre-line', lineHeight: '1.6', flex: '1', paddingRight: '2rem' }}>
              {quoteData.footerGreeting}
            </div>
            
            <div style={{ fontSize: '14px', whiteSpace: 'pre-line', textAlign: 'right', fontWeight: 'bold' }}>
              {quoteData.sender}
            </div>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body, html {
            margin: 0 !important;
            padding: 0 !important;
            background-color: white !important;
          }
          body * {
            visibility: hidden;
          }
          .hide-on-print {
            display: none !important;
          }
          #quote-document, #quote-document * {
            visibility: visible !important;
          }
          #quote-document {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            right: 0 !important;
            margin: 0 auto !important; /* Forces centering */
            padding: 15mm !important;
            width: 210mm !important;
            height: 297mm !important;
            transform: none !important;
            box-sizing: border-box !important;
            box-shadow: none !important;
          }
        }
      `}} />
    </div>
  );
}

const inputStyle = {
  padding: '0.8rem 1rem', 
  borderRadius: '8px', 
  border: '1px solid #cbd5e1', 
  outline: 'none', 
  fontSize: '0.95rem', 
  color: '#0f172a', 
  fontWeight: 500, 
  backgroundColor: '#f8fafc', 
  transition: 'all 0.2s',
  width: '100%'
};

function FormGroup({ label, type = "text", value, onChange }: any) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>{label}</label>
      <input 
        type={type} 
        value={value}
        onChange={onChange}
        style={inputStyle} 
        onFocus={(e) => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.backgroundColor = '#fff'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)' }}
        onBlur={(e) => { e.currentTarget.style.borderColor = '#cbd5e1'; e.currentTarget.style.backgroundColor = '#f8fafc'; e.currentTarget.style.boxShadow = 'none' }}
      />
    </div>
  );
}

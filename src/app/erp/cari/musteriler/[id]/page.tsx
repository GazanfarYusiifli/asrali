'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, MessageSquare, Send, Link as LinkIcon, 
  CreditCard, Download, CalendarDays, FileText, Plus,
  Camera, TrendingUp, TrendingDown, Clock, Search, X, CheckCircle, FileEdit
} from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';

export default function CustomerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params.id as string;
  
  const [customer, setCustomer] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  
  // Modals
  const [modalType, setModalType] = useState<'tahsilat' | 'odeme' | 'fatura' | 'sms' | 'odemeIste' | 'linkGonder' | 'taksit' | 'ekstre' | 'notEkle' | null>(null);
  
  const [form, setForm] = useState({
    tarih: new Date().toISOString().split('T')[0],
    belgeNo: '',
    teslim: '',
    aciklama: '',
    mebleg: '',
    kassa: 'Ana Kassa',
    // SMS
    smsMesaj: '',
    // Taksit
    taksitMebleg: '',
    odemeSekli: 'Nəğd',
    ilkTaksitTarixi: new Date().toISOString().split('T')[0],
    pesinAlinan: '0',
    vadeFerqi: '0',
    taksitBasligi: '',
    // Ekstre
    baslangicTarixi: '',
    bitisTarixi: new Date().toISOString().split('T')[0],
    goruntulemeNovu: 'Bütün Hərəkətlər',
    gonderimSekli: 'Göstər',
    // Not
    qeydMetni: ''
  });
  
  const [showToast, setShowToast] = useState('');

  useEffect(() => {
    if (!customerId) return;
    
    // Load Customer
    const localCustomers = JSON.parse(getAppStorage('erp_customers') || '[]');
    const found = localCustomers.find((c: any) => c.id === customerId);
    setCustomer(found);

    // Load Transactions
    const localTx = JSON.parse(getAppStorage('erp_customer_transactions') || '[]');
    const cusTx = localTx.filter((t: any) => t.cariId === customerId);
    // Sort by date
    cusTx.sort((a: any, b: any) => new Date(a.tarih).getTime() - new Date(b.tarih).getTime());
    setTransactions(cusTx);
  }, [customerId]);

  const triggerToast = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(''), 3000);
    setModalType(null);
  };

  const handleActionClick = (type: any) => {
    // Current total debt
    let currentBakiye = 0;
    if (customer?.dovrQaligi > 0) {
      if (customer.dovrQaliqNovu === 'Borc') currentBakiye += Number(customer.dovrQaligi);
      else currentBakiye -= Number(customer.dovrQaligi);
    }
    transactions.forEach(t => {
      currentBakiye += (Number(t.borc) || 0) - (Number(t.alinan) || 0);
    });

    // Set first day of month for ekstre
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];

    setForm(prev => ({
      ...prev,
      tarih: new Date().toISOString().split('T')[0],
      belgeNo: Date.now().toString().slice(-6),
      teslim: '',
      aciklama: type === 'tahsilat' ? 'Aldığım Təhsilat' : type === 'odeme' ? 'Etdiyim Ödəniş' : 'Yeni Sənəd',
      mebleg: '',
      kassa: 'Ana Kassa',
      smsMesaj: customer?.hesabAdi ? `Hörmətli ${customer.hesabAdi}, hesabınızla bağlı...` : '',
      taksitMebleg: currentBakiye > 0 ? currentBakiye.toString() : '',
      baslangicTarixi: firstDay,
      qeydMetni: ''
    }));
    setModalType(type);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (modalType === 'sms') {
      triggerToast('SMS müştəriyə uğurla göndərildi!');
      return;
    }
    if (modalType === 'notEkle') {
      triggerToast('Müştəri qeydi uğurla əlavə edildi!');
      return;
    }
    if (modalType === 'ekstre') {
      if (form.gonderimSekli === 'Çap Et (Yazdır)') {
        window.print();
        setModalType(null);
      } else {
        triggerToast(`${form.gonderimSekli} əməliyyatı uğurla icra edildi!`);
      }
      return;
    }
    if (modalType === 'taksit') {
      triggerToast(`Müştəri borcu uğurla taksitləndirildi!`);
      return;
    }

    const mebleg = Number(form.mebleg);
    let borc = 0;
    let alinan = 0;
    
    if (modalType === 'tahsilat') {
      alinan = mebleg; // We receive money
    } else if (modalType === 'odeme') {
      borc = mebleg; // We pay them
    } else if (modalType === 'fatura') {
      borc = mebleg; // We sell them something
    }

    const newTx = {
      id: Date.now().toString(),
      cariId: customerId,
      tarih: form.tarih,
      belgeNo: form.belgeNo,
      teslim: form.kassa, // using teslim column for kassa in tahsilat/odeme visually
      aciklama: form.aciklama,
      borc,
      alinan
    };

    const updatedTx = [...transactions, newTx];
    updatedTx.sort((a: any, b: any) => new Date(a.tarih).getTime() - new Date(b.tarih).getTime());
    setTransactions(updatedTx);

    // Save to global
    const globalTx = JSON.parse(getAppStorage('erp_customer_transactions') || '[]');
    globalTx.push(newTx);
    setAppStorage('erp_customer_transactions', JSON.stringify(globalTx));

    triggerToast('Əməliyyat uğurla qeydə alındı!');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    triggerToast('Link kopyalandı!');
  };

  const closeModal = () => setModalType(null);

  if (!customer) return <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>Yüklənir və ya müştəri tapılmadı...</div>;

  // Calculate Running Balances
  let currentBakiye = 0;
  if (customer.dovrQaligi > 0) {
    if (customer.dovrQaliqNovu === 'Borc') currentBakiye += Number(customer.dovrQaligi);
    else currentBakiye -= Number(customer.dovrQaligi);
  }

  const processedTransactions = transactions.map(t => {
    currentBakiye += (Number(t.borc) || 0) - (Number(t.alinan) || 0);
    return {
      ...t,
      bakiye: Math.abs(currentBakiye),
      bakiyeDurum: currentBakiye > 0 ? '(B)' : currentBakiye < 0 ? '(A)' : ''
    };
  });

  const isDebt = currentBakiye >= 0;

  return (
    <div style={{ padding: '2rem', height: '100%', backgroundColor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: '1.5rem', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      
      {/* Toast Notification */}
      {showToast && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', backgroundColor: '#10b981', color: 'white', padding: '1rem 1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 9999, animation: 'slideIn 0.3s ease-out' }}>
          <CheckCircle size={20}/> {showToast}
        </div>
      )}

      {/* Top Header & Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }} className="no-print">
        <Link href="/erp/cari/musteriler" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', backgroundColor: 'white', borderRadius: '10px', border: '1px solid #e2e8f0', color: '#64748b', cursor: 'pointer', textDecoration: 'none' }}>
          <ArrowLeft size={20} />
        </Link>
        <div style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600 }}>Cari Hesablar / <span style={{ color: '#0f172a' }}>{customer.hesabAdi}</span></div>
      </div>

      {/* Profile Header */}
      <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '1.5rem', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, color: '#94a3b8' }}>
              {customer.hesabAdi.charAt(0)}
            </div>
            <button className="no-print" style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: 'white', border: '1px solid #cbd5e1', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#475569' }}>
              <Camera size={14}/>
            </button>
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>{customer.hesabAdi}</h1>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', color: '#64748b', fontSize: '0.85rem' }}>
              {customer.mobil && <span>📱 {customer.mobil}</span>}
              {customer.voen && <span>VÖEN: {customer.voen}</span>}
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'right', padding: '1rem', backgroundColor: isDebt ? '#fef2f2' : '#f0fdf4', borderRadius: '12px', border: `1px solid ${isDebt ? '#fecaca' : '#bbf7d0'}` }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: isDebt ? '#ef4444' : '#10b981', textTransform: 'uppercase', marginBottom: '4px' }}>Hesab Vəziyyəti</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: isDebt ? '#dc2626' : '#059669', letterSpacing: '-0.5px' }}>
            {Math.abs(currentBakiye).toLocaleString('az-AZ', {minimumFractionDigits:2})} <span style={{fontSize:'1rem'}}>₼</span>
          </div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: isDebt ? '#dc2626' : '#059669' }}>
            {isDebt ? 'Borclu (Bize ödəyəcək)' : 'Alacaqlı (Biz ödəyəcəyik)'}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="no-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <SummaryCard title="Qaimə Qalığı" amount="0.00" icon={<FileText size={20}/>} />
        <SummaryCard title="Çek Qalığı" amount="0.00" icon={<CreditCard size={20}/>} />
        <SummaryCard title="Veksəl Qalığı" amount="0.00" icon={<FileText size={20}/>} />
        <div style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>Ortalama Təhsilat</div>
            <div style={{ color: '#4f46e5' }}><Clock size={20}/></div>
          </div>
          <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => triggerToast("Detallı məlumat yoxdur")} style={{ flex: 1, padding: '0.4rem', border: '1px solid #e2e8f0', borderRadius: '6px', background: 'white', fontSize: '0.75rem', fontWeight: 700, color: '#3b82f6', cursor: 'pointer' }}>Göstər</button>
            <button onClick={() => triggerToast("Gecikmə yoxdur")} style={{ flex: 1, padding: '0.4rem', border: '1px solid #e2e8f0', borderRadius: '6px', background: 'white', fontSize: '0.75rem', fontWeight: 700, color: '#ef4444', cursor: 'pointer' }}>Gecikmə Hesabla</button>
          </div>
        </div>
      </div>

      {/* Action Buttons Toolbar */}
      <div className="no-print" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', backgroundColor: 'white', padding: '0.75rem', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
        <ActionBtn icon={<MessageSquare size={16}/>} label="SMS Göndər" onClick={()=>handleActionClick('sms')} />
        <ActionBtn icon={<Send size={16}/>} label="Ödəniş Tələb Et" onClick={()=>handleActionClick('odemeIste')} />
        <ActionBtn icon={<LinkIcon size={16}/>} label="Sifariş Linki" onClick={()=>handleActionClick('linkGonder')} />
        <div style={{ width: '1px', backgroundColor: '#e2e8f0', margin: '0 0.5rem' }}></div>
        <ActionBtn icon={<TrendingDown size={16}/>} label="Etdiyim Ödəniş" onClick={()=>handleActionClick('odeme')} color="#ef4444" bg="#fee2e2" />
        <ActionBtn icon={<TrendingUp size={16}/>} label="Aldığım Təhsilat" onClick={()=>handleActionClick('tahsilat')} color="#10b981" bg="#dcfce7" />
        <ActionBtn icon={<CalendarDays size={16}/>} label="Taksitləndir" onClick={()=>handleActionClick('taksit')} color="#f59e0b" bg="#fef3c7" />
        <div style={{ width: '1px', backgroundColor: '#e2e8f0', margin: '0 0.5rem' }}></div>
        <ActionBtn icon={<Download size={16}/>} label="Hesab Çıxarışı" onClick={()=>handleActionClick('ekstre')} />
        <ActionBtn icon={<Plus size={16}/>} label="Yeni Sənəd" onClick={()=>handleActionClick('fatura')} color="#4f46e5" bg="#e0e7ff" />
        <ActionBtn icon={<FileEdit size={16}/>} label="Qeyd Əlavə Et" onClick={()=>handleActionClick('notEkle')} />
      </div>

      {/* Transaction Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }} className="no-print">
          <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b', fontWeight: 800 }}>Hesab Hərəkətləri (Ekstre)</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
              <input type="text" placeholder="Açıqlama ilə axtar..." style={{ padding: '0.5rem 0.5rem 0.5rem 2rem', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '0.85rem', outline: 'none' }} />
            </div>
          </div>
        </div>
        <div style={{ overflowX: 'auto', flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '1000px' }}>
            <thead style={{ backgroundColor: '#f1f5f9', position: 'sticky', top: 0, borderBottom: '2px solid #e2e8f0' }}>
              <tr>
                <th style={thStyle}>Tarix</th>
                <th style={thStyle}>Sənəd No</th>
                <th style={thStyle}>Təslim / Kassa</th>
                <th style={{...thStyle, width: '30%'}}>Açıqlama</th>
                <th style={{...thStyle, textAlign: 'right'}}>Borc (Satış)</th>
                <th style={{...thStyle, textAlign: 'right'}}>Alınan (Təhsilat)</th>
                <th style={{...thStyle, textAlign: 'right'}}>Qalıq (Bakiye)</th>
                <th style={{...thStyle, width: '40px'}}></th>
              </tr>
            </thead>
            <tbody>
              {customer.dovrQaligi > 0 && (
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <td style={tdStyle} colSpan={4}><span style={{ fontWeight: 600, color: '#64748b' }}>Əvvəlki Qalıq / Dövr Qalığı</span></td>
                  <td style={{...tdStyle, textAlign: 'right'}}>{customer.dovrQaliqNovu === 'Borc' ? `${Number(customer.dovrQaligi).toLocaleString('az-AZ',{minimumFractionDigits:2})} ₼` : '-'}</td>
                  <td style={{...tdStyle, textAlign: 'right'}}>{customer.dovrQaliqNovu === 'Alacaq' ? `${Number(customer.dovrQaligi).toLocaleString('az-AZ',{minimumFractionDigits:2})} ₼` : '-'}</td>
                  <td style={{...tdStyle, textAlign: 'right', fontWeight: 800, color: '#0f172a'}}>{Number(customer.dovrQaligi).toLocaleString('az-AZ',{minimumFractionDigits:2})} ₼</td>
                  <td style={{...tdStyle, fontWeight: 800, color: customer.dovrQaliqNovu === 'Borc' ? '#ef4444' : '#10b981'}}>{customer.dovrQaliqNovu === 'Borc' ? '(B)' : '(A)'}</td>
                </tr>
              )}
              {processedTransactions.length === 0 && customer.dovrQaligi == 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8', fontStyle: 'italic' }}>Heç bir hesab hərəkəti yoxdur. Yuxarıdakı düymələrlə yeni əməliyyat daxil edin.</td></tr>
              )}
              {processedTransactions.map((row, idx) => (
                <tr key={row.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={tdStyle}>{new Date(row.tarih).toLocaleDateString('az-AZ')}</td>
                  <td style={tdStyle}>{row.belgeNo}</td>
                  <td style={tdStyle}>{row.teslim || '-'}</td>
                  <td style={{...tdStyle, fontWeight: 600}}>{row.aciklama}</td>
                  <td style={{...tdStyle, textAlign: 'right', color: row.borc > 0 ? '#ef4444' : '#94a3b8'}}>{row.borc > 0 ? `${Number(row.borc).toLocaleString('az-AZ',{minimumFractionDigits:2})} ₼` : '-'}</td>
                  <td style={{...tdStyle, textAlign: 'right', color: row.alinan > 0 ? '#10b981' : '#94a3b8'}}>{row.alinan > 0 ? `${Number(row.alinan).toLocaleString('az-AZ',{minimumFractionDigits:2})} ₼` : '-'}</td>
                  <td style={{...tdStyle, textAlign: 'right', fontWeight: 800, color: '#0f172a'}}>{row.bakiye.toLocaleString('az-AZ',{minimumFractionDigits:2})} ₼</td>
                  <td style={{...tdStyle, fontWeight: 800, color: row.bakiyeDurum === '(B)' ? '#ef4444' : row.bakiyeDurum === '(A)' ? '#10b981' : '#94a3b8'}}>{row.bakiyeDurum}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1. TAHSILAT & ODEME & FATURA MODAL */}
      {(modalType === 'tahsilat' || modalType === 'odeme' || modalType === 'fatura') && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(4px)', padding: '2rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', width: '100%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
              <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.25rem', fontWeight: 800 }}>
                {modalType === 'tahsilat' ? 'ALDIĞIM TƏHSİLAT' : modalType === 'odeme' ? 'ETDİYİM ÖDƏNİŞ' : 'YENİ SƏNƏD GİRİŞİ'}
              </h2>
              <button type="button" onClick={closeModal} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={18}/></button>
            </div>
            <form onSubmit={handleFormSubmit} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{...labelStyle, color: modalType === 'tahsilat' ? '#10b981' : '#ef4444'}}>Məbləğ (₼) *</label>
                <input type="number" step="any" value={form.mebleg} onChange={e=>setForm({...form, mebleg: e.target.value})} style={{...inputStyle, fontSize: '1.5rem', fontWeight: 800, color: modalType === 'tahsilat' ? '#10b981' : '#ef4444', borderColor: modalType === 'tahsilat' ? '#6ee7b7' : '#fca5a5'}} required placeholder="0.00" />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={labelStyle}>Kassa / Hesab</label>
                <select value={form.kassa} onChange={e=>setForm({...form, kassa: e.target.value})} style={inputStyle}>
                  <option value="Ana Kassa">Ana Kassa</option>
                  <option value="Bank Hesabı">Bank Hesabı</option>
                  <option value="POS Terminal">POS Terminal</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <label style={labelStyle}>{modalType === 'tahsilat' ? 'Təhsilat Tarixi' : modalType === 'odeme' ? 'Ödəniş Tarixi' : 'Tarix'}</label>
                  <input type="date" value={form.tarih} onChange={e=>setForm({...form, tarih: e.target.value})} style={inputStyle} required />
                </div>
                {modalType === 'fatura' && (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={labelStyle}>Sənəd (Belgə) No</label>
                    <input type="text" value={form.belgeNo} onChange={e=>setForm({...form, belgeNo: e.target.value})} style={inputStyle} required />
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={labelStyle}>Açıqlama</label>
                <input type="text" value={form.aciklama} onChange={e=>setForm({...form, aciklama: e.target.value})} style={inputStyle} required />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={closeModal} style={{ flex: 1, padding: '1rem', backgroundColor: '#f1f5f9', border: 'none', borderRadius: '12px', color: '#475569', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>İmtina</button>
                <button type="submit" style={{ flex: 2, padding: '1rem', backgroundColor: modalType === 'tahsilat' ? '#10b981' : modalType === 'odeme' ? '#ef4444' : '#4f46e5', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer' }}>Yadda Saxla</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. TAKSİTLENDİR MODAL */}
      {modalType === 'taksit' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(4px)', padding: '2rem', overflowY: 'auto' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', width: '100%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden', margin: 'auto' }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
              <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.1rem', fontWeight: 800 }}>MÜŞTƏRİNİN BORCUNU TAKSİTLƏNDİRİN</h2>
              <button type="button" onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} color="#64748b"/></button>
            </div>
            <form onSubmit={handleFormSubmit} style={{ padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Taksitləndiriləcək Məbləğ (₼)</label>
                <input type="number" step="any" value={form.taksitMebleg} onChange={e=>setForm({...form, taksitMebleg: e.target.value})} style={{...inputStyle, marginTop: '0.5rem', fontWeight: 800, color: '#ef4444'}} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Ödəniş Şəkli</label>
                  <select value={form.odemeSekli} onChange={e=>setForm({...form, odemeSekli: e.target.value})} style={{...inputStyle, marginTop: '0.5rem'}}>
                    <option value="Nəğd">Nəğd</option>
                    <option value="Banka">Banka (Köçürmə)</option>
                    <option value="Kart">Kredit Kartı</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>İlk Taksit Tarixi</label>
                  <input type="date" value={form.ilkTaksitTarixi} onChange={e=>setForm({...form, ilkTaksitTarixi: e.target.value})} style={{...inputStyle, marginTop: '0.5rem'}} required />
                </div>
                <div>
                  <label style={labelStyle}>Peşin Alınan (₼)</label>
                  <input type="number" step="any" value={form.pesinAlinan} onChange={e=>setForm({...form, pesinAlinan: e.target.value})} style={{...inputStyle, marginTop: '0.5rem'}} />
                </div>
                <div>
                  <label style={labelStyle}>Vade Fərqi (%)</label>
                  <input type="number" step="any" value={form.vadeFerqi} onChange={e=>setForm({...form, vadeFerqi: e.target.value})} style={{...inputStyle, marginTop: '0.5rem'}} />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Taksitləndirmə Başlığı</label>
                <input type="text" value={form.taksitBasligi} onChange={e=>setForm({...form, taksitBasligi: e.target.value})} style={{...inputStyle, marginTop: '0.5rem'}} placeholder="Məs: Qış Kampaniyası Taksitləri" required />
              </div>
              
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '1rem', borderRadius: '10px', marginTop: '0.5rem' }}>
                <div style={{ fontWeight: 800, color: '#ef4444', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp size={16}/> Gecikmə zənninin hesablanması BAĞLIDIR
                </div>
                <div style={{ fontSize: '0.75rem', color: '#7f1d1d', marginTop: '0.2rem' }}>
                  Sistem Ayarları &gt; Ayarlar menyusundan istəsəniz aktiv edə bilərsiniz.
                </div>
              </div>
              
              <button type="submit" style={{ padding: '1rem', backgroundColor: '#f59e0b', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginTop: '1rem' }}>Taksitləri Yarat</button>
            </form>
          </div>
        </div>
      )}

      {/* 3. EKSTRE MODAL */}
      {modalType === 'ekstre' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(4px)', padding: '2rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', width: '100%', maxWidth: '500px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
              <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.1rem', fontWeight: 800 }}>HESAB ÇIXARIŞI (EKSTRE) YARAT</h2>
              <button type="button" onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} color="#64748b"/></button>
            </div>
            <form onSubmit={handleFormSubmit} style={{ padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Başlanğıc Tarixi</label>
                  <input type="date" value={form.baslangicTarixi} onChange={e=>setForm({...form, baslangicTarixi: e.target.value})} style={{...inputStyle, marginTop: '0.5rem'}} required />
                </div>
                <div>
                  <label style={labelStyle}>Bitiş Tarixi</label>
                  <input type="date" value={form.bitisTarixi} onChange={e=>setForm({...form, bitisTarixi: e.target.value})} style={{...inputStyle, marginTop: '0.5rem'}} required />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Görüntüləmə Növü</label>
                <select value={form.goruntulemeNovu} onChange={e=>setForm({...form, goruntulemeNovu: e.target.value})} style={{...inputStyle, marginTop: '0.5rem'}}>
                  <option value="Bütün Hərəkətlər">Bütün Hərəkətlər</option>
                  <option value="Yalnız Satışlar">Yalnız Satışlar</option>
                  <option value="Yalnız Təhsilatlar">Yalnız Ödəniş və Təhsilatlar</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Göndərim Şəkli</label>
                <select value={form.gonderimSekli} onChange={e=>setForm({...form, gonderimSekli: e.target.value})} style={{...inputStyle, marginTop: '0.5rem', backgroundColor: '#f8fafc', fontWeight: 700, color: '#4f46e5'}}>
                  <option value="Göstər">Göstər</option>
                  <option value="Çap Et (Yazdır)">Çap Et (Yazdır)</option>
                  <option value="PDF olaraq Yüklə">PDF olaraq Yüklə</option>
                  <option value="Excel olaraq Yüklə">Excel olaraq Yüklə</option>
                  <option value="SMS olaraq Göndər">SMS olaraq Göndər (Ödənişsiz)</option>
                  <option value="E-Poçt olaraq Göndər">E-Poçt olaraq Göndər</option>
                  <option value="Whatsapp ilə Göndər">Whatsapp ilə Göndər</option>
                </select>
              </div>
              <button type="submit" style={{ padding: '1rem', backgroundColor: '#1e293b', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginTop: '0.5rem' }}>Ekstre Yarat / Göndər</button>
            </form>
          </div>
        </div>
      )}

      {/* 4. SMS MODAL */}
      {modalType === 'sms' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(4px)', padding: '2rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', width: '100%', maxWidth: '400px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
              <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.25rem', fontWeight: 800 }}>SMS GÖNDƏR</h2>
              <button type="button" onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} color="#64748b"/></button>
            </div>
            <form onSubmit={handleFormSubmit} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Mobil Nömrə</label>
                <div style={{ padding: '0.8rem', backgroundColor: '#f1f5f9', borderRadius: '10px', marginTop: '0.5rem', fontWeight: 600, color: '#475569' }}>
                  {customer.mobil || 'Nömrə qeyd edilməyib'}
                </div>
              </div>
              <div>
                <label style={labelStyle}>Mesajın Mətni</label>
                <textarea value={form.smsMesaj} onChange={e=>setForm({...form, smsMesaj: e.target.value})} style={{...inputStyle, minHeight: '120px', marginTop: '0.5rem'}} required />
              </div>
              <button type="submit" disabled={!customer.mobil} style={{ padding: '1rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginTop: '1rem', opacity: customer.mobil ? 1 : 0.5 }}>Göndər</button>
            </form>
          </div>
        </div>
      )}

      {/* 5. LINK/ODEME ISTE MODAL */}
      {(modalType === 'odemeIste' || modalType === 'linkGonder') && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(4px)', padding: '2rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', width: '100%', maxWidth: '400px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
              <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.25rem', fontWeight: 800 }}>{modalType === 'odemeIste' ? 'ÖDƏNİŞ TƏLƏB ET' : 'B2B SİFARİŞ LİNKİ'}</h2>
              <button type="button" onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} color="#64748b"/></button>
            </div>
            <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem', lineHeight: '1.5' }}>
                Müştəriyə aşağıdakı linki göndərərək {modalType === 'odemeIste' ? 'onlayn ödəniş etməsini' : 'onlayn sifariş verməsini'} təmin edə bilərsiniz.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#f1f5f9', padding: '0.5rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ flex: 1, padding: '0 0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#3b82f6', fontWeight: 600, fontSize: '0.9rem' }}>
                  {modalType === 'odemeIste' ? `https://pay.erp.az/t/${customer.id}` : `https://b2b.erp.az/o/${customer.id}`}
                </div>
                <button onClick={() => copyToClipboard(modalType === 'odemeIste' ? `https://pay.erp.az/t/${customer.id}` : `https://b2b.erp.az/o/${customer.id}`)} style={{ padding: '0.6rem 1rem', backgroundColor: '#1e293b', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Kopyala</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. NOT EKLE MODAL */}
      {modalType === 'notEkle' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, backdropFilter: 'blur(4px)', padding: '2rem' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '20px', width: '100%', maxWidth: '400px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', overflow: 'hidden' }}>
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' }}>
              <h2 style={{ margin: 0, color: '#1e293b', fontSize: '1.25rem', fontWeight: 800 }}>QEYD ƏLAVƏ ET</h2>
              <button type="button" onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} color="#64748b"/></button>
            </div>
            <form onSubmit={handleFormSubmit} style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={labelStyle}>Müştəri haqqında xüsusi qeyd</label>
                <textarea value={form.qeydMetni} onChange={e=>setForm({...form, qeydMetni: e.target.value})} style={{...inputStyle, minHeight: '120px', marginTop: '0.5rem'}} required placeholder="Məsələn: Bu müştəri zəngləri 17:00-dan sonra açır..." />
              </div>
              <button type="submit" style={{ padding: '1rem', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', marginTop: '1rem' }}>Qeydi Yadda Saxla</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

// Subcomponents
const SummaryCard = ({ title, amount, icon }: { title: string, amount: string, icon: any }) => {
  return (
  <div style={{ backgroundColor: 'white', padding: '1.25rem', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>{title}</div>
      <div style={{ color: '#94a3b8' }}>{icon}</div>
    </div>
    <div style={{ marginTop: '0.75rem', fontSize: '1.4rem', fontWeight: 800, color: '#1e293b' }}>
      {amount} <span style={{fontSize:'0.9rem', color:'#94a3b8'}}>₼</span>
    </div>
  </div>
)};

const ActionBtn = ({ icon, label, onClick, color = '#475569', bg = '#f8fafc' }: { icon: any, label: string, onClick: ()=>void, color?: string, bg?: string }) => (
  <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.8rem', backgroundColor: bg, border: '1px solid #e2e8f0', borderRadius: '8px', color: color, fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', transition: 'filter 0.2s' }} onMouseOver={e=>e.currentTarget.style.filter='brightness(0.95)'} onMouseOut={e=>e.currentTarget.style.filter='brightness(1)'}>
    {icon} {label}
  </button>
);

// Styles
const thStyle: React.CSSProperties = { padding: '1rem', textAlign: 'left', color: '#64748b', fontWeight: 800, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' };
const tdStyle: React.CSSProperties = { padding: '1rem', color: '#334155', fontSize: '0.9rem' };
const labelStyle: React.CSSProperties = { fontSize: '0.85rem', fontWeight: 700, color: '#475569' };
const inputStyle: React.CSSProperties = { padding: '0.8rem', borderRadius: '10px', border: '1px solid #cbd5e1', outline: 'none', width: '100%', fontSize: '0.95rem', color: '#1e293b' };

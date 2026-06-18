'use client'
import React, { useState } from 'react';
import { Save, CheckCircle, X, ChevronLeft, Calendar, FileDigit, Building2, User, Search } from 'lucide-react';
import { addDocument } from '../../utils/accounting';
import { useRouter } from 'next/navigation';
import LookupModal from './LookupModal';
import { CatalogName, CatalogItem } from '../../utils/masterData';

export interface DocumentRow {
  id: string;
  catalogItem?: CatalogItem;
  desc: string;
  qty: number;
  price: number;
  amount: number;
}

interface DocumentLayoutProps {
  title: string;
  type: string; // 'CASH', 'SERVICE', 'BANK', 'WAREHOUSE'
  prefix: string; // e.g. 'KM'
  counterpartyCatalog?: CatalogName; // e.g. 'counterparties', 'patients', 'employees'
  children: (props: { 
    rows: DocumentRow[], 
    setRows: React.Dispatch<React.SetStateAction<DocumentRow[]>>,
    totalAmount: number
  }) => React.ReactNode;
  onPost: (totalAmount: number, docName: string, rows: DocumentRow[], counterparty?: CatalogItem) => void;
  onClose: () => void;
}

export default function DocumentLayout({ title, type, prefix, counterpartyCatalog, children, onPost, onClose }: DocumentLayoutProps) {
  const router = useRouter();
  const [docNumber, setDocNumber] = useState(prefix + '-' + Math.floor(1000 + Math.random() * 9000));
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [org, setOrg] = useState('Mərkəzi Xəstəxana');
  
  // Counterparty (Header Lookup)
  const [counterparty, setCounterparty] = useState<CatalogItem | undefined>(undefined);
  const [isCounterpartyModalOpen, setIsCounterpartyModalOpen] = useState(false);

  // Tabular section rows
  const [rows, setRows] = useState<DocumentRow[]>([
    { id: '1', desc: '', qty: 1, price: 0, amount: 0 }
  ]);

  const totalAmount = rows.reduce((acc, r) => acc + (r.amount || 0), 0);

  const handlePost = () => {
    if (totalAmount <= 0) {
      alert("Sənədin yekun məbləği 0 ola bilməz!");
      return;
    }
    if (counterpartyCatalog && !counterparty) {
      alert("Qarşı tərəf seçilməyib!");
      return;
    }

    const docName = `${title} #${docNumber}`;

    // 1. Save Document (Header)
    addDocument({
      date: new Date(date).toISOString(),
      type: type,
      name: docName,
      org: org,
      amount: totalAmount,
      status: 'Keçirilib'
    });

    // 2. Trigger Postings callback (passes rows for detailed Dt/Ct)
    onPost(totalAmount, docName, rows, counterparty);

    alert("Sənəd uğurla keçirildi və mühasibat yazılışı yaradıldı!");
    onClose();
  };

  const handleSaveDraft = () => {
    const docName = `${title} #${docNumber}`;
    addDocument({
      date: new Date(date).toISOString(),
      type: type,
      name: docName,
      org: org,
      amount: totalAmount,
      status: 'Qaralama'
    });
    alert("Sənəd qaralama kimi yadda saxlandı.");
    onClose();
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-color)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* HEADER (Toolbar) */}
      <div style={{ backgroundColor: 'var(--surface-color)', borderBottom: '1px solid var(--border-color)', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', background: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600 }}>
            <ChevronLeft size={20} /> Geri
          </button>
          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)' }}></div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-color)', margin: 0 }}>{title}</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleSaveDraft} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-secondary)', fontWeight: 600, cursor: 'pointer' }}>
            <Save size={18} /> Qaralama
          </button>
          <button onClick={handlePost} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.2rem', backgroundColor: '#10b981', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 10px rgba(16,185,129,0.2)' }}>
            <CheckCircle size={18} /> Keçir və Bağla
          </button>
        </div>
      </div>

      <div style={{ padding: '2rem', flex: 1, maxWidth: '1400px', margin: '0 auto', width: '100%' }}>
        
        {/* Document Header Info */}
        <div style={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 2fr', gap: '1.5rem' }}>
          
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}><FileDigit size={16}/> Nömrə</label>
            <input type="text" value={docNumber} onChange={e => setDocNumber(e.target.value)} style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontWeight: 600 }} />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}><Calendar size={16}/> Tarix</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }} />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}><Building2 size={16}/> Şöbə (Bölmə)</label>
            <select value={org} onChange={e => setOrg(e.target.value)} style={{ width: '100%', padding: '0.75rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}>
              <option>Əsas Şöbə</option>
              <option>Poliklinika</option>
              <option>Stasionar</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}><User size={16}/> Qarşı tərəf {counterpartyCatalog && '(Seçilməlidir)'}</label>
            {counterpartyCatalog ? (
              <div style={{ position: 'relative' }}>
                <input 
                  type="text" 
                  readOnly 
                  value={counterparty ? `${counterparty.code} - ${counterparty.name}` : ''} 
                  placeholder="Kataloqdan seçin..."
                  onClick={() => setIsCounterpartyModalOpen(true)}
                  style={{ width: '100%', padding: '0.75rem 2.5rem 0.75rem 0.75rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--primary-color)', fontWeight: 600, cursor: 'pointer' }} 
                />
                <Search size={18} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', pointerEvents: 'none' }} />
              </div>
            ) : (
              <input type="text" placeholder="Tələb olunmur" disabled style={{ width: '100%', padding: '0.75rem', backgroundColor: 'rgba(0,0,0,0.05)', border: '1px dashed var(--border-color)', borderRadius: '8px', color: 'var(--text-secondary)' }} />
            )}
          </div>

        </div>

        {/* Tabular Section (Injected as children) */}
        <div style={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', fontWeight: 700, color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between' }}>
            <span>Cədvəl hissəsi (Tabular Section)</span>
            <span style={{ color: 'var(--text-primary)' }}>Yekun: <strong style={{ color: '#10b981', fontSize: '1.2rem' }}>{totalAmount.toFixed(2)} ₼</strong></span>
          </div>
          <div style={{ padding: '0' }}>
            {children({ rows, setRows, totalAmount })}
          </div>
        </div>

      </div>

      {isCounterpartyModalOpen && counterpartyCatalog && (
        <LookupModal 
          catalogName={counterpartyCatalog}
          title="Qarşı Tərəf"
          onClose={() => setIsCounterpartyModalOpen(false)}
          onSelect={(item) => {
            setCounterparty(item);
            setIsCounterpartyModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

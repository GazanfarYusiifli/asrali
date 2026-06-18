'use client'

import { useState } from 'react';
import Link from 'next/link';

type Debtor = { id: string; name: string; email: string; group: string; debt: number; delay: string; isReminded: boolean; };
type Contract = { id: string; name: string; date: string; amount: number; };

const INITIAL_DEBTORS: Debtor[] = [
  { id: 'D1', name: 'Nihad Əliyev', email: 'nihad@edufinance.az', group: 'Riyaziyyat - A1', debt: 150, delay: '5 gün', isReminded: false },
  { id: 'D2', name: 'Aysel Quliyeva', email: 'aysel@edufinance.az', group: 'İngilis Dili - B2', debt: 80, delay: '12 gün', isReminded: false },
  { id: 'D3', name: 'Ramil Həsənov', email: 'ramil@edufinance.az', group: 'Dizayn - C1', debt: 300, delay: '1 ay', isReminded: false },
];

const INITIAL_CONTRACTS: Contract[] = [
  { id: 'MQ-2026-041', name: 'Zəhra Abbasova', date: 'Bugün', amount: 1200 },
  { id: 'MQ-2026-040', name: 'Kərim Kərimov', date: 'Dünən', amount: 800 },
  { id: 'MQ-2026-039', name: 'Leyla Məmmədli', date: '12 İyun', amount: 1500 },
];

export default function DashboardPage() {
  const [debtors, setDebtors] = useState<Debtor[]>(INITIAL_DEBTORS);
  const [contracts, setContracts] = useState<Contract[]>(INITIAL_CONTRACTS);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newContract, setNewContract] = useState({ name: '', amount: '' });

  // İcmal rəqəmləri (Statistikalar)
  const totalDebt = debtors.reduce((sum, d) => sum + d.debt, 0);
  const activeContractsCount = 1237 + contracts.length;

  const handleSendReminder = (id: string) => {
    const debtor = debtors.find(d => d.id === id);
    if (debtor) {
      // Create mailto link for native email client
      const subject = encodeURIComponent("Təhsil Haqqı Gecikməsi Bildirişi");
      const body = encodeURIComponent(`Hörmətli ${debtor.name},\n\nSizin ${debtor.group} qrupu üzrə ${debtor.debt} ₼ təhsil haqqı ödənişiniz ${debtor.delay} gecikir.\nXahiş edirik, ən qısa zamanda ödənişi edəsiniz.\n\nHörmətlə,\nEduFinance İdarəetməsi`);
      window.open(`mailto:${debtor.email}?subject=${subject}&body=${body}`, '_blank');
      
      // Update UI state
      setDebtors(debtors.map(d => d.id === id ? { ...d, isReminded: true } : d));
    }
  };

  const handleAddContract = () => {
    if (!newContract.name || !newContract.amount) return alert('Ad və Məbləğ daxil edilməlidir!');
    
    const newRecord: Contract = {
      id: `MQ-2026-0${42 + contracts.length}`,
      name: newContract.name,
      date: 'Bugün',
      amount: Number(newContract.amount)
    };
    
    setContracts([newRecord, ...contracts]);
    setIsModalOpen(false);
    setNewContract({ name: '', amount: '' });
  };

  // CSV Export Function
  const handleExportCSV = () => {
    const csvRows = [];
    csvRows.push("Hesabat Novu,Tarix,Umumi Odenisler,Xalis Balans,Borc,Aktiv Muqavileler");
    csvRows.push(`Ayliq Icmal,13 Iyun 2026,142500,104300,${totalDebt},${activeContractsCount}`);
    
    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'EduFinance_Dashboard_Hesabat.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.5px', marginBottom: '0.25rem' }}>Təhsil İdarə Paneli</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Maliyyə, Tələbələr və Sistem İcmalı</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={handleExportCSV} style={{ 
            padding: '0.65rem 1.25rem', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', borderRadius: '10px', fontWeight: 600, cursor: 'pointer'
          }}>
            Hesabat Çıxar (Export)
          </button>
          <button onClick={() => setIsModalOpen(true)} style={{ 
            padding: '0.65rem 1.25rem', backgroundColor: 'var(--primary-color)', color: 'white', borderRadius: '10px', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
          }}>
            + Yeni Şagird (Müqavilə)
          </button>
        </div>
      </div>

      {/* ƏSAS METRİKALAR */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <StatCard title="Ümumi Ödənişlər" value="142,500 ₼" subtitle="+12% keçən aydan" color="#4f46e5" />
        <StatCard title="Xərclər (Kateqoriyalar)" value="38,200 ₼" subtitle="Müəllim maaşı, İcarə" color="#ef4444" />
        <StatCard title="Xalis Balans" value="104,300 ₼" subtitle="Kassa və Bank" color="#10b981" />
        <StatCard title="Ödəniş Faizi" value="85%" subtitle="Aylıq hədəf: 95%" color="#0ea5e9" />
        <StatCard title="Aktiv Müqavilələr" value={activeContractsCount.toLocaleString('en-US')} subtitle="Şagird və Tələbə" color="#8b5cf6" />
        <StatCard title="Ümumi Borc (Gecikən)" value={`${totalDebt.toLocaleString('en-US')} ₼`} subtitle={`${debtors.length} Şagird üzrə`} color="#f59e0b" />
      </div>

      {/* DETALLI PANELLƏR */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        
        {/* Şagird və Borc Cədvəli */}
        <div className="glass-panel" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Borclu Şagirdlər (Gecikmələr)</h3>
            <button style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary-color)', border: 'none', background: 'none', cursor: 'pointer' }}>Hamısına Bax →</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Şagird / Qrup</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Borc Məbləği</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Gecikmə</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Əməliyyat</th>
                </tr>
              </thead>
              <tbody>
                {debtors.map((student) => (
                  <tr key={student.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }} className="table-row-modern">
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <div style={{ fontWeight: 700 }}>{student.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{student.group}</div>
                    </td>
                    <td style={{ padding: '1.25rem 1.5rem', fontWeight: 800, color: '#ef4444' }}>{student.debt} ₼</td>
                    <td style={{ padding: '1.25rem 1.5rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{student.delay}</td>
                    <td style={{ padding: '1.25rem 1.5rem' }}>
                      <button 
                        onClick={() => handleSendReminder(student.id)}
                        disabled={student.isReminded}
                        style={{ 
                          padding: '0.5rem 1rem', 
                          backgroundColor: student.isReminded ? 'rgba(16, 185, 129, 0.1)' : 'rgba(79, 70, 229, 0.1)', 
                          color: student.isReminded ? '#10b981' : 'var(--primary-color)', 
                          border: 'none', borderRadius: '8px', fontWeight: 700, cursor: student.isReminded ? 'not-allowed' : 'pointer', fontSize: '0.8rem',
                          transition: 'all 0.2s'
                        }}
                      >
                        {student.isReminded ? 'Göndərildi ✅' : 'Xatırlatma Göndər'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Son Müqavilələr */}
        <div className="glass-panel" style={{ borderRadius: '16px', padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem' }}>Son Müqavilələr</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flexGrow: 1 }}>
            {contracts.map((contract) => (
              <div key={contract.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>{contract.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{contract.id} • <span style={{fontWeight: 600}}>{contract.date}</span></div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{contract.amount.toLocaleString('en-US')} ₼</div>
                  <Link href={`/dashboard/contracts?id=${contract.id}`} style={{ fontSize: '0.8rem', color: '#0ea5e9', cursor: 'pointer', fontWeight: 700, textDecoration: 'none' }}>
                    PDF Bax
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <Link href="/dashboard/contracts" style={{ display: 'block', textAlign: 'center', width: '100%', padding: '0.85rem', marginTop: '1.5rem', backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '12px', fontWeight: 700, color: 'var(--text-primary)', cursor: 'pointer', textDecoration: 'none' }}>
            Bütün Müqavilələr
          </Link>
        </div>
      </div>

      {/* YENİ ŞAGİRD MODALI */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem'
        }}>
          <div style={{ backgroundColor: 'var(--surface-color)', width: '100%', maxWidth: '450px', padding: '2.5rem', borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem' }}>Yeni Şagird və Müqavilə</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
              <div>
                <label style={labelStyle}>Şagirdin Adı, Soyadı</label>
                <input value={newContract.name} onChange={e => setNewContract({...newContract, name: e.target.value})} placeholder="Məs: Fidan Cəfərova" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Müqavilə Məbləği (₼)</label>
                <input type="number" value={newContract.amount} onChange={e => setNewContract({...newContract, amount: e.target.value})} placeholder="Məs: 1500" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Qrup / Fənn</label>
                <select style={inputStyle}>
                  <option>Riyaziyyat</option>
                  <option>İngilis Dili</option>
                  <option>Proqramlaşdırma</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2.5rem' }}>
              <button onClick={() => setIsModalOpen(false)} style={{ padding: '0.85rem 1.5rem', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}>İmtina</button>
              <button onClick={handleAddContract} style={{ padding: '0.85rem 2rem', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}>Şagirdi Qeydiyyatdan Keçir</button>
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .table-row-modern:hover { background-color: var(--bg-color); transition: 0.2s; }
      `}} />
    </div>
  );
}

function StatCard({ title, value, subtitle, color }: { title: string, value: string, subtitle: string, color: string }) {
  return (
    <div className="glass-panel" style={{ 
      padding: '1.5rem', 
      borderRadius: '16px', 
      borderLeft: `4px solid ${color}`,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
      <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>{title}</h3>
      <div style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-1px' }}>{value}</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{subtitle}</div>
    </div>
  )
}

const labelStyle = { display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.9rem' };
const inputStyle = { width: '100%', padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.95rem', outline: 'none' };

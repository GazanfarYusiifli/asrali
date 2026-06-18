'use client'
import React, { useState, useEffect } from 'react';
import { getPostings, Posting } from '../../utils/accounting';

export default function TrialBalancePage() {
  const [rows, setRows] = useState<any[]>([]);
  const [totals, setTotals] = useState({ dtTurn: 0, ctTurn: 0, dtBal: 0, ctBal: 0 });

  useEffect(() => {
    const postings = getPostings();
    
    // Extract unique accounts
    const accounts = new Set<string>();
    postings.forEach(p => { accounts.add(p.dt); accounts.add(p.ct); });

    let totalDtTurn = 0, totalCtTurn = 0, totalDtBal = 0, totalCtBal = 0;

    const data = Array.from(accounts).sort().map(acc => {
      const dtTurnover = postings.filter(p => p.dt === acc).reduce((sum, p) => sum + Number(p.amount), 0);
      const ctTurnover = postings.filter(p => p.ct === acc).reduce((sum, p) => sum + Number(p.amount), 0);
      
      let dtBalance = 0;
      let ctBalance = 0;
      
      // Basic Active vs Passive rule
      // 1xx, 2xx, 7xx -> Active (Debit balance)
      // 3xx, 4xx, 5xx, 6xx -> Passive (Credit balance)
      const isAktiv = ['1','2','7'].includes(acc.charAt(0));

      if (isAktiv) {
        dtBalance = dtTurnover - ctTurnover;
      } else {
        ctBalance = ctTurnover - dtTurnover;
      }

      totalDtTurn += dtTurnover;
      totalCtTurn += ctTurnover;
      if (dtBalance > 0) totalDtBal += dtBalance;
      if (ctBalance > 0) totalCtBal += ctBalance;

      return { acc, dtTurnover, ctTurnover, dtBalance: dtBalance > 0 ? dtBalance : 0, ctBalance: ctBalance > 0 ? ctBalance : 0 };
    });

    setRows(data);
    setTotals({ dtTurn: totalDtTurn, ctTurn: totalCtTurn, dtBal: totalDtBal, ctBal: totalCtBal });
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-color)', marginBottom: '0.5rem' }}>Dövriyyə cədvəli (Şaxmatka)</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Hesablar üzrə dövriyyə və qalıqların (Trial Balance) hesabatı.</p>

      <div style={{ backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)', borderRadius: '20px', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
            <thead>
              <tr>
                <th rowSpan={2} style={{ padding: '1rem', borderBottom: '2px solid var(--border-color)', borderRight: '1px solid var(--border-color)', textAlign: 'center' }}>Hesab</th>
                <th colSpan={2} style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', borderRight: '1px solid var(--border-color)', textAlign: 'center' }}>Dövriyyə</th>
                <th colSpan={2} style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', textAlign: 'center' }}>Son Qalıq</th>
              </tr>
              <tr style={{ backgroundColor: 'var(--bg-color)', borderBottom: '2px solid var(--border-color)' }}>
                <th style={{ padding: '0.75rem', borderRight: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>Debet</th>
                <th style={{ padding: '0.75rem', borderRight: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>Kredit</th>
                <th style={{ padding: '0.75rem', borderRight: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>Debet</th>
                <th style={{ padding: '0.75rem', color: 'var(--text-secondary)' }}>Kredit</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem', borderRight: '1px solid var(--border-color)', textAlign: 'center', fontWeight: 700, color: 'var(--primary-color)' }}>{row.acc}</td>
                  <td style={{ padding: '1rem', borderRight: '1px solid var(--border-color)', color: row.dtTurnover > 0 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{row.dtTurnover.toLocaleString('az-AZ')}</td>
                  <td style={{ padding: '1rem', borderRight: '1px solid var(--border-color)', color: row.ctTurnover > 0 ? 'var(--text-primary)' : 'var(--text-secondary)' }}>{row.ctTurnover.toLocaleString('az-AZ')}</td>
                  <td style={{ padding: '1rem', borderRight: '1px solid var(--border-color)', fontWeight: 600, color: row.dtBalance > 0 ? '#10b981' : 'var(--text-secondary)' }}>{row.dtBalance.toLocaleString('az-AZ')}</td>
                  <td style={{ padding: '1rem', fontWeight: 600, color: row.ctBalance > 0 ? '#ef4444' : 'var(--text-secondary)' }}>{row.ctBalance.toLocaleString('az-AZ')}</td>
                </tr>
              ))}
              
              {/* Totals Row */}
              <tr style={{ backgroundColor: 'var(--bg-color)', borderTop: '2px solid var(--border-color)' }}>
                <td style={{ padding: '1.25rem 1rem', borderRight: '1px solid var(--border-color)', textAlign: 'center', fontWeight: 800 }}>CƏMİ</td>
                <td style={{ padding: '1.25rem 1rem', borderRight: '1px solid var(--border-color)', fontWeight: 800 }}>{totals.dtTurn.toLocaleString('az-AZ')}</td>
                <td style={{ padding: '1.25rem 1rem', borderRight: '1px solid var(--border-color)', fontWeight: 800 }}>{totals.ctTurn.toLocaleString('az-AZ')}</td>
                <td style={{ padding: '1.25rem 1rem', borderRight: '1px solid var(--border-color)', fontWeight: 800, color: '#10b981' }}>{totals.dtBal.toLocaleString('az-AZ')}</td>
                <td style={{ padding: '1.25rem 1rem', fontWeight: 800, color: '#ef4444' }}>{totals.ctBal.toLocaleString('az-AZ')}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

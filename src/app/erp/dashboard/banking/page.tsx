export default function BankingPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Bank və Kassa</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ 
            padding: '0.5rem 1rem', 
            backgroundColor: 'transparent', 
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)', 
            borderRadius: 'var(--radius-md)',
            fontWeight: 500,
            cursor: 'pointer'
          }}>
            Bank Hesabı Qoş
          </button>
          <button style={{ 
            padding: '0.5rem 1rem', 
            backgroundColor: 'var(--primary-color)', 
            color: 'white', 
            borderRadius: 'var(--radius-md)',
            fontWeight: 500,
            border: 'none',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}>
            + Yeni Əməliyyat
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: 600 }}>Əsas Korporativ Hesab</h3>
            <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary-color)', borderRadius: '4px', fontWeight: 600 }}>Aktiv</span>
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>**** **** **** 4582</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>142,500.00 ₼</div>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: 600 }}>Kassa Aparatı</h3>
            <span style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', color: '#16a34a', borderRadius: '4px', fontWeight: 600 }}>Sinxronlaşdırılıb</span>
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Baş Ofisin Kassası</div>
          <div style={{ fontSize: '2.5rem', fontWeight: 700 }}>2,450.00 ₼</div>
        </div>
      </div>

      <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Son Əməliyyatlar</h3>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏦</div>
          <p>Baza qoşulduqdan sonra bank əməliyyatlarının tarixçəsi burada görünəcək.</p>
        </div>
      </div>
    </div>
  );
}

export default function HRPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>İnsan Resursları və Əməkhaqqı</h1>
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
          + İşçi Əlavə Et
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Ümumi İşçi Sayı</h3>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>42</div>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Bu Gün Məzuniyyətdə Olanlar</h3>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>3</div>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Növbəti Əməkhaqqı Tarixi</h3>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, paddingTop: '0.5rem' }}>31 Oktyabr 2026</div>
        </div>
      </div>

      <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>İşçi Siyahısı</h3>
          <input 
            type="text" 
            placeholder="İşçiləri axtar..." 
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--bg-color)',
              outline: 'none'
            }}
          />
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>İşçi</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Vəzifə</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Şöbə</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Aygün Həsənova', role: 'Baş Dizayner', dept: 'Dizayn', status: 'Aktiv' },
                { name: 'Rəşad Əliyev', role: 'Proqramçı', dept: 'Mühəndislik', status: 'Aktiv' },
                { name: 'Cavid Quliyev', role: 'Mühasib', dept: 'Maliyyə', status: 'Məzuniyyətdə' },
              ].map((emp, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 1.5rem', fontWeight: 500 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
                        {emp.name.charAt(0)}
                      </div>
                      {emp.name}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{emp.role}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{emp.dept}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '99px', 
                      fontSize: '0.75rem', 
                      fontWeight: 600,
                      backgroundColor: emp.status === 'Aktiv' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: emp.status === 'Aktiv' ? '#16a34a' : '#d97706'
                    }}>
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

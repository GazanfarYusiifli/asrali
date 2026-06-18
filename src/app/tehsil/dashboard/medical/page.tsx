export default function MedicalPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Tibb və Klinika</h1>
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
            Həkim Cədvəli
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
            + Yeni Pasiyent Qəbulu
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid #ef4444' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Bu Günki Növbələr</h3>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>124</div>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid var(--primary-color)' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Aktiv Həkimlər</h3>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>18</div>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid #22c55e' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Klinik Gəlir (Bu gün)</h3>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>5,200 ₼</div>
        </div>
      </div>

      <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Pasiyent Qəbulu Tarixçəsi</h3>
          <input 
            type="text" 
            placeholder="Pasiyent adı və ya ID..." 
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
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>ID / Pasiyent</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Həkim / Prosedur</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Sığorta / Ödəniş</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'PT-0012', name: 'Zəhra Abbasova', doctor: 'Dr. Əhmədov (Kardioloq)', payment: 'Sığorta (İcbari)', status: 'Müayinədə' },
                { id: 'PT-0013', name: 'Rəşad Məmmədov', doctor: 'Dr. Həsənova (Terapevt)', payment: 'Nağd (50 ₼)', status: 'Gözləyir' },
                { id: 'PT-0014', name: 'Nuranə Səfərova', doctor: 'USM', payment: 'Kartla (35 ₼)', status: 'Tamamlandı' },
              ].map((patient, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontWeight: 500 }}>{patient.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{patient.id}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{patient.doctor}</td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{patient.payment}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '99px', 
                      fontSize: '0.75rem', 
                      fontWeight: 600,
                      backgroundColor: patient.status === 'Tamamlandı' ? 'rgba(34, 197, 94, 0.1)' : patient.status === 'Müayinədə' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: patient.status === 'Tamamlandı' ? '#16a34a' : patient.status === 'Müayinədə' ? '#3b82f6' : '#d97706'
                    }}>
                      {patient.status}
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

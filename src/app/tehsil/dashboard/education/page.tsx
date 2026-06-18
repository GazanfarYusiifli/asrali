export default function EducationDashboardPage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Təhsil İdarə Paneli (EduFinance)</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ 
            padding: '0.5rem 1rem', 
            backgroundColor: 'transparent', 
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)', 
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            Hesabat Çıxar (Export)
          </button>
          <button style={{ 
            padding: '0.5rem 1rem', 
            backgroundColor: 'var(--primary-color)', 
            color: 'white', 
            borderRadius: 'var(--radius-md)',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}>
            + Yeni Şagird (Müqavilə)
          </button>
        </div>
      </div>

      {/* ƏSAS METRİKALAR (Real vaxt göstəricilər) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <StatCard title="Ümumi Ödənişlər" value="142,500 ₼" subtitle="+12% keçən aydan" color="#4f46e5" />
        <StatCard title="Xərclər (Kateqoriyalar)" value="38,200 ₼" subtitle="Müəllim maaşı, İcarə" color="#ef4444" />
        <StatCard title="Xalis Balans" value="104,300 ₼" subtitle="Kassa və Bank" color="#10b981" />
        <StatCard title="Ödəniş Faizi" value="85%" subtitle="Aylıq hədəf: 95%" color="#0ea5e9" />
        <StatCard title="Aktiv Müqavilələr" value="1,240" subtitle="Şagird və Tələbə" color="#8b5cf6" />
        <StatCard title="Ümumi Borc (Gecikən)" value="15,400 ₼" subtitle="45 Şagird üzrə" color="#f59e0b" />
      </div>

      {/* DETALLI PANELLƏR */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* Şagird və Borc Cədvəli */}
        <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Borclu Şagirdlər (Gecikmələr)</h3>
            <button style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--primary-color)', border: 'none', background: 'none', cursor: 'pointer' }}>Hamısına Bax →</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Şagird / Qrup</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Borc Məbləği</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Gecikmə</th>
                  <th style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Əməliyyat</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Nihad Əliyev', group: 'Riyaziyyat - A1', debt: '150 ₼', delay: '5 gün' },
                  { name: 'Aysel Quliyeva', group: 'İngilis Dili - B2', debt: '80 ₼', delay: '12 gün' },
                  { name: 'Ramil Həsənov', group: 'Dizayn - C1', debt: '300 ₼', delay: '1 ay' },
                ].map((student, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ fontWeight: 600 }}>{student.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{student.group}</div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem', fontWeight: 700, color: '#ef4444' }}>{student.debt}</td>
                    <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{student.delay}</td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <button style={{ padding: '0.4rem 0.8rem', backgroundColor: 'rgba(79, 70, 229, 0.1)', color: 'var(--primary-color)', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer', fontSize: '0.75rem' }}>
                        Xatırlatma Göndər
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Son Müqavilələr və Aktlar */}
        <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Son Müqavilələr</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { id: 'MQ-2026-041', name: 'Zəhra Abbasova', date: 'Bugün', amount: '1,200 ₼' },
              { id: 'MQ-2026-040', name: 'Kərim Kərimov', date: 'Dünən', amount: '800 ₼' },
              { id: 'MQ-2026-039', name: 'Leyla Məmmədli', date: '12 İyun', amount: '1,500 ₼' },
            ].map((contract, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{contract.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{contract.id} • {contract.date}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{contract.amount}</div>
                  <div style={{ fontSize: '0.75rem', color: '#0ea5e9', cursor: 'pointer', fontWeight: 600 }}>PDF Bax</div>
                </div>
              </div>
            ))}
          </div>
          <button style={{ width: '100%', padding: '0.75rem', marginTop: '1rem', backgroundColor: 'transparent', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer' }}>
            Bütün Müqavilələr
          </button>
        </div>

      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, color }: { title: string, value: string, subtitle: string, color: string }) {
  return (
    <div className="glass-panel" style={{ 
      padding: '1.5rem', 
      borderRadius: 'var(--radius-lg)', 
      borderLeft: `4px solid ${color}`,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
      <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 600 }}>{title}</h3>
      <div style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-1px' }}>{value}</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{subtitle}</div>
    </div>
  )
}

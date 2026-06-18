'use client'

export default function DirectoriesPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>📁 Sorğu Kitabçaları</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>1C strukturuna uyğun olaraq bütün siyahılar və kitabçalar buradan idarə olunur.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {['Müəssisələr', 'Kontragentlər', 'Nomenklatura', 'Hesablar Planı', 'Anbarlar', 'İstifadəçilər'].map(dir => (
          <div key={dir} style={{ padding: '1.5rem', backgroundColor: 'var(--surface-color)', borderRadius: '16px', border: '1px solid var(--border-color)', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-color)' }}>{dir}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}

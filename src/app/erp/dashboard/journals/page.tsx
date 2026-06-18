'use client'

export default function JournalsPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>📘 Jurnallar</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Sənədlərin reyestri və mühasibat yazılışlarının (Debet/Kredit) idarə olunduğu mərkəz.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
        {[
          { title: 'Sənədlər Jurnalı', desc: 'Bütün sənədlərin xronoloji ardıcıllıqla siyahısı və statusları.' },
          { title: 'Mühasibat Yazılışları (D/K)', desc: 'Təsdiqlənmiş sənədlərin yaratdığı ikili yazılış (Double-Entry) reyestri.' }
        ].map(doc => (
          <div key={doc.title} style={{ padding: '2rem', backgroundColor: 'var(--surface-color)', borderRadius: '16px', border: '1px solid var(--border-color)', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#3b82f6', marginBottom: '0.75rem' }}>{doc.title}</h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{doc.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

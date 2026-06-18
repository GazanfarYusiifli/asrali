'use client'

export default function DocumentsPage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>📄 Sənədlər</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Bütün ilkin əməliyyatlar sənədlərlə aparılır. Hər sənəd təsdiqləndikdə avtomatik mühasibat yazılışı yaradır.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {[
          { title: 'Alış Fakturası', desc: 'Təchizatçılardan mal alışı' },
          { title: 'Satış/Xidmət Aktı', desc: 'Xəstələrə göstərilən xidmətlər' },
          { title: 'Mədaxil Orderi', desc: 'Kassaya nağd daxilolma' },
          { title: 'Məxaric Orderi', desc: 'Kassadan ödənişlər' },
          { title: 'Anbar Transferi', desc: 'Mərkəzdən filiala mal göndərişi' },
          { title: 'Əməkhaqqı Hesablanması', desc: 'İşçilərə maaş hesablanması' }
        ].map(doc => (
          <div key={doc.title} style={{ padding: '1.5rem', backgroundColor: 'var(--surface-color)', borderRadius: '16px', border: '1px solid var(--border-color)', cursor: 'pointer', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-color)', marginBottom: '0.5rem' }}>{doc.title}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{doc.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

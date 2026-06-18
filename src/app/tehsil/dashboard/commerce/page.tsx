export default function CommercePage() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>Ticarət və Satış (CRM)</h1>
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
            Müştəri Əlavə Et
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
            + Yeni Sifariş
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid var(--primary-color)' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Günlük Satış Həcmi</h3>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>12,450 ₼</div>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid #f59e0b' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Gözləyən Sifarişlər</h3>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>34</div>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid #22c55e' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 500, marginBottom: '0.5rem' }}>Ümumi Müştəri Bazası</h3>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>8,240</div>
        </div>
      </div>

      <div className="glass-panel" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Son Sifarişlər</h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', outline: 'none' }}>
              <option>Bütün Statuslar</option>
              <option>Təsdiqlənib</option>
              <option>Çatdırılmada</option>
            </select>
            <input 
              type="text" 
              placeholder="Sifariş və ya Müştəri axtar..." 
              style={{
                padding: '0.5rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-color)',
                outline: 'none'
              }}
            />
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(0,0,0,0.02)', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Sifariş NO / Tarix</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Müştəri</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Məbləğ / Endirim</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 500, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 'ORD-5091', date: 'Bugün, 14:30', customer: 'Vüqar Məmmədov', amount: '450 ₼', discount: '0%', status: 'Çatdırılmada' },
                { id: 'ORD-5090', date: 'Bugün, 12:15', customer: 'Leyla Əliyeva', amount: '1,200 ₼', discount: '10%', status: 'Təsdiqlənib' },
                { id: 'ORD-5089', date: 'Dünən, 18:45', customer: 'Kərim Kərimov', amount: '85 ₼', discount: '5%', status: 'Tamamlandı' },
              ].map((order, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontWeight: 500 }}>{order.id}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{order.date}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{order.customer}</td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ fontWeight: 500 }}>{order.amount}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Endirim: {order.discount}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '99px', 
                      fontSize: '0.75rem', 
                      fontWeight: 600,
                      backgroundColor: order.status === 'Tamamlandı' ? 'rgba(34, 197, 94, 0.1)' : order.status === 'Təsdiqlənib' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                      color: order.status === 'Tamamlandı' ? '#16a34a' : order.status === 'Təsdiqlənib' ? '#3b82f6' : '#d97706'
                    }}>
                      {order.status}
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

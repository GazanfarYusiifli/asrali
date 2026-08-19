'use client';
import React, { useState } from 'react';
import { 
  Users, CheckCircle2, XCircle, Search, LogOut, 
  Shield, UserCheck, UserX, Crown,
  Mail, Calendar, Activity, RefreshCw, Eye, EyeOff, Trash2
} from 'lucide-react';

const ADMIN_PASSWORD = '123';

type User = {
  id: number;
  name: string;
  surname: string;
  email: string;
  plan: string;
  active: boolean;
  joined: string;
  lastLogin: string;
  country: string;
};

const initialUsers: User[] = [
  { id: 1,  name: 'Gazanfar',      surname: 'Yusifli',     email: 'yusifliqezenfer90@gmail.com',    plan: 'PRO',   active: true,  joined: '2026-06-18', lastLogin: '2026-07-28', country: 'AZ' },
  { id: 2,  name: 'Streamx',       surname: 'World',        email: 'streamxworld1@gmail.com',        plan: 'PRO',   active: true,  joined: '2026-06-21', lastLogin: '2026-07-28', country: 'AZ' },
  { id: 3,  name: 'Fuad',          surname: 'Yusifov',      email: 'fuad.yusifov@gmail.com',         plan: 'TRIAL', active: false, joined: '2026-06-19', lastLogin: '2026-07-22', country: 'AZ' },
  { id: 4,  name: 'Mehriban',      surname: 'İbrahimova',   email: 'mehriban.ibrahimova@mail.ru',    plan: 'TRIAL', active: false, joined: '2026-06-22', lastLogin: '2026-07-18', country: 'AZ' },
  { id: 5,  name: 'Rahman',        surname: 'Tagıyev',      email: 'rahman.tagiyev@gmail.com',       plan: 'TRIAL', active: false, joined: '2026-06-25', lastLogin: '2026-07-10', country: 'AZ' },
  { id: 6,  name: 'Birmilyonyaprak', surname: 'Shop',       email: 'birmilyonyaprak@gmail.com',      plan: 'TRIAL', active: false, joined: '2026-06-20', lastLogin: '2026-07-15', country: 'AZ' },
  { id: 7,  name: 'Leyla',         surname: 'Əliyeva',      email: 'leyla.aliyeva@gmail.com',        plan: 'TRIAL', active: false, joined: '2026-07-05', lastLogin: '2026-07-20', country: 'AZ' },
  { id: 8,  name: 'Nicat',         surname: 'Quliyev',      email: 'nicat.quliyev@yahoo.com',        plan: 'TRIAL', active: false, joined: '2026-07-10', lastLogin: '2026-07-16', country: 'AZ' },
  { id: 9,  name: 'Sevinc',        surname: 'Mustafayeva',  email: 'sevinc.mustafayeva@mail.ru',     plan: 'TRIAL', active: false, joined: '2026-07-14', lastLogin: '2026-07-21', country: 'AZ' },
  { id: 10, name: 'Elnur',         surname: 'Babayev',      email: 'elnur.babayev@gmail.com',        plan: 'TRIAL', active: false, joined: '2026-07-16', lastLogin: '2026-07-19', country: 'AZ' },
  { id: 11, name: 'Günel',         surname: 'Həsənova',     email: 'gunel.hasanova@gmail.com',       plan: 'TRIAL', active: false, joined: '2026-07-20', lastLogin: '2026-07-25', country: 'AZ' },
  { id: 12, name: 'Tural',         surname: 'Süleymanov',   email: 'tural.suleymanov@outlook.com',   plan: 'TRIAL', active: false, joined: '2026-07-22', lastLogin: '2026-07-24', country: 'AZ' },
];

export default function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'pro'>('all');
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [secretMode, setSecretMode] = useState(false);
  const [bulkCount, setBulkCount] = useState(10);
  const [secretFlash, setSecretFlash] = useState(false);


  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setError('');
    } else {
      setError('Şifrə yanlışdır!');
    }
  };

  const toggleActive = (id: number) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u));
  };

  const deleteUser = (id: number) => {
    if (confirm('Bu istifadəçini silmək istəyirsiniz?')) {
      setUsers(prev => prev.filter(u => u.id !== id));
    }
  };

  const handleLogoClick = () => {
    const next = logoClickCount + 1;
    setLogoClickCount(next);
    if (next >= 5) {
      setSecretMode(true);
      setLogoClickCount(0);
      setSecretFlash(true);
      setTimeout(() => setSecretFlash(false), 600);
    }
  };

  const addBulkUsers = () => {
    const randomNames = [
      { name: 'Anar', surname: 'Hüseynov' }, { name: 'Leyla', surname: 'Əliyeva' },
      { name: 'Nicat', surname: 'Quliyev' }, { name: 'Sevinc', surname: 'Mustafayeva' },
      { name: 'Elnur', surname: 'Babayev' }, { name: 'Günel', surname: 'Həsənova' },
      { name: 'Tural', surname: 'Süleymanov' }, { name: 'Könül', surname: 'Nəsirov' },
      { name: 'Rauf', surname: 'Əhmədov' }, { name: 'Xədicə', surname: 'Manafova' },
      { name: 'Orxan', surname: 'İsmayılov' }, { name: 'Nərmin', surname: 'Əsgərova' },
      { name: 'Fərid', surname: 'Hüseynli' }, { name: 'Aytən', surname: 'Qasımova' },
      { name: 'Kamran', surname: 'Məmmədov' }, { name: 'Şəbnəm', surname: 'Rzayeva' },
      { name: 'Vüsal', surname: 'Aliyev' }, { name: 'Lalə', surname: 'Əlizadə' },
      { name: 'Samir', surname: 'Hüseynli' }, { name: 'Zəhra', surname: 'Quluzadə' },
      { name: 'Murad', surname: 'Kazımov' }, { name: 'Nuray', surname: 'Əlizadə' },
    ];
    const domains = ['gmail.com', 'mail.ru', 'yahoo.com', 'outlook.com', 'icloud.com'];
    let currentId = users.length + 100;
    const newUsers: User[] = Array.from({ length: bulkCount }, () => {
      const p = randomNames[Math.floor(Math.random() * randomNames.length)];
      const d = domains[Math.floor(Math.random() * domains.length)];
      const slug = (s: string) => s.toLowerCase().replace(/[əÊ™]/g,'e').replace(/[ışıI]/g,'i').replace(/ö/g,'o').replace(/ü/g,'u').replace(/ş/g,'s').replace(/ç/g,'c').replace(/ğ/g,'g');
      const today = new Date();
      const jd = Math.floor(Math.random() * 50);
      const ld = Math.floor(Math.random() * jd + 1);
      return {
        id: currentId++,
        name: p.name, surname: p.surname,
        email: `${slug(p.name)}.${slug(p.surname)}${Math.floor(Math.random()*99)}@${d}`,
        plan: Math.random() > 0.8 ? 'PRO' : 'TRIAL',
        active: false,
        joined: new Date(today.getTime() - jd * 86400000).toISOString().split('T')[0],
        lastLogin: new Date(today.getTime() - ld * 86400000).toISOString().split('T')[0],
        country: 'AZ',
      };
    });
    setUsers(prev => [...prev, ...newUsers]);
    setLastRefresh(new Date());
  };

  const filtered = users.filter(u => {
    const matchSearch = search === '' || 
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.surname.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = 
      filter === 'all' ? true :
      filter === 'active' ? u.active :
      filter === 'inactive' ? !u.active :
      filter === 'pro' ? u.plan === 'PRO' : true;
    return matchSearch && matchFilter;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.active).length,
    inactive: users.filter(u => !u.active).length,
    pro: users.filter(u => u.plan === 'PRO').length,
  };

  if (!authed) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        fontFamily: "'Inter', system-ui, sans-serif"
      }}>
        <div style={{
          backgroundColor: '#1e293b', borderRadius: '24px', padding: '3rem',
          width: '100%', maxWidth: '420px', border: '1px solid #334155',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '20px',
              background: 'linear-gradient(135deg, #10b981, #059669)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.5rem', boxShadow: '0 10px 20px rgba(16,185,129,0.3)'
            }}>
              <Shield size={36} color="white" />
            </div>
            <h1 style={{ color: 'white', fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>Admin Panel</h1>
            <p style={{ color: '#64748b', marginTop: '0.5rem', fontSize: '0.95rem' }}>ASRALI İdarəetmə Sistemi</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="Şifrəni daxil edin"
                style={{
                  width: '100%', padding: '1rem 3rem 1rem 1rem',
                  backgroundColor: '#0f172a', border: error ? '1px solid #ef4444' : '1px solid #334155',
                  borderRadius: '12px', color: 'white', fontSize: '1rem',
                  outline: 'none', boxSizing: 'border-box'
                }}
              />
              <button onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && <p style={{ color: '#ef4444', fontSize: '0.875rem', margin: 0, textAlign: 'center' }}>{error}</p>}
            <button onClick={handleLogin}
              style={{ padding: '1rem', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, fontSize: '1rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(16,185,129,0.4)' }}>
              Daxil Ol
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', fontFamily: "'Inter', system-ui, sans-serif", color: 'white' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#1e293b', borderBottom: '1px solid #334155', padding: '1rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div
            onClick={handleLogoClick}
            style={{ width: '40px', height: '40px', borderRadius: '10px', background: secretFlash ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'linear-gradient(135deg, #10b981, #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s', userSelect: 'none' }}
            title={`${5 - logoClickCount} dəfə daha kliklə`}
          >
            <Shield size={20} color="white" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>ASRALI Admin</h1>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>İstifadəçi İdarəetmə Paneli</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#64748b', fontSize: '0.8rem' }}>Son yenilənmə: {lastRefresh.toLocaleTimeString('az')}</span>
          <button onClick={() => setLastRefresh(new Date())}
            style={{ background: 'none', border: '1px solid #334155', color: '#94a3b8', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}>
            <RefreshCw size={16} />
          </button>
          <button onClick={() => setAuthed(false)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}>
            <LogOut size={16} /> Çıxış
          </button>
        </div>
      </div>

      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
          {[
            { label: 'Ümumi İstifadəçi', value: stats.total, icon: <Users size={24} />, color: '#3b82f6', bg: '#1e3a5f' },
            { label: 'Aktiv İstifadəçi', value: stats.active, icon: <UserCheck size={24} />, color: '#10b981', bg: '#064e3b' },
            { label: 'Qeyri-aktiv', value: stats.inactive, icon: <UserX size={24} />, color: '#ef4444', bg: '#450a0a' },
            { label: 'PRO İstifadəçi', value: stats.pro, icon: <Crown size={24} />, color: '#f59e0b', bg: '#451a03' },
          ].map(stat => (
            <div key={stat.label} style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '1.5rem', border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '12px', backgroundColor: stat.bg, color: stat.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {stat.icon}
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: stat.color, lineHeight: 1 }}>{stat.value}</div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Add User + Filters + Search */}
        <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '1.5rem', border: '1px solid #334155', marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Secret bulk add panel — logo 5x click ile actilir */}
          {secretMode && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: '#451a03', borderRadius: '10px', padding: '0.5rem 1rem', border: '1px solid #92400e', animation: 'pulse 1s' }}>
              <span style={{ color: '#f59e0b', fontSize: '0.8rem', fontWeight: 600 }}>🔓 Gizli Mod</span>
              <input
                type="number"
                min={1}
                max={500}
                value={bulkCount}
                onChange={e => setBulkCount(Math.max(1, Math.min(500, parseInt(e.target.value) || 1)))}
                style={{ width: '65px', padding: '0.35rem 0.5rem', backgroundColor: '#0f172a', border: '1px solid #92400e', borderRadius: '6px', color: '#f59e0b', fontSize: '0.9rem', outline: 'none', textAlign: 'center', fontWeight: 700 }}
              />
              <button onClick={addBulkUsers}
                style={{ padding: '0.4rem 1rem', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#1c1917', border: 'none', borderRadius: '8px', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
                Əlavə Et
              </button>
              <button onClick={() => setSecretMode(false)}
                style={{ padding: '0.4rem 0.6rem', background: 'none', border: '1px solid #92400e', borderRadius: '8px', color: '#f59e0b', fontSize: '0.75rem', cursor: 'pointer' }}>
                ✕
              </button>
            </div>
          )}

          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Ad, soyad, email..."
              style={{ width: '100%', padding: '0.65rem 0.75rem 0.65rem 2.4rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: 'white', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {[
              { key: 'all', label: 'Hamısı' },
              { key: 'active', label: '✅ Aktiv' },
              { key: 'inactive', label: '❌ Qeyri-aktiv' },
              { key: 'pro', label: '👑 PRO' },
            ].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key as any)}
                style={{ padding: '0.55rem 0.9rem', borderRadius: '8px', border: filter === f.key ? '1px solid #10b981' : '1px solid #334155', backgroundColor: filter === f.key ? '#064e3b' : 'transparent', color: filter === f.key ? '#10b981' : '#94a3b8', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Users Table */}
        <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', border: '1px solid #334155', overflow: 'hidden' }}>
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700 }}>İstifadəçi Siyahısı</h2>
            <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{filtered.length} nəticə</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#0f172a' }}>
                  {['#', 'İstifadəçi', 'Email', 'Plan', 'Qoşulma', 'Son Giriş', 'Status', 'Sil'].map(h => (
                    <th key={h} style={{ padding: '0.9rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '3rem', textAlign: 'center', color: '#475569' }}>İstifadəçi tapılmadı</td>
                  </tr>
                ) : filtered.map((user, idx) => (
                  <tr key={user.id} style={{ borderTop: '1px solid #334155', transition: 'background 0.15s' }}
                    onMouseOver={e => (e.currentTarget.style.backgroundColor = '#1a2640')}
                    onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}>
                    <td style={{ padding: '1rem 1.25rem', color: '#475569', fontSize: '0.85rem' }}>{idx + 1}</td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `hsl(${user.id * 47}, 65%, 45%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', flexShrink: 0 }}>
                          {user.name[0]}{user.surname[0]}
                        </div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem', whiteSpace: 'nowrap' }}>{user.name} {user.surname}</div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94a3b8', fontSize: '0.8rem' }}>
                        <Mail size={13} /> {user.email}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{ padding: '0.25rem 0.65rem', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700, backgroundColor: user.plan === 'PRO' ? '#451a03' : '#1e3a5f', color: user.plan === 'PRO' ? '#f59e0b' : '#60a5fa', border: `1px solid ${user.plan === 'PRO' ? '#92400e' : '#1d4ed8'}` }}>
                        {user.plan === 'PRO' ? '👑 PRO' : '🔵 TRIAL'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        <Calendar size={13} /> {user.joined}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#64748b', fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
                        <Activity size={13} /> {user.lastLogin}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <button onClick={() => toggleActive(user.id)}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0.85rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.78rem', backgroundColor: user.active ? '#064e3b' : '#450a0a', color: user.active ? '#10b981' : '#ef4444', whiteSpace: 'nowrap' }}>
                        {user.active ? <><CheckCircle2 size={13} /> Aktiv</> : <><XCircle size={13} /> Deaktiv</>}
                      </button>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <button onClick={() => deleteUser(user.id)}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.4rem', borderRadius: '8px', border: '1px solid #334155', backgroundColor: 'transparent', color: '#ef4444', cursor: 'pointer' }}>
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', padding: '1.5rem', borderTop: '1px solid #1e293b', color: '#334155', fontSize: '0.8rem' }}>
        Developed by{' '}
        <a href="https://www.codfy.tech" target="_blank" rel="noopener noreferrer"
          style={{ color: '#10b981', fontWeight: 600, textDecoration: 'none' }}
          onMouseOver={e => e.currentTarget.style.textDecoration = 'underline'}
          onMouseOut={e => e.currentTarget.style.textDecoration = 'none'}
        >
          Codfy
        </a>
        {' '}· {new Date().getFullYear()}
      </div>
    </div>
  );
}

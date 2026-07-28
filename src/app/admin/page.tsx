'use client';
import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle2, XCircle, Search, LogOut, 
  Shield, TrendingUp, UserCheck, UserX, Crown,
  Mail, Calendar, Activity, RefreshCw, Eye, EyeOff
} from 'lucide-react';

const ADMIN_PASSWORD = '123';

const fakeUsers = [
  { id: 1, name: 'Fuad', surname: 'Yusifov', email: 'fuad.yusifov@gmail.com', plan: 'PRO', active: true, joined: '2026-06-19', lastLogin: '2026-07-28', country: 'AZ' },
  { id: 2, name: 'Mehriban', surname: 'İbrahimova', email: 'mehriban.ibrahimova@mail.ru', plan: 'TRIAL', active: true, joined: '2026-06-22', lastLogin: '2026-07-27', country: 'AZ' },
  { id: 3, name: 'Streamx', surname: 'World', email: 'streamxworld1@gmail.com', plan: 'PRO', active: true, joined: '2026-06-21', lastLogin: '2026-07-28', country: 'AZ' },
  { id: 4, name: 'Rahman', surname: 'Tagıyev', email: 'rahman.tagiyev@gmail.com', plan: 'TRIAL', active: false, joined: '2026-06-25', lastLogin: '2026-07-10', country: 'AZ' },
  { id: 5, name: 'Birmilyonyaprak', surname: 'Shop', email: 'birmilyonyaprak@gmail.com', plan: 'PRO', active: true, joined: '2026-06-20', lastLogin: '2026-07-26', country: 'AZ' },
  { id: 6, name: 'Gazanfar', surname: 'Yusifli', email: 'yusifliqezenfer90@gmail.com', plan: 'PRO', active: true, joined: '2026-06-18', lastLogin: '2026-07-28', country: 'AZ' },
  { id: 7, name: 'Anar', surname: 'Hüseynov', email: 'anar.huseynov@bk.ru', plan: 'TRIAL', active: false, joined: '2026-07-01', lastLogin: '2026-07-15', country: 'AZ' },
  { id: 8, name: 'Leyla', surname: 'Əliyeva', email: 'leyla.aliyeva@gmail.com', plan: 'TRIAL', active: true, joined: '2026-07-05', lastLogin: '2026-07-28', country: 'AZ' },
  { id: 9, name: 'Nicat', surname: 'Quliyev', email: 'nicat.quliyev@yahoo.com', plan: 'TRIAL', active: false, joined: '2026-07-10', lastLogin: '2026-07-18', country: 'AZ' },
  { id: 10, name: 'Sevinc', surname: 'Mustafayeva', email: 'sevinc.mustafayeva@mail.ru', plan: 'TRIAL', active: true, joined: '2026-07-14', lastLogin: '2026-07-27', country: 'AZ' },
  { id: 11, name: 'Elnur', surname: 'Babayev', email: 'elnur.babayev@gmail.com', plan: 'TRIAL', active: false, joined: '2026-07-16', lastLogin: '2026-07-20', country: 'AZ' },
  { id: 12, name: 'Günel', surname: 'Həsənova', email: 'gunel.hasanova@gmail.com', plan: 'TRIAL', active: true, joined: '2026-07-20', lastLogin: '2026-07-28', country: 'AZ' },
  { id: 13, name: 'Tural', surname: 'Süleymanov', email: 'tural.suleymanov@outlook.com', plan: 'TRIAL', active: false, joined: '2026-07-22', lastLogin: '2026-07-24', country: 'AZ' },
];

export default function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive' | 'pro'>('all');
  const [users, setUsers] = useState(fakeUsers);
  const [lastRefresh, setLastRefresh] = useState(new Date());

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
              <button
                onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {error && <p style={{ color: '#ef4444', fontSize: '0.875rem', margin: 0, textAlign: 'center' }}>{error}</p>}
            <button
              onClick={handleLogin}
              style={{
                padding: '1rem', background: 'linear-gradient(135deg, #10b981, #059669)',
                color: 'white', border: 'none', borderRadius: '12px',
                fontWeight: 700, fontSize: '1rem', cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(16,185,129,0.4)'
              }}
            >
              Daxil Ol
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', backgroundColor: '#0f172a',
      fontFamily: "'Inter', system-ui, sans-serif", color: 'white'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#1e293b', borderBottom: '1px solid #334155',
        padding: '1rem 2rem', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Shield size={20} color="white" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>ASRALI Admin</h1>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>İstifadəçi İdarəetmə Paneli</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ color: '#64748b', fontSize: '0.8rem' }}>
            Son yenilənmə: {lastRefresh.toLocaleTimeString('az')}
          </span>
          <button
            onClick={() => setLastRefresh(new Date())}
            style={{ background: 'none', border: '1px solid #334155', color: '#94a3b8', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}
          >
            <RefreshCw size={16} />
          </button>
          <button
            onClick={() => setAuthed(false)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              padding: '0.5rem 1rem', backgroundColor: '#ef4444',
              color: 'white', border: 'none', borderRadius: '8px',
              fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer'
            }}
          >
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
            <div key={stat.label} style={{
              backgroundColor: '#1e293b', borderRadius: '16px', padding: '1.5rem',
              border: '1px solid #334155', display: 'flex', alignItems: 'center', gap: '1rem'
            }}>
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

        {/* Filters & Search */}
        <div style={{
          backgroundColor: '#1e293b', borderRadius: '16px', padding: '1.5rem',
          border: '1px solid #334155', marginBottom: '1.5rem',
          display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center'
        }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={18} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Ad, soyad və ya email ilə axtar..."
              style={{
                width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem',
                backgroundColor: '#0f172a', border: '1px solid #334155',
                borderRadius: '10px', color: 'white', fontSize: '0.9rem',
                outline: 'none', boxSizing: 'border-box'
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[
              { key: 'all', label: 'Hamısı' },
              { key: 'active', label: '✅ Aktiv' },
              { key: 'inactive', label: '❌ Qeyri-aktiv' },
              { key: 'pro', label: '👑 PRO' },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key as any)}
                style={{
                  padding: '0.6rem 1rem', borderRadius: '8px',
                  border: filter === f.key ? '1px solid #10b981' : '1px solid #334155',
                  backgroundColor: filter === f.key ? '#064e3b' : 'transparent',
                  color: filter === f.key ? '#10b981' : '#94a3b8',
                  fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer'
                }}
              >
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
                  {['#', 'İstifadəçi', 'Email', 'Plan', 'Qoşulma tarixi', 'Son Giriş', 'Status'].map(h => (
                    <th key={h} style={{ padding: '0.9rem 1.25rem', textAlign: 'left', fontSize: '0.8rem', fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, idx) => (
                  <tr key={user.id} style={{ borderTop: '1px solid #334155', transition: 'background 0.15s' }}
                    onMouseOver={e => (e.currentTarget.style.backgroundColor = '#1a2640')}
                    onMouseOut={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '1rem 1.25rem', color: '#475569', fontSize: '0.85rem' }}>{idx + 1}</td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '38px', height: '38px', borderRadius: '10px',
                          background: `hsl(${user.id * 47}, 70%, 45%)`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 800, fontSize: '0.9rem', flexShrink: 0
                        }}>
                          {user.name[0]}{user.surname[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name} {user.surname}</div>
                          <div style={{ color: '#64748b', fontSize: '0.75rem' }}>{user.country}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                        <Mail size={14} /> {user.email}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{
                        padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700,
                        backgroundColor: user.plan === 'PRO' ? '#451a03' : '#1e3a5f',
                        color: user.plan === 'PRO' ? '#f59e0b' : '#60a5fa',
                        border: `1px solid ${user.plan === 'PRO' ? '#92400e' : '#1d4ed8'}`
                      }}>
                        {user.plan === 'PRO' ? '👑 PRO' : '🔵 TRIAL'}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                        <Calendar size={14} /> {user.joined}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', fontSize: '0.85rem' }}>
                        <Activity size={14} /> {user.lastLogin}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <button
                        onClick={() => toggleActive(user.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.4rem',
                          padding: '0.4rem 0.9rem', borderRadius: '8px', border: 'none',
                          cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem',
                          backgroundColor: user.active ? '#064e3b' : '#450a0a',
                          color: user.active ? '#10b981' : '#ef4444',
                          transition: 'all 0.2s'
                        }}
                      >
                        {user.active ? <><CheckCircle2 size={14} /> Aktiv</> : <><XCircle size={14} /> Deaktiv</>}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

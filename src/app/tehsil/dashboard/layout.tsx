'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth, Role } from '../../context/AuthContext';
import RoleSwitcher from '../../components/RoleSwitcher';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { role } = useAuth();

  const navItems = [
    { name: 'Əsas Panel', path: '/tehsil/dashboard', roles: ['SUPERADMIN', 'HR', 'ACCOUNTANT', 'TEACHER'] },
    { name: 'Şagird İdarəetməsi', path: '/tehsil/dashboard/students', roles: ['SUPERADMIN', 'TEACHER'] },
    { name: 'Əməkdaş İdarəetməsi', path: '/tehsil/dashboard/employees', roles: ['SUPERADMIN', 'HR'] },
    { name: 'Müqavilələr', path: '/tehsil/dashboard/contracts', roles: ['SUPERADMIN', 'ACCOUNTANT', 'HR'] },
    { name: 'Ödəniş və Xərc Uçotu', path: '/tehsil/dashboard/accounting', roles: ['SUPERADMIN', 'ACCOUNTANT'] },
    { name: 'Bank və Xəzinə', path: '/tehsil/dashboard/bank', roles: ['SUPERADMIN', 'ACCOUNTANT'] },
    { name: 'Maliyyə Hesabatları', path: '/tehsil/dashboard/reports', roles: ['SUPERADMIN', 'ACCOUNTANT'] },
    { name: 'İnventar İdarəetməsi', path: '/tehsil/dashboard/inventory', roles: ['SUPERADMIN', 'TEACHER', 'HR'] },
    { name: 'Tənzimləmələr', path: '/tehsil/dashboard/settings', roles: ['SUPERADMIN'] },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
      {/* Sidebar */}
      <aside style={{
        width: '260px',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderRight: '1px solid var(--border-color)',
        padding: '2rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, var(--primary-color), var(--accent-color))' }}></div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.5px' }}>EduFinance.az</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
          {navItems.filter(item => item.roles.includes(role)).map((item) => {
            const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
            return (
              <Link 
                key={item.path} 
                href={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isActive ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                  color: isActive ? 'var(--primary-color)' : 'var(--text-secondary)',
                  fontWeight: isActive ? 600 : 500,
                  transition: 'all 0.2s ease',
                  textDecoration: 'none'
                }}
              >
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
              AA
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Aysel Əliyeva</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ 
          height: '72px', 
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ fontWeight: 500, color: 'var(--text-secondary)' }}>
            Hədəf Kursları <span style={{ color: 'var(--primary-color)', fontWeight: 600, fontSize: '0.8rem', padding: '0.2rem 0.5rem', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '4px', marginLeft: '0.5rem' }}>hedef.edufinance.az</span>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <RoleSwitcher />
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>🔔</button>
            <button style={{ 
              padding: '0.5rem 1rem', 
              borderRadius: 'var(--radius-full)', 
              border: '1px solid var(--border-color)',
              background: 'transparent',
              color: 'var(--text-primary)',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer'
            }}>
              Çıxış
            </button>
          </div>
        </header>
        
        <div style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}

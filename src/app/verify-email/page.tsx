import Link from 'next/link';

export default function VerifyEmailPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      backgroundColor: 'var(--bg-color)',
      backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '480px',
        padding: '3rem 2.5rem',
        borderRadius: 'var(--radius-xl)',
        boxShadow: 'var(--shadow-lg)',
        textAlign: 'center'
      }}>
        <div style={{ 
          width: '64px', 
          height: '64px', 
          borderRadius: '50%', 
          backgroundColor: 'rgba(34, 197, 94, 0.1)', 
          color: '#16a34a',
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          fontSize: '2rem',
          margin: '0 auto 1.5rem' 
        }}>
          ✉️
        </div>
        
        <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '1rem' }}>Check your email</h1>
        
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
          We've sent a confirmation link to your email address. Please click the link to verify your account and access the dashboard.
        </p>
        
        <div style={{ 
          padding: '1rem', 
          backgroundColor: 'rgba(0,0,0,0.02)', 
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.875rem',
          color: 'var(--text-secondary)',
          marginBottom: '2rem'
        }}>
          Can't find the email? Check your spam folder or wait a few minutes.
        </div>
        
        <Link href="/login" style={{ 
          display: 'inline-block',
          width: '100%',
          padding: '0.875rem',
          backgroundColor: 'transparent',
          color: 'var(--text-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-md)',
          fontWeight: 600,
          fontSize: '1rem',
          transition: 'background-color 0.2s'
        }}>
          Back to Login
        </Link>
      </div>
    </div>
  );
}

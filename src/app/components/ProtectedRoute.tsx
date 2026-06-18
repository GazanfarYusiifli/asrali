'use client'

import React from 'react';
import { useAuth, Role } from '../context/AuthContext';
import Link from 'next/link';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { role } = useAuth();

  if (role === 'SUPERADMIN' || allowedRoles.includes(role)) {
    return <>{children}</>;
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div style={{
        fontSize: '4rem',
        marginBottom: '1rem'
      }}>
        🔒
      </div>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>
        Giriş Qadağandır
      </h1>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', lineHeight: 1.6, marginBottom: '2rem' }}>
        Sizin hazırkı <strong>{role}</strong> rolunuz bu bölməyə daxil olmaq üçün kifayət etmir. Zəhmət olmasa, sistem admininə müraciət edin.
      </p>
      <Link href="/" style={{
        padding: '0.75rem 1.5rem',
        backgroundColor: 'var(--primary-color)',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '8px',
        fontWeight: 600,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        Ana Səhifəyə Qayıt
      </Link>
    </div>
  );
}

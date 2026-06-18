'use client'

import React from 'react';
import { useAuth, Role } from '../context/AuthContext';

export default function RoleSwitcher() {
  const { role, setRole } = useAuth();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRole(e.target.value as Role);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.1) 100%)',
      padding: '0.4rem 1rem',
      borderRadius: '99px',
      border: '1px solid rgba(16, 185, 129, 0.2)',
      boxShadow: '0 2px 10px rgba(16, 185, 129, 0.1)',
      transition: 'all 0.2s ease'
    }}>

      <select 
        value={role} 
        onChange={handleRoleChange}
        style={{
          backgroundColor: 'transparent',
          border: 'none',
          fontWeight: 800,
          color: 'var(--text-primary)',
          fontSize: '0.85rem',
          outline: 'none',
          cursor: 'pointer'
        }}
      >
        <option value="SUPERADMIN">👑 SUPERADMIN (Hamısına İcazəli)</option>
        <option value="HR">👥 HR (Yalnız İşçi İdarəetmə)</option>
        <option value="ACCOUNTANT">💰 MÜHASİB (Yalnız Maliyyə)</option>
        <option value="DOCTOR">🩺 HƏKİM (Yalnız Tibbi Bölmələr)</option>
        <option value="TEACHER">📚 MÜƏLLİM (Yalnız Təhsil Bölmələri)</option>
      </select>
    </div>
  );
}

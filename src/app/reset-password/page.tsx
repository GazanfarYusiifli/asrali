'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [sessionActive, setSessionActive] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      // Also listen for hash change because sometimes session is created right after mount
      supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          setSessionActive(true);
          setCheckingSession(false);
        } else if (session) {
          setSessionActive(true);
          setCheckingSession(false);
        }
      });

      if (session) {
        setSessionActive(true);
      }
      setCheckingSession(false);
    };

    checkSession();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      setError('Şifrə ən azı 6 simvoldan ibarət olmalıdır.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Şifrələr uyğun gəlmir.');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();

      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        throw error;
      }

      setSuccess(true);
      // Wait 3 seconds and redirect to dashboard
      setTimeout(() => {
        window.location.href = '/erp/dashboard';
      }, 3000);
    } catch (err: any) {
      console.error('Update Password Error:', err.message);
      setError('Şifrə yenilənərkən xəta baş verdi. Linkin müddəti bitmiş ola bilər.');
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#020617' }}>
        <Loader2 size={40} color="#0ea5e9" style={{ animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#020617', 
      backgroundImage: 'radial-gradient(circle at 50% 0%, #1e293b 0%, #020617 70%)',
      fontFamily: '"Inter", sans-serif',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Background Orbs */}
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(16,185,129,0.15) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', filter: 'blur(60px)' }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(14,165,233,0.15) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%', filter: 'blur(60px)' }}></div>

      <div style={{ 
        backgroundColor: 'rgba(30, 41, 59, 0.5)', 
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '3rem', 
        borderRadius: '24px', 
        border: '1px solid rgba(255, 255, 255, 0.1)', 
        maxWidth: '450px', 
        width: '90%', 
        textAlign: 'center',
        zIndex: 1,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981, #0ea5e9)', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' }}></div>
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'white', marginBottom: '0.5rem', letterSpacing: '-1px' }}>
          Yeni Şifrə Təyin Et
        </h1>
        
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', marginBottom: '2.5rem', lineHeight: 1.5 }}>
          Lütfən hesabınız üçün yeni və güclü bir şifrə daxil edin.
        </p>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
            {error}
          </div>
        )}

        {!sessionActive && !success && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: '1.5rem', textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Link Aktiv Deyil</h3>
            <p style={{ fontSize: '0.9rem', color: '#fecaca' }}>
              Şifrə bərpa linki artıq istifadə olunub və ya müddəti bitib. Zəhmət olmasa yeni bərpa linki istəyin.
            </p>
            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <Link href="/forgot-password" style={{ color: '#0ea5e9', textDecoration: 'underline', fontWeight: 600 }}>Yeni link göndər</Link>
            </div>
          </div>
        )}

        {success ? (
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#6ee7b7', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Şifrə Yeniləndi!</h3>
            <p style={{ fontSize: '0.9rem', color: '#a7f3d0' }}>
              Sizin şifrəniz uğurla dəyişdirildi. Qısa müddətdə sistemə yönləndiriləcəksiniz...
            </p>
          </div>
        ) : sessionActive && (
          <form onSubmit={handleUpdatePassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 500 }}>Yeni Şifrə</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                required
              />
            </div>
            
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 500 }}>Şifrənin Təsdiqi</label>
              <input 
                type="password" 
                placeholder="Şifrəni təkrar daxil edin" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="login-input"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="submit-btn"
            >
              {loading ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : 'Şifrəni Yenilə'}
            </button>
          </form>
        )}

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes spin { 100% { transform: rotate(360deg); } }
          .login-input {
            width: 100%;
            padding: 0.85rem 1rem;
            background: rgba(15, 23, 42, 0.6);
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 12px;
            color: white;
            font-size: 1rem;
            outline: none;
            transition: all 0.2s;
          }
          .login-input:focus {
            border-color: #0ea5e9;
            box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
          }
          .submit-btn {
            width: 100%;
            padding: 1rem;
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            border: none;
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .submit-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
          }
          .submit-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }
        `}} />
      </div>
    </div>
  );
}

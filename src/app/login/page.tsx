'use client';

import React, { useState, Suspense, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '../context/I18nContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useSearchParams } from 'next/navigation';

function LoginContent() {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const supabase = createClient();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    const forceLogout = searchParams.get('force_logout');
    
    if (forceLogout === 'true') {
      supabase.auth.signOut();
    }
    
    if (errorParam === 'not_registered') {
      setError('Belə bir hesab yoxdur. Zəhmət olmasa əvvəlcə qeydiyyatdan keçin.');
    }
  }, [searchParams]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!login || !password) {
      setError('Zəhmət olmasa bütün xanaları doldurun.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let authEmail = login;

      // If it doesn't contain '@', treat it as a username and resolve the email
      if (!login.includes('@')) {
        const { data, error: rpcError } = await supabase.rpc('resolve_username_to_email', {
          p_username: login
        });
        
        if (rpcError) {
          throw new Error('rpc_error');
        }
        
        if (!data) {
          throw new Error('not_registered');
        }
        
        authEmail = data;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: authEmail,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user?.user_metadata?.registered !== true) {
        await supabase.auth.signOut();
        throw new Error('not_registered');
      }

      window.location.href = '/erp/dashboard';
    } catch (err: any) {
      console.error('Email Login Error:', err.message);
      if (err.message === 'not_registered' || err.message?.includes('not_registered')) {
        setError('Belə bir hesab yoxdur. Zəhmət olmasa əvvəlcə qeydiyyatdan keçin.');
      } else if (err.message === 'Invalid login credentials') {
        setError('Belə bir hesab yoxdur və ya şifrə yanlışdır. Zəhmət olmasa əvvəlcə qeydiyyatdan keçin.');
      } else {
        setError('Giriş edərkən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
      }
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
          queryParams: {
            prompt: 'select_account',
          },
        },
      });

      if (error) {
        throw error;
      }
    } catch (err: any) {
      console.error('Google Login Error:', err.message);
      setError('Giriş edərkən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }
    } catch (err: any) {
      console.error('Facebook Login Error:', err.message);
      setError('Facebook ilə giriş edərkən xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.');
      setLoading(false);
    }
  };

  return (
    <div className="login-root-container">
      {/* Background Cartesian & Ambient Mesh matching landing aesthetic */}
      <div className="login-backdrop" aria-hidden="true">
        <div className="login-radial-spot login-spot-1" />
        <div className="login-radial-spot login-spot-2" />
        <div className="login-cartesian-grid" />
      </div>

      {/* Top Floating Language Switcher & Home link */}
      <div className="top-nav-bar">
        <Link href="/" className="back-home-link">
          <span style={{ fontSize: '1.1rem' }}>←</span>
          <span>Ana səhifə</span>
        </Link>
        <LanguageSwitcher />
      </div>

      <div className="login-split-card">
        
        {/* LEFT SIDE: FORM */}
        <div className="login-form-side">
          <div className="login-brand-header">
            <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.65rem' }}>
              <div className="brand-logo-hex">A</div>
              <span style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px', color: '#14141c' }}>
                ASRALI <span style={{ color: '#059669', fontWeight: 900 }}>ERP</span>
              </span>
            </Link>
          </div>

          <h1 className="login-main-title">
            Xoş gəlmisiniz
          </h1>
          <p className="login-subtitle">
            Sistemə daxil olmaq üçün Gmail hesabınızı istifadə edin.
          </p>

          {error && (
            <div className="login-error-alert">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailLogin} className="login-form">
            <div className="form-group">
              <label className="form-label">İstifadəçi adı və ya E-poçt</label>
              <input 
                type="text" 
                placeholder="istifadeci_adi və ya email@example.com" 
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                className="login-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Şifrə</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="login-input"
                required
              />
            </div>
            
            <div className="forgot-password-row">
              <Link href="/forgot-password" className="forgot-link">
                Şifrəni unutmusunuz?
              </Link>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="submit-btn"
            >
              {loading ? <Loader2 size={19} className="spin-icon" /> : 'Daxil ol'}
            </button>
          </form>

          <div className="or-divider">
            <div className="divider-line" />
            <span className="divider-text">və ya</span>
            <div className="divider-line" />
          </div>

          <div className="oauth-buttons-wrap">
            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="oauth-btn google-btn"
            >
              {loading ? (
                <Loader2 size={20} className="spin-icon" />
              ) : (
                <>
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.78 15.72 17.56V20.31H19.28C21.36 18.4 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                    <path d="M12 23C14.97 23 17.46 22.02 19.28 20.31L15.72 17.56C14.73 18.22 13.48 18.63 12 18.63C9.13 18.63 6.7 16.69 5.82 14.1H2.15V16.94C3.96 20.53 7.69 23 12 23Z" fill="#34A853"/>
                    <path d="M5.82 14.1C5.6 13.44 5.47 12.73 5.47 12C5.47 11.27 5.6 10.56 5.82 9.9V7.06H2.15C1.41 8.54 1 10.22 1 12C1 13.78 1.41 15.46 2.15 16.94L5.82 14.1Z" fill="#FBBC05"/>
                    <path d="M12 5.38C13.62 5.38 15.06 5.94 16.2 7.02L19.36 3.86C17.46 2.09 14.97 1 12 1C7.69 1 3.96 3.47 2.15 7.06L5.82 9.9C6.7 7.31 9.13 5.38 12 5.38Z" fill="#EA4335"/>
                  </svg>
                  <span>Google ilə daxil ol</span>
                </>
              )}
            </button>

            <button 
              onClick={handleFacebookLogin}
              disabled={loading}
              className="oauth-btn facebook-btn"
            >
              {loading ? (
                <Loader2 size={20} className="spin-icon" />
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24V15.563H7.078V12.073H10.125V9.413C10.125 6.388 11.916 4.71 14.658 4.71C15.97 4.71 17.344 4.945 17.344 4.945V7.915H15.83C14.34 7.915 13.875 8.845 13.875 9.799V12.073H17.203L16.671 15.563H13.875V24C19.612 23.094 24 18.1 24 12.073Z"/>
                  </svg>
                  <span>Facebook ilə daxil ol</span>
                </>
              )}
            </button>
          </div>

          <div className="register-footer-text">
            Hesabınız yoxdur?{' '}
            <Link href="/register" className="register-link">
              Qeydiyyatdan keçin
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE: IMAGE / VISUAL SHOWCASE */}
        <div className="login-image-side">
          <div className="image-side-overlay" />
          
          <div className="image-side-content">
            <div className="mockup-mini-badge">
              <span className="pulse-dot" />
              <span>Real-vaxt İdarəetmə Paneli</span>
            </div>

            <h3 className="image-side-title">
              Biznesinizi tək platformadan nəzarətdə saxlayın
            </h3>
            <p className="image-side-desc">
              Satış, borclar, müqavilələr, anbar və maliyyə hesabatları — hamısı tək bir ekranda.
            </p>

            <div className="showcase-frame">
              <div className="showcase-frame-header">
                <div style={{ display: 'flex', gap: '5px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f43f5e' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f59e0b' }} />
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
                </div>
                <span style={{ fontSize: '0.72rem', color: '#888290', fontFamily: 'monospace' }}>app.asrali.com/erp</span>
              </div>
              <img 
                src="/dashboard_mockup.png" 
                alt="ASRALI ERP Ekran Görünüşü"
                className="showcase-img"
              />
            </div>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin-icon { animation: spin 1s linear infinite; }

        .login-root-container {
          min-height: 100vh;
          background-color: #f7f5f6;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          padding: 2.5rem 1.5rem;
          font-family: inherit;
          overflow-x: hidden;
        }

        /* Ambient Hex.tech backdrop */
        .login-backdrop {
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
        }
        .login-radial-spot {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          opacity: 0.45;
        }
        .login-spot-1 {
          top: -10%;
          left: 10%;
          width: 50vw;
          height: 50vw;
          background: radial-gradient(circle, rgba(164, 119, 178, 0.25) 0%, transparent 70%);
        }
        .login-spot-2 {
          bottom: -10%;
          right: 5%;
          width: 50vw;
          height: 50vw;
          background: radial-gradient(circle, rgba(92, 177, 152, 0.22) 0%, transparent 70%);
        }
        .login-cartesian-grid {
          position: absolute;
          inset: 0;
          background-size: 32px 32px;
          background-image: 
            linear-gradient(to right, rgba(43, 37, 44, 0.055) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(43, 37, 44, 0.055) 1px, transparent 1px);
        }

        /* Top Nav Bar */
        .top-nav-bar {
          position: fixed;
          top: 1.25rem;
          left: 2rem;
          right: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 20;
          pointer-events: auto;
        }
        .back-home-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          color: #59535f;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 600;
          padding: 0.45rem 0.85rem;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.7);
          border: 1px solid #e9e5e8;
          backdrop-filter: blur(8px);
          transition: all 0.2s;
        }
        .back-home-link:hover {
          color: #14141c;
          border-color: #dbd7da;
          background: #ffffff;
        }

        /* 2-Column Split Card */
        .login-split-card {
          position: relative;
          z-index: 5;
          display: flex;
          width: 100%;
          max-width: 1040px;
          min-height: 650px;
          background: #ffffff;
          border: 1px solid #e9e5e8;
          border-radius: 24px;
          box-shadow: 0 20px 60px -15px rgba(20, 20, 28, 0.08), 0 0 1px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          margin-top: 2rem;
        }

        /* Left Side: Form */
        .login-form-side {
          flex: 1.1;
          padding: 3.5rem 3.5rem 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: #ffffff;
        }
        .login-brand-header {
          margin-bottom: 1.75rem;
        }
        .brand-logo-hex {
          width: 36px;
          height: 36px;
          border-radius: 9px;
          background: #14141c;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          color: white;
          font-size: 1.1rem;
        }
        .login-main-title {
          font-size: 1.85rem;
          font-weight: 800;
          color: #14141c;
          letter-spacing: -0.6px;
          margin-bottom: 0.45rem;
        }
        .login-subtitle {
          color: #59535f;
          font-size: 0.95rem;
          margin-bottom: 1.75rem;
          line-height: 1.5;
        }

        .login-error-alert {
          background-color: #fef2f2;
          color: #b91c1c;
          padding: 0.85rem 1rem;
          border-radius: 10px;
          border: 1px solid #fecaca;
          margin-bottom: 1.25rem;
          font-size: 0.88rem;
          font-weight: 500;
        }

        .login-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .form-label {
          color: #2b252c;
          font-size: 0.88rem;
          font-weight: 600;
        }
        .login-input {
          width: 100%;
          padding: 0.8rem 1rem;
          background: #faf8f9;
          border: 1px solid #e9e5e8;
          border-radius: 10px;
          color: #14141c;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.2s;
        }
        .login-input:focus {
          background: #ffffff;
          border-color: #059669;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.12);
        }

        .forgot-password-row {
          text-align: right;
          margin-top: -0.25rem;
        }
        .forgot-link {
          color: #059669;
          font-size: 0.85rem;
          text-decoration: none;
          font-weight: 600;
        }
        .forgot-link:hover {
          text-decoration: underline;
        }

        .submit-btn {
          width: 100%;
          padding: 0.85rem;
          background: #059669;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          margin-top: 0.4rem;
          box-shadow: 0 2px 8px rgba(5, 150, 105, 0.2);
        }
        .submit-btn:hover {
          background: #047857;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
        }
        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .or-divider {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin: 1.35rem 0 1.15rem;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background-color: #e9e5e8;
        }
        .divider-text {
          font-size: 0.78rem;
          text-transform: uppercase;
          font-weight: 700;
          color: #888290;
          letter-spacing: 0.5px;
        }

        .oauth-buttons-wrap {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .oauth-btn {
          width: 100%;
          padding: 0.75rem 1rem;
          background: #ffffff;
          color: #2b252c;
          border: 1px solid #e9e5e8;
          border-radius: 10px;
          font-size: 0.92rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          transition: all 0.2s ease;
        }
        .oauth-btn:hover {
          background: #faf8f9;
          border-color: #dbd7da;
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }
        .oauth-btn:disabled {
          cursor: not-allowed;
          opacity: 0.7;
          transform: none;
        }

        .register-footer-text {
          margin-top: 1.75rem;
          font-size: 0.9rem;
          color: #59535f;
          text-align: center;
        }
        .register-link {
          color: #059669;
          text-decoration: none;
          font-weight: 700;
          margin-left: 0.25rem;
        }
        .register-link:hover {
          text-decoration: underline;
        }

        /* Right Side: Image Showcase */
        .login-image-side {
          flex: 1;
          background: linear-gradient(145deg, #181721 0%, #0d0c14 100%);
          position: relative;
          padding: 3.5rem 3rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          overflow: hidden;
          color: white;
        }
        .image-side-overlay {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
          background-size: 28px 28px;
          pointer-events: none;
        }
        .image-side-content {
          position: relative;
          z-index: 2;
        }
        .mockup-mini-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.35rem 0.85rem;
          background: rgba(5, 150, 105, 0.16);
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 9999px;
          color: #34d399;
          font-size: 0.78rem;
          font-weight: 700;
          margin-bottom: 1.25rem;
        }
        .pulse-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 8px #10b981;
        }
        .image-side-title {
          font-size: 1.65rem;
          font-weight: 800;
          line-height: 1.25;
          letter-spacing: -0.5px;
          color: #ffffff;
          margin-bottom: 0.75rem;
        }
        .image-side-desc {
          color: #a49da8;
          font-size: 0.92rem;
          line-height: 1.55;
          margin-bottom: 2rem;
        }

        .showcase-frame {
          background: #1e1d27;
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.6);
          transition: transform 0.3s ease;
        }
        .showcase-frame:hover {
          transform: translateY(-3px);
        }
        .showcase-frame-header {
          background: #15141e;
          padding: 0.55rem 0.85rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }
        .showcase-img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
        }

        /* Responsive Breakpoints */
        @media (max-width: 900px) {
          .login-split-card {
            flex-direction: column;
            max-width: 520px;
          }
          .login-form-side {
            padding: 2.5rem 2rem;
          }
          .login-image-side {
            display: none;
          }
        }
      `}} />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', backgroundColor: '#020617' }}></div>}>
      <LoginContent />
    </Suspense>
  );
}

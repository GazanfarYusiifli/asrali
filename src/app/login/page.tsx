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

      <div style={{ position: 'absolute', top: '2rem', right: '2rem', zIndex: 10 }}>
        <LanguageSwitcher />
      </div>

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
        
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'linear-gradient(135deg, #10b981, #0ea5e9)', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)' }}></div>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', marginBottom: '0.5rem', letterSpacing: '-1px' }}>
            {t('login_title')}
          </h1>
        </Link>
        
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', marginBottom: '2.5rem', lineHeight: 1.5 }}>
          {t('login_desc')}
        </p>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '1.5rem', textAlign: 'left' }}>
          <div>
            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 500 }}>İstifadəçi adı və ya E-poçt</label>
            <input 
              type="text" 
              placeholder="istifadeci_adi və ya email@example.com" 
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="login-input"
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 500 }}>Şifrə</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
              required
            />
          </div>
          
          <div style={{ textAlign: 'right', marginTop: '-0.5rem', marginBottom: '0.5rem' }}>
            <Link href="/forgot-password" style={{ color: '#0ea5e9', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 500 }}>
              Şifrəni unutmusunuz?
            </Link>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="submit-btn"
          >
            {loading ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : 'Daxil ol'}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.5rem 0', color: '#64748b' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
          <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 600 }}>və ya</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.1)' }}></div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="oauth-btn google-btn"
          >
            {loading ? (
              <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <>
                <div style={{ backgroundColor: 'white', borderRadius: '50%', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.78 15.72 17.56V20.31H19.28C21.36 18.4 22.56 15.6 22.56 12.25Z" fill="#4285F4"/>
                    <path d="M12 23C14.97 23 17.46 22.02 19.28 20.31L15.72 17.56C14.73 18.22 13.48 18.63 12 18.63C9.13 18.63 6.7 16.69 5.82 14.1H2.15V16.94C3.96 20.53 7.69 23 12 23Z" fill="#34A853"/>
                    <path d="M5.82 14.1C5.6 13.44 5.47 12.73 5.47 12C5.47 11.27 5.6 10.56 5.82 9.9V7.06H2.15C1.41 8.54 1 10.22 1 12C1 13.78 1.41 15.46 2.15 16.94L5.82 14.1Z" fill="#FBBC05"/>
                    <path d="M12 5.38C13.62 5.38 15.06 5.94 16.2 7.02L19.36 3.86C17.46 2.09 14.97 1 12 1C7.69 1 3.96 3.47 2.15 7.06L5.82 9.9C6.7 7.31 9.13 5.38 12 5.38Z" fill="#EA4335"/>
                  </svg>
                </div>
                {t('login_google_btn')}
              </>
            )}
          </button>

          <button 
            onClick={handleFacebookLogin}
            disabled={loading}
            className="oauth-btn facebook-btn"
          >
            {loading ? (
              <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
            ) : (
              <>
                <div style={{ backgroundColor: '#1877F2', borderRadius: '50%', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.9981 11.9991C23.9981 5.37216 18.626 0 11.9991 0C5.37216 0 0 5.37216 0 11.9991C0 17.9882 4.38789 22.9522 10.1242 23.8524V15.4676H7.07758V11.9991H10.1242V9.35553C10.1242 6.34826 11.9156 4.68714 14.6564 4.68714C15.9692 4.68714 17.3424 4.92149 17.3424 4.92149V7.87439H15.8294C14.3388 7.87439 13.874 8.79933 13.874 9.74824V11.9991H17.2018L16.6698 15.4676H13.874V23.8524C19.6103 22.9522 23.9981 17.9882 23.9981 11.9991Z" fill="white"/>
                  </svg>
                </div>
                Facebook ilə daxil ol
              </>
            )}
          </button>
        </div>

        <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#64748b' }}>
          {t('login_no_account')}{' '}
          <Link href="/register" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: 600 }}>
            {t('login_register_link')}
          </Link>
        </div>

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
          .oauth-btn {
            width: 100%;
            padding: 1rem 1.5rem;
            background: linear-gradient(135deg, #1e293b, #0f172a);
            color: white;
            border: 1px solid rgba(255,255,255,0.1);
            border-radius: 14px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            z-index: 1;
          }
          .oauth-btn::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            opacity: 0;
            z-index: -1;
            transition: opacity 0.3s ease;
          }
          .google-btn::before {
            background: linear-gradient(135deg, #2563eb, #06b6d4);
          }
          .facebook-btn::before {
            background: linear-gradient(135deg, #1877F2, #0e56b4);
          }
          .oauth-btn:hover {
            transform: translateY(-2px);
            border-color: rgba(255,255,255,0.2);
          }
          .google-btn:hover {
            box-shadow: 0 10px 20px -10px rgba(14, 165, 233, 0.5);
          }
          .facebook-btn:hover {
            box-shadow: 0 10px 20px -10px rgba(24, 119, 242, 0.5);
          }
          .oauth-btn:hover::before {
            opacity: 1;
          }
          .oauth-btn:disabled {
            cursor: not-allowed;
            opacity: 0.7;
            transform: none;
            box-shadow: none;
          }
          .oauth-btn:disabled::before {
            display: none;
          }
        `}} />
      </div>
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

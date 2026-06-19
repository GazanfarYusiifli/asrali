'use client';

import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useI18n } from '../context/I18nContext';

export default function ForgotPasswordPage() {
  const { t } = useI18n();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState('');

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Zəhmət olmasa E-poçt ünvanını daxil edin.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      setSuccess(true);
    } catch (err: any) {
      console.error('Reset Password Error:', err.message);
      setError('Xəta baş verdi. Zəhmət olmasa E-poçt ünvanının düzgünlüyünü yoxlayın və yenidən cəhd edin.');
    } finally {
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
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'white', marginBottom: '0.5rem', letterSpacing: '-1px' }}>
            Şifrəni Bərpa Et
          </h1>
        </Link>
        
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', marginBottom: '2.5rem', lineHeight: 1.5 }}>
          Zəhmət olmasa hesabınıza aid e-poçt ünvanını daxil edin. Sizə şifrəni yeniləmək üçün link göndərəcəyik.
        </p>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#fca5a5', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 500 }}>
            {error}
          </div>
        )}

        {success ? (
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#6ee7b7', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>E-poçt Göndərildi!</h3>
            <p style={{ fontSize: '0.9rem', color: '#a7f3d0' }}>
              Daxil etdiyiniz e-poçt ünvanına şifrəni yeniləmək üçün xüsusi bir link göndərdik. Lütfən e-poçtunuzu (həmçinin Spam qovluğunu) yoxlayın.
            </p>
          </div>
        ) : (
          <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', marginBottom: '1.5rem', textAlign: 'left' }}>
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: 500 }}>E-poçt Ünvanı</label>
              <input 
                type="email" 
                placeholder="email@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                required
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="submit-btn"
            >
              {loading ? <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} /> : 'Bərpa Linkini Göndər'}
            </button>
          </form>
        )}

        <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#64748b' }}>
          Yenidən daxil olmaq istəyirsiniz?{' '}
          <Link href="/login" style={{ color: '#0ea5e9', textDecoration: 'none', fontWeight: 600 }}>
            Geri qayıt
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
        `}} />
      </div>
    </div>
  );
}

'use client';
import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';

function SuccessPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updateSubscription } = useAuth();
  
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      setStatus('error');
      setErrorMessage('Ödəniş sessiyası tapılmadı. Təhlükəsizlik səbəbilə əməliyyat ləğv edildi.');
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await fetch('/api/verify-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId })
        });
        
        const data = await res.json();
        
        if (data.status === 'paid') {
          // Doğrulama uğurlu oldu!
          setStatus('success');
          updateSubscription({ status: 'PRO', trialStartDate: null });
          
          setTimeout(() => {
            router.push('/erp/dashboard');
          }, 3500);
        } else {
          setStatus('error');
          setErrorMessage('Ödəniş hələ təsdiqlənməyib və ya xəta baş verib.');
        }
      } catch (err) {
        setStatus('error');
        setErrorMessage('Serverlə əlaqə qurularkən xəta baş verdi.');
      }
    };

    verifyPayment();
  }, [searchParams, router, updateSubscription]);

  return (
    <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: '2rem' }}>
      <div style={{ backgroundColor: 'white', padding: '4rem', borderRadius: '24px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0', maxWidth: '500px', width: '100%' }}>
        
        {status === 'verifying' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <Loader2 size={48} color="#635BFF" style={{ animation: 'spin 1s linear infinite' }} />
            <h2 style={{ fontSize: '1.5rem', color: '#334155', fontWeight: 600 }}>Ödəniş Təsdiqlənir...</h2>
            <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Stripe serverləri ilə əlaqə qurulur. Zəhmət olmasa gözləyin.</p>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {status === 'success' && (
          <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ width: '80px', height: '80px', backgroundColor: '#d1fae5', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto' }}>
              <CheckCircle2 size={40} />
            </div>
            <h2 style={{ fontSize: '2rem', color: '#0f172a', marginBottom: '1rem', fontWeight: 800 }}>Təbriklər!</h2>
            <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
              Ödənişiniz <strong>Stripe</strong> tərəfindən uğurla doğrulandı. <br />
              Siz artıq <strong style={{ color: '#10b981' }}>ASHRALI PRO</strong> istifadəçisisiniz!
            </p>
            <p style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Sistemə yönləndirilirsiniz...</p>
          </div>
        )}

        {status === 'error' && (
          <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ width: '80px', height: '80px', backgroundColor: '#fee2e2', color: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem auto' }}>
              <XCircle size={40} />
            </div>
            <h2 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '1rem', fontWeight: 800 }}>Xəta Baş Verdi</h2>
            <p style={{ color: '#ef4444', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem', fontWeight: 600 }}>
              {errorMessage}
            </p>
            <button onClick={() => router.push('/erp/upgrade')} style={{ padding: '0.8rem 1.5rem', backgroundColor: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>Geriyə Qayıt</button>
          </div>
        )}

        <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem' }}>Yüklənir...</div>}>
      <SuccessPageInner />
    </Suspense>
  );
}

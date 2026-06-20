'use client';
import React, { useState } from 'react';
import { CreditCard, ShieldCheck, ArrowLeft, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);

  const handleStripeCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe Checkout
      } else {
        console.error("Stripe xətası:", data);
        alert("Ödəniş sisteminə qoşularkən xəta baş verdi.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Şəbəkə xətası:", error);
      alert("Şəbəkə xətası baş verdi.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100%', padding: '3rem 2rem', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'center' }}>
      
      <div style={{ maxWidth: '600px', width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        <Link href="/erp/upgrade" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>
          <ArrowLeft size={18} /> Paketlərə Qayıt
        </Link>
        
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', letterSpacing: '-0.5px' }}>Sifarişinizi Rəsmiləşdirin</h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem' }}>ASRALI PRO üçün ödəniş mərhələsi</p>
        </div>

        <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '2.5rem', border: '1px solid #e2e8f0', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#334155', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CreditCard size={22} color="#10b981" /> Sifarişin Detalları
          </h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#475569', fontSize: '1.05rem' }}>
            <span>PRO Paket (Aylıq)</span>
            <span style={{ fontWeight: 600 }}>49.00 AZN</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: '#475569', fontSize: '1.05rem' }}>
            <span>ƏDV (18%)</span>
            <span style={{ fontWeight: 600 }}>8.82 AZN</span>
          </div>
          <div style={{ height: '2px', backgroundColor: '#e2e8f0', margin: '1.5rem 0' }}></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1e293b' }}>Yekun Məbləğ:</span>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>57.82 AZN</span>
          </div>

          <a 
            href="https://buy.stripe.com/28EcN71kb8c64F9a9geUU02"
            style={{ 
              width: '100%', 
              padding: '1.2rem', 
              background: '#635BFF', // Stripe brand color
              color: 'white', 
              border: 'none', 
              borderRadius: '14px', 
              fontWeight: 800, 
              fontSize: '1.1rem', 
              cursor: 'pointer', 
              transition: 'all 0.2s', 
              boxShadow: '0 10px 15px -3px rgba(99,91,255,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              textDecoration: 'none'
            }}
          >
            Stripe ilə Ödəniş Et (Live) <ExternalLink size={20} />
          </a>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#64748b', fontSize: '0.9rem', backgroundColor: '#f1f5f9', padding: '1.5rem', borderRadius: '16px', justifyContent: 'center', textAlign: 'center' }}>
          <ShieldCheck size={28} color="#635BFF" style={{ flexShrink: 0 }} />
          <span>Siz dünyanın ən təhlükəsiz ödəniş infrastrukturu olan <strong>Stripe</strong> səhifəsinə yönləndiriləcəksiniz. Kart məlumatlarınız bizdə saxlanılmır.</span>
        </div>

      </div>
    </div>
  );
}

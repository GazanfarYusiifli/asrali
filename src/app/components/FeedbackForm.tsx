'use client';
import React, { useState } from 'react';

export default function FeedbackForm() {
  const [form, setForm] = useState({ name: '', email: '', type: 'suggestion', message: '' });
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const set = (field: string, val: string) => setForm(prev => ({ ...prev, [field]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) return;
    setStatus('sending');
    // Simulate sending (no backend needed — just show success)
    await new Promise(r => setTimeout(r, 1200));
    setStatus('sent');
  };

  const types = [
    { key: 'suggestion', label: '💡 Təklif' },
    { key: 'bug', label: '🐛 Xəta bildirişi' },
    { key: 'praise', label: '👏 Rəy' },
    { key: 'question', label: '❓ Sual' },
  ];

  if (status === 'sent') {
    return (
      <div style={{
        backgroundColor: '#0f2d1f', border: '1px solid #166534', borderRadius: '20px',
        padding: '3rem', textAlign: 'center',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
        <h3 style={{ color: '#4ade80', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.75rem' }}>
          Təşəkkür edirik!
        </h3>
        <p style={{ color: '#86efac', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
          Mesajınız uğurla göndərildi. Tezliklə sizinlə əlaqə saxlayacağıq.
        </p>
        <button
          onClick={() => { setStatus('idle'); setForm({ name: '', email: '', type: 'suggestion', message: '' }); setRating(0); }}
          style={{ padding: '0.65rem 1.5rem', background: 'linear-gradient(135deg,#10b981,#059669)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}
        >
          Yeni Mesaj Göndər
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}
      style={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '20px', padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Name + Email row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ad Soyad *</label>
          <input required value={form.name} onChange={e => set('name', e.target.value)}
            placeholder="Adınızı yazın"
            style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: 'white', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', transition: 'border 0.2s' }}
            onFocus={e => e.target.style.borderColor = '#10b981'}
            onBlur={e => e.target.style.borderColor = '#334155'}
          />
        </div>
        <div>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
            placeholder="email@example.com"
            style={{ width: '100%', padding: '0.75rem 1rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: 'white', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', transition: 'border 0.2s' }}
            onFocus={e => e.target.style.borderColor = '#10b981'}
            onBlur={e => e.target.style.borderColor = '#334155'}
          />
        </div>
      </div>

      {/* Type selector */}
      <div>
        <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mesaj növü</label>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {types.map(t => (
            <button type="button" key={t.key} onClick={() => set('type', t.key)}
              style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: form.type === t.key ? '1px solid #10b981' : '1px solid #334155', backgroundColor: form.type === t.key ? '#064e3b' : 'transparent', color: form.type === t.key ? '#10b981' : '#94a3b8', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', transition: 'all 0.2s' }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Star Rating */}
      <div>
        <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Qiymətləndirmə</label>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {[1, 2, 3, 4, 5].map(star => (
            <button type="button" key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '2rem', padding: '0', lineHeight: 1, transition: 'transform 0.15s', transform: (hoverRating || rating) >= star ? 'scale(1.2)' : 'scale(1)' }}>
              {(hoverRating || rating) >= star ? '⭐' : '☆'}
            </button>
          ))}
          {rating > 0 && (
            <span style={{ color: '#64748b', fontSize: '0.85rem', alignSelf: 'center', marginLeft: '0.5rem' }}>
              {['', 'Pis', 'Orta', 'Yaxşı', 'Çox yaxşı', 'Əla!'][rating]}
            </span>
          )}
        </div>
      </div>

      {/* Message */}
      <div>
        <label style={{ display: 'block', color: '#94a3b8', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mesajınız *</label>
        <textarea required value={form.message} onChange={e => set('message', e.target.value)}
          rows={5} placeholder="Fikirlərinizi, təkliflərinizi və ya şikayətlərinizi burada yazın..."
          style={{ width: '100%', padding: '0.85rem 1rem', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '10px', color: 'white', fontSize: '0.9rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.6, transition: 'border 0.2s' }}
          onFocus={e => e.target.style.borderColor = '#10b981'}
          onBlur={e => e.target.style.borderColor = '#334155'}
        />
        <div style={{ textAlign: 'right', color: '#475569', fontSize: '0.75rem', marginTop: '0.3rem' }}>{form.message.length} simvol</div>
      </div>

      {/* Submit */}
      <button type="submit" disabled={status === 'sending' || !form.name || !form.message}
        style={{ padding: '1rem', background: (!form.name || !form.message) ? '#1e293b' : 'linear-gradient(135deg, #10b981, #059669)', color: (!form.name || !form.message) ? '#475569' : 'white', border: '1px solid #334155', borderRadius: '12px', fontWeight: 800, fontSize: '1rem', cursor: (!form.name || !form.message) ? 'not-allowed' : 'pointer', transition: 'all 0.2s', boxShadow: (!form.name || !form.message) ? 'none' : '0 4px 15px rgba(16,185,129,0.3)' }}>
        {status === 'sending' ? '⏳ Göndərilir...' : '📨 Göndər'}
      </button>
    </form>
  );
}

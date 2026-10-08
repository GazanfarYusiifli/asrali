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
        backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '24px',
        padding: '3rem', textAlign: 'center', boxShadow: '0 10px 25px -5px rgba(16, 185, 129, 0.1)'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
        <h3 style={{ color: '#15803d', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.75rem' }}>
          Təşəkkür edirik!
        </h3>
        <p style={{ color: '#166534', lineHeight: 1.6, margin: '0 0 1.5rem' }}>
          Mesajınız uğurla qəbul edildi. Tezliklə sizinlə əlaqə saxlayacağıq.
        </p>
        <button
          onClick={() => { setStatus('idle'); setForm({ name: '', email: '', type: 'suggestion', message: '' }); setRating(0); }}
          style={{ padding: '0.75rem 1.75rem', background: 'linear-gradient(135deg,#10b981,#059669)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', fontSize: '0.92rem', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)' }}
        >
          Yeni Mesaj Göndər
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}
      style={{ 
        backgroundColor: '#ffffff', 
        border: '1px solid #e2e8f0', 
        borderRadius: '24px', 
        padding: '2.5rem', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '1.5rem',
        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.05)'
      }}>

      {/* Name + Email row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', color: '#475569', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ad Soyad *</label>
          <input required value={form.name} onChange={e => set('name', e.target.value)}
            placeholder="Adınızı daxil edin"
            style={{ width: '100%', padding: '0.85rem 1rem', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', color: '#0f172a', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s' }}
            onFocus={e => { e.target.style.borderColor = '#10b981'; e.target.style.backgroundColor = '#ffffff'; }}
            onBlur={e => { e.target.style.borderColor = '#cbd5e1'; e.target.style.backgroundColor = '#f8fafc'; }}
          />
        </div>
        <div>
          <label style={{ display: 'block', color: '#475569', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</label>
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
            placeholder="email@example.com"
            style={{ width: '100%', padding: '0.85rem 1rem', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', color: '#0f172a', fontSize: '0.92rem', outline: 'none', boxSizing: 'border-box', transition: 'all 0.2s' }}
            onFocus={e => { e.target.style.borderColor = '#10b981'; e.target.style.backgroundColor = '#ffffff'; }}
            onBlur={e => { e.target.style.borderColor = '#cbd5e1'; e.target.style.backgroundColor = '#f8fafc'; }}
          />
        </div>
      </div>

      {/* Type selector */}
      <div>
        <label style={{ display: 'block', color: '#475569', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mesaj növü</label>
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
          {types.map(t => (
            <button type="button" key={t.key} onClick={() => set('type', t.key)}
              style={{ 
                padding: '0.55rem 1.15rem', 
                borderRadius: '10px', 
                border: form.type === t.key ? '1px solid #10b981' : '1px solid #e2e8f0', 
                backgroundColor: form.type === t.key ? '#ecfdf5' : '#f8fafc', 
                color: form.type === t.key ? '#047857' : '#64748b', 
                fontWeight: 700, 
                fontSize: '0.88rem', 
                cursor: 'pointer', 
                transition: 'all 0.2s' 
              }}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Star Rating */}
      <div>
        <label style={{ display: 'block', color: '#475569', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Qiymətləndirmə</label>
        <div style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
          {[1, 2, 3, 4, 5].map(star => (
            <button type="button" key={star}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.85rem', padding: '0', lineHeight: 1, transition: 'transform 0.15s', transform: (hoverRating || rating) >= star ? 'scale(1.15)' : 'scale(1)' }}>
              {(hoverRating || rating) >= star ? '⭐' : '☆'}
            </button>
          ))}
          {rating > 0 && (
            <span style={{ color: '#047857', fontWeight: 700, fontSize: '0.9rem', marginLeft: '0.75rem' }}>
              {['', 'Zəif', 'Orta', 'Yaxşı', 'Çox yaxşı', 'Mükəmməl!'][rating]}
            </span>
          )}
        </div>
      </div>

      {/* Message */}
      <div>
        <label style={{ display: 'block', color: '#475569', fontSize: '0.82rem', fontWeight: 700, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mesajınız *</label>
        <textarea required value={form.message} onChange={e => set('message', e.target.value)}
          rows={5} placeholder="Fikirlərinizi, təkliflərinizi və ya suallarınızı qeyd edin..."
          style={{ width: '100%', padding: '0.9rem 1rem', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', color: '#0f172a', fontSize: '0.92rem', outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit', lineHeight: 1.6, transition: 'all 0.2s' }}
          onFocus={e => { e.target.style.borderColor = '#10b981'; e.target.style.backgroundColor = '#ffffff'; }}
          onBlur={e => { e.target.style.borderColor = '#cbd5e1'; e.target.style.backgroundColor = '#f8fafc'; }}
        />
        <div style={{ textAlign: 'right', color: '#94a3b8', fontSize: '0.78rem', marginTop: '0.35rem' }}>{form.message.length} simvol</div>
      </div>

      {/* Submit */}
      <button type="submit" disabled={status === 'sending' || !form.name || !form.message}
        style={{ 
          padding: '1rem', 
          background: (!form.name || !form.message) ? '#e2e8f0' : 'linear-gradient(135deg, #10b981, #059669)', 
          color: (!form.name || !form.message) ? '#94a3b8' : 'white', 
          border: 'none', 
          borderRadius: '12px', 
          fontWeight: 800, 
          fontSize: '1rem', 
          cursor: (!form.name || !form.message) ? 'not-allowed' : 'pointer', 
          transition: 'all 0.25s', 
          boxShadow: (!form.name || !form.message) ? 'none' : '0 6px 20px rgba(16, 185, 129, 0.35)' 
        }}>
        {status === 'sending' ? '⏳ Göndərilir...' : '📨 Rəyi Göndər'}
      </button>
    </form>
  );
}

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';

const SpeechRecognition = typeof window !== 'undefined' ? 
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition : null;

export default function VoiceAssistant() {
  const router = useRouter();
  const { signOut } = useAuth();
  
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const [mounted, setMounted] = useState(false);
  
  const [convMode, setConvMode] = useState<'navigation' | 'create_expense' | 'create_sale'>('navigation');
  const [expenseStep, setExpenseStep] = useState<'amount' | 'category' | 'desc' | null>(null);
  const [expenseDraft, setExpenseDraft] = useState({ mebleg: '', kateqoriya: '', aciqlama: '' });
  
  const [saleStep, setSaleStep] = useState<'amount' | 'customer' | 'desc' | null>(null);
  const [saleDraft, setSaleDraft] = useState({ mebleg: '', musteri: '', aciqlama: '' });

  const recognitionRef = useRef<any>(null);

  const speakAndListen = useCallback((text: string) => {
    setFeedback(text);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Mute any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'az-AZ';
      
      // We don't want the mic to listen to the bot's own voice
      if (isListening) recognitionRef.current?.stop();
      
      utterance.onend = () => {
        setTimeout(() => {
          try {
            recognitionRef.current?.start();
          } catch(e) {}
        }, 300);
      };
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => {
        try {
          recognitionRef.current?.start();
        } catch(e) {}
      }, 1500);
    }
  }, [isListening]);

  useEffect(() => {
    setMounted(true);
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'az-AZ';

      recognition.onstart = () => {
        setIsListening(true);
        setFeedback('Sizi dinləyirəm...');
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const result = event.results[current][0].transcript;
        setTranscript(result);
        processCommand(result.toLowerCase());
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          setFeedback('Mikrofona icazə verilmədi. Brauzer ayarlarına baxın.');
        } else if (event.error === 'service-not-allowed') {
          setFeedback('Brauzer səs xidmətini bloklayır (Chrome istifadə edin).');
        } else {
          setFeedback('Səsinizi anlaya bilmədim. Yenidən yoxlayın.');
        }
        
        setTimeout(() => setFeedback(''), 4000);
      };

      recognition.onend = () => {
        // Only set listening to false if we are NOT in a conversation mode that expects an answer
        // Actually, speech recognition stops automatically. We let speakAndListen restart it.
        setIsListening(false);
        if (feedback === 'Sizi dinləyirəm...') {
            setFeedback('');
        }
      };

      recognitionRef.current = recognition;
    }
  }, [router, signOut, speakAndListen]);

  const processCommand = useCallback((command: string) => {
    setFeedback(`Siz: "${command}"`);
    
    if (convMode === 'create_expense') {
      if (expenseStep === 'amount') {
        const amountMatch = command.match(/\d+/);
        if (amountMatch) {
          setExpenseDraft(prev => ({ ...prev, mebleg: amountMatch[0] }));
          setExpenseStep('category');
          speakAndListen("Məbləğ qeyd olundu. Hansı kateqoriyadır? Məsələn, Ofis xərci, maaş və ya komunal.");
        } else {
          speakAndListen("Məbləği rəqəmlə anlaya bilmədim. Zəhmət olmasa sadəcə rəqəm deyin.");
        }
        return;
      }
      if (expenseStep === 'category') {
        setExpenseDraft(prev => ({ ...prev, kateqoriya: command.charAt(0).toUpperCase() + command.slice(1) }));
        setExpenseStep('desc');
        speakAndListen("Aydındır. Bu xərc nə üçündür? Qısa açıqlama verin.");
        return;
      }
      if (expenseStep === 'desc') {
        const finalExpense = {
          id: Date.now(),
          tarix: new Date().toISOString().split('T')[0],
          kateqoriya: expenseDraft.kateqoriya,
          kassaBanka: 'Əsas Bank Hesabı',
          aciqlama: command.charAt(0).toUpperCase() + command.slice(1),
          mebleg: Number(expenseDraft.mebleg),
          valyuta: 'AZN',
          veziyyet: 'Ödənilib',
          tekrarla: 'Təkrarlanmır'
        };
        
        const storageKey = 'app_erp_expenses';
        let existing = [];
        try {
          existing = JSON.parse(localStorage.getItem(storageKey) || localStorage.getItem('erp_expenses') || '[]');
        } catch(e) {}
        existing.unshift(finalExpense);
        localStorage.setItem(storageKey, JSON.stringify(existing));
        // Also set without prefix just in case
        localStorage.setItem('erp_expenses', JSON.stringify(existing));
        
        setConvMode('navigation');
        setExpenseStep(null);
        setExpenseDraft({ mebleg: '', kateqoriya: '', aciqlama: '' });
        
        speakAndListen("Əla! Yeni xərc uğurla yaradıldı və yadda saxlanıldı.");
        
        setTimeout(() => {
          router.push('/erp/giderler/liste');
        }, 3000);
        return;
      }
    }

    if (convMode === 'create_sale') {
      if (saleStep === 'amount') {
        const amountMatch = command.match(/\d+/);
        if (amountMatch) {
          setSaleDraft(prev => ({ ...prev, mebleg: amountMatch[0] }));
          setSaleStep('customer');
          speakAndListen("Məbləğ qeyd olundu. Müştərinin adı nədir?");
        } else {
          speakAndListen("Məbləği rəqəmlə anlaya bilmədim. Zəhmət olmasa sadəcə rəqəm deyin.");
        }
        return;
      }
      if (saleStep === 'customer') {
        setSaleDraft(prev => ({ ...prev, musteri: command.charAt(0).toUpperCase() + command.slice(1) }));
        setSaleStep('desc');
        speakAndListen("Aydındır. Bu satış nə üçündür? Məhsulun və ya xidmətin adını qısa deyin.");
        return;
      }
      if (saleStep === 'desc') {
        const finalSale = {
          id: Date.now(),
          tarih: new Date().toISOString().split('T')[0],
          evrakNo: 'EVR-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 1000)).padStart(3, '0'),
          faturaNo: 'INV-' + String(Math.floor(Math.random() * 10000)).padStart(4, '0'),
          hesapAdi: saleDraft.musteri,
          aciklama: command.charAt(0).toUpperCase() + command.slice(1),
          teslimDurumu: 'Təslim Edildi',
          miktar: Number(saleDraft.mebleg)
        };
        
        const storageKey = 'app_erp_sales';
        let existing = [];
        try {
          existing = JSON.parse(localStorage.getItem(storageKey) || localStorage.getItem('erp_sales') || '[]');
        } catch(e) {}
        existing.unshift(finalSale);
        localStorage.setItem(storageKey, JSON.stringify(existing));
        localStorage.setItem('erp_sales', JSON.stringify(existing));
        
        setConvMode('navigation');
        setSaleStep(null);
        setSaleDraft({ mebleg: '', musteri: '', aciqlama: '' });
        
        speakAndListen("Əla! Yeni satış uğurla yaradıldı və yadda saxlanıldı.");
        
        setTimeout(() => {
          router.push('/erp/satislar/liste');
        }, 3000);
        return;
      }
    }

    // NORMAL NAVIGATION MODE
    if (command.includes('yeni xərc') || command.includes('xərc yarat')) {
      setConvMode('create_expense');
      setExpenseStep('amount');
      speakAndListen("Yeni xərc yaradırıq. Xərcin məbləği nə qədərdir?");
      return;
    }

    if (command.includes('yeni satış') || command.includes('satış yarat') || command.includes('satis yarat') || command.includes('satiş yarat')) {
      setConvMode('create_sale');
      setSaleStep('amount');
      speakAndListen("Yeni satış yaradırıq. Satışın məbləği nə qədərdir?");
      return;
    }

    // Baza naviqasiya əmrləri
    if (command.includes('satış') || command.includes('satiş')) {
      router.push('/erp/sales');
      return;
    }
    if (command.includes('alış') || command.includes('aliş')) {
      router.push('/erp/purchases');
      return;
    }
    if (command.includes('xərc')) {
      router.push('/erp/expenses');
      return;
    }
    if (command.includes('müştəri') || command.includes('müştəri')) {
      router.push('/erp/contacts');
      return;
    }
    if (command.includes('maliyyə')) {
      router.push('/erp/finance');
      return;
    }
    if (command.includes('inventar') || command.includes('anbar')) {
      router.push('/erp/inventory');
      return;
    }
    if (command.includes('ana səhifə') || command.includes('idarə paneli') || command.includes('panel')) {
      router.push('/erp/dashboard');
      return;
    }
    if (command.includes('çıxış') || command.includes('sistemdən çıx')) {
      signOut();
      return;
    }

    // Əgər komanda tapılmadısa
    const errorMsg = 'Sizi anlaya bilmədim, fərqli şəkildə deyin.';
    setFeedback(errorMsg);
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(errorMsg);
      u.lang = 'az-AZ';
      window.speechSynthesis.speak(u);
    }
    setTimeout(() => setFeedback(''), 3000);
  }, [router, signOut, convMode, expenseStep, expenseDraft, speakAndListen]);

  const toggleListening = () => {
    if (!SpeechRecognition) {
      alert('Sizin brauzeriniz səsli idarəetməni (Speech API) dəstəkləmir. Zəhmət olmasa Google Chrome istifadə edin.');
      return;
    }

    if (isListening) {
      window.speechSynthesis.cancel();
      recognitionRef.current?.stop();
      // Reset state if manually stopped
      setConvMode('navigation');
      setExpenseStep(null);
      setSaleStep(null);
    } else {
      setTranscript('');
      try { recognitionRef.current?.start(); } catch(e) {}
    }
  };

  // Hydration və brauzer dəstəyi yoxlanışı
  if (!mounted || !SpeechRecognition) return null;

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
      
      {/* Feedback Popover */}
      {feedback && (
        <div style={{
          backgroundColor: '#1e293b',
          color: 'white',
          padding: '0.75rem 1rem',
          borderRadius: '12px',
          fontSize: '0.85rem',
          fontWeight: 600,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
          animation: 'fadeIn 0.3s ease',
          maxWidth: '250px',
          textAlign: 'center'
        }}>
          {feedback}
        </div>
      )}

      <button
        onClick={toggleListening}
        title="Səsli İdarəetmə"
        style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          backgroundColor: isListening ? '#ef4444' : '#0ea5e9',
          color: 'white',
          border: 'none',
          boxShadow: isListening ? '0 0 20px rgba(239, 68, 68, 0.5)' : '0 10px 25px -5px rgba(14, 165, 233, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          position: 'relative'
        }}
      >
        {isListening && (
          <span style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '2px solid #ef4444',
            animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
            opacity: 0.7
          }}></span>
        )}
        
        {/* SVG Microphone Icon */}
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" y1="19" x2="12" y2="22"/>
        </svg>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes ping {
            75%, 100% {
              transform: scale(1.6);
              opacity: 0;
            }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}} />
      </button>
    </div>
  );
}

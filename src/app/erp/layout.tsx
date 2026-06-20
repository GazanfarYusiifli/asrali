'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, Role } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import VoiceAssistant from '@/components/VoiceAssistant';

import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';
import { 
  LayoutDashboard, ShoppingCart, ShoppingBag, TrendingDown, Users, 
  CreditCard, Package, Settings, Wrench, FileCheck, Globe, BarChart3, HelpCircle, 
  ChevronDown, ChevronRight, LogOut, Bell, Wallet
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, role, subscription, trialDaysLeft, updateSubscription, logout } = useAuth();
  
  const menuNames = [
    'Ümumi Baxış', 'Satışlar', 'Alışlar', 'Xərclər', 'Müştəri və Təchizatçı',
    'Kassa və Bank', 'Anbar', 'Digər Xüsusiyyətlər', 'E-Faktura', 'E-Ticarət',
    'Hesabatlar', 'Sistem Tənzimləmələri', 'Dəstək'
  ];
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const checkExpenses = () => {
      if (typeof window === 'undefined') return;
      const expenses = JSON.parse(getAppStorage('erp_expenses') || '[]');
      const notifs: any[] = [];
      const today = new Date();
      
      expenses.forEach((exp: any) => {
        if (exp.tekrarla && exp.tekrarla !== 'Təkrarlanmır') {
          let nextDate = new Date(exp.tarix);
          // If the date is invalid, skip
          if (isNaN(nextDate.getTime())) return;

          // Push the nextDate to the future
          while (nextDate < today) {
            if (exp.tekrarla === 'Hər Həftə') nextDate.setDate(nextDate.getDate() + 7);
            else if (exp.tekrarla === 'Hər Ay') nextDate.setMonth(nextDate.getMonth() + 1);
            else if (exp.tekrarla === 'Hər 3 Aydan Bir') nextDate.setMonth(nextDate.getMonth() + 3);
            else if (exp.tekrarla === 'Hər İl') nextDate.setFullYear(nextDate.getFullYear() + 1);
            else break;
          }

          const diffTime = nextDate.getTime() - today.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays <= 5 && diffDays >= 0) {
            notifs.push({
              id: exp.id + 'n1',
              type: 'warning',
              title: 'Xərc Vaxtı Yaxınlaşır',
              desc: `"${exp.aciqlama || exp.kateqoriya}" təkrarlanan ödənişinin vaxtına ${diffDays} gün qaldı.`,
            });
          } else if (exp.veziyyet === 'Ödənilməyib') {
             notifs.push({
              id: exp.id + 'n2',
              type: 'danger',
              title: 'Gecikmiş Ödəniş',
              desc: `"${exp.aciqlama || exp.kateqoriya}" ödənişi hələ edilməyib.`,
            });
          }
        }
      });
      setNotifications(notifs);
    };
    checkExpenses();
    // Update active menu based on pathname
    const activeMenu = menuStructure.find(m => 
      m.subItems?.some(sub => pathname === sub.path || pathname.startsWith(sub.path + '/')) || pathname === m.path
    );
    if (activeMenu && !openMenus.includes(activeMenu.name)) {
      setOpenMenus([activeMenu.name]);
    }
  }, [pathname]);

  useEffect(() => {
    if (loading) return;

    // Check authentication first
    if (user === null) {
      router.push('/login');
      return;
    }

    if (subscription?.status === 'EXPIRED' && !pathname.startsWith('/erp/upgrade')) {
      router.push('/erp/upgrade');
    }
  }, [user, loading, subscription?.status, pathname, router]);

  const toggleMenu = (menuName: string) => {
    setOpenMenus(prev => prev.includes(menuName) ? [] : [menuName]);
  };

  const menuStructure = [
    {
      name: t('menu_dashboard'),
      icon: <LayoutDashboard size={20} />,
      roles: ['SUPERADMIN', 'ACCOUNTANT'],
      path: '/erp/dashboard',
      subItems: [],
      separatorAfter: true
    },
    {
      name: t('menu_sales'),
      icon: <ShoppingCart size={20} />,
      roles: ['SUPERADMIN', 'ACCOUNTANT'],
      subItems: [
        { name: t('sub_sales_list'), path: '/erp/satislar/liste' },
        { name: t('sub_quotes'), path: '/erp/satislar/teklifler' },
        { name: t('sub_calendar'), path: '/erp/satislar/takvim' },
        { name: t('sub_smm'), path: '/erp/satislar/smm' },
        { name: t('sub_sales_report'), path: '/erp/satislar/rapor' },
        { name: t('sub_bulk_invoice'), path: '/erp/satislar/toplu-fatura' }
      ]
    },
    {
      name: t('menu_purchases'),
      icon: <ShoppingBag size={20} />,
      roles: ['SUPERADMIN', 'ACCOUNTANT'],
      subItems: [
        { name: t('sub_purchases_list'), path: '/erp/alislar/liste' },
        { name: t('sub_purchases_report'), path: '/erp/alislar/rapor' }
      ]
    },
    {
      name: t('menu_expenses'),
      icon: <TrendingDown size={20} />,
      roles: ['SUPERADMIN', 'ACCOUNTANT'],
      subItems: [
        { name: t('sub_expenses_list'), path: '/erp/giderler/liste' },
        { name: t('sub_recurring_expenses'), path: '/erp/giderler/tekrarlayan' },
        { name: t('sub_payroll'), path: '/erp/giderler/personel' },
        { name: t('sub_projects'), path: '/erp/giderler/proje' }
      ],
      separatorAfter: true
    },
    {
      name: t('menu_crm'),
      icon: <Users size={20} />,
      roles: ['SUPERADMIN', 'ACCOUNTANT'],
      subItems: [
        { name: t('sub_customer_list'), path: '/erp/cari/musteriler' },
        { name: t('sub_supplier_list'), path: '/erp/cari/tedarikciler' },
        { name: t('sub_search'), path: '/erp/cari/arama' }
      ]
    },
    {
      name: t('menu_finance'),
      icon: <Wallet size={20} />,
      roles: ['SUPERADMIN', 'ACCOUNTANT'],
      subItems: [
        { name: t('sub_transactions'), path: '/erp/finans/islemler' },
        { name: t('sub_assets'), path: '/erp/finans/aktivler' },
        { name: t('sub_bank_integration'), path: '/erp/finans/entegrasyon' },
        { name: t('sub_credit_calc'), path: '/erp/finans/kredit' }
      ]
    },
    {
      name: t('menu_inventory'),
      icon: <Package size={20} />,
      roles: ['SUPERADMIN', 'ACCOUNTANT'],
      subItems: [
        { name: t('sub_product_list'), path: '/erp/stok/urunler' },
        { name: t('sub_inventory_count'), path: '/erp/stok/sayim' },
        { name: t('sub_inventory_transfer'), path: '/erp/stok/transfer' },
        { name: t('sub_warehouse'), path: '/erp/stok/depolar' },
        { name: t('sub_special_price'), path: '/erp/stok/ozel-fiyat' }
      ],
      separatorAfter: true
    },
    {
      name: t('menu_other'),
      icon: <Wrench size={20} />,
      roles: ['SUPERADMIN', 'ACCOUNTANT'],
      subItems: [
        { name: t('sub_checks'), path: '/erp/diger/cek-senet' },
        { name: t('sub_service'), path: '/erp/diger/servis' },
        { name: t('sub_erecon'), path: '/erp/diger/mutabakat' }
      ]
    },
    {
      name: t('menu_einvoice'),
      icon: <FileCheck size={20} />,
      roles: ['SUPERADMIN', 'ACCOUNTANT'],
      subItems: [
        { name: t('sub_new_einvoice'), path: '/erp/efatura/irsaliye' },
        { name: t('sub_in_einvoice'), path: '/erp/efatura/gelen' },
        { name: t('sub_out_einvoice'), path: '/erp/efatura/giden' },
        { name: t('sub_rejected_einvoice'), path: '/erp/efatura/red' },
        { name: t('sub_error_einvoice'), path: '/erp/efatura/hatali' }
      ]
    },
    {
      name: t('menu_ecommerce'),
      icon: <Globe size={20} />,
      roles: ['SUPERADMIN', 'ACCOUNTANT'],
      isPro: true,
      subItems: [
        { name: t('sub_in_orders'), path: '/erp/eticaret/pro' },
        { name: t('sub_settings'), path: '/erp/eticaret/pro' }
      ]
    },
    {
      name: t('menu_support'),
      icon: <HelpCircle size={20} />,
      roles: ['SUPERADMIN', 'ACCOUNTANT'],
      subItems: [
        { name: t('sub_support_center'), path: '/erp/yardim' }
      ]
    }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)', width: '100%', overflowX: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{
        width: '300px',
        backgroundColor: '#1e293b', // Dark sidebar like ticari bulut
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <img src="/logo.png" alt="ASRALI" style={{ height: "32px", width: "auto", borderRadius: "8px" }} />
        </div>

        <nav style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.5rem' }}>
          {menuStructure.filter(menu => menu.roles.includes(role)).map((menu) => {
            const hasSubItems = menu.subItems && menu.subItems.length > 0;
            const isOpen = openMenus.includes(menu.name);
            const isAnyChildActive = hasSubItems 
              ? menu.subItems.some(sub => pathname === sub.path || pathname.startsWith(sub.path + '/')) 
              : pathname === menu.path;

            if (!hasSubItems && menu.path) {
              return (
                <div key={menu.name} style={{ marginBottom: '0.25rem' }}>
                  <Link
                    href={menu.path}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.6rem 1rem',
                      borderRadius: '8px',
                      backgroundColor: isAnyChildActive ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                      color: isAnyChildActive ? '#10b981' : '#cbd5e1',
                      fontWeight: isAnyChildActive ? 600 : 500,
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ opacity: isAnyChildActive ? 1 : 0.7 }}>{menu.icon}</div>
                    {menu.name}
                  </Link>
                  {menu.separatorAfter && (
                    <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.08)', margin: '0.75rem 1rem' }}></div>
                  )}
                </div>
              );
            }

            return (
              <div key={menu.name} style={{ marginBottom: '0.25rem' }}>
                <button
                  onClick={() => toggleMenu(menu.name)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.75rem',
                    padding: '0.6rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: (isOpen || isAnyChildActive) ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                    color: (isOpen || isAnyChildActive) ? '#38bdf8' : '#cbd5e1',
                    fontWeight: (isOpen || isAnyChildActive) ? 600 : 500,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ opacity: (isOpen || isAnyChildActive) ? 1 : 0.7, color: (isOpen || isAnyChildActive) ? '#38bdf8' : 'inherit' }}>{menu.icon}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {menu.name}
                      {menu.isPro && <span style={{ backgroundColor: '#f59e0b', color: 'white', fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '4px', fontWeight: 800 }}>PRO</span>}
                    </div>
                  </div>
                  {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                
                {isOpen && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.1rem', marginTop: '0.25rem', paddingLeft: '2.5rem' }}>
                    {menu.subItems.map((subItem) => {
                      const isSubActive = pathname === subItem.path;
                      return (
                         <Link
                          key={subItem.name}
                          href={subItem.path}
                          style={{
                            padding: '0.5rem 0.75rem',
                            borderRadius: '6px',
                            backgroundColor: isSubActive ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                            color: isSubActive ? '#10b981' : '#94a3b8',
                            fontWeight: isSubActive ? 600 : 400,
                            fontSize: '0.85rem',
                            textDecoration: 'none',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {subItem.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
                
                {menu.separatorAfter && (
                  <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.08)', margin: '0.75rem 1rem' }}></div>
                )}
              </div>
            );
          })}
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, boxShadow: '0 2px 4px rgba(16,185,129,0.3)' }}>
              İ
            </div>
            <div>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'white', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email || 'İstifadəçi'}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, backgroundColor: '#f1f5f9' }}>
        <header style={{ 
          height: '64px', 
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          backgroundColor: 'white',
        }}>
          <div style={{ fontWeight: 600, color: '#334155', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            ASRALI 
            {subscription?.status === 'PRO' ? (
              <span 
                onClick={() => {
                  if(confirm('Test üçün Sadə Paketə (14 günlük) qayıtmaq istəyirsiniz?')) {
                    updateSubscription({ status: 'TRIAL', trialStartDate: new Date().toISOString() });
                    window.location.href = '/erp/dashboard';
                  }
                }}
                style={{ cursor: 'pointer', color: '#10b981', fontWeight: 700, fontSize: '0.75rem', padding: '0.2rem 0.6rem', backgroundColor: '#d1fae5', borderRadius: '12px', border: '1px solid #a7f3d0' }}
                title="Sıfırlamaq üçün klikləyin"
              >
                PRO Paket
              </span>
            ) : subscription?.status === 'TRIAL' ? (
              <Link href="/erp/upgrade" style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.75rem', padding: '0.2rem 0.6rem', backgroundColor: '#fef3c7', borderRadius: '12px', border: '1px solid #fde68a', textDecoration: 'none', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.filter = 'brightness(0.95)'} onMouseOut={e => e.currentTarget.style.filter = 'brightness(1)'}>Sadə Paket: {trialDaysLeft} gün qaldı</Link>
            ) : (
              <Link href="/erp/upgrade" style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.75rem', padding: '0.2rem 0.6rem', backgroundColor: '#fee2e2', borderRadius: '12px', border: '1px solid #fecaca', textDecoration: 'none', cursor: 'pointer', transition: 'all 0.2s' }} onMouseOver={e => e.currentTarget.style.filter = 'brightness(0.95)'} onMouseOut={e => e.currentTarget.style.filter = 'brightness(1)'}>Müddət Bitib</Link>
            )}
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <LanguageSwitcher />
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}
              >
                <Bell size={22} />
                {notifications.length > 0 && (
                  <span style={{ position: 'absolute', top: '-4px', right: '-4px', backgroundColor: '#ef4444', color: 'white', fontSize: '0.65rem', fontWeight: 800, width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div style={{ position: 'absolute', top: '40px', right: '-10px', width: '320px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', zIndex: 50, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '1rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: '#1e293b' }}>Bildirimlər</span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>{notifications.length} yeni</span>
                  </div>
                  <div style={{ maxHeight: '300px', overflowY: 'auto', padding: '0.5rem 0' }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>Yeni bildirim yoxdur.</div>
                    ) : (
                      notifications.map((notif, idx) => (
                        <div key={idx} style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '0.75rem', cursor: 'pointer', transition: 'background-color 0.2s' }} onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8fafc'} onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: notif.type === 'danger' ? '#ef4444' : '#f59e0b', marginTop: '6px', flexShrink: 0 }}></div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b', marginBottom: '0.2rem' }}>{notif.title}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: '1.4' }}>{notif.desc}</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={logout}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '0.4rem',
                padding: '0.5rem 1rem', 
                borderRadius: '8px', 
                border: '1px solid #e2e8f0',
                background: 'white',
                color: '#64748b',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <LogOut size={16} />
              {t('menu_logout')}
            </button>
          </div>
        </header>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </main>

      {/* Voice Assistant component */}
      <VoiceAssistant />
    </div>
  );
}

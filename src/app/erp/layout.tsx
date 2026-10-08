'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth, Role } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import VoiceAssistant from '@/components/VoiceAssistant';

import { createClient } from '@/utils/supabase/client';
import { getAppStorage, setAppStorage, removeAppStorage } from '@/utils/storage';
import { 
  LayoutDashboard, ShoppingCart, ShoppingBag, TrendingDown, Users, 
  CreditCard, Package, Settings, Wrench, FileCheck, Globe, BarChart3, HelpCircle, 
  ChevronDown, ChevronRight, LogOut, Bell, Wallet, Video, Brain,
  Building2, Briefcase, Share2, Shield, FolderGit2
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, role, subscription, trialDaysLeft, updateSubscription, logout } = useAuth();
  
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const checkNotifications = async () => {
      if (typeof window === 'undefined') return;
      
      const notifs: any[] = [];
      const today = new Date();
      
      // 1. Check Expenses
      const expenses = JSON.parse(getAppStorage('erp_expenses') || '[]');
      expenses.forEach((exp: any) => {
        if (exp.tekrarla && exp.tekrarla !== 'Təkrarlanmır') {
          let nextDate = new Date(exp.tarix);
          if (isNaN(nextDate.getTime())) return;

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

      // 2. Check Network Documents
      if (user?.id) {
        const supabase = createClient();
        const { data: networkDocs } = await supabase
          .from('network_documents')
          .select('id, title, document_type, sender:users!network_documents_sender_user_id_fkey(full_name)')
          .eq('receiver_user_id', user.id)
          .eq('status', 'PENDING');
          
        if (networkDocs) {
          networkDocs.forEach(doc => {
            notifs.push({
              id: doc.id,
              type: 'info',
              title: 'Yeni Sənəd: ' + doc.document_type,
              desc: `${doc.sender?.full_name || 'Bilinməyən'} tərəfindən sizə "${doc.title}" göndərildi. Baxmaq üçün klikləyin.`,
              link: '/erp/network'
            });
          });
        }
      }

      setNotifications(notifs);
    };
    
    checkNotifications();
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
  }, [user, loading, subscription?.status, pathname, router]);

  const toggleMenu = (menuName: string) => {
    setOpenMenus(prev => prev.includes(menuName) ? [] : [menuName]);
  };

  const menuStructure = [
    {
      name: 'İdarə Paneli',
      icon: <LayoutDashboard size={19} />,
      roles: ['SUPERADMIN', 'ACCOUNTANT', 'MANAGER', 'STAFF'],
      path: '/erp/dashboard',
      subItems: [],
      separatorAfter: true
    },
    {
      name: 'Satışlar',
      icon: <ShoppingCart size={19} />,
      roles: ['SUPERADMIN', 'ACCOUNTANT', 'MANAGER', 'STAFF'],
      subItems: [
        { name: 'Yeni Satış', path: '/erp/satislar/yeni' },
        { name: 'Sifarişlər', path: '/erp/satislar/liste' },
        { name: 'Təkliflər', path: '/erp/satislar/teklifler' },
        { name: 'Fakturalar', path: '/erp/documents/sales-invoice' },
        { name: 'İrsaliyyələr', path: '/erp/efatura/irsaliye' },
        { name: 'Qaytarmalar', path: '/erp/satislar/anonim' },
        { name: 'Satış Hesabatları', path: '/erp/satislar/rapor' }
      ]
    },
    {
      name: 'Alışlar',
      icon: <ShoppingBag size={19} />,
      roles: ['SUPERADMIN', 'ACCOUNTANT', 'MANAGER', 'STAFF'],
      subItems: [
        { name: 'Yeni Alış', path: '/erp/alislar/yeni' },
        { name: 'Alış Sifarişləri', path: '/erp/alislar/liste' },
        { name: 'Fakturalar', path: '/erp/documents/purchase-invoice' },
        { name: 'Qaytarmalar', path: '/erp/alislar/liste?filter=qaytarma' },
        { name: 'Alış Hesabatları', path: '/erp/alislar/rapor' }
      ]
    },
    {
      name: 'Anbar',
      icon: <Package size={19} />,
      roles: ['SUPERADMIN', 'ACCOUNTANT', 'MANAGER', 'STAFF'],
      subItems: [
        { name: 'Məhsullar', path: '/erp/stok/urunler' },
        { name: 'Kateqoriyalar', path: '/erp/stok/depolar' },
        { name: 'Anbarlar', path: '/erp/master-data/warehouses' },
        { name: 'Stok', path: '/erp/warehouse/stock-balance' },
        { name: 'Sayım', path: '/erp/stok/sayim' },
        { name: 'Transfer', path: '/erp/stok/transfer' },
        { name: 'Stok Düzəlişi', path: '/erp/stok/fiyat-guncelleme' },
        { name: 'Stok Hesabatları', path: '/erp/reports/warehouse' }
      ]
    },
    {
      name: 'Cari Hesablar',
      icon: <Users size={19} />,
      roles: ['SUPERADMIN', 'ACCOUNTANT', 'MANAGER', 'STAFF'],
      subItems: [
        { name: 'Müştərilər', path: '/erp/cari/musteriler' },
        { name: 'Təchizatçılar', path: '/erp/cari/tedarikciler' },
        { name: 'Borclar', path: '/erp/reports/debts' },
        { name: 'Ödənişlər', path: '/erp/finans/islemler' },
        { name: 'Üzləşmə', path: '/erp/diger/mutabakat' }
      ]
    },
    {
      name: 'Maliyyə',
      icon: <CreditCard size={19} />,
      roles: ['SUPERADMIN', 'ACCOUNTANT', 'MANAGER', 'STAFF'],
      subItems: [
        { name: 'Kassa', path: '/erp/finance/cash-balance' },
        { name: 'Bank', path: '/erp/finance/bank-accounts' },
        { name: 'Gəlirlər', path: '/erp/reports/income-expense' },
        { name: 'Xərclər', path: '/erp/giderler/liste' },
        { name: 'Ödənişlər', path: '/erp/finance/cash-operations' },
        { name: 'Aktivlər', path: '/erp/finans/aktivler' },
        { name: 'Çek / Veksəl', path: '/erp/diger/cek-senet' },
        { name: 'Maliyyə Hesabatları', path: '/erp/accounting/balance-sheet' }
      ]
    },
    {
      name: 'İnsan Resursları',
      icon: <Briefcase size={19} />,
      roles: ['SUPERADMIN', 'ACCOUNTANT', 'MANAGER'],
      subItems: [
        { name: 'İşçilər', path: '/erp/giderler/personel' },
        { name: 'Davamiyyət', path: '/erp/giderler/personel/icazeler' },
        { name: 'Məzuniyyət', path: '/erp/giderler/personel/icazeler' },
        { name: 'Maaş', path: '/erp/giderler/personel/toplu-maas' },
        { name: 'Bonus', path: '/erp/giderler/personel/satish-primi' },
        { name: 'İşçi Hesabatları', path: '/erp/giderler/personel/performans' }
      ]
    },
    {
      name: 'Filiallar',
      icon: <Building2 size={19} />,
      roles: ['SUPERADMIN', 'ACCOUNTANT', 'MANAGER'],
      subItems: [
        { name: 'Filiallar', path: '/erp/management/org-info' },
        { name: 'Şöbələr', path: '/erp/management/settings' },
        { name: 'Filial Hesabatları', path: '/erp/reports/periodic' }
      ]
    },
    {
      name: 'E-Qaimə / E-Sənədlər',
      icon: <FileCheck size={19} />,
      roles: ['SUPERADMIN', 'ACCOUNTANT', 'MANAGER', 'STAFF'],
      subItems: [
        { name: 'Yeni E-Qaimə', path: '/erp/efatura/irsaliye' },
        { name: 'Gələn', path: '/erp/efatura/gelen' },
        { name: 'Göndərilən', path: '/erp/efatura/giden' },
        { name: 'Rədd edilən', path: '/erp/efatura/red' },
        { name: 'Xətalı', path: '/erp/efatura/hatali' },
        { name: 'İrsaliyyələr', path: '/erp/efatura/irsaliye' }
      ]
    },
    {
      name: 'Texniki Servis',
      icon: <Wrench size={19} />,
      roles: ['SUPERADMIN', 'ACCOUNTANT', 'MANAGER', 'STAFF'],
      subItems: [
        { name: 'Servis Sifarişləri', path: '/erp/diger/servis' },
        { name: 'Müştəri Cihazları', path: '/erp/service/logs' },
        { name: 'Texniklər', path: '/erp/master-data/employees' },
        { name: 'Ehtiyat Hissələri', path: '/erp/master-data/goods' },
        { name: 'Servis Hesabatları', path: '/erp/reports/services' }
      ]
    },
    {
      name: 'Layihələr',
      icon: <FolderGit2 size={19} />,
      roles: ['SUPERADMIN', 'ACCOUNTANT', 'MANAGER'],
      subItems: [
        { name: 'Layihələr', path: '/erp/giderler/proje' },
        { name: 'Büdcələr', path: '/erp/dashboard/commerce' },
        { name: 'Tapşırıqlar', path: '/erp/giderler/proje' },
        { name: 'Xərclər', path: '/erp/giderler/liste' },
        { name: 'Layihə Mənfəəti', path: '/erp/accounting/trial-balance' }
      ]
    },
    {
      name: 'E-Ticarət',
      icon: <Globe size={19} />,
      roles: ['SUPERADMIN', 'ACCOUNTANT', 'MANAGER'],
      subItems: [
        { name: 'Mağazalar', path: '/erp/eticaret/ayarlar' },
        { name: 'Sifarişlər', path: '/erp/eticaret/siparisler' },
        { name: 'Məhsullar', path: '/erp/eticaret/pro' },
        { name: 'Stok Sinxronizasiyası', path: '/erp/warehouse/stock-balance' },
        { name: 'Ödənişlər', path: '/erp/finance/cash-operations' },
        { name: 'Çatdırılma', path: '/erp/warehouse/outgoing' },
        { name: 'İnteqrasiyalar', path: '/erp/eticaret/ayarlar' }
      ]
    },

    {
      name: 'Hesabatlar',
      icon: <BarChart3 size={19} />,
      roles: ['SUPERADMIN', 'ACCOUNTANT', 'MANAGER'],
      subItems: [
        { name: 'Satış', path: '/erp/satislar/rapor' },
        { name: 'Alış', path: '/erp/alislar/rapor' },
        { name: 'Maliyyə', path: '/erp/reports/income-expense' },
        { name: 'Anbar', path: '/erp/reports/warehouse' },
        { name: 'Müştəri', path: '/erp/reports/debts' },
        { name: 'Təchizatçı', path: '/erp/cari/tedarikciler' },
        { name: 'İşçi', path: '/erp/giderler/personel/performans' },
        { name: 'Filial', path: '/erp/reports/periodic' },
        { name: 'Layihə', path: '/erp/giderler/proje' }
      ]
    },
    {
      name: 'İnteqrasiyalar',
      icon: <Globe size={19} />,
      roles: ['SUPERADMIN', 'ACCOUNTANT'],
      subItems: [
        { name: 'Bank', path: '/erp/finans/entegrasyon' },
        { name: 'E-Qaimə', path: '/erp/efatura/irsaliye' },
        { name: 'Ödəniş', path: '/erp/finans/islemler' },
        { name: 'Shopify', path: '/erp/eticaret/ayarlar' },
        { name: 'WooCommerce', path: '/erp/eticaret/ayarlar' },
        { name: 'WhatsApp', path: '/erp/service/tests' },
        { name: 'SMS / Email', path: '/erp/service/logs' },
        { name: 'Kargo', path: '/erp/warehouse/outgoing' },
        { name: 'Telefon / Call Center', path: 'https://nitrocalls.site' }
      ]
    },
    {
      name: 'Bildirişlər',
      icon: <Bell size={19} />,
      roles: ['SUPERADMIN', 'ACCOUNTANT', 'MANAGER', 'STAFF'],
      path: '/erp/dashboard',
      subItems: []
    },
    {
      name: 'Tənzimləmələr',
      icon: <Settings size={19} />,
      roles: ['SUPERADMIN', 'ACCOUNTANT'],
      subItems: [
        { name: 'Şirkət', path: '/erp/management/org-info' },
        { name: 'İstifadəçilər', path: '/erp/users/list' },
        { name: 'Rollar və İcazələr', path: '/erp/users/roles' },
        { name: 'Vergilər', path: '/erp/management/settings' },
        { name: 'Valyutalar', path: '/erp/finans/valyuta' },
        { name: 'Sənədlər', path: '/erp/dashboard/documents' },
        { name: 'Bildirişlər', path: '/erp/ayarlar' },
        { name: 'Təhlükəsizlik', path: '/erp/management/audit' },
        { name: 'Audit Log', path: '/erp/management/audit' }
      ]
    },
    {
      name: 'Dəstək',
      icon: <HelpCircle size={19} />,
      roles: ['SUPERADMIN', 'ACCOUNTANT', 'MANAGER', 'STAFF'],
      path: '/erp/yardim',
      subItems: []
    }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-color)', width: '100%', overflowX: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{
        width: '300px',
        background: 'linear-gradient(180deg, #07090e 0%, #0b0f17 40%, #0d121d 100%)',
        color: '#f8fafc',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        flexShrink: 0,
        borderRight: '1px solid rgba(255, 255, 255, 0.05)',
        boxShadow: '6px 0 28px -4px rgba(0, 0, 0, 0.45)',
        position: 'relative'
      }}>
        {/* Subtle top glow */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '140px', background: 'radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.35rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 1 }}>
          <Link href="/erp" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.35rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#ffffff' }}>
              ASRALI <span style={{ color: '#10b981' }}>ERP</span>
            </span>
          </Link>
        </div>

        <nav style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.65rem', position: 'relative', zIndex: 1 }}>
          {menuStructure.filter(menu => menu.roles.includes(role)).map((menu) => {
            const hasSubItems = menu.subItems && menu.subItems.length > 0;
            const isOpen = openMenus.includes(menu.name);
            const isAnyChildActive = hasSubItems 
              ? menu.subItems.some(sub => pathname === sub.path || pathname.startsWith(sub.path + '/')) 
              : pathname === menu.path;

            if (!hasSubItems && menu.path) {
              const isExternal = menu.path.startsWith('http');
              const LinkComponent = isExternal ? 'a' : Link;
              const linkProps = isExternal ? { href: menu.path, target: "_blank", rel: "noopener noreferrer" } : { href: menu.path };
              
              return (
                <div key={menu.name} style={{ marginBottom: '0.25rem' }}>
                  <LinkComponent
                    {...linkProps}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.65rem 1rem',
                      borderRadius: '10px',
                      background: isAnyChildActive ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.22) 0%, rgba(16, 185, 129, 0.08) 100%)' : 'transparent',
                      color: isAnyChildActive ? '#34d399' : '#94a3b8',
                      fontWeight: isAnyChildActive ? 600 : 500,
                      fontSize: '0.93rem',
                      fontFamily: 'inherit',
                      textDecoration: 'none',
                      transition: 'all 0.18s ease',
                      border: isAnyChildActive ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid transparent',
                      boxShadow: isAnyChildActive ? '0 2px 12px rgba(16, 185, 129, 0.15)' : 'none'
                    }}
                    onMouseOver={(e) => {
                      if (!isAnyChildActive) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                        e.currentTarget.style.color = '#f1f5f9';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (!isAnyChildActive) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#94a3b8';
                      }
                    }}
                  >
                    <div style={{ opacity: isAnyChildActive ? 1 : 0.75 }}>{menu.icon}</div>
                    {menu.name}
                  </LinkComponent>
                  {menu.separatorAfter && (
                    <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.05)', margin: '0.75rem 1rem' }}></div>
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
                    padding: '0.65rem 1rem',
                    borderRadius: '10px',
                    background: (isOpen || isAnyChildActive) ? 'linear-gradient(90deg, rgba(56, 189, 248, 0.16) 0%, rgba(56, 189, 248, 0.04) 100%)' : 'transparent',
                    color: (isOpen || isAnyChildActive) ? '#38bdf8' : '#94a3b8',
                    fontWeight: (isOpen || isAnyChildActive) ? 600 : 500,
                    fontSize: '0.93rem',
                    fontFamily: 'inherit',
                    border: (isOpen || isAnyChildActive) ? '1px solid rgba(56, 189, 248, 0.25)' : '1px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    textAlign: 'left'
                  }}
                  onMouseOver={(e) => {
                    if (!isOpen && !isAnyChildActive) {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                      e.currentTarget.style.color = '#f1f5f9';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isOpen && !isAnyChildActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = '#94a3b8';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ opacity: (isOpen || isAnyChildActive) ? 1 : 0.75, color: (isOpen || isAnyChildActive) ? '#38bdf8' : 'inherit' }}>{menu.icon}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {menu.name}
                      {menu.isPro && <span style={{ backgroundColor: '#f59e0b', color: 'white', fontSize: '0.62rem', padding: '0.15rem 0.45rem', borderRadius: '6px', fontWeight: 800 }}>PRO</span>}
                    </div>
                  </div>
                  {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </button>
                
                {isOpen && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', marginTop: '0.3rem', paddingLeft: '2.5rem' }}>
                    {menu.subItems.map((subItem) => {
                      const isSubActive = pathname === subItem.path;
                      return (
                         <Link
                          key={subItem.name}
                          href={subItem.path}
                          style={{
                            padding: '0.5rem 0.85rem',
                            borderRadius: '8px',
                            background: isSubActive ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.22) 0%, rgba(16, 185, 129, 0.08) 100%)' : 'transparent',
                            color: isSubActive ? '#34d399' : '#94a3b8',
                            fontWeight: isSubActive ? 600 : 400,
                            fontSize: '0.85rem',
                            textDecoration: 'none',
                            transition: 'all 0.18s ease',
                            border: isSubActive ? '1px solid rgba(52, 211, 153, 0.3)' : '1px solid transparent'
                          }}
                          onMouseOver={(e) => {
                            if (!isSubActive) {
                              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                              e.currentTarget.style.color = '#f1f5f9';
                            }
                          }}
                          onMouseOut={(e) => {
                            if (!isSubActive) {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = '#94a3b8';
                            }
                          }}
                        >
                          {subItem.name}
                        </Link>
                      );
                    })}
                  </div>
                )}
                
                {menu.separatorAfter && (
                  <div style={{ height: '1px', backgroundColor: 'rgba(255,255,255,0.05)', margin: '0.75rem 1rem' }}></div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Profile Card */}
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem',
            padding: '0.8rem 0.95rem',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
            backdropFilter: 'blur(12px)'
          }}>
            <div style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '12px', 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
              color: 'white', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontWeight: 800, 
              fontSize: '1rem',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
              flexShrink: 0
            }}>
              İ
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#f8fafc', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.email || 'yusifliqezenfer90@gmail.com'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginTop: '0.2rem' }}>
                <span style={{ 
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.12rem 0.5rem',
                  borderRadius: '6px',
                  background: 'linear-gradient(90deg, rgba(56, 189, 248, 0.2) 0%, rgba(56, 189, 248, 0.1) 100%)',
                  color: '#38bdf8',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                  border: '1px solid rgba(56, 189, 248, 0.3)'
                }}>
                  Admin
                </span>
                <span style={{ 
                  width: '6px', 
                  height: '6px', 
                  borderRadius: '50%', 
                  backgroundColor: '#10b981',
                  boxShadow: '0 0 10px #10b981'
                }} title="Aktiv" />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, backgroundColor: '#f8fafc' }}>
        <header style={{ 
          height: '64px', 
          borderBottom: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 2rem',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}>
          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.15rem', letterSpacing: '-0.01em' }}>
            ASRALI <span style={{ color: '#10b981' }}>ERP</span>
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
                        <div 
                          key={idx} 
                          onClick={() => {
                            if (notif.link) {
                              router.push(notif.link);
                              setShowNotifications(false);
                            }
                          }}
                          style={{ padding: '1rem', borderBottom: '1px solid #f1f5f9', display: 'flex', gap: '0.75rem', cursor: notif.link ? 'pointer' : 'default', transition: 'background-color 0.2s' }} 
                          onMouseOver={e => e.currentTarget.style.backgroundColor = '#f8fafc'} 
                          onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: notif.type === 'danger' ? '#ef4444' : notif.type === 'info' ? '#3b82f6' : '#f59e0b', marginTop: '6px', flexShrink: 0 }}></div>
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

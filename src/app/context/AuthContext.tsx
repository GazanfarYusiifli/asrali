'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { createClient } from '@/utils/supabase/client';
import { User } from '@supabase/supabase-js';

export type Role = 'SUPERADMIN' | 'HR' | 'ACCOUNTANT' | 'DOCTOR' | 'TEACHER';
export type SubStatus = 'TRIAL' | 'EXPIRED' | 'PRO';

export interface Subscription {
  status: SubStatus;
  trialStartDate: string | null;
}

interface AuthContextType {
  user: User | null;
  role: Role;
  setRole: (role: Role) => void;
  subscription: Subscription;
  updateSubscription: (sub: Subscription) => void;
  trialDaysLeft: number;
  logout: () => Promise<void>;
  loading: boolean;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRoleState] = useState<Role>('SUPERADMIN');
  const [subscription, setSubscriptionState] = useState<Subscription>({ status: 'TRIAL', trialStartDate: null });
  const [trialDaysLeft, setTrialDaysLeft] = useState<number>(14);
  const [mounted, setMounted] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        if (session.user.user_metadata?.registered === true) {
          setUser(session.user);
          localStorage.setItem('app_current_user_id', session.user.id);
          await loadUserData(session.user.id);
        } else {
          // Auto-register the user silently
          const fullName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'İstifadəçi';
          const email = session.user.email;
          const defaultCompany = email ? email.split('@')[0] + ' MMC' : 'Şirkət';
          
          try {
            await supabase.rpc('complete_user_registration', {
              p_full_name: fullName,
              p_company_name: defaultCompany,
              p_phone: '',
              p_country: 'Azərbaycan',
              p_city: 'Bakı',
              p_username: null,
              p_email: email
            });
            
            await supabase.auth.updateUser({
              data: { registered: true }
            });
          } catch (rpcErr) {
            console.error('Silently failed to auto-register:', rpcErr);
          }
          
          setUser(session.user);
          localStorage.setItem('app_current_user_id', session.user.id);
          await loadUserData(session.user.id);
          
          if (typeof window !== 'undefined' && window.location.pathname === '/onboarding') {
            window.location.href = '/erp/dashboard';
            return;
          }
        }
      } else {
        setUser(null);
      }
      setMounted(true);

      const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange(
        async (_event, session) => {
          if (session?.user) {
            if (session.user.user_metadata?.registered === true) {
              setUser(session.user);
              localStorage.setItem('app_current_user_id', session.user.id);
              await loadUserData(session.user.id);
            } else {
              // Same auto-registration logic for state change
              const fullName = session.user.user_metadata?.full_name || session.user.user_metadata?.name || 'İstifadəçi';
              const email = session.user.email;
              const defaultCompany = email ? email.split('@')[0] + ' MMC' : 'Şirkət';
              
              try {
                await supabase.rpc('complete_user_registration', {
                  p_full_name: fullName,
                  p_company_name: defaultCompany,
                  p_phone: '',
                  p_country: 'Azərbaycan',
                  p_city: 'Bakı',
                  p_username: null,
                  p_email: email
                });
                
                await supabase.auth.updateUser({
                  data: { registered: true }
                });
              } catch (rpcErr) {
                console.error('Silently failed to auto-register on auth change:', rpcErr);
              }
              
              setUser(session.user);
              localStorage.setItem('app_current_user_id', session.user.id);
              await loadUserData(session.user.id);
              
              if (typeof window !== 'undefined' && window.location.pathname === '/onboarding') {
                window.location.href = '/erp/dashboard';
              }
            }
          } else if (_event === 'SIGNED_OUT') {
            setUser(null);
            localStorage.removeItem('app_current_user_id');
          }
        }
      );

      return () => {
        authListener.unsubscribe();
      };
    };

    initAuth();
  }, []);

  const loadUserData = async (userId: string) => {
    // Role logic
    const savedRole = localStorage.getItem(`app_role_${userId}`) as Role;
    if (savedRole) {
      setRoleState(savedRole);
    } else {
      setRoleState('SUPERADMIN');
    }

    // Fetch subscription from database
    const { data: subData, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    let sub: Subscription;
    let daysLeft = 0;

    if (subData) {
      const isExpired = subData.status === 'expired' || subData.status === 'cancelled';
      const statusStr = isExpired ? 'EXPIRED' : (subData.plan === 'trial' ? 'TRIAL' : 'PRO');
      
      sub = {
        status: statusStr as SubStatus,
        trialStartDate: subData.trial_start
      };

      if (subData.plan === 'trial' && subData.trial_start) {
        const start = new Date(subData.trial_start);
        const now = new Date();
        const diffTime = now.getTime() - start.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        daysLeft = Math.max(0, 14 - diffDays);
        
        if (daysLeft === 0 && subData.status !== 'expired') {
          sub.status = 'EXPIRED';
        }
      }
    } else {
      // Fallback
      sub = { status: 'TRIAL', trialStartDate: new Date().toISOString() };
      daysLeft = 14;
    }

    setSubscriptionState(sub);
    setTrialDaysLeft(daysLeft);
  };

  const setRole = useCallback((newRole: Role) => {
    setRoleState(newRole);
    if (user) {
      localStorage.setItem(`app_role_${user.id}`, newRole);
    }
  }, [user]);

  const updateSubscription = useCallback((newSub: Subscription) => {
    setSubscriptionState(newSub);
    if (user) {
      localStorage.setItem(`app_subscription_${user.id}`, JSON.stringify(newSub));
    }
  }, [user]);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, role, setRole, subscription, updateSubscription, trialDaysLeft, logout, loading: !mounted }}>
      <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
        {children}
      </div>
    </AuthContext.Provider>
  );

}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

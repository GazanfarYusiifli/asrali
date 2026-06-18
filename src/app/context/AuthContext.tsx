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
          loadUserData(session.user.id);
        } else {
          await supabase.auth.signOut();
          setUser(null);
          if (typeof window !== 'undefined') {
            window.location.href = '/login?error=not_registered';
          }
          return;
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
              loadUserData(session.user.id);
            } else {
              await supabase.auth.signOut();
              setUser(null);
              localStorage.removeItem('app_current_user_id');
              if (typeof window !== 'undefined') {
                window.location.href = '/login?error=not_registered';
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

  const loadUserData = (userId: string) => {
    // Role logic
    const savedRole = localStorage.getItem(`app_role_${userId}`) as Role;
    if (savedRole) {
      setRoleState(savedRole);
    } else {
      setRoleState('SUPERADMIN');
    }

    // Subscription logic
    let savedSub = localStorage.getItem(`app_subscription_${userId}`);
    let sub: Subscription;
    
    if (savedSub) {
      sub = JSON.parse(savedSub);
    } else {
      sub = {
        status: 'TRIAL',
        trialStartDate: new Date().toISOString()
      };
      localStorage.setItem(`app_subscription_${userId}`, JSON.stringify(sub));
    }

    // Calculate trial days left if status is TRIAL
    let daysLeft = 0;
    if (sub.status === 'TRIAL' && sub.trialStartDate) {
      const start = new Date(sub.trialStartDate);
      const now = new Date();
      const diffTime = now.getTime() - start.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      
      daysLeft = Math.max(0, 14 - diffDays);
      
      if (daysLeft === 0) {
        sub.status = 'EXPIRED';
        localStorage.setItem(`app_subscription_${userId}`, JSON.stringify(sub));
      }
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

'use client';

import React from 'react';
import { LucideIcon, Plus, Download } from 'lucide-react';

interface PageHeaderBannerProps {
  title: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
  theme?: 'emerald' | 'amber' | 'blue' | 'indigo' | 'purple' | 'rose' | 'cyan' | 'slate' | 'orange' | 'pink';
  primaryAction?: {
    label: string;
    onClick?: () => void;
    href?: string;
    icon?: LucideIcon;
  };
  secondaryAction?: {
    label: string;
    onClick?: () => void;
    icon?: LucideIcon;
  };
}

const themeStyles = {
  emerald: {
    gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.04) 100%)',
    border: 'rgba(16, 185, 129, 0.22)',
    iconBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    iconShadow: 'rgba(16, 185, 129, 0.35)',
    glow: 'rgba(16, 185, 129, 0.15)',
    badgeBg: 'rgba(16, 185, 129, 0.12)',
    badgeColor: '#059669',
    badgeBorder: 'rgba(16, 185, 129, 0.25)',
    buttonBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    buttonShadow: 'rgba(16, 185, 129, 0.38)'
  },
  amber: {
    gradient: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(217, 119, 6, 0.04) 100%)',
    border: 'rgba(245, 158, 11, 0.22)',
    iconBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    iconShadow: 'rgba(245, 158, 11, 0.35)',
    glow: 'rgba(245, 158, 11, 0.15)',
    badgeBg: 'rgba(245, 158, 11, 0.12)',
    badgeColor: '#d97706',
    badgeBorder: 'rgba(245, 158, 11, 0.25)',
    buttonBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    buttonShadow: 'rgba(245, 158, 11, 0.38)'
  },
  orange: {
    gradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.12) 0%, rgba(234, 88, 12, 0.04) 100%)',
    border: 'rgba(249, 115, 22, 0.22)',
    iconBg: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    iconShadow: 'rgba(249, 115, 22, 0.35)',
    glow: 'rgba(249, 115, 22, 0.15)',
    badgeBg: 'rgba(249, 115, 22, 0.12)',
    badgeColor: '#ea580c',
    badgeBorder: 'rgba(249, 115, 22, 0.25)',
    buttonBg: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    buttonShadow: 'rgba(249, 115, 22, 0.38)'
  },
  pink: {
    gradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.12) 0%, rgba(219, 39, 119, 0.04) 100%)',
    border: 'rgba(236, 72, 153, 0.22)',
    iconBg: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
    iconShadow: 'rgba(236, 72, 153, 0.35)',
    glow: 'rgba(236, 72, 153, 0.15)',
    badgeBg: 'rgba(236, 72, 153, 0.12)',
    badgeColor: '#db2777',
    badgeBorder: 'rgba(236, 72, 153, 0.25)',
    buttonBg: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
    buttonShadow: 'rgba(236, 72, 153, 0.38)'
  },
  blue: {
    gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(37, 99, 235, 0.04) 100%)',
    border: 'rgba(59, 130, 246, 0.22)',
    iconBg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    iconShadow: 'rgba(59, 130, 246, 0.35)',
    glow: 'rgba(59, 130, 246, 0.15)',
    badgeBg: 'rgba(59, 130, 246, 0.12)',
    badgeColor: '#2563eb',
    badgeBorder: 'rgba(59, 130, 246, 0.25)',
    buttonBg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    buttonShadow: 'rgba(59, 130, 246, 0.38)'
  },
  indigo: {
    gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(79, 70, 229, 0.04) 100%)',
    border: 'rgba(99, 102, 241, 0.22)',
    iconBg: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    iconShadow: 'rgba(99, 102, 241, 0.35)',
    glow: 'rgba(99, 102, 241, 0.15)',
    badgeBg: 'rgba(99, 102, 241, 0.12)',
    badgeColor: '#4f46e5',
    badgeBorder: 'rgba(99, 102, 241, 0.25)',
    buttonBg: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
    buttonShadow: 'rgba(99, 102, 241, 0.38)'
  },
  purple: {
    gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.12) 0%, rgba(147, 51, 234, 0.04) 100%)',
    border: 'rgba(168, 85, 247, 0.22)',
    iconBg: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
    iconShadow: 'rgba(168, 85, 247, 0.35)',
    glow: 'rgba(168, 85, 247, 0.15)',
    badgeBg: 'rgba(168, 85, 247, 0.12)',
    badgeColor: '#9333ea',
    badgeBorder: 'rgba(168, 85, 247, 0.25)',
    buttonBg: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
    buttonShadow: 'rgba(168, 85, 247, 0.38)'
  },
  rose: {
    gradient: 'linear-gradient(135deg, rgba(244, 63, 94, 0.12) 0%, rgba(225, 29, 72, 0.04) 100%)',
    border: 'rgba(244, 63, 94, 0.22)',
    iconBg: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
    iconShadow: 'rgba(244, 63, 94, 0.35)',
    glow: 'rgba(244, 63, 94, 0.15)',
    badgeBg: 'rgba(244, 63, 94, 0.12)',
    badgeColor: '#e11d48',
    badgeBorder: 'rgba(244, 63, 94, 0.25)',
    buttonBg: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
    buttonShadow: 'rgba(244, 63, 94, 0.38)'
  },
  cyan: {
    gradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(8, 145, 178, 0.04) 100%)',
    border: 'rgba(6, 182, 212, 0.22)',
    iconBg: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    iconShadow: 'rgba(6, 182, 212, 0.35)',
    glow: 'rgba(6, 182, 212, 0.15)',
    badgeBg: 'rgba(6, 182, 212, 0.12)',
    badgeColor: '#0891b2',
    badgeBorder: 'rgba(6, 182, 212, 0.25)',
    buttonBg: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    buttonShadow: 'rgba(6, 182, 212, 0.38)'
  },
  slate: {
    gradient: 'linear-gradient(135deg, rgba(100, 116, 139, 0.1) 0%, rgba(71, 85, 105, 0.04) 100%)',
    border: 'rgba(148, 163, 184, 0.22)',
    iconBg: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
    iconShadow: 'rgba(100, 116, 139, 0.35)',
    glow: 'rgba(100, 116, 139, 0.15)',
    badgeBg: 'rgba(100, 116, 139, 0.12)',
    badgeColor: '#475569',
    badgeBorder: 'rgba(100, 116, 139, 0.25)',
    buttonBg: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
    buttonShadow: 'rgba(100, 116, 139, 0.38)'
  }
};

export default function PageHeaderBanner({
  title,
  description,
  icon: Icon,
  badge,
  theme = 'emerald',
  primaryAction,
  secondaryAction
}: PageHeaderBannerProps) {
  const currentTheme = themeStyles[theme] || themeStyles.emerald;
  const PrimaryIcon = primaryAction?.icon || Plus;
  const SecondaryIcon = secondaryAction?.icon || Download;

  return (
    <div style={{
      position: 'relative',
      borderRadius: '20px',
      background: currentTheme.gradient,
      border: `1px solid ${currentTheme.border}`,
      padding: '1.75rem 2rem',
      marginBottom: '2rem',
      boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.03)',
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1.5rem',
      backdropFilter: 'blur(10px)'
    }}>
      {/* Background radial glow */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        left: '-40px',
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${currentTheme.glow} 0%, transparent 70%)`,
        pointerEvents: 'none'
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', position: 'relative', zIndex: 1 }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: currentTheme.iconBg,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 8px 20px -3px ${currentTheme.iconShadow}`,
          flexShrink: 0
        }}>
          <Icon size={28} strokeWidth={2.3} />
        </div>

        <div>
          {badge && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
              backgroundColor: currentTheme.badgeBg,
              color: currentTheme.badgeColor,
              border: `1px solid ${currentTheme.badgeBorder}`,
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '0.35rem'
            }}>
              {badge}
            </div>
          )}
          <h1 style={{
            fontSize: '1.85rem',
            fontWeight: 800,
            color: '#0f172a',
            letterSpacing: '-0.025em',
            margin: 0,
            lineHeight: 1.2
          }}>
            {title}
          </h1>
          <p style={{
            margin: '0.35rem 0 0 0',
            color: '#64748b',
            fontSize: '0.93rem',
            lineHeight: 1.4
          }}>
            {description}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      {(primaryAction || secondaryAction) && (
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.25rem',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '10px',
                color: '#334155',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseOver={e => {
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.borderColor = '#cbd5e1';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.backgroundColor = '#ffffff';
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <SecondaryIcon size={17} style={{ color: '#64748b' }} />
              <span>{secondaryAction.label}</span>
            </button>
          )}

          {primaryAction && (
            <button
              onClick={primaryAction.onClick}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.65rem 1.35rem',
                background: currentTheme.buttonBg,
                border: 'none',
                borderRadius: '10px',
                color: '#ffffff',
                fontWeight: 650,
                fontSize: '0.88rem',
                cursor: 'pointer',
                boxShadow: `0 8px 20px -3px ${currentTheme.buttonShadow}`,
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onMouseOver={e => {
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={e => {
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <PrimaryIcon size={18} strokeWidth={2.4} />
              <span>{primaryAction.label}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

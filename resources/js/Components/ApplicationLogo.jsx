import React from 'react';

export default function ApplicationLogo({ theme = 'dark', className = '', style = {} }) {
    const isDark = theme === 'dark';
    
    return (
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md ${className}`} style={{ background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)', ...style }}>
            <div style={{ width: '24px', height: '24px', backgroundColor: isDark ? 'var(--color-canvas)' : 'var(--color-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: isDark ? 'var(--color-primary)' : 'var(--color-canvas)', fontWeight: 'bold', fontSize: '14px' }}>K</span>
            </div>
            <span style={{ color: isDark ? 'var(--color-on-dark)' : 'var(--color-ink)', fontSize: '16px', fontWeight: '600', letterSpacing: '0.5px', fontFamily: 'var(--font-sans)', whiteSpace: 'nowrap' }}>
                Koperasi FT Unila
            </span>
        </div>
    );
}

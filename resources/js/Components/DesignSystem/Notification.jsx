import React, { useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';

export default function Notification({ show, message, title, type = 'error', onClose }) {
    const [isVisible, setIsVisible] = useState(show);

    useEffect(() => {
        setIsVisible(show);
        if (show) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                if (onClose) onClose();
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    const getColors = () => {
        switch (type) {
            case 'error':
                return {
                    bg: 'rgba(255, 255, 255, 0.95)',
                    border: 'var(--color-semantic-down)',
                    iconBg: 'rgba(207, 32, 47, 0.1)',
                    icon: 'var(--color-semantic-down)',
                    title: 'var(--color-ink)',
                    text: 'var(--color-muted)'
                };
            case 'success':
                return {
                    bg: 'rgba(255, 255, 255, 0.95)',
                    border: 'var(--color-semantic-up)',
                    iconBg: 'rgba(5, 177, 105, 0.1)',
                    icon: 'var(--color-semantic-up)',
                    title: 'var(--color-ink)',
                    text: 'var(--color-muted)'
                };
            case 'warning':
                return {
                    bg: 'rgba(255, 255, 255, 0.95)',
                    border: 'var(--color-accent-yellow)',
                    iconBg: 'rgba(240, 185, 11, 0.1)',
                    icon: 'var(--color-accent-yellow)',
                    title: 'var(--color-ink)',
                    text: 'var(--color-muted)'
                };
            default:
                return {
                    bg: 'rgba(255, 255, 255, 0.95)',
                    border: 'var(--color-primary)',
                    iconBg: 'rgba(11, 94, 168, 0.1)',
                    icon: 'var(--color-primary)',
                    title: 'var(--color-ink)',
                    text: 'var(--color-muted)'
                };
        }
    };

    const colors = getColors();

    return (
        <Transition
            show={isVisible}
            enter="transition ease-out duration-300"
            enterFrom="transform opacity-0 translate-y-[-20px] scale-95"
            enterTo="transform opacity-100 translate-y-0 scale-100"
            leave="transition ease-in duration-200"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
            className="fixed top-6 right-6 z-[100] w-full max-w-sm"
        >
            <div 
                style={{
                    backgroundColor: colors.bg,
                    backdropFilter: 'blur(16px)',
                    borderLeft: `4px solid ${colors.border}`,
                    borderRadius: '12px',
                    padding: '16px',
                    boxShadow: '0 10px 40px -10px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.05)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px'
                }}
            >
                <div style={{ 
                    width: '32px', height: '32px', 
                    borderRadius: '8px', 
                    backgroundColor: colors.iconBg, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                }}>
                    {type === 'error' && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.icon} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                    )}
                    {type === 'success' && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.icon} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    )}
                    {type === 'warning' && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.icon} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                            <line x1="12" y1="9" x2="12" y2="13"></line>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                    )}
                    {type === 'info' && (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={colors.icon} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="16" x2="12" y2="12"></line>
                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                        </svg>
                    )}
                </div>

                <div style={{ flex: 1 }}>
                    {title && (
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 600, color: colors.title, letterSpacing: '-0.3px' }}>
                            {title}
                        </h4>
                    )}
                    <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.5', color: colors.text }}>
                        {message}
                    </p>
                </div>

                <button 
                    onClick={() => {
                        setIsVisible(false);
                        if (onClose) onClose();
                    }}
                    style={{ 
                        background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', 
                        color: 'var(--color-muted)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: '6px',
                        transition: 'background-color 0.2s'
                    }}
                    className="hover:bg-gray-100"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
        </Transition>
    );
}

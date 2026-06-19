import React, { useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';

export default function Toast({ show, message, type = 'error', onClose }) {
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
                    bg: 'var(--color-semantic-down)',
                    text: 'var(--color-canvas)',
                    icon: 'var(--color-canvas)'
                };
            case 'success':
                return {
                    bg: 'var(--color-semantic-up)',
                    text: 'var(--color-canvas)',
                    icon: 'var(--color-canvas)'
                };
            default:
                return {
                    bg: 'var(--color-surface-dark-elevated)',
                    text: 'var(--color-on-dark)',
                    icon: 'var(--color-on-dark-soft)'
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
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4"
        >
            <div 
                style={{
                    backgroundColor: colors.bg,
                    color: colors.text,
                    borderRadius: 'var(--rounded-xl)',
                    padding: '16px 24px',
                    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                }}
            >
                {type === 'error' && (
                    <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.icon }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                )}
                {type === 'success' && (
                    <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.icon }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )}
                {type === 'info' && (
                    <svg className="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: colors.icon }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                )}
                <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, fontFamily: 'system-ui, -apple-system, sans-serif' }}>
                        {message}
                    </p>
                </div>
                <button 
                    onClick={() => {
                        setIsVisible(false);
                        if (onClose) onClose();
                    }}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', color: colors.icon }}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </Transition>
    );
}

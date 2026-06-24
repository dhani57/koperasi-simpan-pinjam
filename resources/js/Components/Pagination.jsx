import React from 'react';
import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    // Return early if there are no pages or just one page
    if (!links || links.length <= 3) return null;

    const activeIndex = links.findIndex(link => link.active);

    return (
        <div className="mt-6 flex flex-wrap justify-center gap-1.5 sm:gap-2">
            {links.map((link, index) => {
                // Determine visibility logic for mobile
                const isFirstOrLastOrPrevNext = index === 0 || index === links.length - 1 || index === 1 || index === links.length - 2;
                const isDots = link.label.includes('...');
                const isAdjacent = Math.abs(index - activeIndex) <= 1;
                
                // Show only essential links on mobile, show everything on sm screens and up
                const isMobileVisible = isFirstOrLastOrPrevNext || isDots || isAdjacent;
                const visibilityClass = isMobileVisible ? 'flex' : 'hidden sm:flex';

                if (link.url === null) {
                    return (
                        <div
                            key={index}
                            className={`${visibilityClass} items-center justify-center px-3 py-2 sm:px-4 sm:py-2 text-sm text-slate-400 border border-transparent rounded-md bg-slate-50 select-none`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    );
                }

                return (
                    <Link
                        key={index}
                        href={link.url}
                        className={`${visibilityClass} items-center justify-center px-3 py-2 sm:px-4 sm:py-2 text-sm rounded-md transition-colors border ${
                            link.active
                                ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] shadow-sm'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
}

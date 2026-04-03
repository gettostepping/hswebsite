"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const CORNER_THRESHOLD = 60; // pixels from edge to count as corner
const LOGO_CLICK_TIMEOUT = 2000; // 2 seconds for rapid logo clicks
const PATTERN_TIMEOUT = 5000; // 5 seconds to complete pattern before reset

// Pattern: Click logo 3 times quickly → top-left corner → bottom-right corner → logo again
const PATTERN_SEQUENCE = ['logo', 'logo', 'logo', 'top-left', 'bottom-right', 'logo'];

export function useAdminPuzzle() {
    const router = useRouter();
    const patternSequence = useRef<string[]>([]);
    const logoClickTimes = useRef<number[]>([]);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const resetPattern = useCallback(() => {
        patternSequence.current = [];
        logoClickTimes.current = [];
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    }, []);

    const checkPattern = useCallback(() => {
        const current = patternSequence.current;
        if (current.length === 0) return;

        // Check if we have the correct sequence so far
        for (let i = 0; i < current.length; i++) {
            if (current[i] !== PATTERN_SEQUENCE[i]) {
                resetPattern();
                return;
            }
        }

        // If pattern is complete
        if (current.length === PATTERN_SEQUENCE.length) {
            router.push('/admin');
            resetPattern();
        }
    }, [router, resetPattern]);

    const handleLogoClick = useCallback((e: React.MouseEvent) => {
        const now = Date.now();

        // Track logo clicks
        logoClickTimes.current.push(now);
        logoClickTimes.current = logoClickTimes.current.filter(
            time => now - time < LOGO_CLICK_TIMEOUT
        );

        // Prevent default link navigation ONLY if we are in the middle of a pattern
        if (logoClickTimes.current.length >= 2 || patternSequence.current.length > 0) {
            e.preventDefault();
        }

        if (logoClickTimes.current.length >= 3 && patternSequence.current.length === 0) {
            patternSequence.current = ['logo', 'logo', 'logo'];
            checkPattern();
        } else if (patternSequence.current.length > 0 && patternSequence.current.length < PATTERN_SEQUENCE.length) {
            patternSequence.current.push('logo');
            checkPattern();
        }

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(resetPattern, PATTERN_TIMEOUT);
    }, [checkPattern, resetPattern]);

    const handleGlobalClick = useCallback((e: MouseEvent) => {
        const x = e.clientX;
        const y = e.clientY;
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const isTopLeft = x < CORNER_THRESHOLD && y < CORNER_THRESHOLD;
        const isBottomRight = x > windowWidth - CORNER_THRESHOLD && y > windowHeight - CORNER_THRESHOLD;

        if (isTopLeft && patternSequence.current.length >= 3) {
            patternSequence.current.push('top-left');
            checkPattern();
        } else if (isBottomRight && patternSequence.current.length >= 4) {
             patternSequence.current.push('bottom-right');
             checkPattern();
        }
    }, [checkPattern]);

    useEffect(() => {
        window.addEventListener('click', handleGlobalClick);
        return () => {
            window.removeEventListener('click', handleGlobalClick);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [handleGlobalClick]);

    return { handleLogoClick };
}

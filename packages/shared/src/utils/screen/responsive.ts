declare global {
    interface Navigator {
        msMaxTouchPoints: number;
    }
    interface Window {
        // TODO DocumentTouch been removed from the standards, we need to change this with Touch and TouchList later
        DocumentTouch: any;
    }
}

export const MAX_MOBILE_WIDTH = 600;
export const MIN_DESKTOP_WIDTH = 1280;

export const isTouchDevice = () =>
    'ontouchstart' in window ||
    'ontouchstart' in document.documentElement ||
    (window.DocumentTouch && document instanceof window.DocumentTouch) ||
    navigator.maxTouchPoints > 0 ||
    window.navigator.msMaxTouchPoints > 0;
export const isMobile = () => window.innerWidth <= MAX_MOBILE_WIDTH;
export const isTablet = () => MAX_MOBILE_WIDTH < window.innerWidth && window.innerWidth < MIN_DESKTOP_WIDTH;
export const isMobileOrTablet = () => window.innerWidth < MIN_DESKTOP_WIDTH;
export const isDesktop = () => window.innerWidth >= MIN_DESKTOP_WIDTH;
export const isTabletDrawer = () => window.innerWidth < MIN_DESKTOP_WIDTH;

declare global {
    interface Navigator {
        msMaxTouchPoints: number;
    }
    interface Window {
        // TODO DocumentTouch been removed from the standards, we need to change this with Touch and TouchList later
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        DocumentTouch: any;
    }
}

export const MAX_MOBILE_WIDTH = 600;
export const MAX_TABLET_WIDTH = 1279;

export const isTouchDevice = () =>
    'ontouchstart' in window ||
    'ontouchstart' in document.documentElement ||
    (window.DocumentTouch && document instanceof window.DocumentTouch) ||
    navigator.maxTouchPoints > 0 ||
    window.navigator.msMaxTouchPoints > 0;
/** @deprecated Use `is_mobile` from ui-store instead. */
export const isMobile = () => window.innerWidth <= MAX_MOBILE_WIDTH;
export const isDesktop = () => isTablet() || window.innerWidth > MAX_TABLET_WIDTH; // TODO: remove tablet once there is a design for the specific size.
export const isTablet = () => MAX_MOBILE_WIDTH < window.innerWidth && window.innerWidth <= MAX_TABLET_WIDTH;

import { isBot } from '../platform';

declare global {
    interface Navigator {
        msMaxTouchPoints: number;
    }
    interface Window {
        // TODO DocumentTouch been removed from the standards, we need to change this with Touch and TouchList later
        DocumentTouch: any;
    }
}

const is_bot = isBot();

export const MAX_MOBILE_WIDTH = is_bot ? 1023 : 926; // iPhone 12 Pro Max has the world largest viewport size of 428 x 926
export const MAX_TABLET_WIDTH = 1081;

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

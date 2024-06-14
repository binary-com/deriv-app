import { useWindowSize } from 'usehooks-ts';

// Using the same breakpoints as the ones used by useDevice hook in wallets package & by is_mobile in ui-store
export const MAX_MOBILE_WIDTH = 600;
export const MIN_DESKTOP_WIDTH = 1280;

/** Checks for the client device width and determines the layout to be rendered */
export const useDevice = () => {
    const { width } = useWindowSize();
    const is_mobile = width > 0 && width <= MAX_MOBILE_WIDTH;
    const is_tablet = width > MAX_MOBILE_WIDTH && width < MIN_DESKTOP_WIDTH;
    const is_desktop = width >= MIN_DESKTOP_WIDTH;

    return {
        is_desktop,
        is_mobile,
        is_tablet,
    };
};

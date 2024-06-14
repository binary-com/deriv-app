import { useWindowSize } from 'usehooks-ts';

/** A custom hook to check for the client device and determine the layout to be rendered */
const useDevice = () => {
    const { width } = useWindowSize();
    const isMobile = width > 0 && width <= 600;
    const isTablet = width > 600 && width < 1280;
    const isDesktop = width >= 1280;

    return {
        isDesktop,
        isMobile,
        isTablet,
    };
};

export default useDevice;

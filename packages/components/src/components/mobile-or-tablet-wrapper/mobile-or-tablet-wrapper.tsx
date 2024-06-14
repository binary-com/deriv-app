import React from 'react';
import { useDevice } from '@deriv-com/ui';

type TMobileOrTabletWrapper = {
    children: React.ReactNode;
};

const MobileOrTabletWrapper = ({ children }: TMobileOrTabletWrapper) => {
    const { isMobile, isTablet } = useDevice();
    if (!isMobile && !isTablet) return null;

    return <React.Fragment>{children}</React.Fragment>;
};

export default MobileOrTabletWrapper;

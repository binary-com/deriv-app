import React from 'react';
import { useDevice } from '@deriv-com/ui';

type TMobileWrapper = {
    children: React.ReactNode;
};

const MobileWrapper = ({ children }: TMobileWrapper) => {
    const { isMobile } = useDevice();
    if (!isMobile) return null;

    return <React.Fragment>{children}</React.Fragment>;
};

export default MobileWrapper;

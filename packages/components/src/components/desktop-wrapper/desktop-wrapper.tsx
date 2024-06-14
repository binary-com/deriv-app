import React from 'react';
import { useDevice } from '@deriv-com/ui';

type TDesktopProps = {
    children: React.ReactNode;
};

const Desktop = ({ children }: TDesktopProps) => {
    const { isDesktop } = useDevice();
    if (!isDesktop) return null;

    return <React.Fragment>{children}</React.Fragment>;
};

export default Desktop;

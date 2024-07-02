import React, { PropsWithChildren } from 'react';
import { useDevice } from '@deriv-com/ui';

type TScrollbarWrapper = {
    height?: string;
};

const ScrollbarWrapper = ({ children, height }: PropsWithChildren<TScrollbarWrapper>) => {
    const { isDesktop } = useDevice();

    return (
        <div className='scrollbar-wrapper' style={{ height: isDesktop ? height : '100%' }}>
            {children}
        </div>
    );
};

export default ScrollbarWrapper;

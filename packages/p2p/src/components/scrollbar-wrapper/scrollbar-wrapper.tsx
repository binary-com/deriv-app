import React, { PropsWithChildren } from 'react';
import { useStore } from '@deriv/stores';

type TScrollbarWrapper = {
    height?: string;
};

const ScrollbarWrapper = ({ children, height }: PropsWithChildren<TScrollbarWrapper>) => {
    const {
        ui: { is_mobile_or_tablet },
    } = useStore();

    return (
        <div className='scrollbar-wrapper' style={{ height: is_mobile_or_tablet ? '100%' : height }}>
            {children}
        </div>
    );
};

export default ScrollbarWrapper;

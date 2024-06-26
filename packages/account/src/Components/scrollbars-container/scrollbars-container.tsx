import clsx from 'clsx';
import React from 'react';
import { ThemedScrollbars } from '@deriv/components';
import { useDevice } from '@deriv-com/ui';

type TScrollbarsContainer = {
    className?: string;
    scroll_offset?: string;
    isFullHeight?: boolean;
};

export const ScrollbarsContainer = ({
    children,
    className,
    scroll_offset,
    isFullHeight = false,
}: React.PropsWithChildren<TScrollbarsContainer>) => {
    const { isDesktop } = useDevice();
    const height_unit = isFullHeight ? '100vh' : '100%';
    return (
        <ThemedScrollbars
            is_bypassed={!isDesktop}
            height={scroll_offset ? `calc(${height_unit} - ${scroll_offset})` : '100%'}
        >
            <div className={clsx('account__scrollbars_container', className)} data-testid='dt_scrollbar_container_div'>
                {children}
            </div>
        </ThemedScrollbars>
    );
};

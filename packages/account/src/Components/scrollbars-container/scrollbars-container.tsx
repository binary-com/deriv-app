import clsx from 'clsx';
import React from 'react';
import { ThemedScrollbars } from '@deriv/components';
import { isMobileOrTablet } from '@deriv/shared';

type TScrollbarsContainer = {
    className?: string;
    scroll_offset?: string;
};

export const ScrollbarsContainer = ({
    children,
    className,
    scroll_offset,
}: React.PropsWithChildren<TScrollbarsContainer>) => (
    <ThemedScrollbars
        is_bypassed={isMobileOrTablet()}
        height={scroll_offset ? `calc(100% - ${scroll_offset})` : '100%'}
    >
        <div className={clsx('account__scrollbars_container', className)} data-testid='dt_scrollbar_container_div'>
            {children}
        </div>
    </ThemedScrollbars>
);

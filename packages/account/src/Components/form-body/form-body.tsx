// [TODO] - To be removed once CFD is configured to use the new form-body component
import React, { PropsWithChildren, Fragment } from 'react';
import { ScrollbarsContainer } from '../scrollbars-container/scrollbars-container';
import { Div100vhContainer } from '@deriv/components';
import { useDevice } from '@deriv-com/ui';
import clsx from 'clsx';

type TFormBody = {
    scroll_offset?: string;
    className?: string;
    isFullHeight?: boolean;
};

export const FormBody = ({ children, scroll_offset, className, isFullHeight }: PropsWithChildren<TFormBody>) => {
    const { isDesktop } = useDevice();
    return (
        <Fragment>
            {isDesktop ? (
                <ScrollbarsContainer
                    className={clsx('account__scrollbars_container--grid-layout', className)}
                    scroll_offset={scroll_offset}
                    isFullHeight={isFullHeight}
                >
                    {children}
                </ScrollbarsContainer>
            ) : (
                <Div100vhContainer
                    className={clsx('account__scrollbars_container--grid-layout', className)}
                    height_offset={scroll_offset || '100%'}
                >
                    {children}
                </Div100vhContainer>
            )}
        </Fragment>
    );
};

// [TODO] - To be removed once CFD is configured to use the new form-body component
import React, { PropsWithChildren, Fragment } from 'react';
import { ScrollbarsContainer } from '../scrollbars-container/scrollbars-container';
import { Div100vhContainer, DesktopWrapper, MobileOrTabletWrapper } from '@deriv/components';
import clsx from 'clsx';

type TFormBody = {
    scroll_offset?: string;
    className?: string;
};

export const FormBody = ({ children, scroll_offset, className }: PropsWithChildren<TFormBody>) => (
    <Fragment>
        <DesktopWrapper>
            <ScrollbarsContainer
                className={clsx('account__scrollbars_container--grid-layout', className)}
                scroll_offset={scroll_offset}
            >
                {children}
            </ScrollbarsContainer>
        </DesktopWrapper>
        <MobileOrTabletWrapper>
            <Div100vhContainer
                className={clsx('account__scrollbars_container--grid-layout', className)}
                height_offset={scroll_offset || '200px'}
            >
                {children}
            </Div100vhContainer>
        </MobileOrTabletWrapper>
    </Fragment>
);

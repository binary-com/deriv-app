import React, { PropsWithChildren } from 'react';
import { TooltipRenderProps } from 'react-joyride';
import { LegacyClose2pxIcon } from '@deriv/quill-icons';
import { THooks } from '../../types';
import { WalletButton, WalletText } from '../Base';
import './WalletTourGuide.scss';

export const walletsOnboardingLocalStorageKey = 'walletsOnboarding';
export const walletsOnboardingStartValue = 'started';

export const TooltipComponent = ({
    backProps,
    closeProps,
    continuous,
    index,
    isLastStep,
    primaryProps,
    skipProps,
    step,
    tooltipProps,
}: TooltipRenderProps) => {
    return (
        <div {...tooltipProps} className='wallets-tour-guide__container'>
            <div className='wallets-tour-guide__header'>
                {step?.title as React.ReactNode}
                <LegacyClose2pxIcon
                    className='wallets-tour-guide__close-icon'
                    iconSize='xs'
                    onClick={skipProps.onClick as unknown as React.MouseEventHandler<SVGElement>}
                />
            </div>
            {<div className='wallets-tour-guide__content'>{step.content as React.ReactNode}</div>}
            <div className='wallets-tour-guide__footer'>
                {index > 0 && (
                    <WalletButton {...backProps} color='white' variant='outlined'>
                        Back
                    </WalletButton>
                )}
                {continuous && <WalletButton {...primaryProps}>{isLastStep ? 'Done' : 'Next'}</WalletButton>}
                {!continuous && <WalletButton {...closeProps}>Close</WalletButton>}
            </div>
        </div>
    );
};

export const SpotLightHeader = ({ children }: PropsWithChildren) => (
    <WalletText color='red' size='sm' weight='bold'>
        {children}
    </WalletText>
);

export const getFiatWalletLoginId = (wallets?: THooks.WalletAccountsList[]) => {
    return wallets?.find(wallet => !wallet.is_crypto)?.loginid;
};

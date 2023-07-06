import React from 'react';
import { Step, Locale, Styles } from 'react-joyride';
import { Text, SpanButton, Icon } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import 'Components/toggle-account-type/toggle-account-type.scss';

export const getWalletStepConfig = (): Step[] => [
    {
        title: (
            <React.Fragment>
                <Text as='p' weight='bold' color='brand-red-coral'>
                    {localize('Wallets')}
                </Text>
                <div className='toggle-account-type__divider' />
            </React.Fragment>
        ),
        content: (
            <Text as='p' size='xs'>
                {localize('This is your Wallet. You can see your total balance for this Wallet here.')}
            </Text>
        ),
        target: '.wallet-header',
        disableBeacon: true,
        disableOverlayClose: true,
        placement: 'bottom-end',
        hideBackButton: true,
        spotlightPadding: 0,
        styles: {
            spotlight: {
                width: '115.2rem',
                height: '8rem',
                borderRadius: '1.6rem 1.6rem 0rem 0rem',
            },
        },
    },
    {
        title: (
            <React.Fragment>
                <Text as='p' weight='bold' color='brand-red-coral'>
                    {localize('Expand Wallets')}
                </Text>
                <div className='toggle-account-type__divider' />
            </React.Fragment>
        ),
        content: (
            <Text as='p' size='xs'>
                <Localize i18n_default_text='Click here to expand or collapse your Wallet and view the trading accounts linked to this Wallet.' />
            </Text>
        ),

        target: '.wallet-header__balance-arrow-icon',
        disableBeacon: true,
        disableOverlayClose: true,
        placement: 'left',
        styles: { spotlight: { borderRadius: '50%' } },
    },
    {
        title: (
            <React.Fragment>
                <Text as='p' weight='bold' color='brand-red-coral'>
                    {localize('Wallet actions')}
                </Text>
                <div className='toggle-account-type__divider' />
            </React.Fragment>
        ),
        content: (
            <Text as='p' size='xs'>
                {localize(
                    "Perform deposits, withdrawals, and fund transfers using your Wallet. You can also view your Wallet's transaction history."
                )}
            </Text>
        ),
        target: '.wallet-header__description-buttons',
        disableBeacon: true,
        disableOverlayClose: true,
        spotlightPadding: 8,
        styles: { spotlight: { borderRadius: '4.8rem' } },
    },
];

export const wallet_tour_styles: Styles = {
    options: {
        width: '28rem',
    },
    tooltip: {
        backgroundColor: 'var(--general-main-1)',
        padding: '1.6rem',
    },
    tooltipTitle: {
        color: 'var(--brand-red-coral)',
        textAlign: 'left',
    },
    tooltipContent: {
        textAlign: 'left',
        fontSize: '1.4rem',
        padding: '1.6rem 0',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
    },
    buttonNext: {
        padding: '0.9rem',
        fontSize: '1.5rem',
        fontWeight: 'bold',
        outline: 'none',
    },
    buttonSkip: {
        position: 'absolute',
        right: '0',
        top: '0',
        padding: '1.6rem',
        lineHeight: '1',
        fontSize: '1.6rem',
    },
};

export const getWalletStepLocale = (): Locale => ({
    back: <SpanButton has_effect text={localize('Back')} secondary medium />,
    next: localize('Next'),
    skip: <Icon icon='IcCross' size={16} />,
});

import React from 'react';
import { Step, Styles, Locale } from 'react-joyride';
import { Text, SpanButton, Icon } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { isMobile } from '@deriv/shared';
import 'Components/toggle-account-type/toggle-account-type.scss';

export const getTourStepConfig = (): Step[] => [
    {
        title: (
            <React.Fragment>
                <Text as='p' weight='bold' color='brand-red-coral'>
                    {localize('Switch accounts')}
                </Text>
                <div className='toggle-account-type__divider' />
            </React.Fragment>
        ),
        content: <Text as='p'>{localize('You can switch between real and demo accounts.')}</Text>,
        target: '.account-type-dropdown--parent',
        disableBeacon: true,
        disableOverlayClose: true,
    },
    {
        title: (
            <React.Fragment>
                <Text as='p' weight='bold' color='brand-red-coral'>
                    {localize('Choice of regulation')}
                </Text>
                <div className='toggle-account-type__divider' />
            </React.Fragment>
        ),
        content: (
            <Text as='p'>
                <Localize
                    i18n_default_text='You can create real accounts under EU or non-EU regulation. Click the <0><0/> icon to learn more about these accounts.'
                    components={[
                        <Text key={0}>
                            <Icon icon='IcInfoOutline' />
                        </Text>,
                    ]}
                />
            </Text>
        ),

        target: isMobile() ? '.main-title-bar-mobile--regulator' : '.regulators-switcher__container',
        disableBeacon: true,
        disableOverlayClose: true,
    },
    {
        title: (
            <React.Fragment>
                <Text as='p' weight='bold' color='brand-red-coral'>
                    {localize("Trader's Hub tour")}
                </Text>
                <div className='toggle-account-type__divider' />
            </React.Fragment>
        ),
        content: <Text as='p'>{localize('Click here if you ever need to repeat this tour.')}</Text>,
        target: '.trading-hub-header__tradinghub--onboarding--logo',
        disableBeacon: true,
        disableOverlayClose: true,
    },
];

export const getTourStepConfigHighRisk = (): Step[] => [
    {
        title: (
            <React.Fragment>
                <Text as='p' weight='bold' color='brand-red-coral'>
                    {localize('Switch accounts')}
                </Text>
                <div className='toggle-account-type__divider' />
            </React.Fragment>
        ),
        content: <Text as='p'>{localize('You can switch between real and demo accounts.')}</Text>,
        target: '.account-type-dropdown--parent',
        disableBeacon: true,
        disableOverlayClose: true,
    },
    {
        title: (
            <React.Fragment>
                <Text as='p' weight='bold' color='brand-red-coral'>
                    {localize("Trader's Hub tour")}
                    <div className='toggle-account-type__divider' />
                </Text>
            </React.Fragment>
        ),
        content: <Text as='p'>{localize('Click here if you ever need to repeat this tour.')}</Text>,
        target: '.trading-hub-header__tradinghub--onboarding--logo',
        disableBeacon: true,
        disableOverlayClose: true,
    },
];

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
        // The 'target' refers to the element where the spotlight will be positioned. If there are multiple elements with the same class name, the 'target' will select the first element.
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
    {
        title: (
            <React.Fragment>
                <Text as='p' weight='bold' color='brand-red-coral'>
                    {localize('CFDs trading accounts')}
                </Text>
                <div className='toggle-account-type__divider' />
            </React.Fragment>
        ),
        content: (
            // TODO: update this component if there's a cfd account
            <Text as='p' size='xs'>
                {localize(
                    'This is your CFDs trading account. Click Get to create the trading account you desire for trading.'
                )}
            </Text>
        ),
        target: '#trading-app-card__derived',
        disableBeacon: true,
        disableOverlayClose: true,
        spotlightPadding: 3,
        placement: 'right',
        styles: { spotlight: { borderRadius: '0.6rem', height: '100px' } },
    },
    {
        title: (
            <React.Fragment>
                <Text as='p' weight='bold' color='brand-red-coral'>
                    {localize('Deriv Apps trading account')}
                </Text>
                <div className='toggle-account-type__divider' />
            </React.Fragment>
        ),
        content: (
            <Text as='p' size='xs'>
                {localize(
                    'This is your Deriv Apps trading account balance. Click Transfer to move funds between your Wallet and Deriv Apps trading account.'
                )}
            </Text>
        ),
        target: '.currency-switcher-container',
        disableBeacon: true,
        disableOverlayClose: true,
        placement: 'left',
        spotlightPadding: 0,
        styles: {
            spotlight: { borderRadius: '0.6rem' },
        },
    },
    {
        title: (
            <React.Fragment>
                <Text as='p' weight='bold' color='brand-red-coral'>
                    {localize('Deriv apps')}
                </Text>
                <div className='toggle-account-type__divider' />
            </React.Fragment>
        ),
        content: (
            <Text as='p' size='xs'>
                {localize('Choose a Deriv app to trade options or multipliers.')}
            </Text>
        ),
        target: '#trading-app-card__dtrader',
        disableBeacon: true,
        disableOverlayClose: true,
        spotlightPadding: 3,
        placement: 'right',
        styles: { spotlight: { borderRadius: '0.6rem', height: '100px' } },
    },
    {
        title: (
            <React.Fragment>
                <Text as='p' weight='bold' color='brand-red-coral'>
                    {localize('Explore more Wallets')}
                </Text>
                <div className='toggle-account-type__divider' />
            </React.Fragment>
        ),
        content: (
            <Text as='p' size='xs'>
                {localize('Click Add on each card for more Wallets.')}
            </Text>
        ),
        target: '.add-wallets__card',
        disableBeacon: true,
        disableOverlayClose: true,
        spotlightPadding: 0,
        placement: 'right',
        styles: { spotlight: { borderRadius: '1.7rem' } },
    },
    {
        title: (
            <React.Fragment>
                <Text as='p' weight='bold' color='brand-red-coral'>
                    {localize("Trader's Hub tour")}
                </Text>
                <div className='toggle-account-type__divider' />
            </React.Fragment>
        ),
        content: (
            <Text as='p' size='xs'>
                {localize('Click here to repeat this tour.')}
            </Text>
        ),
        target: '.trading-hub-header__tradinghub--onboarding',
        disableBeacon: true,
        disableOverlayClose: true,
        spotlightPadding: 12,
        placement: 'right',
        styles: { spotlight: { borderRadius: '0.4rem' } },
    },
];

export const tour_styles: Styles = {
    options: {
        width: 350,
    },
    tooltipTitle: {
        color: 'var(--brand-red-coral)',
        textAlign: 'left',
    },
    tooltipContent: {
        textAlign: 'left',
        fontSize: '1.6rem',
        padding: '3rem 0 1.6rem 0',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
    },
    buttonNext: {
        padding: '0.9rem',
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
};

export const tour_styles_dark_mode: Styles = {
    options: {
        width: 350,
        backgroundColor: 'var(--general-section-3)',
        arrowColor: 'var(--general-section-3)',
    },
    tooltipTitle: {
        color: 'var(--brand-red-coral)',
        textAlign: 'left',
    },
    tooltipContent: {
        textAlign: 'left',
        fontSize: '1.6rem',
        padding: '3rem 0 1.6rem 0',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
    },
    buttonNext: {
        padding: '0.9rem',
        fontSize: '1.5rem',
        fontWeight: 'bold',
    },
};

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

export const getTourStepLocale = (): Locale => ({
    back: <SpanButton has_effect text={localize('Back')} secondary medium />,
    close: localize('Close'),
    last: localize('OK'),
    next: localize('Next'),
    skip: localize('Skip'),
});

export const getHighRiskTourStepLocale = (): Locale => ({
    back: <SpanButton has_effect text={localize('Back')} secondary medium />,
    close: localize('Close'),
    last: localize('OK'),
    next: localize('Next'),
    skip: localize('Skip'),
});

export const getWalletStepLocale = (): Locale => ({
    back: <SpanButton has_effect text={localize('Back')} secondary medium />,
    last: localize('Close'),
    next: localize('Next'),
    skip: <Icon icon='IcCross' size={16} />,
});

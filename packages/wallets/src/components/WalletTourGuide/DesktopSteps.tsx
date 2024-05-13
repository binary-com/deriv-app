import React from 'react';
import { Step } from 'react-joyride';
import { WalletText } from '../Base';
import { SpotLightHeader } from './WalletTourGuideSettings';
import './WalletTourGuide.scss';

const stepProps = {
    disableBeacon: true,
    disableOverlayClose: true,
    spotlightPadding: 0,
};

export const desktopStepTourGuide: Step[] = [
    {
        content: <WalletText size='sm'>Manage your funds with Wallets.</WalletText>,
        placement: 'bottom-start',
        styles: { spotlight: { borderRadius: '1.6rem' } },
        target: '.wallets-container__header',
        title: <SpotLightHeader>This is your Wallet</SpotLightHeader>,
        ...stepProps,
    },
    {
        content: <WalletText size='sm'>Press the tab to switch between Demo or Real Wallets.</WalletText>,
        placement: 'bottom',
        target: '.wallets-list-header__slider',
        title: <SpotLightHeader>Select Demo or Real</SpotLightHeader>,
        ...stepProps,
    },
    {
        content: <WalletText size='sm'>Use the drop-down menu to switch between your Wallets.</WalletText>,
        placement: 'right',
        target: '.wallets-textfield__box',
        title: <SpotLightHeader>Switch between Wallets</SpotLightHeader>,
        ...stepProps,
        spotlightPadding: 8,
    },
    {
        content: (
            <WalletText size='sm'>
                Want Wallets in other currencies too? Press <strong>Add</strong>.
            </WalletText>
        ),
        placement: 'right',
        styles: { spotlight: { borderRadius: '1.6rem' } },
        target: '.wallets-add-more__card',
        title: (
            <WalletText color='red' size='sm' weight='bold'>
                Explore more Wallets
            </WalletText>
        ),
        ...stepProps,
    },
    {
        content: <WalletText size='sm'>Press here to repeat this tour.</WalletText>,
        placement: 'bottom',
        styles: { spotlight: { borderRadius: '0 0 0.8rem 0.8rem' } },
        target: '.traders-hub-header__tradershub--onboarding--logo',
        title: (
            <WalletText color='red' size='sm' weight='bold'>
                Trader&apos;s Hub tour
            </WalletText>
        ),
        ...stepProps,
        spotlightPadding: 12,
    },
];

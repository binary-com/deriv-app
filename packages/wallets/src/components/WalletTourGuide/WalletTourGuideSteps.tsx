import React from 'react';
import { Step } from 'react-joyride';
import { Localize } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import { SpotLightHeader } from './WalletTourGuideSettings';
import './WalletTourGuide.scss';

const stepProps = {
    disableBeacon: true,
    disableOverlayClose: true,
    spotlightPadding: 0,
};

export const desktopStepTourGuide = (allWalletsAreAdded: boolean, isRtl: boolean): Step[] => [
    {
        content: (
            <Text align='start' size='sm'>
                <Localize i18n_default_text='Manage your funds with Wallets.' />
            </Text>
        ),
        placement: isRtl ? 'bottom-end' : 'bottom-start',
        styles: { spotlight: { borderRadius: '1.6rem' } },
        target: '.wallets-container__header',
        title: (
            <SpotLightHeader>
                <Localize i18n_default_text='This is your Wallet' />
            </SpotLightHeader>
        ),
        ...stepProps,
    },
    {
        content: (
            <Text align='start' size='sm'>
                <Localize i18n_default_text='Press the tab to switch between Demo or Real Wallets.' />
            </Text>
        ),
        disableScrolling: false,
        placement: 'bottom',
        target: '.wallets-list-header__slider',
        title: (
            <SpotLightHeader>
                <Localize i18n_default_text='Select Demo or Real' />
            </SpotLightHeader>
        ),
        ...stepProps,
    },
    {
        content: (
            <Text align='start' size='sm'>
                <Localize i18n_default_text='Switch to a Wallet from the drop-down menu.' />
            </Text>
        ),
        disableScrolling: !!allWalletsAreAdded,
        placement: 'bottom',
        target: '.wallets-textfield__box',
        title: (
            <SpotLightHeader>
                <Localize i18n_default_text='Change your Wallet' />
            </SpotLightHeader>
        ),
        ...stepProps,
        spotlightPadding: 8,
    },
    {
        content: (
            <Text align='start' size='sm'>
                <Localize
                    components={[<strong key={0} />]}
                    i18n_default_text='Want Wallets in other currencies too? Press <0>Add</0>.'
                />
            </Text>
        ),
        disableScrolling: false,
        placement: isRtl ? 'left' : 'right',
        styles: { spotlight: { borderRadius: '1.6rem' } },
        target: allWalletsAreAdded ? 'null' : '.wallets-add-more__card',
        title: (
            <Text color='red' size='sm' weight='bold'>
                <Localize i18n_default_text='Add more currencies' />
            </Text>
        ),
        ...stepProps,
    },
    {
        content: (
            <Text align='start' size='sm'>
                <Localize i18n_default_text='Press here to repeat this tour.' />
            </Text>
        ),
        placement: 'bottom',
        styles: { spotlight: { borderRadius: '0 0 0.8rem 0.8rem' } },
        target: '.traders-hub-header__tradershub--onboarding--logo',
        title: (
            <Text color='red' size='sm' weight='bold'>
                <Localize i18n_default_text="Trader's Hub tour" />
            </Text>
        ),
        ...stepProps,
        spotlightPadding: 12,
    },
];

export const mobileStepTourGuide = (allWalletsAreAdded: boolean): Step[] => [
    {
        content: (
            <Text align='start' size='sm'>
                <Localize i18n_default_text='Manage your funds with Wallets.' />
            </Text>
        ),
        placement: 'bottom',
        styles: { spotlight: { borderRadius: '0' } },
        target: '.wallets-carousel-content',
        title: (
            <SpotLightHeader>
                <Localize i18n_default_text='This is your Wallet' />
            </SpotLightHeader>
        ),
        ...stepProps,
    },
    {
        content: (
            <Text align='start' size='sm'>
                <Localize i18n_default_text='Swipe left or right to switch between Wallets.' />
            </Text>
        ),
        disableScrolling: !!allWalletsAreAdded,
        placement: 'bottom',
        styles: { spotlight: { borderRadius: '0' } },
        target: '.wallets-carousel-content__wrapper',
        title: (
            <SpotLightHeader>
                <Localize i18n_default_text='Switch between Wallets' />
            </SpotLightHeader>
        ),
        ...stepProps,
    },
    {
        content: (
            <Text align='start' size='sm'>
                <Localize i18n_default_text='Press the tab to switch between CFDs and Options accounts.' />
            </Text>
        ),
        disableScrolling: !!allWalletsAreAdded,
        placement: 'bottom',
        styles: { spotlight: { borderRadius: '0.8rem' } },
        target: '.wallets-tabs-list',
        title: (
            <SpotLightHeader>
                <Localize i18n_default_text='Select your account type' />
            </SpotLightHeader>
        ),
        ...stepProps,
    },
    {
        content: (
            <Text align='start' size='sm'>
                <Localize
                    components={[<strong key={0} />]}
                    i18n_default_text='Want Wallets in other currencies too? Press <0>Add</0>.'
                />
            </Text>
        ),
        disableScrolling: !!allWalletsAreAdded,
        placement: 'top',
        styles: { spotlight: { borderRadius: '1.6rem' } },
        target: allWalletsAreAdded ? 'null' : '.wallets-add-more__card',
        title: (
            <SpotLightHeader>
                <Localize i18n_default_text='Add more currencies' />
            </SpotLightHeader>
        ),
        ...stepProps,
    },
    {
        content: (
            <Text align='start' size='sm'>
                <Localize i18n_default_text='Press here to repeat this tour.' />
            </Text>
        ),
        disableScrolling: !!allWalletsAreAdded,
        placement: 'bottom',
        styles: { spotlight: { borderRadius: '0 0 0.8rem 0.8rem' } },
        target: '.traders-hub-header__tradershub--onboarding--logo',
        title: (
            <Text color='red' size='sm' weight='bold'>
                <Localize i18n_default_text="Trader's Hub tour" />
            </Text>
        ),
        ...stepProps,
        spotlightPadding: 12,
    },
];

import React from 'react';
import { Step } from 'react-joyride';
import { Localize } from '@deriv/translations';

const STEPS = [
    {
        content: <Localize i18n_default_text='Scroll left or right to explore trade types.' />,
        offset: 0,
        spotlightPadding: 2,
        target: '.trade__trade-types',
        title: <Localize i18n_default_text='Explore trade types (1/6)' />,
    },
    {
        content: <Localize i18n_default_text='View available markets here.' />,
        offset: 4,
        placement: 'bottom-start' as Step['placement'],
        spotlightPadding: 8,
        target: '.market-selector__container',
        title: <Localize i18n_default_text='Choose a market (2/6)' />,
    },
    {
        content: <Localize i18n_default_text='Specify your trade parameters.' />,
        offset: 4,
        spotlightPadding: 8,
        target: '.trade-params',
        title: <Localize i18n_default_text='Open your trade (3/6)' />,
    },
    {
        content: '',
        disableBeacon: false,
        offset: 0,
        spotlightPadding: 0,
        styles: {
            spotlight: {
                display: 'none',
            },
            arrow: {
                display: 'none',
            },
        },
        target: '#react-joyride-portal',
        title: 'scroll-icon',
    },
    {
        content: <Localize i18n_default_text='Track market trends with our interactive charts.' />,
        spotlightPadding: 8,
        offset: 4,
        target: '.trade__chart-tooltip',
        title: <Localize i18n_default_text='Analyse with charts (4/6)' />,
        placement: 'bottom' as Step['placement'],
    },
    {
        content: <Localize i18n_default_text='Scroll left or right to adjust your trade parameters.' />,
        disableScrolling: false,
        offset: -4,
        target: '.trade__parameter',
        title: <Localize i18n_default_text='Make quick adjustments (5/6)' />,
    },
    {
        content: <Localize i18n_default_text='View your positions here.' />,
        offset: -4,
        target: '.user-guide__anchor',
        title: <Localize i18n_default_text='Check your positions (6/6)' />,
    },
];

export default STEPS;

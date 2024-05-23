import { TJurisdictionCardItems } from './props.types';

export const getJurisdictionSvgContents = (): TJurisdictionCardItems => ({
    contents: {
        all: [
            {
                description: 'Forex, stocks, stock indices, commodities, cryptocurrencies, ETFs and synthetic indices',
                key: 'assets',
                title: 'Assets',
                titleIndicators: {
                    displayText: '40+',
                    displayTextSkinColor: 'red-darker',
                    type: 'displayText',
                },
            },
            {
                key: 'leverage',
                title: 'Leverage',
                titleIndicators: {
                    displayText: '1:1000',
                    displayTextSkinColor: 'yellow-light',
                    type: 'displayText',
                },
            },
            {
                description: 'You will need to submit proof of identity and address once you reach certain thresholds.',
                key: 'verifications',
                title: 'Verifications',
                titleIndicators: {
                    type: 'displayIcons',
                },
            },
            {
                description: 'Deriv (SVG) LLC (company no. 273 LLC 2020)',
                key: 'regulator',
                title: 'Regulator/EDR',
            },
        ],
        financial: [
            {
                description: 'Forex, Stocks, Stock indices, Commodities, and Cryptocurrencies',
                key: 'assets',
                title: 'Assets',
                titleIndicators: {
                    displayText: '170+',
                    displayTextSkinColor: 'red-light',
                    type: 'displayText',
                },
            },
            {
                clickableDescription: [
                    {
                        tag: 'dynamicLeverage',
                        text: 'Dynamic Leverage',
                        type: 'link',
                    },
                ],
                key: 'leverage',
                title: 'Leverage',
                titleIndicators: {
                    displayText: '1:1000',
                    displayTextSkinColor: 'yellow-light',
                    type: 'displayText',
                },
            },
            {
                key: 'spreads-from',
                title: 'Spreads from',
                titleIndicators: {
                    displayText: '0.6 pips',
                    displayTextSkinColor: 'violet-dark',
                    type: 'displayText',
                },
            },
            {
                description: 'You will need to submit proof of identity and address once you reach certain thresholds.',
                key: 'verifications',
                title: 'Verifications',
                titleIndicators: {
                    type: 'displayIcons',
                },
            },
            {
                description: 'Deriv (SVG) LLC (company no. 273 LLC 2020)',
                key: 'regulator',
                title: 'Regulator/EDR',
            },
        ],
        synthetic: [
            {
                description: 'Synthetics, Baskets and Derived FX',
                key: 'assets',
                title: 'Assets',
                titleIndicators: {
                    displayText: '40+',
                    displayTextSkinColor: 'red-darker',
                    type: 'displayText',
                },
            },
            {
                key: 'leverage',
                title: 'Leverage',
                titleIndicators: {
                    displayText: '1:1000',
                    displayTextSkinColor: 'yellow-light',
                    type: 'displayText',
                },
            },
            {
                description: 'You will need to submit proof of identity and address once you reach certain thresholds.',
                key: 'verifications',
                title: 'Verifications',
                titleIndicators: {
                    type: 'displayIcons',
                },
            },
            {
                description: 'Deriv (SVG) LLC (company no. 273 LLC 2020)',
                key: 'regulator',
                title: 'Regulator/EDR',
            },
        ],
    },
    header: 'St. Vincent & Grenadines',
    isOverHeaderAvailable: false,
    verificationDocs: {
        financial: ['notApplicable'],
        synthetic: ['notApplicable'],
    },
});

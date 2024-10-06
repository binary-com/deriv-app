import { useTranslations } from '@deriv-com/translations';
import { TJurisdictionCardItems } from './props.types';

export const getJurisdictionSvgContents = (
    localize: ReturnType<typeof useTranslations>['localize']
): TJurisdictionCardItems => ({
    contents: {
        all: [
            {
                description: localize(
                    'Forex, stocks, stock indices, commodities, cryptocurrencies, ETFs and synthetic indices'
                ),
                key: 'assets',
                title: localize('Assets'),
                titleIndicators: {
                    displayText: localize('40+'),
                    displayTextSkinColor: 'red-darker',
                    type: 'displayText',
                },
            },
            {
                key: 'leverage',
                title: localize('Leverage up to'),
                titleIndicators: {
                    displayText: localize('1:1000'),
                    displayTextSkinColor: 'yellow-light',
                    type: 'displayText',
                },
            },
            {
                description: localize(
                    'You will need to submit proof of identity and address once you reach certain thresholds.'
                ),
                key: 'verifications',
                title: localize('Verifications'),
                titleIndicators: {
                    type: 'displayIcons',
                },
            },
            {
                description: localize('Deriv (SVG) LLC (company no. 273 LLC 2020)'),
                key: 'regulator',
                title: localize('Regulator/EDR'),
            },
        ],
        financial: [
            {
                description: localize(
                    'Forex (standard/micro), stocks, stock indices, commodities, cryptocurrencies and ETFs'
                ),
                key: 'assets',
                title: localize('Assets'),
                titleIndicators: {
                    displayText: localize('170+'),
                    displayTextSkinColor: 'red-light',
                    type: 'displayText',
                },
            },
            {
                clickableDescription: [
                    {
                        tag: 'dynamicLeverage',
                        text: localize('Dynamic Leverage'),
                        type: 'link',
                    },
                ],
                key: 'leverage',
                title: localize('Leverage up to'),
                titleIndicators: {
                    displayText: localize('1:1000'),
                    displayTextSkinColor: 'yellow-light',
                    type: 'displayText',
                },
            },
            {
                key: 'spreads-from',
                title: localize('Spreads from'),
                titleIndicators: {
                    displayText: localize('0.6 pips'),
                    displayTextSkinColor: 'violet-dark',
                    type: 'displayText',
                },
            },
            {
                description: localize(
                    'You will need to submit proof of identity and address once you reach certain thresholds.'
                ),
                key: 'verifications',
                title: localize('Verifications'),
                titleIndicators: {
                    type: 'displayIcons',
                },
            },
            {
                description: localize('Deriv (SVG) LLC (company no. 273 LLC 2020)'),
                key: 'regulator',
                title: localize('Regulator/EDR'),
            },
        ],
        synthetic: [
            {
                description: localize(
                    'Forex (standard), stock indices, commodities, cryptocurrencies, synthetic indices, basket indices and derived FX'
                ),
                key: 'assets',
                title: localize('Assets'),
                titleIndicators: {
                    displayText: localize('210+'),
                    displayTextSkinColor: 'red-darker',
                    type: 'displayText',
                },
            },
            {
                key: 'leverage',
                title: localize('Leverage up to'),
                titleIndicators: {
                    displayText: localize('1:1000'),
                    displayTextSkinColor: 'yellow-light',
                    type: 'displayText',
                },
            },
            {
                description: localize(
                    'You will need to submit proof of identity and address once you reach certain thresholds.'
                ),
                key: 'verifications',
                title: localize('Verifications'),
                titleIndicators: {
                    type: 'displayIcons',
                },
            },
            {
                description: localize('Deriv (SVG) LLC (company no. 273 LLC 2020)'),
                key: 'regulator',
                title: localize('Regulator/EDR'),
            },
        ],
    },
    header: localize('St. Vincent & Grenadines'),
    isOverHeaderAvailable: false,
    verificationDocs: {
        financial: ['notApplicable'],
        synthetic: ['notApplicable'],
    },
});

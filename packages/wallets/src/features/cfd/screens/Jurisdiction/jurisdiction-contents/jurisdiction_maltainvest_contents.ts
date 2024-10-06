import { useTranslations } from '@deriv-com/translations';
import { TJurisdictionCardItems } from './props.types';

export const getJurisdictionMaltainvestContents = (
    localize: ReturnType<typeof useTranslations>['localize']
): TJurisdictionCardItems => ({
    contents: {
        financial: [
            {
                description: localize(
                    'Forex, stocks, stock indices, commodities, cryptocurrencies and synthetic indices'
                ),
                key: 'assets',
                title: localize('Assets'),
                titleIndicators: {
                    displayText: localize('140+'),
                    displayTextSkinColor: 'red-light',
                    type: 'displayText',
                },
            },
            {
                key: 'leverage',
                title: localize('Leverage up to'),
                titleIndicators: {
                    displayText: localize('1:30'),
                    displayTextSkinColor: 'brown-dark',
                    type: 'displayText',
                },
            },
            {
                key: 'spreads-from',
                title: localize('Spreads from'),
                titleIndicators: {
                    displayText: localize('0.5 pips'),
                    displayTextSkinColor: 'violet-dark',
                    type: 'displayText',
                },
            },
            {
                clickableDescription: [
                    {
                        text: localize('Learn more'),
                        type: 'link',
                    },
                    {
                        text: localize('about verifications needed.'),
                        type: 'text',
                    },
                ],
                key: 'verifications',
                title: localize('Verifications'),
                titleIndicators: {
                    type: 'displayIcons',
                },
            },
            {
                description: localize('Malta Financial Services Authority (MFSA) (licence no. IS/70156)'),
                key: 'regulator',
                title: localize('Regulator/EDR'),
            },
        ],
        synthetic: [
            {
                description: localize('Synthetics, Forex, Stocks, Stock indices, Commodities, and Cryptocurrencies'),
                key: 'assets',
                title: localize('Assets'),
                titleIndicators: {
                    displayText: localize('210+'),
                    displayTextSkinColor: 'red-light',
                    type: 'displayText',
                },
            },
            {
                key: 'leverage',
                title: localize('Leverage up to'),
                titleIndicators: {
                    displayText: localize('1:30'),
                    displayTextSkinColor: 'brown-dark',
                    type: 'displayText',
                },
            },
            {
                key: 'spreads-from',
                title: localize('Spreads from'),
                titleIndicators: {
                    displayText: localize('0.5 pips'),
                    displayTextSkinColor: 'violet-dark',
                    type: 'displayText',
                },
            },
            {
                clickableDescription: [
                    {
                        text: localize('Learn more'),
                        type: 'link',
                    },
                    {
                        text: localize('about verifications needed.'),
                        type: 'text',
                    },
                ],
                key: 'verifications',
                title: localize('Verifications'),
            },
            {
                description: localize('Malta Financial Services Authority (MFSA) (licence no. IS/70156)'),
                key: 'regulator',
                title: localize('Regulator/EDR'),
            },
        ],
    },
    header: localize('Malta'),
    isOverHeaderAvailable: false,
    verificationDocs: {
        financial: ['selfie', 'identityDocument', 'nameAndAddress'],
        synthetic: ['selfie', 'identityDocument', 'nameAndAddress'],
    },
});

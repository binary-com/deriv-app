import { useTranslations } from '@deriv-com/translations';
import { TJurisdictionCardItems } from './props.types';

export const getJurisdictionLabuanContents = (
    localize: ReturnType<typeof useTranslations>['localize']
): TJurisdictionCardItems => ({
    contents: {
        financial: [
            {
                description: localize('Forex (standard/exotic) and cryptocurrencies'),
                key: 'assets',
                title: localize('Assets'),
                titleIndicators: {
                    displayText: localize('80+'),
                    displayTextSkinColor: 'red-dark',
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
                    displayText: localize('1:100'),
                    displayTextSkinColor: 'yellow-dark',
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
                description: localize('Labuan Financial Services Authority (licence no. MB/18/0024)'),
                key: 'regulator',
                title: localize('Regulator/EDR'),
            },
        ],
        synthetic: [
            {
                description: localize('Forex and Cryptocurrencies'),
                key: 'assets',
                title: localize('Assets'),
            },
            {
                key: 'leverage',
                title: localize('Leverage up to'),
            },
            {
                key: 'spreads-from',
                title: localize('Spreads from'),
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
                description: localize('Labuan Financial Services Authority (licence no. MB/18/0024)'),
                key: 'regulator',
                title: localize('Regulator/EDR'),
            },
        ],
    },
    header: localize('Labuan'),
    isOverHeaderAvailable: true,
    overHeader: localize('Straight-through processing'),
    verificationDocs: {
        financial: ['documentNumber', 'nameAndAddress'],
        synthetic: ['documentNumber', 'nameAndAddress'],
    },
});

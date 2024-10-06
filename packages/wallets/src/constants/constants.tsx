import { useTranslations } from '@deriv-com/translations';
import { getStaticUrl, getUrlSmartTrader } from '../helpers/urls';

export const getOptionsAndMultipliersContent = (localize: ReturnType<typeof useTranslations>['localize']) => [
    {
        description: localize('The options and multipliers trading platform.'),
        key: 'trader',
        redirect: '/dtrader',
        title: 'Deriv Trader',
    },
    {
        description: localize('The ultimate bot trading platform.'),
        key: 'bot',
        redirect: '/bot',
        title: 'Deriv Bot',
    },
    {
        description: localize('The legacy options trading platform.'),
        isExternal: true,
        key: 'smarttrader',
        redirect: getUrlSmartTrader(),
        title: 'SmartTrader',
    },
    {
        description: localize('The mobile app for trading multipliers and accumulators.'),
        isExternal: true,
        key: 'derivgo',
        redirect: getStaticUrl('/deriv-go'),
        title: 'Deriv GO',
    },
];

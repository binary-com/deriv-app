import { routes } from '@deriv/shared';

import { localize } from '@deriv/translations';

const platform_config = [
    {
        icon: 'IcBrandDtrader',
        title: () => localize('DTrader'),
        name: 'DTrader',
        description: () => localize('A whole new trading experience on a powerful yet easy to use platform.'),
        link_to: routes.trade,
    },
    {
        icon: 'IcBrandDbot',
        title: () => localize('DBot'),
        name: 'DBot',
        description: () => localize('Automated trading at your fingertips. No coding needed.'),
        link_to: routes.bot,
    },
    {
        icon: 'IcBrandDmt5',
        title: () => localize('DMT5'),
        name: 'DMT5',
        description: () => localize('The most popular CFD trading platform worldwide.'),
        link_to: routes.mt5,
    },
    {
        icon: 'IcBrandDxtrade',
        title: () => localize('Deriv X'),
        name: 'Deriv X',
        description: () => localize('CFD trading on a customisable multi-asset platform.'),
        link_to: routes.dxtrade,
    },
    {
        icon: 'IcBrandSmarttrader',
        title: () => localize('SmartTrader'),
        name: 'SmartTrader',
        description: () => localize('Trade the world’s markets with our popular user-friendly platform'),
        href: routes.smarttrader,
    },
];

export default platform_config;

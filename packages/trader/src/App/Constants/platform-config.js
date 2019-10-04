import { localize } from 'App/i18n';
import { routes }   from 'Constants/index';
import { isBot }    from 'Utils/PlatformSwitcher';

const key = isBot() ? 'href' : 'link_to';

const platform_config = [
    {
        icon       : 'IconDeriv',
        title      : localize('DTrader'),
        description: localize('Everything you need to trade the markets you want'),
        [key]      : routes.trade,
    },
    {
        icon       : 'IconDBot',
        title      : localize('DBot'),
        description: localize('A powerful robot builder to automate your trading strategies'),
        href       : '/bot',
    },
    // TODO: Enable MT5 once all relevant tasks are done
    // {
    //     icon       : 'IconMT5',
    //     title      : localize('MetaTrader 5'),
    //     description: localize('An all-in-one platform for FX and CFD Trading'),
    //     [key]      : routes.mt5,
    // },
];

export default platform_config;

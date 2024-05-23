import React from 'react';
import {
    DerivProductDerivBotBrandLightLogoHorizontalIcon,
    DerivProductDerivGoBrandLightLogoHorizontalIcon,
    DerivProductDerivTraderBrandLightLogoHorizontalIcon,
    PartnersProductBinaryBotBrandLightLogoHorizontalIcon,
    PartnersProductSmarttraderBrandLightLogoIcon,
} from '@deriv/quill-icons';
import { getStaticUrl, getUrlBinaryBot, getUrlSmartTrader } from '../helpers/urls';
import i18n from '../translations/i18n';

export const optionsAndMultipliersContent = [
    {
        description: i18n.t('The options and multipliers trading platform.'),
        icon: <DerivProductDerivTraderBrandLightLogoHorizontalIcon height='48' width='48' />,
        redirect: '/',
        smallIcon: <DerivProductDerivTraderBrandLightLogoHorizontalIcon height='32' width='32' />,
        title: i18n.t('Deriv Trader'),
    },
    {
        description: i18n.t('The ultimate bot trading platform.'),
        icon: <DerivProductDerivBotBrandLightLogoHorizontalIcon height='48' width='48' />,
        redirect: '/bot',
        smallIcon: <DerivProductDerivBotBrandLightLogoHorizontalIcon height='32' width='32' />,
        title: i18n.t('Deriv Bot'),
    },
    {
        description: i18n.t('The legacy options trading platform.'),
        icon: <PartnersProductSmarttraderBrandLightLogoIcon height='48' width='48' />,
        isExternal: true,
        redirect: getUrlSmartTrader(),
        smallIcon: <PartnersProductSmarttraderBrandLightLogoIcon height='32' width='32' />,
        title: i18n.t('SmartTrader'),
    },
    {
        description: i18n.t('The legacy bot trading platform.'),
        icon: <PartnersProductBinaryBotBrandLightLogoHorizontalIcon height='48' width='48' />,
        isExternal: true,
        redirect: getUrlBinaryBot(),
        smallIcon: <PartnersProductBinaryBotBrandLightLogoHorizontalIcon height='32' width='32' />,
        title: i18n.t('Binary Bot'),
    },
    {
        description: i18n.t('The mobile trading app for multipliers.'),
        icon: <DerivProductDerivGoBrandLightLogoHorizontalIcon height='48' width='48' />,
        isExternal: true,
        redirect: getStaticUrl('/deriv-go'),
        smallIcon: <DerivProductDerivGoBrandLightLogoHorizontalIcon height='32' width='32' />,
        title: i18n.t('Deriv GO'),
    },
];

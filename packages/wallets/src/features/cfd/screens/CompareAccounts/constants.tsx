import React from 'react';
import {
    AccountsDerivXIcon,
    AccountsDmt5CfdsIcon,
    AccountsDmt5FinancialIcon,
    AccountsDmt5StandardIcon,
    AccountsDmt5SwfIcon,
    AccountsDmt5ZrsIcon,
    PartnersProductDerivCtraderBrandLightLogoHorizontalIcon,
} from '@deriv/quill-icons';
import { useTranslations } from '@deriv-com/translations';
import { CFD_PLATFORMS, MARKET_TYPE, PRODUCT } from '../../constants';

export const ACCOUNT_ICONS = {
    [MARKET_TYPE.SYNTHETIC]: <AccountsDmt5StandardIcon iconSize='lg' />,
    [MARKET_TYPE.FINANCIAL]: <AccountsDmt5FinancialIcon iconSize='lg' />,
    [MARKET_TYPE.ALL]: <AccountsDmt5SwfIcon iconSize='lg' />,
    [CFD_PLATFORMS.DXTRADE]: <AccountsDerivXIcon iconSize='lg' />,
    [CFD_PLATFORMS.CTRADER]: <PartnersProductDerivCtraderBrandLightLogoHorizontalIcon height={48} width={48} />,
    [PRODUCT.ZEROSPREAD]: <AccountsDmt5ZrsIcon iconSize='lg' />,
    default: <AccountsDmt5CfdsIcon iconSize='lg' />,
} as const;

export const MARKET_TYPE_SHORTCODE = {
    ALL_DXTRADE: 'all_',
    ALL_SVG: 'all_svg',
    ALL_SWAP_FREE_SVG: 'all_swap_free_svg',
    ALL_ZERO_SPREAD_BVI: 'all_zero_spread_bvi',
    FINANCIAL_BVI: 'financial_bvi',
    FINANCIAL_LABUAN: 'financial_labuan',
    FINANCIAL_MALTAINVEST: 'financial_maltainvest',
    FINANCIAL_SVG: 'financial_svg',
    FINANCIAL_VANUATU: 'financial_vanuatu',
    GAMING: 'gaming',
    SYNTHETIC_BVI: 'synthetic_bvi',
    SYNTHETIC_SVG: 'synthetic_svg',
    SYNTHETIC_VANUATU: 'synthetic_vanuatu',
} as const;

export const JURISDICTION = {
    BVI: 'bvi',
    LABUAN: 'labuan',
    MALTAINVEST: 'maltainvest',
    SVG: 'svg',
    VANUATU: 'vanuatu',
} as const;

export const platformLabel = (localize: ReturnType<typeof useTranslations>['localize']) => ({
    CTrader: 'Deriv cTrader',
    DerivX: 'Deriv X',
    MT5: localize('MT5 Platform'),
    OtherCFDs: localize('Other CFDs Platform'),
});

export const headerColor = {
    CTrader: 'orange',
    DerivX: 'green',
    MT5: 'blue',
    OtherCFDs: 'green',
} as const;

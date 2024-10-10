import React from 'react';
import { Icon } from '@deriv/components';
import { routes } from '@deriv/shared';
import { CFD_PLATFORMS, PRODUCT } from '../Helpers/cfd-config';
import TradingPlatformIcon from '../Assets/svgs/trading-platform';
import { TProducts } from '../Components/props.types';

type TCFDPasswordSuccessIconProps = {
    platform: string;
    type?: string;
    show_eu_related_content: boolean;
    product?: TProducts;
};

const getIconForTradersHub = (type: string | undefined, show_eu_related_content: boolean, product?: TProducts) => {
    switch (type) {
        case 'synthetic':
            return 'Standard';
        case 'all':
            return product === PRODUCT.ZEROSPREAD ? 'ZeroSpread' : 'SwapFree';
        case 'financial':
            return show_eu_related_content ? 'CFDs' : 'Financial';
        default:
            return 'Financial';
    }
};

const getIconForMt5 = (type: string | undefined, show_eu_related_content: boolean, product?: TProducts) => {
    switch (type) {
        case 'synthetic':
            return 'IcMt5StandardPlatform';
        case 'all':
            return product === PRODUCT.ZEROSPREAD ? 'IcMt5ZeroSpread' : 'IcMt5SwapFreePlatform';
        case 'financial':
            return show_eu_related_content ? 'IcMt5CfdPlatform' : 'IcMt5FinancialPlatform';
        default:
            return 'IcMt5FinancialStpPlatform';
    }
};

const CFDPasswordSuccessIcon = ({ platform, type, show_eu_related_content, product }: TCFDPasswordSuccessIconProps) => {
    const isTradersHub = window.location.pathname === routes.traders_hub;

    if (platform === CFD_PLATFORMS.DXTRADE) {
        return <Icon icon='IcRebrandingDxtradeDashboard' size={128} />;
    }

    if (platform === CFD_PLATFORMS.CTRADER) {
        return <TradingPlatformIcon icon='CTrader' size={128} />;
    }

    if (isTradersHub) {
        const icon = getIconForTradersHub(type, show_eu_related_content, product);
        return <TradingPlatformIcon icon={icon} size={128} />;
    }

    const icon = getIconForMt5(type, show_eu_related_content, product);
    return <Icon icon={icon} size={128} />;
};

export default CFDPasswordSuccessIcon;

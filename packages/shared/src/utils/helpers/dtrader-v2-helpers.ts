/* TODO: remove this component after /trader package is separated into its own repo.
It's used to keep dtrader_v2 utils that are currently shared between various packages. */

import { extractInfoFromShortcode, isHighLow } from '../shortcode';
import { getMarketName, getTradeTypeName } from './market-underlying';

export const POSITIONS_V2_TAB_NAME = {
    OPEN: 'Open',
    CLOSED: 'Closed',
};

export const getPositionsV2TabIndexFromURL = () => {
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.toString()) {
        const current_opened_tab = [...searchParams.values()];
        return current_opened_tab[0] === POSITIONS_V2_TAB_NAME.OPEN.toLowerCase() ? 0 : 1;
    }
    return 0;
};

export const isDTraderV2 = () =>
    !!JSON.parse(localStorage.getItem('FeatureFlagsStore') ?? '{}')?.data?.dtrader_v2 && window.innerWidth < 600;

export const redirectToDTraderStandalone = () => {
    !!JSON.parse(localStorage.getItem('FeatureFlagsStore') ?? '{}')?.data?.redirect_to_dtrader_standalone;
};

export const getTradeNotificationMessage = (shortcode: string) => {
    const extracted_info_from_shortcode = extractInfoFromShortcode(shortcode);
    const symbol = getMarketName(extracted_info_from_shortcode.underlying);
    const trade_type = extracted_info_from_shortcode.category;
    const contract_type = getTradeTypeName(trade_type, {
        isHighLow: isHighLow({ shortcode }),
        showMainTitle: true,
    });
    const contract_type_with_subtype = `${contract_type} ${getTradeTypeName(trade_type, {
        isHighLow: isHighLow({ shortcode }),
    })}`.trim();

    return `${contract_type_with_subtype} - ${symbol}`;
};

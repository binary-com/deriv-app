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
    const positions_v2_tab_names_array = Object.keys(POSITIONS_V2_TAB_NAME).map(key => key.toLowerCase());

    if (searchParams.toString()) {
        // searchParams will include language as additional parameter for all languages except English.
        // We need filtration for URL params in order to make solutions independent from any langue change
        const current_opened_tab = [...searchParams.values()].filter(value =>
            positions_v2_tab_names_array.includes(value?.toLowerCase())
        );
        return current_opened_tab[0]?.toLowerCase() === POSITIONS_V2_TAB_NAME.OPEN.toLowerCase() ||
            !current_opened_tab[0]
            ? 0
            : 1;
    }
    return 0;
};

export const isDTraderV2 = () =>
    !!JSON.parse(localStorage.getItem('FeatureFlagsStore') ?? '{}')?.data?.dtrader_v2 && window.innerWidth < 600;

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

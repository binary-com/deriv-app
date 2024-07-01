import React from 'react';
import {
    IllustrativeBasketIndicesIcon,
    IllustrativeCommoditiesIcon,
    IllustrativeCryptocurrenciesIcon,
    IllustrativeDerivedFxIcon,
    IllustrativeEtfIcon,
    IllustrativeForexIcon,
    IllustrativeStockIndicesIcon,
    IllustrativeStocksIcon,
    IllustrativeSyntheticIndicesIcon,
} from '@deriv/quill-icons';

const getInstrumentsIcons = (isMobile: boolean) => {
    const size = isMobile ? { height: 16, width: 16 } : { height: 24, width: 24 };

    return {
        Baskets: <IllustrativeBasketIndicesIcon {...size} />,
        Commodities: <IllustrativeCommoditiesIcon {...size} />,
        Cryptocurrencies: <IllustrativeCryptocurrenciesIcon {...size} />,
        DerivedFX: <IllustrativeDerivedFxIcon {...size} />,
        ETF: <IllustrativeEtfIcon {...size} />,
        Forex: <IllustrativeForexIcon {...size} />,
        StockIndices: <IllustrativeStockIndicesIcon {...size} />,
        Stocks: <IllustrativeStocksIcon {...size} />,
        Synthetics: <IllustrativeSyntheticIndicesIcon {...size} />,
    };
};

export default getInstrumentsIcons;

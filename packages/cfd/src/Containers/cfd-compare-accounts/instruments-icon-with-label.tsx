import React from 'react';
import TradingInstrumentsIcon from '../../Assets/svgs/trading-instruments';

type TIconProps = {
    icon:
        | 'DerivedFX'
        | 'Synthetics'
        | 'BasketIndices'
        | 'Stocks'
        | 'StockIndices'
        | 'Commodities'
        | 'Forex'
        | 'Cryptocurrencies'
        | 'ETF';
    text: string;
    highlighted: boolean;
    className?: string;
};

const InstumentsIconWithLabel = ({ icon, text, highlighted, className }: TIconProps) => {
    return (
        <div
            style={{
                opacity: highlighted ? '' : '0.2',
            }}
            className={className}
        >
            <TradingInstrumentsIcon icon={icon} size={24} className='trading-instruments__icon' />
            <span
                style={{
                    marginLeft: '0.5rem',
                }}
            >
                {text}
            </span>
        </div>
    );
};

export default InstumentsIconWithLabel;

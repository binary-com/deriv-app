import React from 'react';
// TODO: Replace icons with quill-icons
import DerivedMT5 from '../../../../public/images/mt5-derived.svg';
import FinancialMT5 from '../../../../public/images/mt5-financial.svg';
import SwapFreeMT5 from '../../../../public/images/mt5-swap-free.svg';
import i18n from '../../../../translations/i18n';
import { MT5AccountTypeCard } from '../MT5AccountTypeCard';
import './MT5AccountType.scss';

const marketTypeDetailsMapper = {
    all: {
        description: i18n.t(
            'Trade swap-free CFDs on MT5 with forex, stocks, stock indices, commodities cryptocurrencies, ETFs and synthetic indices.'
        ),
        icon: <SwapFreeMT5 />,
        title: i18n.t('Swap-Free'),
    },
    financial: {
        description: i18n.t(
            'Trade CFDs on MT5 with forex, stocks and indices, commodities, cryptocurrencies, and ETFs.'
        ),
        icon: <FinancialMT5 />,
        title: i18n.t('Financial'),
    },
    synthetic: {
        description: i18n.t('Trade CFDs on MT5 with derived indices that simulate real-world market movements.'),
        icon: <DerivedMT5 />,
        title: i18n.t('Derived'),
    },
};

type TProps = {
    onMarketTypeSelect: (marketType: keyof typeof marketTypeDetailsMapper) => void;
    selectedMarketType?: keyof typeof marketTypeDetailsMapper;
};

const MT5AccountType: React.FC<TProps> = ({ onMarketTypeSelect, selectedMarketType }) => {
    const sortedMarketTypeEntries = Object.entries(marketTypeDetailsMapper).sort(([keyA], [keyB]) => {
        const order = ['synthetic', 'financial', 'all'];
        return order.indexOf(keyA) - order.indexOf(keyB);
    });
    return (
        <div className='wallets-mt5-account-type-content'>
            {sortedMarketTypeEntries.map(([key, value]) => (
                <MT5AccountTypeCard
                    description={value.description}
                    icon={value.icon}
                    isSelected={selectedMarketType === key}
                    key={key}
                    // @ts-expect-error the key always is the type of keyof typeof marketTypeDetailsMapper.
                    onClick={() => onMarketTypeSelect(key === selectedMarketType ? undefined : key)}
                    title={value.title}
                />
            ))}
        </div>
    );
};

export default MT5AccountType;

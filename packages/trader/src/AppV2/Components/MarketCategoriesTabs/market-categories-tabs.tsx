import React from 'react';
import { Tab } from '@deriv-com/quill-ui';
import useActiveSymbols from 'AppV2/Hooks/useActiveSymbols';
import { categorizeSymbols } from 'AppV2/Utils/symbol-categories-utils';

const tabs = [
    { id: 'abc', title: 'cde', content: 'fornow' },
    { id: 'abcde', title: 'cde', content: 'some' },
    { id: 'abcfg', title: 'cde', content: 'kewl' },
];
export type TProcessedSymbolItem = {
    symbol: string;
    name: string;
    market: string;
    market_display_name: string;
    subgroup: string;
    subgroup_display_name: string;
    submarket: string;
    submarket_display_name: string;
    exchange_is_open: boolean;
    decimal_places: number;
};

const Dropdown: React.FC<DropdownProps> = ({ groupedSymbols }) => {
    return (
        <div>
            {Object.entries(groupedSymbols).map(([market, marketGroup]) => (
                <div key={market}>
                    <h2>{marketGroup.market_display_name}</h2>
                    {Object.entries(marketGroup.subgroups).map(([subgroup, subgroupGroup]) => (
                        <div key={subgroup}>
                            <h3>{subgroupGroup.subgroup_display_name}</h3>
                            {Object.entries(subgroupGroup.submarkets).map(([submarket, submarketGroup]) => (
                                <div key={submarket}>
                                    <h4>{submarketGroup.submarket_display_name}</h4>
                                    <ul>
                                        {submarketGroup.items.map(item => (
                                            <li key={item.symbol}>{item.display_name}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

const MarketCategoriesTabs = () => {
    const { activeSymbols } = useActiveSymbols();
    const categorizedSymbols = categorizeSymbols(activeSymbols);

    return (
        <React.Fragment>
            <Tab.List>
                {Object.values(categorizedSymbols).map(symbol => {
                    return <Tab.Trigger key={symbol.market_display_name}>{symbol.market_display_name}</Tab.Trigger>;
                })}
            </Tab.List>
            {/* <Tab.Content className=''>
                {tabs.map(({ id, content }) => (
                    <Tab.Panel key={id}>{content}</Tab.Panel>
                ))}
            </Tab.Content> */}
        </React.Fragment>
    );
};

export default MarketCategoriesTabs;

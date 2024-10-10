import React from 'react';
import { Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { Link } from '@deriv-com/quill-ui';
import {
    STRATEGY_TRADE_ASSOCIATIONS,
    TRADE_TYPE_INDEX,
    TRADE_TYPES,
    TStrategyTradeAssociations,
} from './trade-constants';

type TStrategyListProps = {
    selector_chip_value: number;
    search_value: string;
    is_searching: boolean;
    onSelectStrategy: (strategy: string, trade_type: string) => void;
};
type TStrategyBlock = {
    title: string;
    items: TStrategyTradeAssociations;
    onSelectStrategy: (strategy: string, trade_type: string) => void;
};
type TStrategyTypes = { type: string; items: TStrategyTradeAssociations }[];

const StrategyBlock = ({ title, items, onSelectStrategy }: TStrategyBlock) => {
    return items.length > 0 ? (
        <div className='strategy-template-picker__strategy'>
            <div className='strategy-template-picker__title'>
                <Text size='xs' weight='bold'>
                    {title}
                </Text>
            </div>
            {items.map((item, index) => (
                <div className='strategy-template-picker__links' key={index}>
                    <Link
                        color='var(--text-prominent)'
                        hasChevron
                        size='sm'
                        onClick={() => onSelectStrategy(item.name, title)}
                    >
                        {item.display_name}
                    </Link>
                </div>
            ))}
        </div>
    ) : null;
};

const StrategyList = ({ selector_chip_value, search_value, is_searching, onSelectStrategy }: TStrategyListProps) => {
    const result: TStrategyTradeAssociations = [];
    let is_parent_match_value = false;

    const filterVisibleParents = (parent: string) => {
        is_parent_match_value = parent.toLowerCase().includes(search_value.toLowerCase());
        return (is_searching && is_parent_match_value) || !is_searching;
    };

    const is_display_name_match = STRATEGY_TRADE_ASSOCIATIONS.some(item =>
        item.display_name.toLowerCase().includes(search_value.toLowerCase())
    );

    STRATEGY_TRADE_ASSOCIATIONS.filter(
        item =>
            item.parent.some(parent => filterVisibleParents(parent)) ||
            item.display_name.toLowerCase().includes(search_value.toLowerCase())
    ).forEach(item => {
        const tmp_item = { ...item };
        if (is_searching && search_value !== '') {
            if (is_display_name_match) {
                tmp_item.parent = [...item.parent];
            } else {
                const matched_parents = tmp_item.parent.filter(parent =>
                    TRADE_TYPES.some(
                        type =>
                            parent.toLowerCase().includes(type.toLowerCase()) &&
                            type.toLowerCase().includes(search_value.toLowerCase())
                    )
                );
                tmp_item.parent = matched_parents.length > 0 ? matched_parents : item.parent;
            }
        } else {
            tmp_item.parent = [...item.parent];
        }
        result.push(tmp_item);
    });

    const options = result.filter(item => item.parent.includes(TRADE_TYPES[TRADE_TYPE_INDEX.OPTIONS]));
    const multiplier = result.filter(item => item.parent.includes(TRADE_TYPES[TRADE_TYPE_INDEX.MULTIPLIERS]));
    const accumulator = result.filter(item => item.parent.includes(TRADE_TYPES[TRADE_TYPE_INDEX.ACCUMULATORS]));

    const selected_chip_value = TRADE_TYPES[selector_chip_value];

    const strategy_types: TStrategyTypes = [
        { type: 'Options', items: options },
        { type: 'Multipliers', items: multiplier },
        { type: 'Accumulators', items: accumulator },
    ];

    const should_render = (type: string) => selected_chip_value === 'All' || selected_chip_value === type;

    const filtered_strategies = strategy_types.filter(({ type }) => should_render(type));
    const has_visible_strategies = filtered_strategies.some(({ items }) => items.length > 0);

    return result.length > 0 && has_visible_strategies ? (
        <div className='strategy-template-picker__strategies'>
            {filtered_strategies.map(({ type, items }) => (
                <StrategyBlock key={type} title={type} items={items} onSelectStrategy={onSelectStrategy} />
            ))}
        </div>
    ) : (
        <div className='no-results'>
            <Text size='xs'>{localize('No results found')}</Text>
        </div>
    );
};

export default StrategyList;

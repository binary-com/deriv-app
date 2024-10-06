import React from 'react';
import { screen, render } from '@testing-library/react';
import MarketCategory from '../market-category';
import { ActiveSymbols } from '@deriv/api-types';

jest.mock('AppV2/Components/MarketCategoryItem', () =>
    jest.fn(props => <div ref={props.ref}>MockedMarketCategoryItem</div>)
);

jest.mock('AppV2/Components/FavoriteSymbols', () => jest.fn(() => <div>MockedFavoriteSymbols</div>));

describe('<MarketCategory />', () => {
    const mocked_props = {
        category: {
            market: 'forex',
            market_display_name: 'Forex',
            subgroups: {
                none: {
                    subgroup_display_name: 'Forex',
                    submarkets: {
                        major_pairs: {
                            submarket_display_name: 'Major Pairs',
                            items: [
                                {
                                    symbol: 'frxAUDUSD',
                                    display_name: 'AUD/USD',
                                    market: 'forex',
                                    market_display_name: 'Forex',
                                    subgroup: 'none',
                                    subgroup_display_name: 'None',
                                    submarket: 'major_pairs',
                                    submarket_display_name: 'Major Pairs',
                                },
                                {
                                    symbol: 'frxUSDCAD',
                                    display_name: 'USD/CAD',
                                    market: 'forex',
                                    market_display_name: 'Forex',
                                    subgroup: 'none',
                                    subgroup_display_name: 'None',
                                    submarket: 'major_pairs',
                                    submarket_display_name: 'Major Pairs',
                                },
                            ] as ActiveSymbols,
                        },
                    },
                },
            },
        },
        selectedSymbol: '',
        setSelectedSymbol: jest.fn,
        setIsOpen: jest.fn(),
        isOpen: false,
    };

    it('should render correct labels', () => {
        render(<MarketCategory {...mocked_props} />);
        expect(screen.getByText('Major Pairs')).toBeInTheDocument();
        expect(screen.getAllByText('MockedMarketCategoryItem')).toHaveLength(2);
    });
    it('should render FavoriteSymbols component when market is favorites', () => {
        const favoriteProps = {
            ...mocked_props,
            category: {
                market: 'favorites',
                market_display_name: 'Favourites',
                subgroups: {},
            },
        };
        render(<MarketCategory {...favoriteProps} />);
        expect(screen.getByText('MockedFavoriteSymbols')).toBeInTheDocument();
    });
});

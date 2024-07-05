import React, { useState, useEffect } from 'react';
import { Tag, Text, useSnackbar } from '@deriv-com/quill-ui';
import { StandaloneStarFillIcon, StandaloneStarRegularIcon } from '@deriv/quill-icons';
import { Localize } from '@deriv/translations';
import SymbolIconsMapper from '../SymbolIconsMapper/symbol-icons-mapper';
import { ActiveSymbols } from '@deriv/api-types';
import clsx from 'clsx';
import { observer } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';

type TMarketCategoryItem = {
    item: ActiveSymbols[0];
    selectedSymbol: string;
    setSelectedSymbol: (input: string) => void;
    setIsOpen: (input: boolean) => void;
};

const MarketCategoryItem = observer(({ item, selectedSymbol, setSelectedSymbol, setIsOpen }: TMarketCategoryItem) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const { favoriteSymbols, setFavoriteSymbols, removeFavoriteSymbol, onChange: onSymbolChange } = useTraderStore();
    const { addSnackbar } = useSnackbar();

    useEffect(() => {
        setIsFavorite(favoriteSymbols.includes(item.symbol));
    }, [favoriteSymbols, item.symbol]);

    const handleSelect = async (e: React.MouseEvent<HTMLSpanElement>) => {
        const symbol = (e.target as HTMLSpanElement).getAttribute('data-symbol');
        setSelectedSymbol(symbol ?? '');
        await onSymbolChange({ target: { name: 'symbol', value: symbol } });
        setIsOpen(false);
    };

    const toggleFavorites = (e: React.MouseEvent<HTMLSpanElement>) => {
        const symbol = (e.currentTarget as HTMLSpanElement).getAttribute('data-symbol');
        if (!symbol) return;
        const symbolIndex = favoriteSymbols.indexOf(symbol);

        if (symbolIndex !== -1) {
            removeFavoriteSymbol(symbol);
            addSnackbar({
                icon: (
                    <StandaloneStarRegularIcon
                        fill={
                            selectedSymbol === item.symbol
                                ? 'var(--semantic-color-slate-solid-textIcon-inverse-highest)'
                                : 'var(--semantic-color-monochrome-textIcon-normal-mid)'
                        }
                        iconSize='sm'
                    />
                ),
                message: 'Removed from favorites',
                hasCloseButton: false,
            });
        } else {
            setFavoriteSymbols([...favoriteSymbols, symbol]);
            addSnackbar({
                icon: <StandaloneStarFillIcon fill='var(--core-color-solid-mustard-700)' iconSize='sm' />,
                message: 'Added to favorites',
                hasCloseButton: false,
            });
        }
        setIsFavorite(favoriteSymbols.includes(symbol));
    };

    return (
        <div
            className={clsx('market-category-item', {
                'market-category-item--selected': selectedSymbol === item.symbol,
            })}
        >
            <SymbolIconsMapper symbol={item.symbol} />
            <Text
                size='sm'
                className={clsx('market-category-item-symbol', {
                    'market-category-item-symbol--selected': selectedSymbol === item.symbol,
                })}
            >
                <span onClick={handleSelect} data-symbol={item.symbol}>
                    {item.display_name}
                </span>
            </Text>
            {!item.exchange_is_open && (
                <Tag
                    label={<Localize i18n_default_text='CLOSED' />}
                    color='error'
                    variant={selectedSymbol === item.symbol ? 'outline' : 'fill'}
                    showIcon={false}
                />
            )}
            <span onClick={toggleFavorites} data-symbol={item.symbol}>
                {isFavorite ? (
                    <StandaloneStarFillIcon fill='var(--core-color-solid-mustard-700)' iconSize='sm' />
                ) : (
                    <StandaloneStarRegularIcon
                        fill={
                            selectedSymbol === item.symbol
                                ? 'var(--semantic-color-slate-solid-textIcon-inverse-highest)'
                                : 'var(--semantic-color-monochrome-textIcon-normal-mid)'
                        }
                        iconSize='sm'
                    />
                )}
            </span>
        </div>
    );
});

export default MarketCategoryItem;

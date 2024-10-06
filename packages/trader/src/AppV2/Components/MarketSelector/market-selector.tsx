import React, { useState } from 'react';
import ActiveSymbolsList from '../ActiveSymbolsList';
import useActiveSymbols from 'AppV2/Hooks/useActiveSymbols';
import SymbolIconsMapper from '../SymbolIconsMapper/symbol-icons-mapper';
import { CaptionText, Skeleton, Tag, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { LabelPairedChevronDownMdRegularIcon } from '@deriv/quill-icons';
import { observer } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';

const MarketSelector = observer(() => {
    const [isOpen, setIsOpen] = useState(false);
    const { activeSymbols } = useActiveSymbols();
    const { symbol: storeSymbol, tick_data } = useTraderStore();
    const currentSymbol = activeSymbols.find(({ symbol }) => symbol === storeSymbol);

    const { pip_size, quote } = tick_data ?? {};
    const current_spot = quote?.toFixed(pip_size);
    // For closed markets exchange_is_open === 0
    if (typeof currentSymbol?.exchange_is_open === 'undefined')
        return <Skeleton.Square height={42} width={240} rounded />;

    return (
        <React.Fragment>
            <div className='market-selector__container' onClick={() => setIsOpen(true)}>
                <div className='market-selector'>
                    <SymbolIconsMapper symbol={storeSymbol} />
                    <div className='market-selector-info'>
                        <div className='market-selector-info__label'>
                            <Text bold>{currentSymbol?.display_name}</Text>
                            {!currentSymbol?.exchange_is_open && (
                                <Tag
                                    label={<Localize key='closed' i18n_default_text='CLOSED' />}
                                    color='error'
                                    variant='fill'
                                    showIcon={false}
                                    size='sm'
                                />
                            )}
                            <LabelPairedChevronDownMdRegularIcon fill='var(--component-textIcon-normal-default' />
                        </div>
                        {current_spot ? (
                            <CaptionText className='market-selector-info__price'>{current_spot}</CaptionText>
                        ) : (
                            <Skeleton.Square height={18} width={64} rounded />
                        )}
                    </div>
                </div>
            </div>
            <ActiveSymbolsList isOpen={isOpen} setIsOpen={setIsOpen} />
        </React.Fragment>
    );
});

export default MarketSelector;

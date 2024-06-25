import { ActionSheet, Tab, Text } from '@deriv-com/quill-ui';
import { observer } from '@deriv/stores';
// import { Localize, localize } from '@deriv/translations';
import React, { useState } from 'react';
import MarketSelectorSearchField from '../MarketSelectorSearchField';
import { Localize } from '@deriv/translations';
import MarketCategoriesTabs from '../MarketCategoriesTabs';
import SymbolNotFound from '../SymbolNotFound';
import clsx from 'clsx';

const MarketSelector = observer(() => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const notFound = true;

    return (
        <React.Fragment>
            <button onClick={() => setIsOpen(!isOpen)}>button</button>
            <ActionSheet.Root isOpen={isOpen}>
                <ActionSheet.Portal>
                    <MarketSelectorSearchField isSearching={isSearching} setIsSearching={setIsSearching} />
                    <Tab.Container
                        contentStyle='hug'
                        size='md'
                        className={clsx('market-selector__content', {
                            // 'market-selector__content--not-found': notFound,
                        })}
                    >
                        {isSearching ? (
                            <Text
                                size='sm'
                                color='quill-typography__color--subtle'
                                className='market-selector__search--suggestion'
                            >
                                <Localize i18n_default_text='Try searching for markets or keywords' />
                            </Text>
                        ) : (
                            // <SymbolNotFound searchTerm='yello' />
                            <MarketCategoriesTabs />
                        )}
                    </Tab.Container>
                </ActionSheet.Portal>
            </ActionSheet.Root>
        </React.Fragment>
    );
});

export default MarketSelector;

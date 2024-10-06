import { Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import React from 'react';

const SymbolNotFound = ({ searchTerm }: { searchTerm?: string }) => {
    return (
        <div className='symbol-not-found__container'>
            <div className='symbol-not-found__content'>
                <Text size='lg' bold color='quill-typography__color--subtle'>
                    <Localize i18n_default_text='No results for {{searchTerm}}' values={{ searchTerm }} />
                </Text>
                <Text size='sm' color='quill-typography__color--subtle'>
                    <Localize i18n_default_text='Try searching for something else.' />
                </Text>
            </div>
        </div>
    );
};

export default SymbolNotFound;

import React from 'react';
import { Text } from '@deriv/components';
import { Localize, localize } from 'Components/i18next';
import './filter-modal-no-results.scss';

type TFilterModalNoResultsProps = {
    text: string;
};

const FilterModalNoResults = ({ text }: TFilterModalNoResultsProps) => (
    <div className='filter-modal-no-result'>
        <Text as='h2' align='center' weight='bold' className='filter-modal-no-result__title'>
            <Localize
                i18n_default_text='No results for "{{text}}".'
                values={{ text }}
                options={{ interpolation: { escapeValue: false } }}
            />
        </Text>
        <Text as='p' align='center' className='filter-modal-no-result__subtitle'>
            <Localize i18n_default_text='Check your spelling or use a different term.' />
        </Text>
    </div>
);

export default FilterModalNoResults;

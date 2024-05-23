import React from 'react';
import debounce from 'lodash.debounce';
import { observer } from '@deriv/stores';
import { localize } from '@deriv/translations';
import { Analytics } from '@deriv-com/analytics';
import { DEBOUNCE_INTERVAL_TIME } from 'Constants/bot-contents';
import { useDBotStore } from 'Stores/useDBotStore';

type TSearchInput = {
    faq_value: string;
    setFaqSearchContent: (value: string) => void;
    prev_active_tutorials: number;
};

const SearchInput = observer(({ faq_value, setFaqSearchContent, prev_active_tutorials }: TSearchInput) => {
    const { dashboard } = useDBotStore();
    const input_ref = React.useRef(null);
    const { setActiveTabTutorial, filterTuotrialTab } = dashboard;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debounceChange = React.useCallback(
        debounce(
            value => {
                filterTuotrialTab(value);
                setActiveTabTutorial(3);
                Analytics.trackEvent('ce_bot_form', {
                    action: 'search',
                    form_name: 'ce_bot_form',
                    subpage_name: 'tutorials',
                    search_term: value,
                });
                if (value === '') {
                    setActiveTabTutorial(prev_active_tutorials);
                }
            },
            DEBOUNCE_INTERVAL_TIME,
            {
                trailing: true,
                leading: false,
            }
        ),
        []
    );
    const onSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFaqSearchContent(event.target.value);
        debounceChange(event.target.value);
    };

    return (
        <>
            <input
                ref={input_ref}
                data-testid='id-test-input-search'
                type='text'
                placeholder={localize('Search')}
                className='dc-tabs__wrapper__group__search-input'
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => onSearch(event)}
                value={faq_value}
            />
        </>
    );
});

export default SearchInput;

import React from 'react';
import debounce from 'lodash.debounce';
import { Loading, SearchBox, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';
import { Localize, localize } from 'Components/i18next';
import { api_error_codes } from 'Constants/api-error-codes';
import { useStores } from 'Stores';
import BlockUserDropdown from '../block-user-dropdown';
import BlockUserTable from '../block-user-table';
import BlockUserTableError from '../block-user-table/block-user-table-error';

const BlockUserList = observer(() => {
    const { general_store, my_profile_store } = useStores();
    const { isDesktop } = useDevice();

    const debouncedGetSearchedTradePartners = debounce((search: string) => {
        my_profile_store.setSearchTerm(search.trim());
        my_profile_store.getSearchedTradePartners();
    }, 200);

    const onSearch = (search: string) => {
        // Ensures that trade partners list is not reloaded if search term entered is the same
        if (my_profile_store.search_term !== search.trim()) {
            my_profile_store.setIsBlockUserTableLoading(true);
            debouncedGetSearchedTradePartners(search);
        }
    };

    if (
        (general_store?.error_code === api_error_codes.TEMPORARY_BAR ||
            general_store?.error_code === api_error_codes.PERMISSION_DENIED) &&
        general_store.block_unblock_user_error
    ) {
        return <BlockUserTableError error_message={general_store.block_unblock_user_error} />;
    }

    if (my_profile_store.is_loading) {
        return <Loading is_fullscreen={!isDesktop} />;
    }

    return (
        <div className='block-user-list'>
            {!my_profile_store.should_show_block_user_list_header && (
                <React.Fragment>
                    <Text className='block-user-list__text' size='xs'>
                        <Localize i18n_default_text="When you block someone, you won't see their ads, and they can't see yours. Your ads will be hidden from their search results, too." />
                    </Text>
                    <div className='block-user-list__header'>
                        <SearchBox
                            onClear={my_profile_store.onClear}
                            onSearch={onSearch}
                            placeholder={localize('Search by nickname')}
                        />
                        <BlockUserDropdown />
                    </div>
                </React.Fragment>
            )}
            <BlockUserTable />
        </div>
    );
});

export default BlockUserList;

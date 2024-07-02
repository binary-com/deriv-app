import React from 'react';
import { Dropdown, Icon } from '@deriv/components';
import { useDevice } from '@deriv-com/ui';
import { observer } from 'mobx-react-lite';
import { localize } from 'Components/i18next';
import { useStores } from 'Stores';
import 'Pages/buy-sell/sort-dropdown.scss';

const SortDropdown = () => {
    const { isDesktop } = useDevice();
    const { buy_sell_store } = useStores();

    const sort_list = [
        { text: localize('Exchange rate'), value: 'rate' },
        { text: localize('User rating'), value: 'rating' },
    ];

    if (isDesktop) {
        return (
            <Dropdown
                className='sort-dropdown'
                classNameLabel='sort-dropdown--label'
                is_align_text_left
                list={sort_list}
                onChange={buy_sell_store.handleChange}
                placeholder={localize('Sort by')}
                value={buy_sell_store.selected_value}
            />
        );
    }

    return (
        <div
            data-testid='sort-div'
            className='sort-dropdown--sort'
            onClick={() => buy_sell_store.setIsSortDropdownOpen(true)}
        >
            <Icon icon='IcCashierSort' size={16} data_testid='mobile-view-sort-icon' />
        </div>
    );
};

export default observer(SortDropdown);

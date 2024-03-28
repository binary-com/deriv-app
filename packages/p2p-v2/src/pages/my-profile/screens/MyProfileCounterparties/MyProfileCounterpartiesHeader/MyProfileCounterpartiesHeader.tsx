import React from 'react';
import { Dropdown, Search } from '@/components';
import { COUNTERPARTIES_DROPDOWN_LIST } from '@/constants';
import { useDevice } from '@/hooks';
import { Button, Text } from '@deriv-com/ui';
import SortIcon from '../../../../../public/ic-cashier-sort.svg';
import './MyProfileCounterpartiesHeader.scss';

type MyProfileCounterpartiesHeaderProps = {
    dropdownValue: string;
    onClickFilter: () => void;
    setDropdownValue: (value: string) => void;
    setSearchValue: (value: string) => void;
};

const MyProfileCounterpartiesHeader = ({
    dropdownValue,
    onClickFilter,
    setDropdownValue,
    setSearchValue,
}: MyProfileCounterpartiesHeaderProps) => {
    const { isMobile } = useDevice();
    return (
        <div className='p2p-v2-my-profile-counterparties__content-header'>
            <Text as='p' size='sm'>
                When you block someone, you won’t see their ads, and they can’t see yours. Your ads will be hidden from
                their search results, too.
            </Text>
            <div className='p2p-v2-my-profile-counterparties-header'>
                {/* TODO: to be replaced by deriv-com/ui search component */}
                <Search name='counterparties-search' onSearch={setSearchValue} placeholder='Search by nickname' />
                {/* TODO: to be replaced by deriv-com/ui dropdown component */}
                {isMobile ? (
                    <Button
                        className='p2p-v2-my-profile-counterparties-header__sort-icon'
                        color='black'
                        icon={<SortIcon />}
                        onClick={onClickFilter}
                        variant='outlined'
                    />
                ) : (
                    <Dropdown
                        label='Filter by'
                        list={COUNTERPARTIES_DROPDOWN_LIST}
                        listHeight='sm'
                        name='counterparty-filter'
                        onSelect={setDropdownValue}
                        value={dropdownValue}
                    />
                )}
            </div>
        </div>
    );
};
export default MyProfileCounterpartiesHeader;

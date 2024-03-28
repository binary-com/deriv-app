import React, { PropsWithChildren, useState } from 'react';
import { FullPageMobileWrapper } from '@/components';
import { RadioGroupFilterModal } from '@/components/Modals';
import { COUNTERPARTIES_DROPDOWN_LIST } from '@/constants';
import { useDevice, useQueryString } from '@/hooks';
import { Text } from '@deriv-com/ui';
import { MyProfileCounterpartiesHeader } from './MyProfileCounterpartiesHeader';
import { MyProfileCounterpartiesTable } from './MyProfileCounterpartiesTable';
import './MyProfileCounterparties.scss';

const MyProfileCounterpartiesDisplayWrapper = ({ children }: PropsWithChildren<unknown>) => {
    const { setQueryString } = useQueryString();
    const { isMobile } = useDevice();

    if (isMobile) {
        return (
            <FullPageMobileWrapper
                className='absolute top-16'
                onBack={() =>
                    setQueryString({
                        tab: 'default',
                    })
                }
                renderHeader={() => (
                    <Text className='p2p-v2-my-profile-counterparties__header' size='md' weight='bold'>
                        My counterparties
                    </Text>
                )}
            >
                {children}
            </FullPageMobileWrapper>
        );
    }
    return children;
};

const MyProfileCounterparties = () => {
    const [searchValue, setSearchValue] = useState('');
    const [dropdownValue, setDropdownValue] = useState('all');
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [showHeader, setShowHeader] = useState(false);

    const onClickFilter = () => {
        setIsFilterModalOpen(true);
    };

    const onToggle = (value: string) => {
        setDropdownValue(value);
        setIsFilterModalOpen(false);
    };

    return (
        <MyProfileCounterpartiesDisplayWrapper>
            <div className='p2p-v2-my-profile-counterparties'>
                {showHeader && (
                    <MyProfileCounterpartiesHeader
                        dropdownValue={dropdownValue}
                        onClickFilter={onClickFilter}
                        setDropdownValue={setDropdownValue}
                        setSearchValue={setSearchValue}
                    />
                )}
                <div className='p2p-v2-my-profile-counterparties__content'>
                    <MyProfileCounterpartiesTable
                        dropdownValue={dropdownValue}
                        searchValue={searchValue}
                        setShowHeader={setShowHeader}
                    />
                </div>
                <RadioGroupFilterModal
                    isModalOpen={isFilterModalOpen}
                    list={COUNTERPARTIES_DROPDOWN_LIST}
                    onRequestClose={() => setIsFilterModalOpen(false)}
                    onToggle={onToggle}
                    selected={dropdownValue}
                />
            </div>
        </MyProfileCounterpartiesDisplayWrapper>
    );
};

export default MyProfileCounterparties;

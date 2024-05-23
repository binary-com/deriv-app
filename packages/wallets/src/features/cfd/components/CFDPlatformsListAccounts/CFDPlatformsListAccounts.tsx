import React from 'react';
import { useCtraderAccountsList, useDxtradeAccountsList, useSortedMT5Accounts } from '@deriv/api-v2';
import { TradingAppCardLoader } from '../../../../components/SkeletonLoader';
import {
    AddedCTraderAccountsList,
    AddedDxtradeAccountsList,
    AddedMT5AccountsList,
    AvailableCTraderAccountsList,
    AvailableDxtradeAccountsList,
    AvailableMT5AccountsList,
} from '../../flows';
import './CFDPlatformsListAccounts.scss';

const CFDPlatformsListAccounts: React.FC = () => {
    const { data: mt5AccountsList, isFetchedAfterMount, isLoading: isMT5Loading } = useSortedMT5Accounts();
    const { data: ctraderAccountsList } = useCtraderAccountsList();
    const { data: dxtradeAccountsList } = useDxtradeAccountsList();

    const hasCTraderAccount = !!ctraderAccountsList?.length;
    const hasDxtradeAccount = !!dxtradeAccountsList?.length;

    return (
        <div className='wallets-cfd-list-accounts__content'>
            {/* TODO: Update loader with updated skeleton loader design */}
            {(isMT5Loading || !isFetchedAfterMount) && <TradingAppCardLoader />}
            {(!isMT5Loading || isFetchedAfterMount) &&
                mt5AccountsList?.map((account, index) => {
                    if (account.is_added)
                        return (
                            <AddedMT5AccountsList account={account} key={`added-mt5-list${account.loginid}-${index}`} />
                        );

                    return (
                        <AvailableMT5AccountsList
                            account={account}
                            key={`available-mt5-list${account.name}-${index}`}
                        />
                    );
                })}
            {hasCTraderAccount ? <AddedCTraderAccountsList /> : <AvailableCTraderAccountsList />}
            {hasDxtradeAccount ? <AddedDxtradeAccountsList /> : <AvailableDxtradeAccountsList />}
        </div>
    );
};

export default CFDPlatformsListAccounts;

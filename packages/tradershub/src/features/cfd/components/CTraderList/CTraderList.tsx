import React from 'react';
import { useActiveTradingAccount, useCtraderAccountsList } from '@deriv/api';
import { Text } from '@deriv/quill-design';
import { PlatformDetails } from '../../constants';
import { AddedCTraderAccountsList, AvailableCTraderAccountsList } from '../../flows/CTrader';

const CTraderList = () => {
    const { data: cTraderAccounts } = useCtraderAccountsList();
    const { data: activeTradingAccount } = useActiveTradingAccount();

    const hasCTraderAccount = cTraderAccounts?.some(account => account.is_virtual === activeTradingAccount?.is_virtual);

    return (
        <div className='pb-1200'>
            <Text bold>{PlatformDetails.ctrader.title}</Text>

            <div className='grid grid-cols-3 gap-x-800 gap-y-2400 lg:grid-cols-1 lg:grid-rows-1'>
                {hasCTraderAccount ? <AddedCTraderAccountsList /> : <AvailableCTraderAccountsList />}
            </div>
        </div>
    );
};

export default CTraderList;

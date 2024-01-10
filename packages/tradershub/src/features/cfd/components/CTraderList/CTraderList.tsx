import React from 'react';
import { useActiveTradingAccount, useCtraderAccountsList } from '@deriv/api';
import { Text } from '@deriv/quill-design';
import { THooks } from '../../../../types';
import { PlatformDetails } from '../../constants';
import { AddedCTraderAccountsList, AvailableCTraderAccountsList } from '../../flows/CTrader';

const CTraderList = () => {
    const { data: cTraderAccounts } = useCtraderAccountsList();
    const { data: activeTradingAccount } = useActiveTradingAccount();

    const hasCTraderAccount = cTraderAccounts?.some(
        (account: THooks.CtraderAccountsList) => account.is_virtual === activeTradingAccount?.is_virtual
    );

    return (
        <div className='pb-1200'>
            <Text bold>{PlatformDetails.ctrader.title}</Text>
            {hasCTraderAccount ? <AddedCTraderAccountsList /> : <AvailableCTraderAccountsList />}
        </div>
    );
};

export default CTraderList;

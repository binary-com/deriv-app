import React from 'react';
import { useActiveTradingAccount } from '@deriv/api-v2';
import { Category, PlatformDetails } from '../../constants';
import { CFDSuccess } from '../../screens';
import SuccessButtonGroup from '../ButtonGroups/SuccessButtonGroup';

const DxtradeSuccess = () => {
    const { data: activeTrading } = useActiveTradingAccount();
    const isDemo = activeTrading?.is_virtual;

    const successDescription = isDemo
        ? `Congratulations, you have successfully created your ${Category.DEMO} ${PlatformDetails.dxtrade.title} account.`
        : `Congratulations, you have successfully created your ${Category.REAL} ${PlatformDetails.dxtrade.title} account. To start trading, transfer funds from your Deriv account into this account.`;

    return (
        <CFDSuccess
            description={successDescription}
            platform={PlatformDetails.dxtrade.platform}
            renderButtons={SuccessButtonGroup}
        />
    );
};

export default DxtradeSuccess;

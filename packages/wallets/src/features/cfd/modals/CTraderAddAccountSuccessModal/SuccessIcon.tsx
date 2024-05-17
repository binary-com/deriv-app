import React from 'react';
import { AccountsDerivCtraderIcon, LegacyWonIcon } from '@deriv/quill-icons';

const SuccessIcon = () => {
    return (
        <div className='wallets-ctrader-success-icon'>
            <AccountsDerivCtraderIcon height={128} width={128} />
            <LegacyWonIcon className='wallets-ctrader-success-icon-check' iconSize='lg' />
        </div>
    );
};

export default SuccessIcon;

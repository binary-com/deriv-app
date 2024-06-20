import React from 'react';
import { AccountsDerivCtraderIcon, LegacyWonIcon } from '@deriv/quill-icons';

const SuccessIcon = () => {
    return (
        <div className='wallets-ctrader-success-icon' data-testid='dt_wallets_ctrader_success_icon'>
            <AccountsDerivCtraderIcon height={128} width={128} />
            <LegacyWonIcon className='wallets-ctrader-success-icon__check' iconSize='lg' />
        </div>
    );
};

export default SuccessIcon;

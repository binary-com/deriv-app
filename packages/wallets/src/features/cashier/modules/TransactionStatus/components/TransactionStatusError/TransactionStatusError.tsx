import React from 'react';
import { Divider } from '@deriv-com/ui';
import { WalletButton, WalletText } from '../../../../../../components/Base';

type TTransactionStatusError = {
    refresh: VoidFunction;
};

const TransactionStatusError: React.FC<TTransactionStatusError> = ({ refresh }) => (
    <React.Fragment>
        <WalletText lineHeight='sm' size='xs'>
            Unfortunately, we cannot retrieve the information at this time.
        </WalletText>
        <Divider color='var(--general-active)' />
        <WalletButton isFullWidth={true} onClick={refresh} size='sm' variant='outlined'>
            Refresh
        </WalletButton>
    </React.Fragment>
);

export default TransactionStatusError;

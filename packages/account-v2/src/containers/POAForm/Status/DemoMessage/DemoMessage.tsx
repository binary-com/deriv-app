import React from 'react';
import { useAuthorize } from '@deriv/api';
import { Button } from '@deriv-com/ui/dist/components/Button';
import IcPOALock from '../../../../assets/verification-status/ic-poa-lock.svg';
import POAStatus from '../POAStatus';

export const DemoMessage = () => {
    const { data: authorizeData } = useAuthorize();
    const hasRealAccount = authorizeData?.account_list?.some(account => account.is_virtual === 0);
    return (
        <POAStatus
            actionButton={<Button>{hasRealAccount ? 'Switch to real account' : 'Add a real account'}</Button>}
            icon={<IcPOALock width={128} />}
            title='This feature is not available for demo accounts.'
        />
    );
};

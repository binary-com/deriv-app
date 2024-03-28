import React from 'react';
import { useLoginHistory } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { LoginHistoryTable } from '../../containers';

export const LoginHistory = () => {
    const { isLoading, loginHistory } = useLoginHistory(50);
    if (isLoading) return <Loader />;
    if (loginHistory?.length) return <LoginHistoryTable loginHistory={loginHistory} />;
};

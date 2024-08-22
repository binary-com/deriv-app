import React from 'react';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount, useMutation } from '@deriv/api-v2';
import { useTranslations } from '@deriv-com/translations';
import { ActionScreen, Loader } from '@deriv-com/ui';
import useAllBalanceSubscription from '../../../../hooks/useAllBalanceSubscription';
import { getResetBalanceContent } from './ResetBalanceContent';

type ContentVariant = keyof ReturnType<typeof getResetBalanceContent>;

const ResetBalance = () => {
    const history = useHistory();
    const { localize } = useTranslations();
    const { isLoading: isResetBalanceLoading, isSuccess: isResetBalanceSuccess, mutate } = useMutation('topup_virtual');
    const { data: balanceData, isLoading: isBalanceLoading } = useAllBalanceSubscription();
    const { data: activeWallet } = useActiveWalletAccount();

    const resetBalance = () => {
        mutate();
    };

    const navigateToTransfer = () => history.push('/wallet/account-transfer');
    const shouldResetBalance = balanceData && balanceData?.[activeWallet?.loginid ?? '']?.balance < 10000;

    const contentMapper = getResetBalanceContent(localize, resetBalance, navigateToTransfer);
    const getContentVariant = (): ContentVariant => {
        if (isResetBalanceSuccess) return 'success';
        if (shouldResetBalance || isResetBalanceLoading) return 'resetAvailable';
        return 'resetUnavailable';
    };

    const content = contentMapper[getContentVariant()];

    if (isBalanceLoading) {
        return <Loader />;
    }

    return (
        <ActionScreen
            actionButtons={content.actionButton}
            description={content.description}
            icon={content.icon}
            title={content.title}
        />
    );
};

export default ResetBalance;

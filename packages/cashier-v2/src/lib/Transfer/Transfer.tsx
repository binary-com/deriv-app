import React, { useCallback, useEffect } from 'react';
import { useTransferBetweenAccounts } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { PageContainer } from '../../components';
import TransferProvider, { useTransfer } from './provider/TransferProvider';
import { TransferForm, TransferReceipt } from './components';

const TransferModule = () => {
    const { data: transferAccounts, isSuccess, mutate } = useTransferBetweenAccounts();
    const requestForAccounts = useCallback(() => mutate({ accounts: 'all' }), [mutate]);

    useEffect(() => {
        requestForAccounts();
    }, [requestForAccounts]);

    if (isSuccess && transferAccounts.accounts?.length) {
        if (transferAccounts?.accounts?.length <= 1) return <div>Need more than one account</div>;

        return (
            <PageContainer>
                <TransferProvider accounts={transferAccounts?.accounts}>
                    <Transfer />
                </TransferProvider>
            </PageContainer>
        );
    }
    return (
        <PageContainer>
            <Loader />
        </PageContainer>
    );
};

const Transfer = () => {
    const { transferReceipt } = useTransfer();

    if (transferReceipt) {
        return <TransferReceipt data={transferReceipt} />;
    }

    return (
        <>
            <TransferForm />
        </>
    );
};

export default TransferModule;

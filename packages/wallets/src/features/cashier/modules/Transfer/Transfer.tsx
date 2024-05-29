import React from 'react';
import { WalletsErrorScreen } from '../../../../components';
import type { THooks } from '../../../../types';
import { TransferForm, TransferReceipt } from './components';
import { TransferProvider, useTransfer } from './provider';

type TProps = {
    accounts: THooks.TransferAccount[];
};

const TransferModule: React.FC<TProps> = ({ accounts }) => {
    return (
        <TransferProvider accounts={accounts}>
            <Transfer />
        </TransferProvider>
    );
};

const Transfer: React.FC = () => {
    const { error: transferError, receipt, resetTransfer } = useTransfer();
    const errorMessage = transferError?.error.message;

    if (errorMessage)
        return (
            <WalletsErrorScreen
                buttonText={'Make another transfer'}
                message={errorMessage}
                onClick={() => resetTransfer()}
                title='Error'
            />
        );

    if (receipt) return <TransferReceipt />;

    return <TransferForm />;
};

export default TransferModule;

import React, { useEffect } from 'react';
import { getInitialLanguage } from '@deriv-com/translations';
import type { THooks } from '../../../../types';
import { TransferErrorScreen } from '../../screens/TransferErrorScreen';
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
    const { error, receipt, resetTransfer } = useTransfer();
    const i18nLanguage = getInitialLanguage();
    const transferError = error?.error;

    useEffect(() => {
        resetTransfer();
    }, [i18nLanguage, resetTransfer]);

    if (transferError) return <TransferErrorScreen error={transferError} resetError={resetTransfer} />;

    if (receipt) return <TransferReceipt />;

    return <TransferForm />;
};

export default TransferModule;

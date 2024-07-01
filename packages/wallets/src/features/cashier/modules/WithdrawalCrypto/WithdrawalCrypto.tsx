import React from 'react';
import { Loader } from '@deriv-com/ui';
import { WalletText } from '../../../../components';
import { isServerError } from '../../../../utils/utils';
import { WithdrawalErrorScreen } from '../../screens';
import { TransactionStatus } from '../TransactionStatus';
import { WithdrawalCryptoDisclaimer, WithdrawalCryptoForm, WithdrawalCryptoReceipt } from './components';
import { useWithdrawalCryptoContext, WithdrawalCryptoProvider } from './provider';
import './WithdrawalCrypto.scss';

type TWithdrawalCryptoProps = {
    setResendEmail: React.Dispatch<React.SetStateAction<boolean>>;
    setVerificationCode: React.Dispatch<React.SetStateAction<string>>;
    verificationCode: string;
};

const WithdrawalCrypto: React.FC<Pick<TWithdrawalCryptoProps, 'setResendEmail' | 'setVerificationCode'>> = ({
    setResendEmail,
    setVerificationCode,
}) => {
    const { activeWallet, error, getCurrencyConfig, isLoading, isWithdrawalSuccess, setError, withdrawalReceipt } =
        useWithdrawalCryptoContext();

    const onCloseHandler = () => setVerificationCode('');

    const resetError = () => {
        onCloseHandler();
        setError(undefined);
    };

    if (isLoading) return <Loader />;

    if (isServerError(error)) {
        return <WithdrawalErrorScreen error={error} resetError={resetError} setResendEmail={setResendEmail} />;
    }

    if (isWithdrawalSuccess) {
        return <WithdrawalCryptoReceipt onClose={onCloseHandler} withdrawalReceipt={withdrawalReceipt} />;
    }

    return (
        <div className='wallets-withdrawal-crypto'>
            <div className='wallets-withdrawal-crypto__side-pane' />
            <div className='wallets-withdrawal-crypto__content'>
                <WalletText weight='bold'>
                    Withdraw {activeWallet?.currency ? getCurrencyConfig(activeWallet?.currency)?.name : ''} (
                    {activeWallet?.currency}) to your wallet
                </WalletText>
                <WithdrawalCryptoDisclaimer />
                <WithdrawalCryptoForm />
            </div>
            <div className='wallets-withdrawal-crypto__side-pane'>
                <TransactionStatus transactionType='withdrawal' />
            </div>
        </div>
    );
};

const WithdrawalCryptoModule: React.FC<TWithdrawalCryptoProps> = ({
    setResendEmail,
    setVerificationCode,
    verificationCode,
}) => {
    return (
        <WithdrawalCryptoProvider verificationCode={verificationCode}>
            <WithdrawalCrypto setResendEmail={setResendEmail} setVerificationCode={setVerificationCode} />
        </WithdrawalCryptoProvider>
    );
};

export default WithdrawalCryptoModule;

import React, { useEffect } from 'react';
import { useAuthorize, useDepositCryptoAddress } from '@deriv/api-v2';
import { Loader } from '../../../../components';
import { Divider } from '../../../../components/Base';
import { isServerError } from '../../../../utils/utils';
import { DepositErrorScreen } from '../../screens';
import { TransactionStatus } from '../TransactionStatus';
import DepositCryptoAddress from './components/DepositCryptoAddress/DepositCryptoAddress';
import DepositCryptoCurrencyDetails from './components/DepositCryptoCurrencyDetails/DepositCryptoCurrencyDetails';
import DepositCryptoDisclaimers from './components/DepositCryptoDisclaimers/DepositCryptoDisclaimers';
import DepositCryptoTryFiatOnRamp from './components/DepositCryptoTryFiatOnRamp/DepositCryptoTryFiatOnRamp';
import './DepositCrypto.scss';

const DepositCrypto = () => {
    const { isSuccess: isAuthorizeSuccess } = useAuthorize();
    const { data: depositCryptoAddress, error, isLoading, mutate: mutateDepositCrypto } = useDepositCryptoAddress();
    const depositCryptoError = error?.error;

    useEffect(() => {
        if (isAuthorizeSuccess) {
            mutateDepositCrypto();
        }
    }, [isAuthorizeSuccess, mutateDepositCrypto]);

    if (isLoading) return <Loader />;

    if (isServerError(depositCryptoError)) {
        return <DepositErrorScreen error={depositCryptoError} />;
    }

    return (
        <div className='wallets-deposit-crypto'>
            <div className='wallets-deposit-crypto__side-pane' />
            <div className='wallets-deposit-crypto__main-content'>
                <DepositCryptoCurrencyDetails />
                <DepositCryptoAddress depositCryptoAddress={depositCryptoAddress} />
                <DepositCryptoDisclaimers />
                <Divider />
                <DepositCryptoTryFiatOnRamp />
            </div>
            <div className='wallets-deposit-crypto__side-pane'>
                <TransactionStatus transactionType='deposit' />
            </div>
        </div>
    );
};

export default DepositCrypto;

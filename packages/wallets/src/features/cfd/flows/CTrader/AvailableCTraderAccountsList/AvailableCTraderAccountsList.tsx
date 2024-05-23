import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useActiveWalletAccount, useCreateOtherCFDAccount } from '@deriv/api-v2';
import { LabelPairedChevronRightCaptionRegularIcon } from '@deriv/quill-icons';
import { TradingAccountCard, WalletError } from '../../../../../components';
import { WalletText } from '../../../../../components/Base';
import { useModal } from '../../../../../components/ModalProvider';
import { PlatformDetails } from '../../../constants';
import { CTraderSuccessModal } from '../../../modals/CTraderSuccessModal';
import './AvailableCTraderAccountsList.scss';

const AvailableCTraderAccountsList: React.FC = () => {
    const { hide, show } = useModal();
    const { data: createdAccount, error, mutate, status } = useCreateOtherCFDAccount();
    const { data: activeWallet } = useActiveWalletAccount();
    const { t } = useTranslation();

    const accountType = activeWallet?.is_virtual ? 'demo' : 'real';

    const onSubmit = () => {
        mutate({
            payload: {
                account_type: accountType,
                market_type: 'all',
                platform: PlatformDetails.ctrader.platform,
            },
        });
    };

    useEffect(() => {
        if (status === 'success') {
            show(
                <CTraderSuccessModal
                    createdAccount={createdAccount}
                    isDemo={accountType === 'demo'}
                    walletCurrencyType={activeWallet?.wallet_currency_type || 'USD'}
                />
            );
        }
        if (status === 'error') {
            show(
                <WalletError
                    errorMessage={error?.error?.message ?? 'Something went wrong. Please try again'}
                    onClick={() => hide()}
                    title={error?.error?.message ?? 'Error'}
                />
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountType, activeWallet?.wallet_currency_type, error?.error?.message, status]);

    return (
        <TradingAccountCard
            leading={<div className='wallets-available-ctrader__icon'>{PlatformDetails.ctrader.icon}</div>}
            onClick={() => {
                onSubmit();
            }}
            trailing={
                <div className='wallets-available-ctrader__icon'>
                    <LabelPairedChevronRightCaptionRegularIcon width={16} />
                </div>
            }
        >
            <div className='wallets-available-ctrader__details'>
                <WalletText size='sm'>{PlatformDetails.ctrader.title}</WalletText>
                <WalletText size='xs'>{t('CFDs on financial and derived instruments with copy trading.')}</WalletText>
            </div>
        </TradingAccountCard>
    );
};

export default AvailableCTraderAccountsList;

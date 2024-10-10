import React, { useEffect } from 'react';
import { useActiveWalletAccount, useCreateOtherCFDAccount } from '@deriv/api-v2';
import {
    LabelPairedChevronLeftCaptionRegularIcon,
    LabelPairedChevronRightCaptionRegularIcon,
} from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import { TradingAccountCard, WalletError } from '../../../../../components';
import { useModal } from '../../../../../components/ModalProvider';
import useIsRtl from '../../../../../hooks/useIsRtl';
import { PlatformDetails } from '../../../constants';
import { CTraderSuccessModal } from '../../../modals/CTraderSuccessModal';

const AvailableCTraderAccountsList: React.FC = () => {
    const { hide, show } = useModal();
    const {
        data: createdAccount,
        error,
        isLoading: isCFDAccountCreationLoading,
        isSuccess: isCFDAccountCreationSuccess,
        mutate,
        status,
    } = useCreateOtherCFDAccount();
    const { data: activeWallet } = useActiveWalletAccount();
    const isRtl = useIsRtl();
    const { localize } = useTranslations();

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
                    isDemo={activeWallet?.is_virtual}
                    walletCurrencyType={activeWallet?.wallet_currency_type || 'USD'}
                />
            );
        }
        if (status === 'error') {
            show(
                <WalletError
                    errorMessage={error?.error?.message ?? localize('Something went wrong. Please try again')}
                    onClick={() => hide()}
                    title={error?.error?.message ?? localize('Error')}
                />
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accountType, activeWallet?.wallet_currency_type, error?.error?.message, status]);

    return (
        <TradingAccountCard disabled={isCFDAccountCreationLoading || isCFDAccountCreationSuccess} onClick={onSubmit}>
            <TradingAccountCard.Icon>{PlatformDetails.ctrader.icon}</TradingAccountCard.Icon>
            <TradingAccountCard.Section>
                <TradingAccountCard.Content>
                    <Text align='start' size='sm'>
                        {PlatformDetails.ctrader.title}
                    </Text>
                    <Text align='start' size='xs'>
                        <Localize i18n_default_text='CFDs on financial and derived instruments with copy trading.' />
                    </Text>
                </TradingAccountCard.Content>
                <TradingAccountCard.Button>
                    {isRtl ? (
                        <LabelPairedChevronLeftCaptionRegularIcon width={16} />
                    ) : (
                        <LabelPairedChevronRightCaptionRegularIcon width={16} />
                    )}
                </TradingAccountCard.Button>
            </TradingAccountCard.Section>
        </TradingAccountCard>
    );
};

export default AvailableCTraderAccountsList;

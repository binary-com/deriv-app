import React, { useEffect } from 'react';
import {
    useActiveLinkedToTradingAccount,
    useActiveWalletAccount,
    useCreateNewRealAccount,
    useInvalidateQuery,
    useSettings,
} from '@deriv/api-v2';
import { displayMoney } from '@deriv/api-v2/src/utils';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button, Text, useDevice } from '@deriv-com/ui';
import { CFDSuccess } from '../../features/cfd/screens/CFDSuccess';
import useAllBalanceSubscription from '../../hooks/useAllBalanceSubscription';
import useSyncLocalStorageClientAccounts from '../../hooks/useSyncLocalStorageClientAccounts';
import { getFormattedDateString } from '../../utils/utils';
import { ModalStepWrapper } from '../Base';
import { useModal } from '../ModalProvider';
import { TradingAccountCard } from '../TradingAccountCard';
import { WalletMarketIcon } from '../WalletMarketIcon';
import { DerivAppsSuccessFooter } from './DerivAppsSuccessFooter';

const DerivAppsGetAccount: React.FC = () => {
    const { show } = useModal();
    const { isDesktop } = useDevice();
    const { data: activeWallet } = useActiveWalletAccount();
    const {
        isLoading: isAccountCreationLoading,
        isSuccess: isAccountCreationSuccess,
        mutateAsync: createNewRealAccount,
    } = useCreateNewRealAccount();
    const {
        data: { country_code: countryCode, date_of_birth: dateOfBirth, first_name: firstName, last_name: lastName },
    } = useSettings();
    const { addTradingAccountToLocalStorage } = useSyncLocalStorageClientAccounts();
    const invalidate = useInvalidateQuery();

    const { isLoading: isActiveLinkedToTradingAccountLoading } = useActiveLinkedToTradingAccount();

    const { data: balanceData } = useAllBalanceSubscription();

    const { localize } = useTranslations();

    const createTradingAccount = async () => {
        if (!activeWallet?.is_virtual) {
            const createAccountResponse = await createNewRealAccount({
                payload: {
                    currency: activeWallet?.currency_config?.display_code,
                    date_of_birth: getFormattedDateString(Number(dateOfBirth), {}, 'YYYY-MM-DD', true),
                    first_name: firstName,
                    last_name: lastName,
                    residence: countryCode || '',
                },
            });

            const newAccountReal = createAccountResponse?.new_account_real;

            if (!newAccountReal) return;

            await addTradingAccountToLocalStorage(newAccountReal);

            invalidate('account_list');
        }
    };

    useEffect(() => {
        if (isAccountCreationSuccess) {
            const displayBalance = displayMoney(
                balanceData?.[activeWallet?.loginid ?? '']?.balance,
                activeWallet?.currency,
                {
                    fractional_digits: activeWallet?.currency_config?.fractional_digits,
                }
            );

            show(
                <ModalStepWrapper
                    renderFooter={isDesktop ? undefined : () => <DerivAppsSuccessFooter />}
                    shouldHideDerivAppHeader
                    shouldHideHeader={isDesktop}
                >
                    <CFDSuccess
                        actionButtons={<DerivAppsSuccessFooter />}
                        description={localize(
                            'Transfer funds from your {{walletCurrencyType}} Wallet to your Options account to start trading.',
                            { walletCurrencyType: activeWallet?.wallet_currency_type }
                        )}
                        displayBalance={displayBalance}
                        title={localize('Your Options account is ready')}
                    />
                </ModalStepWrapper>,
                {
                    defaultRootId: 'wallets_modal_root',
                }
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addTradingAccountToLocalStorage, isAccountCreationSuccess]);

    return (
        <TradingAccountCard className='wallets-deriv-apps-section wallets-deriv-apps-section__border'>
            <TradingAccountCard.Icon>
                <WalletMarketIcon icon='standard' size={isDesktop ? 'lg' : 'md'} />
            </TradingAccountCard.Icon>
            <TradingAccountCard.Content>
                <Text align='start' size='sm'>
                    <Localize i18n_default_text='Options' />
                </Text>
                <Text align='start' size='xs'>
                    <Localize i18n_default_text='One options account for all platforms.' />
                </Text>
            </TradingAccountCard.Content>
            <TradingAccountCard.Button>
                <Button
                    borderWidth='sm'
                    color='black'
                    disabled={isAccountCreationLoading || isActiveLinkedToTradingAccountLoading}
                    onClick={createTradingAccount}
                    rounded='md'
                    variant='outlined'
                >
                    <Localize i18n_default_text='Enable' />
                </Button>
            </TradingAccountCard.Button>
        </TradingAccountCard>
    );
};

export { DerivAppsGetAccount };

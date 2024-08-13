import React, { useEffect } from 'react';
import {
    useActiveLinkedToTradingAccount,
    useActiveWalletAccount,
    useCreateNewRealAccount,
    useInvalidateQuery,
    useSettings,
} from '@deriv/api-v2';
import { displayMoney } from '@deriv/api-v2/src/utils';
import { toMoment } from '@deriv/utils';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Text } from '@deriv-com/ui';
import { CFDSuccess } from '../../features/cfd/screens/CFDSuccess';
import useAllBalanceSubscription from '../../hooks/useAllBalanceSubscription';
import useDevice from '../../hooks/useDevice';
import useSyncLocalStorageClientAccounts from '../../hooks/useSyncLocalStorageClientAccounts';
import { ModalStepWrapper, WalletButton } from '../Base';
import { useModal } from '../ModalProvider';
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
                    date_of_birth: toMoment(dateOfBirth).format('YYYY-MM-DD'),
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
                        description={localize(
                            'Transfer funds from your {{walletCurrencyType}} Wallet to your Options account to start trading.',
                            { walletCurrencyType: activeWallet?.wallet_currency_type }
                        )}
                        displayBalance={displayBalance}
                        renderButton={() => <DerivAppsSuccessFooter />}
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
        <div className='wallets-deriv-apps-section wallets-deriv-apps-section__get-account'>
            <div className='wallets-deriv-apps-section__icon'>
                <WalletMarketIcon icon='standard' size='lg' />
            </div>
            <div className='wallets-deriv-apps-section__get-content'>
                <div className='wallets-deriv-apps-section__details'>
                    <Text size='sm' weight='bold'>
                        <Localize i18n_default_text='Options' />
                    </Text>
                    <Text size={isDesktop ? '2xs' : 'xs'}>
                        <Localize i18n_default_text='One options account for all platforms.' />
                    </Text>
                </div>
                <WalletButton
                    color='primary-light'
                    disabled={isAccountCreationLoading || isActiveLinkedToTradingAccountLoading}
                    onClick={createTradingAccount}
                >
                    <Localize i18n_default_text='Get' />
                </WalletButton>
            </div>
        </div>
    );
};

export { DerivAppsGetAccount };

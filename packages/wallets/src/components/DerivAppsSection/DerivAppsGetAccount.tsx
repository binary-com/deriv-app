import React, { useEffect } from 'react';
import {
    useActiveLinkedToTradingAccount,
    useActiveWalletAccount,
    useCreateNewRealAccount,
    useSettings,
} from '@deriv/api-v2';
import { toMoment } from '@deriv/utils';
import { CFDSuccess } from '../../features/cfd/screens/CFDSuccess';
import useDevice from '../../hooks/useDevice';
import useSyncLocalStorageClientAccounts from '../../hooks/useSyncLocalStorageClientAccounts';
import { ModalStepWrapper, WalletButton, WalletText } from '../Base';
import { useModal } from '../ModalProvider';
import { WalletMarketIcon } from '../WalletMarketIcon';
import { DerivAppsSuccessFooter } from './DerivAppsSuccessFooter';

const DerivAppsGetAccount: React.FC = () => {
    const { show } = useModal();
    const { isDesktop } = useDevice();
    const { data: activeWallet } = useActiveWalletAccount();
    const {
        data: newTradingAccountData,
        isSuccess: isAccountCreationSuccess,
        mutate: createNewRealAccount,
    } = useCreateNewRealAccount();
    const {
        data: { country_code: countryCode, date_of_birth: dateOfBirth, first_name: firstName, last_name: lastName },
    } = useSettings();
    const { addTradingAccountToLocalStorage } = useSyncLocalStorageClientAccounts();

    const { data: activeLinkedToTradingAccount } = useActiveLinkedToTradingAccount();

    const landingCompanyName = activeWallet?.landing_company_name?.toLocaleUpperCase();

    const createTradingAccount = () => {
        if (!activeWallet?.is_virtual) {
            createNewRealAccount({
                payload: {
                    currency: activeWallet?.currency_config?.display_code,
                    date_of_birth: toMoment(dateOfBirth).format('YYYY-MM-DD'),
                    first_name: firstName,
                    last_name: lastName,
                    residence: countryCode || '',
                },
            });
        }
    };

    useEffect(() => {
        if (newTradingAccountData && isAccountCreationSuccess) {
            addTradingAccountToLocalStorage(newTradingAccountData);
        }
        if (isAccountCreationSuccess) {
            show(
                <ModalStepWrapper
                    renderFooter={isDesktop ? undefined : () => <DerivAppsSuccessFooter />}
                    shouldHideDerivAppHeader
                    shouldHideHeader={isDesktop}
                >
                    <CFDSuccess
                        description={`Transfer funds from your ${activeWallet?.wallet_currency_type} Wallet to your Options (${landingCompanyName}) account to start trading.`}
                        displayBalance={activeLinkedToTradingAccount?.display_balance ?? '0.00'}
                        renderButton={() => <DerivAppsSuccessFooter />}
                        title={`Your Options (${landingCompanyName}) account is ready`}
                    />
                </ModalStepWrapper>,
                {
                    defaultRootId: 'wallets_modal_root',
                }
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [addTradingAccountToLocalStorage, newTradingAccountData, isAccountCreationSuccess]);

    return (
        <div className='wallets-deriv-apps-section wallets-deriv-apps-section__get-account'>
            <div className='wallets-deriv-apps-section__icon'>
                <WalletMarketIcon icon='IcWalletOptionsLight' size='lg' />
            </div>
            <div className='wallets-deriv-apps-section__get-content'>
                <div className='wallets-deriv-apps-section__details'>
                    <WalletText size='sm' weight='bold'>
                        Options
                    </WalletText>
                    <WalletText size={isDesktop ? '2xs' : 'xs'}>One options account for all platforms.</WalletText>
                </div>
                <WalletButton color='primary-light' onClick={createTradingAccount}>
                    Get
                </WalletButton>
            </div>
        </div>
    );
};

export { DerivAppsGetAccount };

import React, { useCallback, useEffect } from 'react';
import {
    useActiveLinkedToTradingAccount,
    useActiveWalletAccount,
    useCreateNewRealAccount,
    useSettings,
} from '@deriv/api-v2';
import { AccountsDerivAccountLightIcon } from '@deriv/quill-icons';
import { toMoment } from '../../../../shared/src/utils/date';
import { CFDSuccess } from '../../features/cfd/screens/CFDSuccess';
import useDevice from '../../hooks/useDevice';
import useSyncLocalStorageClientAccounts from '../../hooks/useSyncLocalStorageClientAccounts';
import { ModalStepWrapper, WalletButton, WalletText } from '../Base';
import { useModal } from '../ModalProvider';
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

    const openSuccessModal = useCallback(() => {
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
    }, [
        activeLinkedToTradingAccount?.display_balance,
        activeWallet?.wallet_currency_type,
        isDesktop,
        landingCompanyName,
        show,
    ]);

    useEffect(() => {
        if (newTradingAccountData && isAccountCreationSuccess) {
            addTradingAccountToLocalStorage(newTradingAccountData);
        }
        if (isAccountCreationSuccess) {
            openSuccessModal();
        }
    }, [addTradingAccountToLocalStorage, isAccountCreationSuccess, newTradingAccountData, openSuccessModal]);

    const createTradingAccount = () => {
        createNewRealAccount({
            payload: {
                currency: activeWallet?.currency_config?.display_code,
                date_of_birth: toMoment(dateOfBirth).format('YYYY-MM-DD'),
                first_name: firstName,
                last_name: lastName,
                residence: countryCode || '',
            },
        });
    };

    return (
        <div className='wallets-deriv-apps-section wallets-deriv-apps-section__get-account'>
            <div className='wallets-deriv-apps-section__icon'>
                <AccountsDerivAccountLightIcon iconSize='lg' />
            </div>
            <div className='wallets-deriv-apps-section__get-content'>
                <div className='wallets-deriv-apps-section__details'>
                    <WalletText size='sm' weight='bold'>
                        Options
                    </WalletText>
                    <WalletText size={isDesktop ? '2xs' : 'xs'}>
                        Trade options on multiple platforms with a single account.
                    </WalletText>
                </div>
                <WalletButton color='primary-light' onClick={createTradingAccount}>
                    Get
                </WalletButton>
            </div>
        </div>
    );
};

export { DerivAppsGetAccount };

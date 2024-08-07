import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useCreateWallet } from '@deriv/api-v2';
import { LabelPairedCheckMdFillIcon, LabelPairedPlusMdFillIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Button } from '@deriv-com/ui';
import useDevice from '../../hooks/useDevice';
import useSyncLocalStorageClientAccounts from '../../hooks/useSyncLocalStorageClientAccounts';
import useWalletAccountSwitcher from '../../hooks/useWalletAccountSwitcher';
import { TWalletCarouselItem } from '../../types';
import { useModal } from '../ModalProvider';
import { WalletAddedSuccess } from '../WalletAddedSuccess';
import { WalletCurrencyIcon } from '../WalletCurrencyIcon';
import { WalletError } from '../WalletError';

const WalletsAddMoreCardBanner: React.FC<TWalletCarouselItem> = ({
    currency,
    is_added: isAdded,
    is_crypto: isCrypto,
}) => {
    const switchWalletAccount = useWalletAccountSwitcher();

    const { data, error, isLoading: isWalletCreationLoading, mutateAsync, status } = useCreateWallet();
    const { isDesktop, isMobile } = useDevice();
    const history = useHistory();
    const modal = useModal();
    const { addWalletAccountToLocalStorage } = useSyncLocalStorageClientAccounts();
    const { localize } = useTranslations();

    useEffect(
        () => {
            if (status === 'error') {
                modal.show(
                    <WalletError
                        buttonText={localize('Close')}
                        errorMessage={error.error.message}
                        onClick={() => modal.hide()}
                    />
                );
            } else if (status === 'success') {
                modal.show(
                    <WalletAddedSuccess
                        currency={data?.currency}
                        displayBalance={data?.display_balance ?? `0.00 ${data?.currency}`}
                        onPrimaryButtonClick={() => {
                            history.push('/wallet/deposit');
                            modal.hide();
                        }}
                        onSecondaryButtonClick={() => modal.hide()}
                    />
                );
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [data?.currency, data?.display_balance, data?.landing_company_shortcode, error?.error.message, isMobile, status]
    );

    return (
        <div className='wallets-add-more__banner'>
            <div className='wallets-add-more__banner-header'>
                <WalletCurrencyIcon currency={currency ?? 'USD'} size={isMobile ? 'xs' : 'sm'} />
            </div>
            <Button
                color='white'
                disabled={isAdded || isWalletCreationLoading}
                icon={
                    // TODO: Replace hex colors with values from Deriv UI
                    isAdded ? (
                        <LabelPairedCheckMdFillIcon fill='#333333' />
                    ) : (
                        <LabelPairedPlusMdFillIcon fill='#333333' />
                    )
                }
                onClick={async e => {
                    e.stopPropagation();

                    if (!currency) return;

                    const createAccountResponse = await mutateAsync({
                        account_type: isCrypto ? 'crypto' : 'doughflow',
                        currency,
                    });

                    const newAccountWallet = createAccountResponse?.new_account_wallet;

                    if (!newAccountWallet) return;

                    await addWalletAccountToLocalStorage({ ...newAccountWallet, display_balance: `0.00 ${currency}` });
                    switchWalletAccount(newAccountWallet.client_id);
                }}
                size={isDesktop ? 'lg' : 'sm'}
                textSize={isDesktop ? 'sm' : 'xs'}
            >
                {isAdded ? <Localize i18n_default_text='Added' /> : <Localize i18n_default_text='Add' />}
            </Button>
        </div>
    );
};

export default WalletsAddMoreCardBanner;

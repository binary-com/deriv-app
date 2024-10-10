import React, { useMemo } from 'react';
import classNames from 'classnames';
import { LegacyClose2pxIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Divider, Text, useDevice } from '@deriv-com/ui';
import { useModal } from '../../../../../../components/ModalProvider';
import type { TAccount, TAccountsList } from '../../types';
import { TransferFormAccountCard } from '../TransferFormAccountCard';
import './TransferFormAccountSelection.scss';

type TProps = {
    accountsList: TAccountsList;
    activeWallet: TAccount;
    fromAccount?: TAccount;
    isFromAccountDropdown: boolean;
    label: string;
    onSelect: (value?: TAccount) => void;
    selectedAccount?: TAccount;
    toAccount?: TAccount;
};

const TitleLine = () => (
    <div
        className='wallets-transfer-form-account-selection__title-line'
        data-testid='dt_wallets_transfer_form_account_selection_title_line'
    />
);

const TransferFormAccountSelection: React.FC<TProps> = ({
    accountsList,
    activeWallet,
    fromAccount,
    isFromAccountDropdown,
    label,
    onSelect,
    selectedAccount,
    toAccount,
}) => {
    const { isDesktop } = useDevice();
    const modal = useModal();
    const { localize } = useTranslations();

    const transferToHint = useMemo(() => {
        const isTransferToHintVisible = !isFromAccountDropdown && toAccount?.loginid === activeWallet?.loginid;

        return isTransferToHintVisible ? (
            <Localize
                i18n_default_text='You can only transfers funds from the {{fromAccountName}} to the linked {{activeWalletName}}.'
                values={{
                    activeWalletName: activeWallet?.accountName,
                    fromAccountName: fromAccount?.accountName,
                }}
            />
        ) : (
            ''
        );
    }, [
        activeWallet?.accountName,
        activeWallet?.loginid,
        fromAccount?.accountName,
        isFromAccountDropdown,
        toAccount?.loginid,
    ]);

    const isSingleAccountsGroup = useMemo(
        () => Object.values(accountsList).filter(accounts => accounts.length > 0).length === 1,
        [accountsList]
    );

    return (
        <div className='wallets-transfer-form-account-selection'>
            <div className='wallets-transfer-form-account-selection__header'>
                <div className='wallets-transfer-form-account-selection__label'>
                    <Text size='md' weight='bold'>
                        {label}
                    </Text>
                </div>
                <button
                    className='wallets-transfer-form-account-selection__close-button'
                    data-testid='dt_wallets_transfer_form_account_selection_close_button'
                    onClick={() => modal.hide()}
                >
                    <LegacyClose2pxIcon iconSize='xs' />
                </button>
            </div>
            <div className='wallets-transfer-form-account-selection__accounts'>
                {Object.entries(accountsList).map(([accountsGroupName, accounts], index) => {
                    if (accounts.length === 0) return null;

                    const groupTitle =
                        accountsGroupName === 'tradingAccounts' ? (
                            <Localize
                                i18n_default_text='Trading accounts linked with {{wallet}}'
                                values={{
                                    wallet: localize('{{currency}} Wallet', {
                                        currency: activeWallet?.currencyConfig?.display_code,
                                    }),
                                }}
                            />
                        ) : (
                            <Localize i18n_default_text='Wallets' />
                        );
                    const isLastAccountsGroup = index === Object.keys(accountsList).length - 1;
                    const shouldShowDivider = isDesktop && !isSingleAccountsGroup && !isLastAccountsGroup;

                    return (
                        <React.Fragment key={accountsGroupName}>
                            <div
                                className='wallets-transfer-form-account-selection__accounts-group'
                                data-testid='dt_wallets_transfer_form_account_selection_accounts_group'
                            >
                                <div className='wallets-transfer-form-account-selection__accounts-group-title'>
                                    <Text size='sm' weight='bold'>
                                        {groupTitle}
                                    </Text>
                                    {!isDesktop && <TitleLine />}
                                </div>
                                <div className='wallets-transfer-form-account-selection__grouped-accounts'>
                                    {accounts.map(account => (
                                        <button
                                            className={classNames('wallets-transfer-form-account-selection__account', {
                                                'wallets-transfer-form-account-selection__account--selected':
                                                    account?.loginid === selectedAccount?.loginid,
                                            })}
                                            data-testid='dt_wallets_transfer_form_account_selection_account'
                                            key={`account-selection-${account?.loginid}`}
                                            onClick={() => {
                                                onSelect(account);
                                                modal.hide();
                                            }}
                                        >
                                            <TransferFormAccountCard account={account} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            {shouldShowDivider && <Divider color='var(--border-divider)' height={4} />}
                        </React.Fragment>
                    );
                })}
                {transferToHint && (
                    <div className='wallets-transfer-form-account-selection__transfer-to-hint'>
                        <Text align='center' as='p' color='primary' size='xs'>
                            {transferToHint}
                        </Text>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransferFormAccountSelection;

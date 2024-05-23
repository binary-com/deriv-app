import React, { useMemo } from 'react';
import classNames from 'classnames';
import { LegacyClose2pxIcon } from '@deriv/quill-icons';
import { WalletText } from '../../../../../../components';
import { useModal } from '../../../../../../components/ModalProvider';
import useDevice from '../../../../../../hooks/useDevice';
import type { TAccount, TAccountsList } from '../../types';
import { TransferFormAccountCard } from '../TransferFormAccountCard';
import './TransferFormAccountSelection.scss';

type TProps = {
    accountsList: TAccountsList;
    activeWallet: TAccount;
    fromAccount?: TAccount;
    label: 'Transfer from' | 'Transfer to';
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
    label,
    onSelect,
    selectedAccount,
    toAccount,
}) => {
    const { isMobile } = useDevice();
    const modal = useModal();

    const transferToHint = useMemo(() => {
        const isTransferToHintVisible = label === 'Transfer to' && toAccount?.loginid === activeWallet?.loginid;

        return isTransferToHintVisible
            ? `You can only transfers funds from the ${fromAccount?.accountName} to the linked ${activeWallet?.accountName}.`
            : '';
    }, [activeWallet?.accountName, activeWallet?.loginid, fromAccount?.accountName, label, toAccount?.loginid]);

    const isSingleAccountsGroup = useMemo(
        () => Object.values(accountsList).filter(accounts => accounts.length > 0).length === 1,
        [accountsList]
    );

    return (
        <div className='wallets-transfer-form-account-selection'>
            <div className='wallets-transfer-form-account-selection__header'>
                <div className='wallets-transfer-form-account-selection__label'>
                    <WalletText size='md' weight='bold'>
                        {label}
                    </WalletText>
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
                        accountsGroupName === 'tradingAccounts'
                            ? `Trading accounts linked with ${activeWallet?.currencyConfig?.display_code} Wallet`
                            : 'Wallets';
                    const isLastAccountsGroup = index === Object.keys(accountsList).length - 1;
                    const shouldShowDivider = !isMobile && !isSingleAccountsGroup && !isLastAccountsGroup;

                    return (
                        <div
                            className={classNames('wallets-transfer-form-account-selection__accounts-group', {
                                'wallets-transfer-form-account-selection__accounts-group--divider': shouldShowDivider,
                            })}
                            data-testid='dt_wallets_transfer_form_account_selection_accounts_group'
                            key={accountsGroupName}
                        >
                            <div className='wallets-transfer-form-account-selection__accounts-group-title'>
                                <WalletText size='sm' weight='bold'>
                                    {groupTitle}
                                </WalletText>
                                {isMobile && <TitleLine />}
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
                                        <TransferFormAccountCard account={account} activeWallet={activeWallet} />
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
                {transferToHint && (
                    <div className='wallets-transfer-form-account-selection__transfer-to-hint'>
                        <WalletText align='center' as='p' color='primary' size='xs'>
                            {transferToHint}
                        </WalletText>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransferFormAccountSelection;

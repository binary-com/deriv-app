import React, { RefObject, useCallback, useEffect, useMemo } from 'react';
import { useFormikContext } from 'formik';
import { useHistory } from 'react-router-dom';
import { LegacyChevronDown2pxIcon } from '@deriv/quill-icons';
import { WalletListCardBadge, WalletText } from '../../../../../../components';
import { useModal } from '../../../../../../components/ModalProvider';
import useDevice from '../../../../../../hooks/useDevice';
import { useTransfer } from '../../provider';
import { TInitialTransferFormValues, TToAccount } from '../../types';
import { TransferFormAccountCard } from '../TransferFormAccountCard';
import { TransferFormAccountSelection } from '../TransferFormAccountSelection';
import './TransferFormDropdown.scss';

type TProps = {
    fieldName: keyof TInitialTransferFormValues;
    mobileAccountsListRef: RefObject<HTMLElement>;
};

const TransferFormDropdown: React.FC<TProps> = ({ fieldName, mobileAccountsListRef }) => {
    const { setValues, values } = useFormikContext<TInitialTransferFormValues>();
    const { accounts, activeWallet } = useTransfer();
    const { fromAccount, toAccount } = values;
    const { isMobile } = useDevice();
    const modal = useModal();
    const isFromAccountDropdown = fieldName === 'fromAccount';

    const fromAccountList = useMemo(() => {
        if (!activeWallet) return { tradingAccounts: [], walletAccounts: [] };
        return {
            ...accounts,
            walletAccounts: [activeWallet],
        };
    }, [accounts, activeWallet]);

    const toAccountList = useMemo(() => {
        if (!activeWallet) return { tradingAccounts: [], walletAccounts: [] };
        if (fromAccount?.loginid === activeWallet.loginid) {
            return {
                tradingAccounts: accounts?.tradingAccounts,
                walletAccounts: accounts?.walletAccounts.filter(account => account.loginid !== activeWallet?.loginid),
            };
        }
        return { tradingAccounts: [], walletAccounts: [activeWallet] };
    }, [accounts?.tradingAccounts, accounts?.walletAccounts, activeWallet, fromAccount?.loginid]);

    const selectedAccount = isFromAccountDropdown ? fromAccount : toAccount;
    const accountsList = isFromAccountDropdown ? fromAccountList : toAccountList;
    const label = isFromAccountDropdown ? 'Transfer from' : 'Transfer to';
    const badgeLabel = selectedAccount?.demo_account ? 'virtual' : selectedAccount?.landingCompanyName;

    const { location } = useHistory();
    const toAccountLoginId =
        location.pathname === '/wallet/account-transfer' ? location.state?.toAccountLoginId : undefined;
    const shouldDefaultUSDWallet =
        location.pathname === '/wallet/account-transfer' ? location.state?.shouldSelectDefaultWallet : false;

    const toDefaultAccount = useMemo(
        () => toAccountList.walletAccounts.find(wallet => wallet.currency === 'USD'),
        [toAccountList.walletAccounts]
    );
    // This sets a 'To transfer' to USD Wallet account to be selected by default when user transfers from a crypto wallet
    if (!toAccount && toDefaultAccount && shouldDefaultUSDWallet) {
        setValues(prev => ({
            ...prev,
            toAccount: toDefaultAccount,
        }));
    }

    useEffect(() => {
        const toAccount: TToAccount = Object.values(accounts)
            .flatMap(account => account)
            .find(account => account.loginid === toAccountLoginId);

        if (toAccountLoginId && toAccount) {
            setValues(prev => ({
                ...prev,
                toAccount,
            }));
        }
    }, [accounts, toAccountLoginId, setValues]);

    const handleSelect = useCallback(
        (account: TInitialTransferFormValues['fromAccount']) => {
            if (account?.loginid === selectedAccount?.loginid) return;

            if (isFromAccountDropdown) {
                setValues(prev => {
                    const toAccount = account?.loginid !== activeWallet?.loginid ? activeWallet : undefined;

                    return {
                        ...prev,
                        activeAmountFieldName: undefined,
                        fromAccount: account,
                        fromAmount: 0,
                        toAccount,
                        toAmount: 0,
                    };
                });
            } else {
                setValues(prev => ({
                    ...prev,
                    activeAmountFieldName: 'fromAmount',
                    toAccount: account,
                    toAmount: 0,
                }));
            }
        },
        [activeWallet, isFromAccountDropdown, selectedAccount?.loginid, setValues]
    );

    return (
        <button
            className='wallets-transfer-form-dropdown'
            onClick={() => {
                modal.show(
                    <TransferFormAccountSelection
                        accountsList={accountsList}
                        activeWallet={activeWallet}
                        fromAccount={fromAccount}
                        label={label}
                        onSelect={handleSelect}
                        selectedAccount={selectedAccount}
                        toAccount={toAccount}
                    />,
                    {
                        rootRef: isMobile ? mobileAccountsListRef : undefined,
                    }
                );
            }}
            type='button'
        >
            <div className='wallets-transfer-form-dropdown__content'>
                <div className='wallets-transfer-form-dropdown__header'>
                    <WalletText size='sm'>{label}</WalletText>

                    {isMobile && <LegacyChevronDown2pxIcon iconSize='xs' />}
                </div>

                {selectedAccount ? (
                    <TransferFormAccountCard account={selectedAccount} type='input' />
                ) : (
                    <div className='wallets-transfer-form-dropdown__select-account-cta'>
                        <WalletText size='sm' weight='bold'>
                            Select a trading account{activeWallet?.demo_account === 0 ? ` or a Wallet` : ''}
                        </WalletText>
                    </div>
                )}
            </div>

            {!isMobile && (
                <>
                    {selectedAccount && (
                        <div className='wallets-transfer-form-dropdown__badge'>
                            <WalletListCardBadge isDemo={Boolean(selectedAccount?.demo_account)} label={badgeLabel} />
                        </div>
                    )}
                    <LegacyChevronDown2pxIcon className='wallets-transfer-form-dropdown__icon-dropdown' iconSize='xs' />
                </>
            )}
        </button>
    );
};

export default TransferFormDropdown;

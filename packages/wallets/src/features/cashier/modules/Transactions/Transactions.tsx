import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount, useCurrencyConfig } from '@deriv/api-v2';
import { LegacyFilter1pxIcon } from '@deriv/quill-icons';
import { ToggleSwitch, WalletDropdown, WalletText } from '../../../../components';
import useDevice from '../../../../hooks/useDevice';
import { TransactionsCompleted, TransactionsCompletedDemoResetBalance, TransactionsPending } from './components';
import './Transactions.scss';

type TTransactionsPendingFilter = React.ComponentProps<typeof TransactionsPending>['filter'];
type TTransactionCompletedFilter = React.ComponentProps<typeof TransactionsCompleted>['filter'];
type TFilterValue = TTransactionCompletedFilter | TTransactionsPendingFilter;

const filtersMapper: Record<string, Record<string, TFilterValue>> = {
    completed: {
        all: undefined,
        deposit: 'deposit',
        withdrawal: 'withdrawal',
        // eslint-disable-next-line sort-keys
        transfer: 'transfer',
    },
    pending: {
        all: 'all',
        deposit: 'deposit',
        withdrawal: 'withdrawal',
    },
};

const Transactions = () => {
    const { data: wallet } = useActiveWalletAccount();

    const { isLoading } = useCurrencyConfig();
    const { isMobile } = useDevice();

    const { location } = useHistory();
    const initialShowPending = Boolean(
        location.pathname === '/wallets/cashier/transactions' ? location.state?.showPending : false
    );
    const initialTransactionType =
        (location.pathname === '/wallets/cashier/transactions' ? location.state?.transactionType : undefined) ?? 'all';

    const [isPendingActive, setIsPendingActive] = useState(initialShowPending);
    const [filterValue, setFilterValue] = useState(initialTransactionType);

    const filterOptionsList = useMemo(
        () =>
            Object.keys(filtersMapper[isPendingActive ? 'pending' : 'completed'])
                // Filtering out withdrawal option for demo wallets
                .filter(key => !wallet?.is_virtual || key !== 'withdrawal')
                .map(key => ({
                    text:
                        key === 'deposit' && wallet?.is_virtual
                            ? 'Reset balance'
                            : key.replace(/^\w/, c => c.toUpperCase()),
                    value: key,
                })),
        [isPendingActive, wallet?.is_virtual]
    );

    useEffect(() => {
        if (!isLoading && !wallet?.is_crypto && isPendingActive) {
            setIsPendingActive(false);
        }
    }, [isLoading, wallet?.is_crypto, isPendingActive]);

    useEffect(() => {
        if (isPendingActive && !Object.keys(filtersMapper.pending).includes(filterValue)) {
            setFilterValue('all');
        }
        if (!isPendingActive && !Object.keys(filtersMapper.completed).includes(filterValue)) {
            setFilterValue('all');
        }
    }, [filterValue, isPendingActive]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div
            className={classNames('wallets-transactions', {
                'wallets-transactions--crypto-mobile': wallet?.is_crypto && isMobile,
            })}
        >
            <div className='wallets-transactions__header'>
                {wallet?.is_crypto && (
                    <div className='wallets-transactions__toggle'>
                        <WalletText size='sm'>Pending Transactions</WalletText>
                        <ToggleSwitch onChange={() => setIsPendingActive(!isPendingActive)} value={isPendingActive} />
                    </div>
                )}
                <WalletDropdown
                    icon={<LegacyFilter1pxIcon iconSize='xs' />}
                    label='Filter'
                    list={filterOptionsList}
                    name='wallets-transactions__dropdown'
                    onSelect={value => setFilterValue(value)}
                    value={filterValue}
                />
            </div>
            {isPendingActive && (
                <TransactionsPending filter={filtersMapper.pending[filterValue] as TTransactionsPendingFilter} />
            )}
            {!isPendingActive &&
                (wallet?.is_virtual && filterValue === 'deposit' ? (
                    <TransactionsCompletedDemoResetBalance />
                ) : (
                    <TransactionsCompleted
                        filter={filtersMapper.completed[filterValue] as TTransactionCompletedFilter}
                    />
                ))}
        </div>
    );
};

export default Transactions;

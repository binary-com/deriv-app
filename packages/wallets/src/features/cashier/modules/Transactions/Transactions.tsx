import React, { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';
import { useHistory } from 'react-router-dom';
import { useActiveWalletAccount, useCurrencyConfig } from '@deriv/api-v2';
import { LegacyFilter1pxIcon } from '@deriv/quill-icons';
import { Localize, useTranslations } from '@deriv-com/translations';
import { Dropdown, Text, useDevice } from '@deriv-com/ui';
import { ToggleSwitch } from '../../../../components';
import { TransactionsCompleted, TransactionsCompletedDemoResetBalance, TransactionsPending } from './components';
import { getTransactionLabels } from './constants';
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

    const { localize } = useTranslations();

    const { isLoading } = useCurrencyConfig();
    const { isDesktop } = useDevice();

    const { location } = useHistory();
    const initialShowPending = Boolean(
        location.pathname === '/wallet/transactions' ? location.state?.showPending : false
    );
    const initialTransactionType =
        (location.pathname === '/wallet/transactions' ? location.state?.transactionType : undefined) ?? 'all';

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
                            ? getTransactionLabels(localize).reset_balance
                            : //@ts-expect-error we only need partial filter values
                              getTransactionLabels(localize)[key],
                    value: key,
                })),
        [isPendingActive, wallet?.is_virtual, localize]
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
                'wallets-transactions--crypto-mobile': wallet?.is_crypto && !isDesktop,
            })}
        >
            <div className='wallets-transactions__header'>
                {wallet?.is_crypto && (
                    <div className='wallets-transactions__toggle'>
                        <Text align='start' size='sm'>
                            <Localize i18n_default_text='Pending Transactions' />
                        </Text>
                        <ToggleSwitch onChange={() => setIsPendingActive(!isPendingActive)} value={isPendingActive} />
                    </div>
                )}
                <div className='wallets-transactions__dropdown'>
                    <Dropdown
                        data-testid='dt_wallets_transactions_dropdown'
                        icon={<LegacyFilter1pxIcon iconSize='xs' />}
                        isFullWidth
                        label={localize('Filter')}
                        list={filterOptionsList}
                        name='wallets-transactions__dropdown'
                        onSelect={value => {
                            if (typeof value === 'string') {
                                setFilterValue(value);
                            }
                        }}
                        value={filterValue}
                        variant='comboBox'
                    />
                </div>
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

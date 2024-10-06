import { useCallback, useEffect, useMemo, useState } from 'react';
import useSubscription from '../useSubscription';

type TTransaction = NonNullable<
    NonNullable<ReturnType<typeof useSubscription<'cashier_payments'>>['data']>['cashier_payments']
>['crypto'][number];

type TStatus = TTransaction['status_code'];

type TDepositStatus = 'PENDING' | 'CONFIRMED' | 'ERROR';

type TWithdrawalStatus = Exclude<TStatus, TDepositStatus>;

// Since BE sends the `status_code` for both `deposit` and `withdrawal` in the same field,
// Here we modify the BE type to make `status_code` type more specific to the `transaction_type` field.
type TModifiedTransaction = Omit<TTransaction, 'status_code' | 'transaction_type'> &
    (
        | { transaction_type: 'deposit'; status_code: TDepositStatus }
        | { transaction_type: 'withdrawal'; status_code: TWithdrawalStatus }
    );

/** A custom hook that returns the list of pending crypto transactions for the current user. */
const useCryptoTransactions = () => {
    const { subscribe, data, ...rest } = useSubscription('cashier_payments');
    const [transactions, setTransactions] = useState<TModifiedTransaction[]>();

    // Reset transactions data
    const resetData = useCallback(() => setTransactions(undefined), []);

    useEffect(() => {
        setTransactions(old_transactions => {
            const new_transactions = data?.cashier_payments?.crypto as TModifiedTransaction[] | undefined;

            if (!new_transactions) return old_transactions;

            if (!old_transactions) return new_transactions;

            const updated_transactions = [...old_transactions];

            // For each new transaction, check if it exists in the old transactions.
            new_transactions.forEach(new_transaction => {
                // Find the index of the new transaction in the old transactions if exists.
                const index = updated_transactions.findIndex(
                    old_transaction => old_transaction.id === new_transaction.id
                );

                // If the new transaction does not exist in the old transactions, add it, otherwise update it.
                if (index === -1) {
                    updated_transactions.push(new_transaction);
                } else {
                    updated_transactions[index] = new_transaction;
                }
            });

            return updated_transactions;
        });
    }, [data?.cashier_payments?.crypto]);

    // Add additional information to each transaction.
    const modified_transactions = useMemo(() => {
        if (!transactions || !transactions.length) return undefined;

        return transactions.map(transaction => ({
            ...transaction,
            /** Determine if the transaction is a deposit or not. */
            is_deposit: transaction.transaction_type === 'deposit',
            /** Determine if the transaction is a withdrawal or not. */
            is_withdrawal: transaction.transaction_type === 'withdrawal',
        }));
    }, [transactions]);

    // Sort transactions by submit time.
    const sorted_transactions = useMemo(
        () => modified_transactions?.sort((a, b) => b.submit_date - a.submit_date),
        [modified_transactions]
    );
    // Get the last transaction if exists.
    const last_transaction = modified_transactions?.[0];

    return {
        /** List of user transactions sorted by submit time. */
        data: sorted_transactions,
        /** Returns the last transaction if exists. */
        last_transaction,
        /** Reset transactions data */
        resetData,
        subscribe,
        ...rest,
    };
};

export default useCryptoTransactions;

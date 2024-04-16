import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';
import { useTransfer } from '../../../../provider';
import { TTransferableAccounts, TTransferFormikContext } from '../../../../types';
import { TransferDropdown } from './components';
import styles from './TransferAccountSelection.module.scss';

const TransferAccountSelection = () => {
    const { setValues, values } = useFormikContext<TTransferFormikContext>();
    const { accounts, setTransferValidationSchema } = useTransfer();

    const { fromAccount, toAccount } = values;
    const filteredToAccounts = accounts?.filter(account => account.loginid !== fromAccount?.loginid);

    useEffect(() => {
        if (fromAccount && toAccount) {
            setTransferValidationSchema(fromAccount, toAccount);
        }
    }, [fromAccount, toAccount, setTransferValidationSchema]);

    const onSelectFromAccount = (account: TTransferableAccounts[number]) => {
        if (account.loginid === toAccount?.loginid)
            setValues(currentValues => ({
                ...currentValues,
                fromAccount: currentValues.toAccount,
                toAccount: currentValues.fromAccount,
            }));
        else setValues(currentValues => ({ ...currentValues, fromAccount: account }));
    };

    const onSelectToAccount = (account: TTransferableAccounts[number]) => {
        setValues(currentValues => ({ ...currentValues, toAccount: account }));
    };

    return (
        <div className={styles.container}>
            <TransferDropdown accounts={accounts} label='From' onSelect={onSelectFromAccount} value={fromAccount} />
            <TransferDropdown accounts={filteredToAccounts} label='To' onSelect={onSelectToAccount} value={toAccount} />
        </div>
    );
};

export default TransferAccountSelection;

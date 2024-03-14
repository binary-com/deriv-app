import React, { useState } from 'react';
import { Formik } from 'formik';
import { useHistory } from 'react-router';
import { Button, Loader, Text } from '@deriv-com/ui';
import { useTransfer } from '../../provider';
import { TTransferableAccounts, TTransferFormikContext } from '../../types';
import { getTransferValidationSchema } from '../../utils';
import TransferPercentageSelector from './components/TransferPercentageSelector/TransferPercentageSelector';
import { TransferAmountConverter, TransferFormAccountSelection } from './components';
import styles from './TransferForm.module.scss';

const TransferForm = () => {
    const history = useHistory();
    const { accounts, activeAccount, isLoading } = useTransfer();
    const [validationSchema, setValidationSchema] = useState<ReturnType<typeof getTransferValidationSchema>>();

    if (!accounts || !activeAccount || isLoading) return <Loader />;

    const getInitialToAccount = (accounts: TTransferableAccounts, activeAccount: TTransferableAccounts[number]) => {
        if (!accounts || !activeAccount) return;

        if (activeAccount.loginid !== accounts[0].loginid) return accounts[0];

        return accounts[1];
    };

    const initialValues: TTransferFormikContext = {
        fromAccount: activeAccount,
        fromAmount: '',
        toAccount: getInitialToAccount(accounts, activeAccount),
        toAmount: '',
    };

    return (
        <Formik initialValues={initialValues} validationSchema={validationSchema}>
            {({ errors, setValues, values }) => {
                // console.log('=> values', values, errors);
                return (
                    <div className={styles.container}>
                        <Text className={styles.title} weight='bold'>
                            Transfer between your accounts in Deriv
                        </Text>
                        <TransferFormAccountSelection setValidationSchema={setValidationSchema} />
                        {values.fromAccount &&
                            values.toAccount &&
                            values.fromAccount.currency !== values.toAccount.currency && <TransferPercentageSelector />}
                        <TransferAmountConverter errors={errors} setValues={setValues} values={values} />
                        <div className={styles['button-group']}>
                            <Button
                                onClick={() => {
                                    history.push('/cashier-v2/deposit');
                                }}
                                size='lg'
                                variant='outlined'
                            >
                                Deposit
                            </Button>
                            <Button size='lg'>Transfer</Button>
                        </div>
                    </div>
                );
            }}
        </Formik>
    );
};

export default TransferForm;

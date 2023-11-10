import React, { useEffect, useState } from 'react';
import { Field, FieldProps, Formik, FormikProps } from 'formik';
import { useActiveWalletAccount } from '@deriv/api';
import { WalletButton, WalletTextField } from '../../../../../../components/Base';
import { WalletsPercentageSelector } from '../../../../../../components/WalletsPercentageSelector';
import { WithdrawalCryptoAmountConverter } from './components/WithdrawalCryptoAmountConverter';
import './WithdrawalCryptoForm.scss';
import { WithdrawalPercentageSelector } from '../WithdrawalPercentageSelector';

const MIN_ADDRESS_LENGTH = 25;
const MAX_ADDRESS_LENGTH = 64;

export type TForm = {
    cryptoAddress: string;
    cryptoAmount: string;
    fiatAmount: string;
    withdrawAmount?: number;
};

const validateCryptoAddress = (address: string) => {
    if (!address) return 'This field is required.';

    if (address.length < MIN_ADDRESS_LENGTH || address.length > MAX_ADDRESS_LENGTH) {
        return 'Your wallet address should have 25 to 64 characters.';
    }

    return undefined;
};

const WithdrawalCryptoForm = () => {
    const { data: activeWallet } = useActiveWalletAccount();
    const [percentage, setPercentage] = useState(0);

    useEffect(() => {
        // console.log('percentage', percentage);
    }, [percentage]);

    return (
        <Formik
            initialValues={{
                cryptoAddress: '',
                cryptoAmount: '',
                fiatAmount: '',
                withdrawAmount: undefined,
            }}
            onSubmit={values => ''}
        >
            {({ errors, handleChange, handleSubmit, isSubmitting, setFieldTouched, touched, values }) => {
                return (
                    <form autoComplete='off' className='wallets-withdrawal-crypto-form' onSubmit={handleSubmit}>
                        <div className='wallets-withdrawal-crypto-address'>
                            <Field name='cryptoAddress' validate={validateCryptoAddress}>
                                {({ field }: FieldProps<string>) => (
                                    <WalletTextField
                                        {...field}
                                        helperMessage={errors.cryptoAddress}
                                        label='Your BTC Wallet address'
                                        showMessage
                                        // name='wallets-withdrawal-crypto-address-textfield'
                                    />
                                )}
                            </Field>
                        </div>
                        {/* <WalletsPercentageSelector balance={12} onChangePercentage={per => setPercentage(per)} /> */}
                        <WithdrawalPercentageSelector balance={12} message='blah! blah1 yada!' />
                        <WithdrawalCryptoAmountConverter />
                        <div className='wallets-withdrawal-crypto__submit'>
                            <WalletButton disabled={!!errors || isSubmitting} size='lg' text='Withdraw' type='submit' />
                        </div>
                    </form>
                );
            }}
        </Formik>
    );
};

export default WithdrawalCryptoForm;

import * as Yup from 'yup';
import { decimalsValidator, insufficientBalanceValidator, numberValidator } from '../../../../../utils';

export const getPaymentAgentUnlistedWithdrawalValidationSchema = (balance: number, fractionalDigits: number) => {
    return Yup.object().shape({
        accountNumber: Yup.string()
            .required('This field is required.')
            .matches(/^CR\d+$/, 'Please enter a valid account number. Example: CR123456789'),
        amount: Yup.string()
            .required('This field is required.')
            .test({
                name: 'test-valid-number',
                test: (value = '', context) => numberValidator(value, context),
            })
            .test({
                name: 'test-decimals',
                test: (value = '', context) => decimalsValidator(value, context, fractionalDigits),
            })
            .test({
                name: 'test-insufficient-balance',
                test: (value = '', context) => insufficientBalanceValidator(value, context, balance),
            }),
    });
};

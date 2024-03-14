import * as Yup from 'yup';
import { TCurrency } from '../../../types';
import {
    betweenMinAndMaxValidator,
    decimalsValidator,
    insufficientBalanceValidator,
    numberValidator,
} from '../../../utils';

type TGetTransferValidationSchema = {
    fromAccount: {
        balance: number;
        currency: TCurrency;
        fractionalDigits?: number;
        limits: {
            max: number;
            min: number;
        };
    };
    toAccount: {
        currency: TCurrency;
        fractionalDigits?: number;
    };
};

export const getTransferValidationSchema = ({ fromAccount, toAccount }: TGetTransferValidationSchema) => {
    return Yup.object().shape({
        fromAmount: Yup.string()
            .required('This field is required.')
            .test({
                name: 'test-valid-number',
                test: (value = '', context) => numberValidator(value, context),
            })
            .test({
                name: 'test-decimals',
                test: (value = '', context) => decimalsValidator(value, context, fromAccount.fractionalDigits ?? 2),
            })
            .test({
                name: 'test-insufficient-funds',
                test: (value = '', context) => insufficientBalanceValidator(value, context, fromAccount.balance),
            })
            .test({
                name: 'test-between-min-max',
                test: (value = '', context) =>
                    betweenMinAndMaxValidator(value, context, {
                        currency: fromAccount.currency,
                        limits: fromAccount.limits,
                    }),
            }),
        toAmount: Yup.string()
            .test({
                name: 'test-valid-number',
                test: (value = '', context) => numberValidator(value, context),
            })
            .test({
                name: 'test-decimals',
                test: (value = '', context) => decimalsValidator(value, context, toAccount.fractionalDigits ?? 2),
            }),
    });
};

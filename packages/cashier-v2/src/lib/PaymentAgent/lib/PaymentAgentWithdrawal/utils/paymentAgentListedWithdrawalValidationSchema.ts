import * as Yup from 'yup';
import type { TCurrency } from '../../../../../types';
import {
    betweenMinAndMaxValidator,
    decimalsValidator,
    insufficientBalanceValidator,
    numberValidator,
} from '../../../../../utils';

type TGetPaymentAgentListedWithdrawalValidationSchema = {
    balance: number;
    currency: TCurrency;
    fractionalDigits: number;
    limits: {
        max?: number;
        min?: number;
    };
};

export const getPaymentAgentListedWithdrawalValidationSchema = ({
    balance,
    currency,
    fractionalDigits,
    limits,
}: TGetPaymentAgentListedWithdrawalValidationSchema) => {
    return Yup.object().shape({
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
            })
            .test({
                name: 'test-between-min-max',
                test: (value = '', context) => betweenMinAndMaxValidator(value, context, { currency, limits }),
            }),
    });
};

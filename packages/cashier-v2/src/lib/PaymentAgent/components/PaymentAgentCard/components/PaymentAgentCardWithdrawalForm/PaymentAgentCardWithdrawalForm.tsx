import React, { useCallback } from 'react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { Button, Input, Text } from '@deriv-com/ui';
import { FormatUtils } from '@deriv-com/utils';
import type { THooks } from '../../../../../../hooks/types';
import type { TCurrency } from '../../../../../../types';
import { usePaymentAgentWithdrawalContext } from '../../../../lib/PaymentAgentWithdrawal/provider';
import styles from './PaymentAgentCardWithdrawalForm.module.scss';

type TPaymentAgentCardWithdrawalFormProps = {
    paymentAgent: THooks.PaymentAgentList[number];
};

type TWithdrawalLimitsProps = {
    currency: TCurrency;
    maxWithdrawalLimit: THooks.PaymentAgentList[number]['max_withdrawal'];
    minWithdrawalLimit: THooks.PaymentAgentList[number]['min_withdrawal'];
};

const WithdrawalLimits: React.FC<TWithdrawalLimitsProps> = ({ currency, maxWithdrawalLimit, minWithdrawalLimit }) => {
    const minLimit = `${FormatUtils.formatMoney(Number(minWithdrawalLimit), { currency })} ${currency}`;
    const maxLimit = `${FormatUtils.formatMoney(Number(maxWithdrawalLimit), { currency })} ${currency}`;

    return (
        <Text color='less-prominent' size='xs'>
            Withdrawal limits: {minLimit}-{maxLimit}
        </Text>
    );
};

const PaymentAgentCardWithdrawalForm: React.FC<TPaymentAgentCardWithdrawalFormProps> = ({ paymentAgent }) => {
    const {
        currencies,
        max_withdrawal: maxWithdrawalLimit,
        min_withdrawal: minWithdrawalLimit,
        paymentagent_loginid: paymentAgentLoginid,
    } = paymentAgent;

    const { getPaymentAgentWithdrawalValidationSchema, requestTryPaymentAgentWithdrawal } =
        usePaymentAgentWithdrawalContext();

    const onSubmitHandler = useCallback(
        ({ amount }: { amount: string }) => {
            requestTryPaymentAgentWithdrawal({
                amount: Number(amount),
                paymentagent_loginid: paymentAgentLoginid,
            });
        },
        [paymentAgentLoginid, requestTryPaymentAgentWithdrawal]
    );

    const getAmountInputMessage = useCallback(
        (isTouched?: boolean, errorMessage?: string) => {
            if (isTouched && errorMessage) return errorMessage;
            return (
                <WithdrawalLimits
                    currency={currencies as TCurrency}
                    maxWithdrawalLimit={maxWithdrawalLimit}
                    minWithdrawalLimit={minWithdrawalLimit}
                />
            );
        },
        [currencies, maxWithdrawalLimit, minWithdrawalLimit]
    );

    return (
        <div className={styles.container}>
            <Text as='p' size='sm' weight='bold'>
                Withdrawal amount
            </Text>
            <Formik
                initialValues={{ amount: '' }}
                onSubmit={onSubmitHandler}
                validationSchema={getPaymentAgentWithdrawalValidationSchema(maxWithdrawalLimit, minWithdrawalLimit)}
            >
                {({ errors, isSubmitting, isValid, touched, values }) => {
                    return (
                        <Form className={styles.form} noValidate>
                            <Field name='amount'>
                                {({ field }: FieldProps) => (
                                    <Input
                                        {...field}
                                        autoComplete='off'
                                        error={touched.amount && Boolean(errors.amount)}
                                        isFullWidth
                                        label='Enter amount'
                                        maxLength={30}
                                        message={getAmountInputMessage(touched.amount, errors.amount)}
                                        required
                                        rightPlaceholder={
                                            <Text as='span' size='sm'>
                                                {paymentAgent.currencies}
                                            </Text>
                                        }
                                        type='text'
                                    />
                                )}
                            </Field>
                            <Button
                                disabled={!isValid || isSubmitting || !values.amount}
                                isLoading={isSubmitting}
                                size='lg'
                                textSize='sm'
                                type='submit'
                            >
                                Continue
                            </Button>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};

export default PaymentAgentCardWithdrawalForm;

import React, { useCallback } from 'react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { useActiveAccount } from '@deriv/api-v2';
import { LabelPairedCircleXmarkMdFillIcon, StandaloneArrowLeftBoldIcon } from '@deriv/quill-icons';
import { Button, Input, Text } from '@deriv-com/ui';
import { usePaymentAgentWithdrawalContext } from '../../provider';
import styles from './PaymentAgentUnlistedWithdrawalForm.module.scss';

const PaymentAgentUnlistedWithdrawalForm = () => {
    const { data: activeAccount } = useActiveAccount();

    const { getPaymentAgentWithdrawalValidationSchema, requestTryPaymentAgentWithdrawal, setIsUnlistedWithdrawal } =
        usePaymentAgentWithdrawalContext();

    const onSubmitHandler = useCallback(
        ({ accountNumber, amount }: { accountNumber: string; amount: string }) => {
            requestTryPaymentAgentWithdrawal({
                amount: Number(amount),
                paymentagent_loginid: accountNumber,
            });
        },
        [requestTryPaymentAgentWithdrawal]
    );

    const getAccountNumberInputMessage = useCallback((isTouched?: boolean, errorMessage?: string) => {
        if (isTouched && errorMessage) return errorMessage;
        return 'Example: CR123456789';
    }, []);

    return (
        <div className={styles.container}>
            <div className={styles['back-section']}>
                <StandaloneArrowLeftBoldIcon
                    className={styles['back-arrow-icon']}
                    data-testid='dt-back-arrow-icon'
                    iconSize='md'
                    onClick={() => setIsUnlistedWithdrawal(false)}
                />
                <Text size='sm' weight='bold'>
                    Back to list
                </Text>
            </div>
            <Formik
                initialValues={{
                    accountNumber: '',
                    amount: '',
                }}
                onSubmit={onSubmitHandler}
                validationSchema={getPaymentAgentWithdrawalValidationSchema()}
            >
                {({ errors, isSubmitting, isValid, setFieldValue, touched, values }) => {
                    const isFormEmpty = !Object.values(values).some(Boolean);

                    return (
                        <Form className={styles.form}>
                            <Field name='accountNumber'>
                                {({ field }: FieldProps) => (
                                    <Input
                                        {...field}
                                        autoComplete='off'
                                        error={touched.accountNumber && Boolean(errors.accountNumber)}
                                        isFullWidth
                                        label='Enter the payment agent account number'
                                        maxLength={30}
                                        message={getAccountNumberInputMessage(
                                            touched.accountNumber,
                                            errors.accountNumber
                                        )}
                                        required
                                        rightPlaceholder={
                                            field.value ?? errors.accountNumber ? (
                                                <LabelPairedCircleXmarkMdFillIcon
                                                    onClick={() => setFieldValue('accountNumber', '')}
                                                />
                                            ) : null
                                        }
                                        type='text'
                                    />
                                )}
                            </Field>
                            <div className={styles['amount-input']}>
                                <Field name='amount'>
                                    {({ field }: FieldProps) => (
                                        <Input
                                            {...field}
                                            autoComplete='off'
                                            error={touched.amount && Boolean(errors.amount)}
                                            isFullWidth
                                            label='Enter amount'
                                            maxLength={30}
                                            message={touched.amount && errors.amount}
                                            required
                                            rightPlaceholder={
                                                <Text as='span' size='sm'>
                                                    {activeAccount?.currency_config?.display_code}
                                                </Text>
                                            }
                                            type='text'
                                        />
                                    )}
                                </Field>
                                <Button
                                    disabled={!isValid || isSubmitting || isFormEmpty}
                                    isLoading={isSubmitting}
                                    size='lg'
                                    textSize='sm'
                                    type='submit'
                                >
                                    Continue
                                </Button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
            <Text as='p' color='less-prominent' size='xs'>
                Note: Deriv does not charge any transfer fees.
            </Text>
        </div>
    );
};

export default PaymentAgentUnlistedWithdrawalForm;

import React from 'react';
import { Field, FieldProps, Form, Formik } from 'formik';
import { Button, Input, Text, TextArea, useDevice } from '@deriv-com/ui';
import type { TActiveAccount, TPaymentAgentTransfer } from '../../types';
import styles from './PaymentAgentTransferForm.module.scss';

type TProps = {
    activeAccount?: TActiveAccount;
    requestTryPaymentAgentTransfer: TPaymentAgentTransfer['requestTryPaymentAgentTransfer'];
    transferConfirm: TPaymentAgentTransfer['transferConfirm'];
    validationSchema: TPaymentAgentTransfer['validationSchema'];
};

const PaymentAgentTransferForm: React.FC<TProps> = ({
    activeAccount,
    requestTryPaymentAgentTransfer,
    transferConfirm,
    validationSchema,
}) => {
    const { isMobile } = useDevice();

    const initialTransferValues = {
        amount: transferConfirm.amount,
        description: transferConfirm.description,
        loginid: transferConfirm.clientID,
    };

    return (
        <div className={styles.container}>
            {!isMobile && (
                <Text align='center' size='lg' weight='bold'>
                    Transfer to client
                </Text>
            )}
            <Formik
                initialValues={initialTransferValues}
                onSubmit={({ amount, description, loginid }) =>
                    requestTryPaymentAgentTransfer({
                        amount: Number(amount),
                        description,
                        transfer_to: loginid,
                    })
                }
                validationSchema={validationSchema}
            >
                {({ errors, isSubmitting, isValid, touched, values }) => {
                    const isFormEmpty = !Object.values(values).some(Boolean);
                    return (
                        <Form className={styles.form} noValidate>
                            <Field name='loginid'>
                                {({ field }: FieldProps) => (
                                    <Input
                                        {...field}
                                        autoComplete='off'
                                        className={styles.input}
                                        data-testid='dt_payment_agent_transfer_form_input_loginid'
                                        error={touched.loginid && Boolean(errors.loginid)}
                                        isFullWidth
                                        label='Client account number'
                                        maxLength={20}
                                        message={touched.loginid && errors.loginid}
                                        required
                                        type='text'
                                    />
                                )}
                            </Field>
                            <Field name='amount'>
                                {({ field }: FieldProps) => (
                                    <Input
                                        {...field}
                                        autoComplete='off'
                                        className={styles.input}
                                        data-testid='dt_payment_agent_transfer_form_input_amount'
                                        error={touched.amount && Boolean(errors.amount)}
                                        isFullWidth
                                        label='Amount'
                                        maxLength={30}
                                        message={touched.amount && errors.amount}
                                        required
                                        rightPlaceholder={
                                            <Text as='span' size='sm'>
                                                {activeAccount?.currency}
                                            </Text>
                                        }
                                        type='text'
                                    />
                                )}
                            </Field>
                            <Field name='description'>
                                {({ field }: FieldProps) => (
                                    <TextArea
                                        {...field}
                                        autoComplete='off'
                                        className={styles.input}
                                        data-testid='dt_payment_agent_transfer_form_input_description'
                                        hint={errors.description}
                                        isInvalid={Boolean(errors.description)}
                                        label='Description'
                                        maxLength={250}
                                        shouldShowCounter
                                        textSize='sm'
                                    />
                                )}
                            </Field>
                            <div className={styles['submit-button']}>
                                <Button
                                    disabled={!isValid || isSubmitting || isFormEmpty}
                                    isLoading={isSubmitting}
                                    size='lg'
                                    type='submit'
                                >
                                    Transfer
                                </Button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};

export default PaymentAgentTransferForm;

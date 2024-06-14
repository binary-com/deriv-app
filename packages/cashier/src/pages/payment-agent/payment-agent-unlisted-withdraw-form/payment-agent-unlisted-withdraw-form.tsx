import classNames from 'classnames';
import React from 'react';
import { Field, FieldProps, Formik, Form } from 'formik';
import { Button, Icon, Input, Text } from '@deriv/components';
import { getDecimalPlaces, getCurrencyDisplayCode, validNumber, website_name } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { localize, Localize } from '@deriv/translations';
import PaymentAgentDisclaimer from '../payment-agent-disclaimer';
import ErrorDialog from 'Components/error-dialog';
import SideNote from 'Components/side-note';
import { useCashierStore } from '../../../stores/useCashierStores';
import { TPaymentAgent } from '../../../types';
import './payment-agent-unlisted-withdraw-form.scss';

type TValidateWithdrawalValueProps = {
    amount: string;
    account_number: string;
};

type TValidateWithdrawalProps = {
    balance?: string | number;
    currency: string;
    payment_agent?: TPaymentAgent;
};

type TPaymentAgentUnlistedWithdrawForm = {
    setIsUnlistedWithdraw: (value: boolean) => void;
};

const validateWithdrawal = (values: TValidateWithdrawalValueProps, { balance, currency }: TValidateWithdrawalProps) => {
    const errors: { account_number?: string; amount?: string } = {};

    const { is_ok, message } = validNumber(values.amount, {
        type: 'float',
        decimals: getDecimalPlaces(currency),
    });

    if (!values.amount) {
        errors.amount = localize('This field is required.');
    } else if (!is_ok && message) {
        errors.amount = message;
    } else if (balance !== undefined && Number(balance) < Number(values.amount)) {
        errors.amount = localize('Insufficient balance.');
    } else if (!values.account_number) {
        errors.account_number = localize('This field is required.');
        // TODO: improve broker code validation of the account number when the wallets project will be released
    } else if (!/^CR\d+$/.test(values.account_number)) {
        errors.account_number = localize('Please enter a valid account number. Example: CR123456789');
    }

    return errors;
};

const PaymentAgentUnlistedWithdrawForm = observer(({ setIsUnlistedWithdraw }: TPaymentAgentUnlistedWithdrawForm) => {
    const { client } = useStore();
    const { balance, currency } = client;
    const verification_code = client.verification_code.payment_agent_withdraw;
    const { payment_agent } = useCashierStore();
    const { error, onMountPaymentAgentWithdraw: onMount, requestTryPaymentAgentWithdraw } = payment_agent;

    React.useEffect(() => {
        onMount();
    }, [onMount]);

    const validateWithdrawalPassthrough = (values: TValidateWithdrawalValueProps) =>
        validateWithdrawal(values, { balance, currency });

    const onWithdrawalPassthrough = async (values: TValidateWithdrawalValueProps) => {
        await requestTryPaymentAgentWithdraw({
            loginid: values.account_number,
            currency,
            amount: Number(values.amount),
            verification_code,
        });
    };

    return (
        <div className='payment-agent-withdraw-form'>
            <div className='payment-agent-withdraw-form__page-return'>
                <Icon
                    data_testid={'dt-back-arrow-icon'}
                    icon='icArrowLeftBold'
                    onClick={() => setIsUnlistedWithdraw(false)}
                />
                <Text as='p' line_height='m' size='xs' weight='bold'>
                    <Localize i18n_default_text='Back to list' />
                </Text>
            </div>
            <SideNote className='payment-agent-list__side-note' has_title={false} is_mobile_or_tablet>
                <PaymentAgentDisclaimer />
            </SideNote>
            <Formik
                initialValues={{
                    account_number: '',
                    amount: '',
                }}
                validate={validateWithdrawalPassthrough}
                onSubmit={onWithdrawalPassthrough}
            >
                {({ errors, isSubmitting, isValid, touched, values, setFieldValue }) => {
                    return (
                        <Form className='payment-agent-withdraw-form__form'>
                            <Field name='account_number'>
                                {({ field }: FieldProps) => (
                                    <Input
                                        {...field}
                                        type='text'
                                        className='payment-agent-withdraw-form__form-account-number'
                                        label={localize('Enter the payment agent account number')}
                                        error={(touched.account_number && errors.account_number) || undefined}
                                        hint={localize('Example: CR123456789')}
                                        required
                                        autoComplete='off'
                                        maxLength={30}
                                        trailing_icon={
                                            errors.account_number ===
                                            localize('Please enter a valid account number. Example: CR123456789') ? (
                                                <Icon
                                                    icon='IcCloseCircleRed'
                                                    onClick={() => {
                                                        setFieldValue('account_number', '');
                                                    }}
                                                />
                                            ) : null
                                        }
                                    />
                                )}
                            </Field>
                            <div className='payment-agent-withdraw-form__form-amount'>
                                <Field name='amount'>
                                    {({ field }: FieldProps) => (
                                        <Input
                                            {...field}
                                            type='text'
                                            label={localize('Enter amount')}
                                            error={(touched.amount && errors.amount) || undefined}
                                            required
                                            autoComplete='off'
                                            maxLength={30}
                                            trailing_icon={
                                                <span
                                                    className={classNames(
                                                        'symbols',
                                                        `symbols--${currency.toLowerCase()}`
                                                    )}
                                                >
                                                    {getCurrencyDisplayCode(currency)}
                                                </span>
                                            }
                                        />
                                    )}
                                </Field>
                                <Button
                                    type='submit'
                                    is_disabled={!isValid || isSubmitting || !values.account_number || !values.amount}
                                    primary
                                    large
                                >
                                    <Localize i18n_default_text='Continue' />
                                </Button>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
            <Text as='p' color='less-prominent' line_height='s' size='xxs'>
                <Localize
                    i18n_default_text='Note: {{website_name}} does not charge any transfer fees.'
                    values={{ website_name }}
                />
            </Text>
            <ErrorDialog error={error} className='payment-agent-list__error-dialog' />
        </div>
    );
});

export default PaymentAgentUnlistedWithdrawForm;

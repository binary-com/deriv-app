import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Field, Formik, Form } from 'formik';
import { Button, Input, Loading, Money, Text } from '@deriv/components';
import { getDecimalPlaces, getCurrencyDisplayCode, validNumber } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import ErrorDialog from 'Components/error-dialog';

const validateWithdrawal = (values, { balance, currency, payment_agent = {} }) => {
    const errors = {};

    const { is_ok, message } = validNumber(values.amount, {
        type: 'float',
        decimals: getDecimalPlaces(currency),
        ...(payment_agent.min_withdrawal && {
            min: payment_agent.min_withdrawal,
            max: payment_agent.max_withdrawal,
        }),
    });

    if (!values.amount) {
        errors.amount = localize('This field is required.');
    } else if (!is_ok) {
        errors.amount = message;
    } else if (+balance < +values.amount) {
        errors.amount = localize('Insufficient balance.');
    }

    return errors;
};

const PaymentAgentCardWithdrawalDetails = ({
    amount,
    balance,
    currency,
    error,
    is_loading,
    onMount,
    payment_agent,
    payment_agent_list,
    requestTryPaymentAgentWithdraw,
    verification_code,
}) => {
    React.useEffect(() => {
        onMount();
    }, [onMount]);

    const validateWithdrawalPassthrough = values =>
        validateWithdrawal(values, {
            balance,
            currency,
            payment_agent: payment_agent_list.find(pa => pa.value === payment_agent.paymentagent_loginid),
        });

    const onWithdrawalPassthrough = async (values, actions) => {
        const payment_agent_withdraw = await requestTryPaymentAgentWithdraw({
            loginid: payment_agent.paymentagent_loginid,
            currency,
            amount: values.amount,
            verification_code,
        });
        if (payment_agent_withdraw?.error) {
            actions.setSubmitting(false);
        }
    };

    if (is_loading || !payment_agent_list.length) {
        return <Loading className='cashier__loader' is_fullscreen={false} />;
    }

    return (
        <div className='payment-agent-card__witdrawal-details'>
            <Text
                as='p'
                className='payment-agent-card__witdrawal-details-header'
                line_height='s'
                size='xs'
                weight='bold'
            >
                <Localize i18n_default_text='Withdrawal amount' />
            </Text>
            <Formik
                initialValues={{
                    // in case coming back from confirmation screen, populate the recent data to be edited
                    amount: amount || '',
                }}
                validate={validateWithdrawalPassthrough}
                onSubmit={onWithdrawalPassthrough}
            >
                {({ errors, isSubmitting, isValid, touched }) => {
                    const getHint = () => {
                        return (
                            payment_agent_list.find(pa => pa.value === payment_agent.paymentagent_loginid) && (
                                <Localize
                                    i18n_default_text='Withdrawal limits: <0 />-<1 />'
                                    components={[
                                        <Money
                                            key={0}
                                            amount={
                                                payment_agent_list.find(
                                                    pa => pa.value === payment_agent.paymentagent_loginid
                                                ).min_withdrawal
                                            }
                                            currency={payment_agent.currency}
                                            show_currency
                                        />,
                                        <Money
                                            key={1}
                                            amount={
                                                payment_agent_list.find(
                                                    pa => pa.value === payment_agent.paymentagent_loginid
                                                ).max_withdrawal
                                            }
                                            currency={payment_agent.currency}
                                            show_currency
                                        />,
                                    ]}
                                />
                            )
                        );
                    };

                    return (
                        <Form className='payment-agent-card__witdrawal-details__form'>
                            <Field name='amount'>
                                {({ field }) => (
                                    <Input
                                        {...field}
                                        className='dc-input--no-placeholder'
                                        type='text'
                                        label={localize('Enter amount')}
                                        error={touched.amount && errors.amount}
                                        required
                                        autoComplete='off'
                                        maxLength='30'
                                        hint={getHint()}
                                        trailing_icon={
                                            <span
                                                className={classNames('symbols', `symbols--${currency.toLowerCase()}`)}
                                            >
                                                {getCurrencyDisplayCode(currency)}
                                            </span>
                                        }
                                    />
                                )}
                            </Field>
                            <Button type='submit' is_disabled={!isValid || isSubmitting} primary large>
                                <Localize i18n_default_text='Continue' />
                            </Button>
                            <ErrorDialog error={error} />
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};

PaymentAgentCardWithdrawalDetails.propTypes = {
    amount: PropTypes.string,
    balance: PropTypes.string,
    currency: PropTypes.string,
    error: PropTypes.object,
    is_loading: PropTypes.bool,
    onMount: PropTypes.func,
    payment_agent: PropTypes.object,
    payment_agent_list: PropTypes.array,
    requestTryPaymentAgentWithdraw: PropTypes.func,
    verification_code: PropTypes.string,
};

export default connect(({ client, modules }) => ({
    amount: modules.cashier.payment_agent.confirm.amount,
    balance: client.balance,
    currency: client.currency,
    error: modules.cashier.payment_agent.error,
    is_loading: modules.cashier.general_store.is_loading,
    onMount: modules.cashier.payment_agent.onMountPaymentAgentWithdraw,
    payment_agent_list: modules.cashier.payment_agent.agents,
    requestTryPaymentAgentWithdraw: modules.cashier.payment_agent.requestTryPaymentAgentWithdraw,
    verification_code: client.verification_code.payment_agent_withdraw,
}))(PaymentAgentCardWithdrawalDetails);

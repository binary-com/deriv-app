import PropTypes from 'prop-types';
import React from 'react';
import { localize } from '@deriv/translations';
import { Money } from '@deriv/components';
import { connect } from 'Stores/connect';
import Confirm from '../confirm.jsx';

const PaymentAgentWithdrawConfirm = ({
    amount,
    currency,
    error,
    loginid,
    payment_agent_name,
    requestPaymentAgentWithdraw,
    setIsTryWithdrawSuccessful,
    verification_code,
}) => (
    <Confirm
        data={[
            { label: localize('Payment agent'), value: payment_agent_name || loginid, key: 'pa' },
            {
                label: localize('Amount'),
                value: <Money currency={currency} amount={amount} show_currency />,
                key: 'amount',
            },
        ]}
        error={error}
        header={localize('Please confirm the transaction details in order to complete the withdrawal:')}
        onClickBack={() => {
            setIsTryWithdrawSuccessful(false);
        }}
        onClickConfirm={() => {
            requestPaymentAgentWithdraw({ loginid, currency, amount, verification_code });
        }}
    />
);

PaymentAgentWithdrawConfirm.propTypes = {
    amount: PropTypes.number,
    currency: PropTypes.string,
    error: PropTypes.object,
    loginid: PropTypes.string,
    payment_agent_name: PropTypes.string,
    requestPaymentAgentWithdraw: PropTypes.func,
    setIsTryWithdrawSuccessful: PropTypes.func,
    verification_code: PropTypes.string,
};

export default connect(({ modules }) => ({
    amount: modules.cashier.general.config.payment_agent.confirm.amount,
    currency: modules.cashier.general.config.payment_agent.confirm.currency,
    error: modules.cashier.general.config.payment_agent.error,
    loginid: modules.cashier.general.config.payment_agent.confirm.loginid,
    payment_agent_name: modules.cashier.general.config.payment_agent.confirm.payment_agent_name,
    requestPaymentAgentWithdraw: modules.cashier.general.requestPaymentAgentWithdraw,
    setIsTryWithdrawSuccessful: modules.cashier.general.setIsTryWithdrawSuccessful,
}))(PaymentAgentWithdrawConfirm);

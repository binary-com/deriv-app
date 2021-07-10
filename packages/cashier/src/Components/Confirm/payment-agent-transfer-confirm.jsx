import PropTypes from 'prop-types';
import React from 'react';
import { localize } from '@deriv/translations';
import { Money } from '@deriv/components';
import { connect } from 'Stores/connect';
import Confirm from '../confirm.jsx';

const PaymentAgentTransferConfirm = ({
    amount,
    currency,
    description,
    error,
    loginid,
    requestPaymentAgentTransfer,
    setIsTryTransferSuccessful,
    transfer_to,
    transfer_to_name,
}) => (
    <Confirm
        data={[
            { label: localize('Transfer from'), value: loginid, key: 'transfer_from' },
            { label: localize('Transfer to'), value: [transfer_to, transfer_to_name], key: 'transfer_to' },
            {
                label: localize('Amount'),
                value: <Money currency={currency} amount={amount} show_currency />,
                key: 'amount',
            },
            { label: localize('Description'), value: description, key: 'description' },
        ]}
        error={error}
        header={localize('Please confirm the transaction details in order to complete the transfer:')}
        onClickBack={() => {
            setIsTryTransferSuccessful(false);
        }}
        onClickConfirm={() => {
            requestPaymentAgentTransfer({ amount, currency, description, transfer_to });
        }}
    />
);

PaymentAgentTransferConfirm.propTypes = {
    amount: PropTypes.number,
    currency: PropTypes.string,
    description: PropTypes.string,
    error: PropTypes.object,
    loginid: PropTypes.string,
    requestPaymentAgentTransfer: PropTypes.func,
    setIsTryTransferSuccessful: PropTypes.func,
    transfer_to: PropTypes.string,
    transfer_to_name: PropTypes.string,
};

export default connect(({ client, modules }) => ({
    currency: client.currency,
    loginid: client.loginid,
    amount: modules.cashier.general.config.payment_agent_transfer.confirm.amount,
    description: modules.cashier.general.config.payment_agent_transfer.confirm.description,
    error: modules.cashier.general.config.payment_agent_transfer.error,
    requestPaymentAgentTransfer: modules.cashier.general.requestPaymentAgentTransfer,
    setIsTryTransferSuccessful: modules.cashier.general.setIsTryTransferSuccessful,
    transfer_to: modules.cashier.general.config.payment_agent_transfer.confirm.client_id,
    transfer_to_name: modules.cashier.general.config.payment_agent_transfer.confirm.client_name,
}))(PaymentAgentTransferConfirm);

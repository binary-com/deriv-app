import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import { Button, Icon, Text } from '@deriv/components';
import { routes, formatMoney, getCurrencyDisplayCode, getCurrencyName } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const openStatement = (history, resetPaymentAgentTransfer) => {
    history.push(routes.statement);
    resetPaymentAgentTransfer();
};

const PaymentAgentTransferReceipt = ({ currency, history, loginid, receipt, resetPaymentAgentTransfer }) => (
    <div className='cashier__wrapper payment-agent-transfer__wrapper'>
        <div className='cashier__success'>
            <h2 className='cashier__header'>
                <Localize i18n_default_text='Your funds have been transferred' />
            </h2>
            <div className='cashier__transferred-amount cashier__text--bold'>
                {formatMoney(currency, receipt.amount_transferred, true)} {getCurrencyDisplayCode(currency)}
            </div>
            <div className='cashier__transferred-details-wrapper'>
                <span className='account-transfer__transfer-details-from'>
                    <Icon icon={`IcCurrency-${currency.toLowerCase()}`} />
                    <span className='cashier__transferred-details'>
                        <Text size='xs' line_height='xs' weight='bold' className='cashier__text--bold'>
                            {getCurrencyName(currency)}
                        </Text>
                        <Text size='xs' line_height='xs' color='prominent' className='cashier__text--faint'>
                            {loginid}
                        </Text>
                    </span>
                </span>
                <Icon className='cashier__transferred-icon' icon='IcArrowLeftBold' />
                <span className='account-transfer__transfer-details-to'>
                    <Icon icon='IcClient' />
                    <span className='cashier__transferred-details'>
                        <Text size='xs' line_height='xs' weight='bold' className='cashier__text--bold'>
                            {receipt.client_name}
                        </Text>
                        <Text size='xs' line_height='xs' color='prominent' className='cashier__text--faint'>
                            {receipt.client_id}
                        </Text>
                    </span>
                </span>
            </div>
        </div>
        <div className='cashier__form-submit'>
            <Button
                className='cashier__form-submit-button'
                has_effect
                text={localize('View in statement')}
                onClick={() => openStatement(history, resetPaymentAgentTransfer)}
                secondary
                large
            />
            <Button
                className='cashier__form-submit-button cashier__done-button'
                has_effect
                text={localize('Make a new transfer')}
                onClick={resetPaymentAgentTransfer}
                primary
                large
            />
        </div>
    </div>
);

PaymentAgentTransferReceipt.propTypes = {
    currency: PropTypes.string,
    history: PropTypes.object,
    loginid: PropTypes.string,
    receipt: PropTypes.object,
    resetPaymentAgentTransfer: PropTypes.func,
};

export default withRouter(
    connect(({ client, modules }) => ({
        currency: client.currency,
        loginid: client.loginid,
        receipt: modules.cashier.config.payment_agent_transfer.receipt,
        resetPaymentAgentTransfer: modules.cashier.resetPaymentAgentTransfer,
    }))(PaymentAgentTransferReceipt)
);

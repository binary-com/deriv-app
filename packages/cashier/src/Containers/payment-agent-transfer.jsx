import PropTypes from 'prop-types';
import React from 'react';
import { Loading } from '@deriv/components';
import { connect } from 'Stores/connect';
import Error from 'Components/Error/error.jsx';
import NoBalance from 'Components/Error/no-balance.jsx';
import Virtual from 'Components/Error/virtual.jsx';
import PaymentAgentTransferConfirm from 'Components/Confirm/payment-agent-transfer-confirm.jsx';
import PaymentAgentTransferForm from 'Components/Form/payment-agent-transfer-form.jsx';
import PaymentAgentTransferReceipt from 'Components/Receipt/payment-agent-transfer-receipt.jsx';

const PaymentAgentTransfer = ({
    balance,
    container,
    error,
    is_loading,
    is_transfer_successful,
    is_try_transfer_successful,
    is_virtual,
    onMount,
    onUnMount,
    setActiveTab,
}) => {
    React.useEffect(() => {
        setActiveTab(container);
        if (!is_virtual) {
            onMount();
        }
    }, [container, is_virtual, onMount, setActiveTab]);

    React.useEffect(() => {
        return () => {
            onUnMount();
        };
    }, [onUnMount]);

    if (is_virtual) {
        return <Virtual />;
    }
    if (is_loading) {
        return <Loading className='cashier__loader' />;
    }
    if (error.is_show_full_page) {
        // for errors with CTA hide the form and show the error,
        // for others show them at the bottom of the form next to submit button
        return <Error error={error} />;
    }
    if (!+balance) {
        return <NoBalance />;
    }
    if (is_try_transfer_successful) {
        return <PaymentAgentTransferConfirm />;
    }
    if (is_transfer_successful) {
        return <PaymentAgentTransferReceipt />;
    }
    return <PaymentAgentTransferForm error={error} />;
};

PaymentAgentTransfer.propTypes = {
    balance: PropTypes.string,
    container: PropTypes.string,
    error: PropTypes.object,
    is_loading: PropTypes.bool,
    is_transfer_successful: PropTypes.bool,
    is_try_transfer_successful: PropTypes.bool,
    is_virtual: PropTypes.bool,
    onMount: PropTypes.func,
    onUnMount: PropTypes.func,
    setActiveTab: PropTypes.func,
};

export default connect(({ client, modules }) => ({
    balance: client.balance,
    is_virtual: client.is_virtual,
    container: modules.cashier.general.config.payment_agent_transfer.container,
    error: modules.cashier.general.config.payment_agent_transfer.error,
    is_loading: modules.cashier.general.is_loading,
    is_transfer_successful: modules.cashier.general.config.payment_agent_transfer.is_transfer_successful,
    is_try_transfer_successful: modules.cashier.general.config.payment_agent_transfer.is_try_transfer_successful,
    onMount: modules.cashier.general.onMountPaymentAgentTransfer,
    onUnMount: modules.cashier.general.resetPaymentAgentTransfer,
    setActiveTab: modules.cashier.general.setActiveTab,
}))(PaymentAgentTransfer);

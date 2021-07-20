import PropTypes from 'prop-types';
import React from 'react';
import { Loading } from '@deriv/components';
import { connect } from 'Stores/connect';
import CashierLocked from '../Components/Error/cashier-locked.jsx';
import PaymentAgentList from '../Components/payment-agent-list.jsx';
import Virtual from '../Components/Error/virtual.jsx';

const PaymentAgent = ({
    container,
    is_cashier_locked,
    is_payment_agent_withdraw,
    is_switching,
    is_virtual,
    setActiveTab,
    verification_code,
    setPaymentAgentActiveTabIndex,
}) => {
    const initial_active_index = verification_code || is_payment_agent_withdraw ? 1 : 0;
    setPaymentAgentActiveTabIndex(initial_active_index);

    React.useEffect(() => {
        setActiveTab(container);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (is_switching) {
        return <Loading className='payment-agent__loader' />;
    }

    if (is_virtual) {
        return <Virtual />;
    }
    if (is_cashier_locked) {
        return <CashierLocked />;
    }
    return (
        <PaymentAgentList verification_code={verification_code} is_payment_agent_withdraw={is_payment_agent_withdraw} />
    );
};

PaymentAgent.propTypes = {
    container: PropTypes.string,
    is_cashier_locked: PropTypes.bool,
    is_payment_agent_withdraw: PropTypes.bool,
    is_virtual: PropTypes.bool,
    setActiveTab: PropTypes.func,
    verification_code: PropTypes.string,
    setPaymentAgentActiveTabIndex: PropTypes.func,
};

export default connect(({ client, modules }) => ({
    is_cashier_locked: modules.cashier.is_cashier_locked,
    is_switching: client.is_switching,
    is_virtual: client.is_virtual,
    verification_code: client.verification_code.payment_agent_withdraw,
    container: modules.cashier.config.payment_agent.container,
    is_payment_agent_withdraw: modules.cashier.config.payment_agent.is_withdraw,
    setActiveTab: modules.cashier.setActiveTab,
    setPaymentAgentActiveTabIndex: modules.cashier.config.payment_agent.setActiveTabIndex,
}))(PaymentAgent);

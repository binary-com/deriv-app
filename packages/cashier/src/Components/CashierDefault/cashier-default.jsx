import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { isCryptocurrency, routes } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { Text } from '@deriv/components';
import { connect } from 'Stores/connect';
import Providers from 'Config/cashier-default-providers';
import CashierDefaultDetail from './cashier-default-detail.jsx';

const CashierDefault = ({
    account_needed_modal_props,
    currency,
    is_eu,
    is_p2p_enabled,
    is_payment_agent_visible,
    openRealAccountSignup,
    setIsDepositCash,
}) => {
    const history = useHistory();

    const onClickDeposit = () => {
        setIsDepositCash(true);
        history.push(routes.cashier_deposit);
    };

    const onClickCrypto = () => {
        history.push(routes.trade);
        openRealAccountSignup(account_needed_modal_props.target);
    };

    const onClickPaymentAgent = () => {
        history.push(routes.cashier_pa);
    };

    const onClickDp2p = () => {
        history.push(routes.cashier_p2p);
    };

    const is_crypto = !!currency && isCryptocurrency(currency);

    const getDepositOptions = () => {
        const options = [];

        options.push(Providers.createCashProvider(onClickDeposit));
        if (!is_eu) {
            options.push(Providers.createCryptoProvider(onClickCrypto));

            // Put the crypto option first in case the account is crypto.
            if (is_crypto)
                options.sort(
                    (first_option, second_option) => options.indexOf(second_option) - options.indexOf(first_option)
                );
        }

        if (is_payment_agent_visible) options.push(Providers.createPaymentAgentProvider(onClickPaymentAgent));
        if (is_p2p_enabled) options.push(Providers.createDp2pProvider(onClickDp2p));
        return options;
    };

    return (
        <div>
            <div className='cashier-default-header'>
                <Text size='sm'>
                    <Localize i18n_default_text='Choose a way to fund your account' />
                </Text>
            </div>
            {getDepositOptions()?.map(deposit => (
                <CashierDefaultDetail
                    key={deposit.detail_header}
                    detail_click={deposit.detail_click}
                    detail_contents={deposit.detail_contents}
                    detail_description={deposit.detail_description}
                    detail_header={deposit.detail_header}
                />
            ))}
        </div>
    );
};

CashierDefault.propTypes = {
    account_needed_modal_props: PropTypes.object,
    currency: PropTypes.string,
    is_eu: PropTypes.bool,
    is_p2p_enabled: PropTypes.bool,
    is_payment_agent_visible: PropTypes.bool,
    openRealAccountSignup: PropTypes.func,
    setIsDepositCash: PropTypes.func,
};

export default connect(({ client, modules, ui }) => ({
    account_needed_modal_props: ui.account_needed_modal_props,
    currency: client.currency,
    is_eu: client.is_eu,
    is_p2p_enabled: modules.cashier.is_p2p_enabled,
    is_payment_agent_visible: modules.cashier.is_payment_agent_visible,
    openRealAccountSignup: ui.openRealAccountSignup,
    setIsDepositCash: modules.cashier.setIsDepositCash,
}))(CashierDefault);

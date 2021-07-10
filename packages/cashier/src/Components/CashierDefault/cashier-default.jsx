import PropTypes from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { getStaticUrl, isCryptocurrency, routes } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import { Loading, ThemedScrollbars, Text } from '@deriv/components';
import { connect } from 'Stores/connect';
import Providers from 'Config/cashier-default-providers';
import CashierDefaultDetails from 'Components/CashierDefault/cashier-default-details.jsx';

const CashierDefault = ({
    accounts_list,
    currency,
    is_dark_mode_on,
    is_eu,
    is_landing_company_loaded,
    is_mobile,
    is_p2p_enabled,
    is_payment_agent_visible,
    is_switching,
    openRealAccountSignup,
    setIsCashierDefault,
    setIsDeposit,
    setManageRealAccountActiveTabIndex,
    toggleAccountsDialog,
}) => {
    const history = useHistory();
    const is_crypto = !!currency && isCryptocurrency(currency);
    const has_crypto_account = accounts_list.some(x => x.is_crypto);
    const has_fiat_account = accounts_list.some(x => !x.is_crypto);

    React.useEffect(() => {
        setIsCashierDefault(true);
        return () => setIsCashierDefault(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onClickDepositCash = () => {
        if (!is_crypto) {
            setIsDeposit(true);
            return;
        }
        if (has_fiat_account) {
            toggleAccountsDialog();
            return;
        }
        setManageRealAccountActiveTabIndex(1);
        openRealAccountSignup('manage');
    };

    const onClickDepositCrypto = () => {
        if (is_crypto) {
            setIsDeposit(true);
            return;
        }
        if (has_crypto_account) {
            toggleAccountsDialog();
            return;
        }
        setManageRealAccountActiveTabIndex(0);
        openRealAccountSignup('manage');
    };

    const onClickPaymentAgent = () => {
        history.push(routes.cashier_pa);
    };

    const onClickDp2p = () => {
        history.push(routes.cashier_p2p);
    };

    const getDepositOptions = () => {
        const options = [];
        options.push(Providers.createCashProvider(onClickDepositCash));
        if (!is_eu) {
            options.push(Providers.createCryptoProvider(onClickDepositCrypto));

            // Put the crypto option first in case the account is crypto.
            if (is_crypto)
                options.sort(
                    (first_option, second_option) => options.indexOf(second_option) - options.indexOf(first_option)
                );
        }
        if (is_payment_agent_visible) {
            options.push(Providers.createPaymentAgentProvider(onClickPaymentAgent));
        }
        if (is_p2p_enabled) {
            options.push(Providers.createDp2pProvider(onClickDp2p));
        }
        return options;
    };

    if (is_switching || accounts_list.length === 0 || !is_landing_company_loaded)
        return <Loading className='cashier-default__loader' />;

    return (
        <div className='cashier-default'>
            <div className='cashier-default-header'>
                <Text size={is_mobile ? 's' : 'sm'} line_height='xxl'>
                    <Localize i18n_default_text='Choose a way to fund your account' />
                </Text>
            </div>
            {is_mobile && (
                <div className='cashier-default-header' onClick={() => window.open(getStaticUrl('/payment-methods'))}>
                    <Text size='xs' color='red'>
                        <Localize i18n_default_text='Learn more about payment methods' />
                    </Text>
                </div>
            )}
            <ThemedScrollbars className='cashier-default-content'>
                <div className='cashier-default-content__description'>
                    {getDepositOptions()?.map((deposit, idx) => (
                        <CashierDefaultDetails
                            key={`${deposit.detail_header}${idx}`}
                            detail_click={deposit.detail_click}
                            detail_contents={deposit.detail_contents}
                            detail_description={deposit.detail_description}
                            detail_header={deposit.detail_header}
                            is_dark_mode_on={is_dark_mode_on}
                            is_mobile={is_mobile}
                        />
                    ))}
                </div>
            </ThemedScrollbars>
        </div>
    );
};

CashierDefault.propTypes = {
    accounts_list: PropTypes.array,
    currency: PropTypes.string,
    is_dark_mode_on: PropTypes.bool,
    is_eu: PropTypes.bool,
    is_landing_company_loaded: PropTypes.bool,
    is_mobile: PropTypes.bool,
    is_p2p_enabled: PropTypes.bool,
    is_payment_agent_visible: PropTypes.bool,
    is_switching: PropTypes.bool,
    openRealAccountSignup: PropTypes.func,
    setIsCashierDefault: PropTypes.func,
    setIsDeposit: PropTypes.func,
    setManageRealAccountActiveTabIndex: PropTypes.func,
    toggleAccountsDialog: PropTypes.func,
};

export default connect(({ client, modules, ui }) => ({
    accounts_list: modules.cashier.general.config.account_transfer.accounts_list,
    currency: client.currency,
    is_dark_mode_on: ui.is_dark_mode_on,
    is_eu: client.is_eu,
    is_landing_company_loaded: client.is_landing_company_loaded,
    is_mobile: ui.is_mobile,
    is_p2p_enabled: modules.cashier.general.is_p2p_enabled,
    is_payment_agent_visible: modules.cashier.general.is_payment_agent_visible,
    is_switching: client.is_switching,
    openRealAccountSignup: ui.openRealAccountSignup,
    setIsCashierDefault: modules.cashier.general.setIsCashierDefault,
    setIsDeposit: modules.cashier.general.setIsDeposit,
    setManageRealAccountActiveTabIndex: ui.setManageRealAccountActiveTabIndex,
    toggleAccountsDialog: ui.toggleAccountsDialog,
}))(CashierDefault);

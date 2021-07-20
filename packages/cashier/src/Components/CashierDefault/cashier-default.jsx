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
    is_payment_agent_visible,
    is_switching,
    openRealAccountSignup,
    resetIsConfirmed,
    shouldNavigateAfterChooseCrypto,
    shouldNavigateAfterPrompt,
    setIsCashierDefault,
    setIsDeposit,
    setDepositTarget,
    setShouldShowAllAvailableCurrencies,
}) => {
    const history = useHistory();
    const is_crypto = !!currency && isCryptocurrency(currency);
    const has_crypto_account = accounts_list.some(x => x.is_crypto);
    const has_fiat_account = accounts_list.some(x => !x.is_crypto);
    const user_fiat_currency = accounts_list.filter(x => !x.is_crypto);

    React.useEffect(() => {
        setIsCashierDefault(true);
        resetIsConfirmed();
        return () => setIsCashierDefault(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const openRealAccount = target => {
        openRealAccountSignup('choose');
        shouldNavigateAfterChooseCrypto(target);
    };

    const openTarget = target => {
        setDepositTarget(target);
        if (is_crypto || has_crypto_account) {
            openRealAccount(target);
        } else {
            openRealAccountSignup('add_crypto');
        }
    };

    const fiatAccountConditions = (next_location, current_location) => {
        if (has_fiat_account) {
            shouldNavigateAfterPrompt(next_location, current_location);
        } else {
            openRealAccountSignup('add_fiat');
        }
    };

    const onClickDepositCash = () => {
        setDepositTarget(routes.cashier_deposit);

        if (is_crypto) {
            fiatAccountConditions(routes.cashier_deposit, 'deposit');
        } else {
            setIsDeposit(true);
        }
    };

    const onClickDepositCrypto = () => {
        openTarget(routes.cashier_deposit);
    };

    const onClickOnramp = () => {
        openTarget(routes.cashier_onramp);
    };

    const onClickPaymentAgent = () => {
        setShouldShowAllAvailableCurrencies(true);
        setDepositTarget(routes.cashier_pa);
        openRealAccount(routes.cashier_pa);
    };

    const onClickDp2p = () => {
        setDepositTarget(routes.cashier_p2p);

        if (is_crypto) {
            fiatAccountConditions(routes.cashier_p2p, 'DP2P');
        } else {
            history.push(routes.cashier_p2p);
        }
    };

    const show_p2p = () => {
        if (is_eu || (user_fiat_currency?.length && user_fiat_currency[0]?.currency !== 'USD')) {
            return false;
        }
        return true;
    };

    const getDepositOptions = () => {
        const options = [];
        options.push(Providers.createCashProvider(onClickDepositCash));
        options.push(Providers.createCryptoProvider(onClickDepositCrypto));
        options.push(Providers.createOnrampProvider(onClickOnramp, is_crypto));
        if (is_payment_agent_visible) {
            options.push(Providers.createPaymentAgentProvider(onClickPaymentAgent));
        }

        if (show_p2p()) {
            options.push(Providers.createDp2pProvider(onClickDp2p));
        }
        return options;
    };

    if (is_switching || accounts_list.length === 0 || !is_landing_company_loaded)
        return <Loading className='cashier-default__loader' is_fullscreen />;

    return (
        <div>
            <div className='cashier-default'>
                <div className='cashier-default-header'>
                    <Text size={is_mobile ? 's' : 'sm'} line_height='xxl'>
                        <Localize i18n_default_text='Choose a way to fund your account' />
                    </Text>
                </div>
                {is_mobile && (
                    <div
                        className='cashier-default-header'
                        onClick={() => window.open(getStaticUrl('/payment-methods'))}
                    >
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
    is_payment_agent_visible: PropTypes.bool,
    is_switching: PropTypes.bool,
    openRealAccountSignup: PropTypes.func,
    shouldNavigateAfterChooseCrypto: PropTypes.func,
    shouldNavigateAfterPrompt: PropTypes.func,
    setIsCashierDefault: PropTypes.func,
    setIsDeposit: PropTypes.func,
};

export default connect(({ client, modules, ui }) => ({
    accounts_list: modules.cashier.config.account_transfer.accounts_list,
    currency: client.currency,
    is_dark_mode_on: ui.is_dark_mode_on,
    is_eu: client.is_eu,
    is_landing_company_loaded: client.is_landing_company_loaded,
    is_mobile: ui.is_mobile,
    is_payment_agent_visible: modules.cashier.is_payment_agent_visible,
    is_switching: client.is_switching,
    openRealAccountSignup: ui.openRealAccountSignup,
    resetIsConfirmed: modules.cashier.account_prompt_dialog.resetIsConfirmed,
    shouldNavigateAfterChooseCrypto: ui.shouldNavigateAfterChooseCrypto,
    shouldNavigateAfterPrompt: modules.cashier.account_prompt_dialog.shouldNavigateAfterPrompt,
    setIsCashierDefault: modules.cashier.setIsCashierDefault,
    setIsDeposit: modules.cashier.setIsDeposit,
    setDepositTarget: modules.cashier.setDepositTarget,
    setShouldShowAllAvailableCurrencies: modules.cashier.setShouldShowAllAvailableCurrencies,
}))(CashierDefault);

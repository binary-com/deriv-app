import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Tabs, ThemedScrollbars } from '@deriv/components';
import { localize } from '@deriv/translations';
import { isDesktop, isMobile } from '@deriv/shared';
import { WS } from 'Services';
import { connect } from 'Stores/connect';
import AddCryptoCurrency from './add-crypto-currency.jsx';
import ChangeAccountCurrency from './change-account-currency.jsx';
import LoadingModal from './real-account-signup-loader.jsx';
import 'Sass/add-or-manage.scss';
import 'Sass/change-account.scss';

const AddOrManageAccounts = props => {
    const {
        available_crypto_currencies,
        can_change_fiat_currency,
        createCryptoAccount,
        current_currency_type,
        has_fiat,
        is_add_crypto,
        is_add_fiat,
        is_eu,
        is_loading,
        manage_real_account_tab_index,
        onError,
        onSuccessSetAccountCurrency,
        openRealAccountSignup,
        resetRealAccountSignupTarget,
        setCurrency,
        setLoading,
        setIsDeposit,
        setShouldShowCancel,
    } = props;

    const initial_active_index =
        manage_real_account_tab_index ?? (has_fiat && available_crypto_currencies?.length === 0) ? 1 : 0;

    const [active_index, setActiveIndex] = React.useState(initial_active_index);
    const [form_error] = React.useState('');
    const [form_value] = React.useState({ crypto: '', fiat: '' });

    React.useEffect(() => {
        const fetchMt5LoginList = async () => {
            setLoading(true);
            await WS.mt5LoginList();
            setLoading(false);
        };
        fetchMt5LoginList();
        return () => setShouldShowCancel(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const setActiveTabIndex = index => {
        setActiveIndex(index);
    };

    const manageOrChangeAccount = (obj, setSubmitting) => {
        setLoading(true);
        Object.entries(obj).map(([key, value]) => {
            if (key === 'fiat') {
                setCurrency(value)
                    .then(response => {
                        setSubmitting(false);
                        onSuccessSetAccountCurrency(
                            response.passthrough.previous_currency,
                            response.echo_req.set_account_currency
                        );
                    })
                    .catch(error => {
                        onError(error);
                    })
                    .finally(() => setLoading(false));
            } else {
                // Add Crypto Account
                createCryptoAccount(value)
                    .then(() => {
                        onSuccessSetAccountCurrency('', value);
                        setSubmitting(false);
                        resetRealAccountSignupTarget();
                        setIsDeposit(true);
                    })
                    .catch(error => {
                        onError(error);
                    })
                    .finally(() => setLoading(false));
            }
        });
    };

    const updateValue = (index, value, setSubmitting) => {
        manageOrChangeAccount(value, setSubmitting);
    };

    const onClickBack = () => {
        openRealAccountSignup('choose');
    };

    const hasNoAvailableCrypto = () => {
        return available_crypto_currencies.length === 0 && has_fiat;
    };

    if (is_loading) return <LoadingModal />;

    const fiat_section = has_fiat && (
        <div
            className={classNames('change-currency', {
                'account-wizard--disabled': !can_change_fiat_currency,
            })}
        >
            <ChangeAccountCurrency
                className='account-wizard__body'
                onSubmit={updateValue}
                value={form_value}
                form_error={form_error}
                can_change_fiat_currency={can_change_fiat_currency}
                current_currency_type={current_currency_type}
            />
        </div>
    );

    if (is_add_crypto)
        return (
            <ThemedScrollbars is_bypassed={isMobile()} autohide={false}>
                <div
                    className={classNames('add-crypto-currency', {
                        'account-wizard--disabled': hasNoAvailableCrypto(),
                    })}
                >
                    <AddCryptoCurrency
                        className='account-wizard__body'
                        onSubmit={updateValue}
                        onClickBack={onClickBack}
                        value={form_value}
                        form_error={form_error}
                        should_show_crypto_only
                        hasNoAvailableCrypto={hasNoAvailableCrypto}
                    />
                </div>
            </ThemedScrollbars>
        );

    if (is_add_fiat) {
        return (
            <ThemedScrollbars is_bypassed={isMobile()} autohide={false}>
                <div className='change-currency'>
                    <AddCryptoCurrency
                        className='account-wizard__body'
                        onSubmit={updateValue}
                        value={form_value}
                        form_error={form_error}
                        should_show_fiat_only
                        hasNoAvailableCrypto={hasNoAvailableCrypto}
                        is_add_fiat
                    />
                </div>
            </ThemedScrollbars>
        );
    }

    return (
        <ThemedScrollbars is_bypassed={isMobile()} autohide={false}>
            {is_eu && has_fiat ? (
                fiat_section
            ) : (
                <Tabs
                    active_index={active_index}
                    className='account-wizard add-or-manage tabs--desktop'
                    onTabItemClick={setActiveTabIndex}
                    top
                    header_fit_content={isDesktop()}
                >
                    <div label={localize('Cryptocurrencies')}>
                        <div
                            className={classNames('add-crypto-currency', {
                                'account-wizard--disabled': hasNoAvailableCrypto(),
                            })}
                        >
                            <AddCryptoCurrency
                                className='account-wizard__body'
                                onSubmit={updateValue}
                                value={form_value}
                                form_error={form_error}
                                should_show_crypto_only
                                hasNoAvailableCrypto={hasNoAvailableCrypto}
                            />
                        </div>
                    </div>
                    <div label={localize('Fiat currencies')}>
                        {has_fiat ? (
                            fiat_section
                        ) : (
                            <AddCryptoCurrency
                                className='account-wizard__body'
                                onSubmit={updateValue}
                                value={form_value}
                                form_error={form_error}
                                should_show_fiat_only={true}
                                hasNoAvailableCrypto={hasNoAvailableCrypto}
                            />
                        )}
                    </div>
                </Tabs>
            )}
        </ThemedScrollbars>
    );
};

AddOrManageAccounts.propTypes = {
    available_crypto_currencies: PropTypes.arrayOf({
        fractional_digits: PropTypes.number,
        is_deposit_suspended: PropTypes.number,
        is_suspended: PropTypes.number,
        is_withdrawal_suspended: PropTypes.number,
        name: PropTypes.string,
        stake_default: PropTypes.number,
        transfer_between_accounts: PropTypes.object,
        type: PropTypes.string,
        value: PropTypes.string,
    }),
    onError: PropTypes.func,
    onLoading: PropTypes.func,
    onSuccessSetAccountCurrency: PropTypes.func,
    is_eu: PropTypes.bool,
    setCurrency: PropTypes.func,
    createCryptoAccount: PropTypes.func,
    has_fiat: PropTypes.bool,
    can_change_fiat_currency: PropTypes.bool,
    current_currency_type: PropTypes.string,
    is_loading: PropTypes.bool,
    is_add_crypto: PropTypes.bool,
    setLoading: PropTypes.func,
    setShouldShowCancel: PropTypes.func,
};

export default connect(({ client, modules, ui }) => ({
    available_crypto_currencies: client.available_crypto_currencies,
    can_change_fiat_currency: client.can_change_fiat_currency,
    current_currency_type: client.current_currency_type,
    current_fiat_currency: client.current_fiat_currency,
    has_fiat: client.has_fiat,
    is_eu: client.is_eu,
    manage_real_account_tab_index: ui.manage_real_account_tab_index,
    setCurrency: client.setAccountCurrency,
    setShouldShowCancel: ui.setShouldShowCancel,
    createCryptoAccount: client.createCryptoAccount,
    openRealAccountSignup: ui.openRealAccountSignup,
    resetRealAccountSignupTarget: ui.resetRealAccountSignupTarget,
    setIsDeposit: modules.cashier.setIsDeposit,
}))(AddOrManageAccounts);

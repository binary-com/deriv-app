import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Tabs, ThemedScrollbars } from '@deriv/components';
import { localize } from '@deriv/translations';
import { CURRENCY_TYPE, isDesktop, isMobileOrTablet } from '@deriv/shared';
import { WS } from 'Services';
import AddCryptoCurrency from './add-crypto-currency.jsx';
import AddCurrency from './add-currency.jsx';
import ChangeAccountCurrency from './change-account-currency.jsx';
import LoadingModal from './real-account-signup-loader.jsx';
import { observer, useStore } from '@deriv/stores';
import 'Sass/add-or-manage.scss';
import 'Sass/change-account.scss';

const AddOrManageAccounts = observer(props => {
    const {
        deposit_target,
        is_add_crypto,
        is_add_currency,
        is_add_fiat,
        is_loading,
        onError,
        onSuccessSetAccountCurrency,
        setLoading,
        onClose,
    } = props;

    const { client, modules, ui, traders_hub } = useStore();
    const {
        available_crypto_currencies,
        can_change_fiat_currency,
        current_currency_type,
        has_fiat,
        setAccountCurrency: setCurrency,
        createCryptoAccount,
        is_low_risk,
        loginid,
    } = client;
    const { cashier } = modules;
    const { show_eu_related_content } = traders_hub;
    const { manage_real_account_tab_index, setShouldShowCancel, resetRealAccountSignupTarget } = ui;
    const setIsDeposit = cashier.general_store.setIsDeposit;
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

    const setCurrencyOrAddCryptoAccount = currency_object => {
        setLoading(true);
        Object.entries(currency_object).map(([key, value]) => {
            if (key === CURRENCY_TYPE.FIAT) {
                setCurrency(value)
                    .then(response => {
                        onSuccessSetAccountCurrency(
                            response.passthrough.previous_currency,
                            response.echo_req.set_account_currency,
                            deposit_target
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
                        onSuccessSetAccountCurrency('', value, deposit_target);
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
                onSubmit={setCurrencyOrAddCryptoAccount}
                value={form_value}
                form_error={form_error}
                can_change_fiat_currency={can_change_fiat_currency}
                current_currency_type={current_currency_type}
                closeModal={onClose}
            />
        </div>
    );

    if (is_add_currency || is_add_crypto || is_add_fiat) {
        return (
            <AddCurrency
                onSubmit={setCurrencyOrAddCryptoAccount}
                value={form_value}
                form_error={form_error}
                should_show_crypto_only
                hasNoAvailableCrypto={hasNoAvailableCrypto}
                is_add_crypto={is_add_crypto}
                is_add_fiat={is_add_fiat}
                is_add_currency={is_add_currency}
            />
        );
    }

    const is_mf_active = loginid?.startsWith('MF');

    return (
        <ThemedScrollbars is_bypassed={isMobileOrTablet()} autohide={false}>
            {(show_eu_related_content && !is_low_risk && has_fiat) || is_mf_active ? (
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
                                onSubmit={setCurrencyOrAddCryptoAccount}
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
                                onSubmit={setCurrencyOrAddCryptoAccount}
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
});

AddOrManageAccounts.propTypes = {
    onClose: PropTypes.func,
    onError: PropTypes.func,
    onSuccessSetAccountCurrency: PropTypes.func,
    is_loading: PropTypes.bool,
    is_add_crypto: PropTypes.bool,
    setLoading: PropTypes.func,
    is_add_fiat: PropTypes.bool,
    is_add_currency: PropTypes.bool,
    deposit_target: PropTypes.string,
};

export default AddOrManageAccounts;

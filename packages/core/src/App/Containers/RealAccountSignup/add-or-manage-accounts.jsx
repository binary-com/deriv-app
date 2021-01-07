import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Tabs, ThemedScrollbars } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { getCurrencyDisplayCode, isDesktop, isMobile, website_name, PlatformContext } from '@deriv/shared';
import { WS } from 'Services';
import { connect } from 'Stores/connect';
import AddCryptoCurrency from './add-crypto-currency.jsx';
import ChangeAccountCurrency from './change-account-currency.jsx';
import LoadingModal from './real-account-signup-loader.jsx';
import 'Sass/add-or-manage.scss';
import 'Sass/change-account.scss';

class AddOrManageAccounts extends React.Component {
    static contextType = PlatformContext;
    constructor(props) {
        super(props);
        this.state = {
            active_index: this.props.has_fiat && this.props.available_crypto_currencies?.length === 0 ? 1 : 0,
            finished: undefined,
            form_error: '',
            form_value: {
                crypto: '',
                fiat: '',
            },
        };
    }

    async componentDidMount() {
        this.props.setLoading(true);
        await WS.mt5LoginList();
        this.props.setLoading(false);
    }

    setActiveTabIndex = index => {
        this.setState({
            active_index: index,
            // form_value: index === 0 ? { currency: '' } : { crypto: '', fiat: ''}
        });
    };

    clearError = () => {
        this.setState({
            form_error: '',
        });
    };

    manageOrChangeAccount = (obj, setSubmitting) => {
        this.props.setLoading(true);
        Object.entries(obj).map(([key, value]) => {
            if (key === 'fiat') {
                this.props
                    .setCurrency(value)
                    .then(response => {
                        setSubmitting(false);
                        this.props.onSuccessSetAccountCurrency(
                            response.passthrough.previous_currency,
                            response.echo_req.set_account_currency
                        );
                    })
                    .catch(error => {
                        this.props.onError(error);
                    })
                    .finally(() => this.props.setLoading(false));
            } else {
                // Add Crypto Account
                this.props
                    .createCryptoAccount(value, this.context.is_deriv_crypto)
                    .then(() => {
                        this.props.onSuccessSetAccountCurrency('', value);
                        setSubmitting(false);
                    })
                    .catch(error => {
                        this.props.onError(error);
                    })
                    .finally(() => this.props.setLoading(false));
            }
        });
    };

    updateValue = (index, value, setSubmitting) => {
        this.manageOrChangeAccount(value, setSubmitting);
    };

    get no_crypto_available() {
        return this.props.available_crypto_currencies.length === 0 && this.props.has_fiat;
    }

    get should_hide_crypto() {
        return this.props.is_eu;
    }

    render() {
        if (this.props.is_loading) return <LoadingModal />;

        const fiat_section = (
            <div
                className={classNames('change-currency', {
                    'account-wizard--disabled': !this.props.can_change_fiat_currency,
                })}
            >
                {!this.props.can_change_fiat_currency && (
                    <div className='account-wizard--disabled-message'>
                        <p>
                            {this.props.current_currency_type === 'fiat' ? (
                                <Localize
                                    i18n_default_text='Currency change is not available because either you have deposited money into your {{currency}} account or you have created a real MetaTrader 5 (MT5) account.'
                                    values={{
                                        currency: getCurrencyDisplayCode(this.props.currency),
                                    }}
                                />
                            ) : (
                                <Localize
                                    i18n_default_text='Please switch to your {{fiat_currency}} account to change currencies.'
                                    values={{
                                        // eslint-disable-next-line
                                        fiat_currency: this.props.current_fiat_currency.toUpperCase(),
                                    }}
                                />
                            )}
                        </p>
                    </div>
                )}
                <ChangeAccountCurrency
                    className='account-wizard__body'
                    onSubmit={this.updateValue}
                    value={this.state.form_value}
                    form_error={this.state.form_error}
                    {...this.props}
                />
            </div>
        );

        return (
            <ThemedScrollbars is_bypassed={isMobile()} autohide={false}>
                {this.props.is_eu && this.props.has_fiat ? (
                    fiat_section
                ) : (
                    <Tabs
                        active_index={this.state.active_index}
                        className='account-wizard add-or-manage tabs--desktop'
                        onTabItemClick={this.setActiveTabIndex}
                        top
                        header_fit_content={isDesktop()}
                    >
                        <div label={localize('Cryptocurrencies')}>
                            <div
                                className={classNames('add-crypto-currency', {
                                    'account-wizard--disabled': this.no_crypto_available,
                                })}
                            >
                                {this.no_crypto_available && (
                                    <div className='account-wizard--disabled-message'>
                                        <p>
                                            {localize(
                                                'You already have an account for each of the cryptocurrencies available on {{deriv}}.',
                                                {
                                                    deriv: website_name,
                                                }
                                            )}
                                        </p>
                                    </div>
                                )}
                                <AddCryptoCurrency
                                    className='account-wizard__body'
                                    onSubmit={this.updateValue}
                                    value={this.state.form_value}
                                    form_error={this.state.form_error}
                                    should_show_crypto_only
                                    {...this.props}
                                />
                            </div>
                        </div>
                        {!this.context.is_deriv_crypto && (
                            <div label={localize('Fiat currencies')}>
                                {this.props.has_fiat ? (
                                    fiat_section
                                ) : (
                                    <AddCryptoCurrency
                                        className='account-wizard__body'
                                        onSubmit={this.updateValue}
                                        value={this.state.form_value}
                                        form_error={this.state.form_error}
                                        should_show_fiat_only
                                        {...this.props}
                                    />
                                )}
                            </div>
                        )}
                    </Tabs>
                )}
            </ThemedScrollbars>
        );
    }
}

AddOrManageAccounts.propTypes = {
    onError: PropTypes.func,
    onLoading: PropTypes.func,
    onSuccessAddCurrency: PropTypes.func,
    onSuccessSetAccountCurrency: PropTypes.func,
};

export default connect(({ client }) => ({
    available_crypto_currencies: client.available_crypto_currencies,
    can_change_fiat_currency: client.can_change_fiat_currency,
    currency: client.currency,
    current_currency_type: client.current_currency_type,
    current_fiat_currency: client.current_fiat_currency,
    is_eu: client.is_eu,
    has_fiat: client.has_fiat,
    setCurrency: client.setAccountCurrency,
    createCryptoAccount: client.createCryptoAccount,
}))(AddOrManageAccounts);

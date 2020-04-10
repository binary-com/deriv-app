import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Button, Dropdown, Icon, Input, Money, DesktopWrapper, MobileWrapper, SelectNative } from '@deriv/components';
import { Field, Formik, Form } from 'formik';
import CurrencyUtils from '@deriv/shared/utils/currency';
import { website_name } from 'App/Constants/app-config';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { getPreBuildDVRs, validNumber } from 'Utils/Validator/declarative-validation-rules';
import Loading from '../../../../templates/_common/components/loading.jsx';

const AccountOption = ({ account, idx }) => (
    <React.Fragment key={idx}>
        {(account.currency || account.mt_icon) && (
            <Icon
                icon={account.mt_icon ? `IcMt5-${account.mt_icon}` : `IcCurrency-${account.currency.toLowerCase()}`}
                className='account-transfer__currency-icon'
            />
        )}
        <span className='account-transfer__currency'>{account.text}</span>
        <span className='account-transfer__balance'>
            (<Money amount={account.balance} currency={account.currency} />)
        </span>
    </React.Fragment>
);

const AccountTransferNote = ({ currency, transfer_fee, minimum_fee }) => {
    return (
        <div className='account-transfer__notes'>
            <div className='account-transfer__bullet-wrapper'>
                <div className='account-transfer__bullet' />
                <span>
                    <Localize i18n_default_text='Transfer limits may vary depending on changes in exchange rates.' />
                </span>
            </div>
            <div className='account-transfer__bullet-wrapper'>
                <div className='account-transfer__bullet' />
                <span>
                    <Localize
                        i18n_default_text='Transfers are subject to a {{transfer_fee}}% transfer fee or {{currency}} {{minimum_fee}}, whichever is higher.'
                        values={{
                            transfer_fee,
                            currency,
                            minimum_fee,
                        }}
                    />
                </span>
            </div>
            <div className='account-transfer__bullet-wrapper'>
                <div className='account-transfer__bullet' />
                <span>
                    <Localize
                        i18n_default_text='Transfers are possible only between your fiat and cryptocurrency accounts (and vice versa), or between your {{website_name}} account and your {{website_name}} MT5 (DMT5) account (or vice versa).'
                        values={{ website_name }}
                    />
                </span>
            </div>
            <div className='account-transfer__bullet-wrapper'>
                <div className='account-transfer__bullet' />
                <span>
                    <Localize i18n_default_text='Transfers may be unavailable at times such as when the market is closed (weekends or holidays), periods of high volatility, or when there are technical issues.' />
                </span>
            </div>
        </div>
    );
};

class AccountTransferForm extends React.Component {
    componentDidMount() {
        this.props.onMount();
    }
    validateAmount = amount => {
        let error;

        if (!amount) {
            error = localize('This field is required.');
        } else if (
            !validNumber(amount, {
                type: 'float',
                decimals: CurrencyUtils.getDecimalPlaces(this.props.selected_from.currency),
                min: this.props.transfer_limit.min,
                max: this.props.transfer_limit.max,
            })
        ) {
            error = getPreBuildDVRs().number.message;
        } else if (+this.props.selected_from.balance < +amount) {
            error = localize('Insufficient balance.');
        }

        return error;
    };

    onTransferPassthrough = async (values, actions) => {
        const transfer_between_accounts = await this.props.requestTransferBetweenAccounts({
            amount: values.amount,
        });
        if (transfer_between_accounts.error) {
            actions.setSubmitting(false);
        }
    };

    render() {
        const { account_limits } = this.props;
        const accounts_from = [];
        const mt_accounts_from = [];
        const accounts_to = [];
        const mt_accounts_to = [];

        this.props.accounts_list.forEach((account, idx) => {
            const text = <AccountOption idx={idx} account={account} />;
            const value = account.value;
            (account.is_mt ? mt_accounts_from : accounts_from).push({
                text,
                value,
                nativepicker_text: `${account.text} (${account.currency} ${account.balance})`,
            });
            const is_selected_from = account.value === this.props.selected_from.value;
            const is_selected_from_mt = this.props.selected_from.is_mt && account.is_mt;
            const is_selected_from_crypto = this.props.selected_from.is_crypto && account.is_crypto;
            // account from and to cannot be the same
            // cannot transfer to MT account from MT
            // cannot transfer to crypto account from crypto
            const is_disabled = is_selected_from_mt || is_selected_from || is_selected_from_crypto;
            (account.is_mt ? mt_accounts_to : accounts_to).push({
                text,
                value,
                disabled: is_disabled,
                nativepicker_text: `${account.text} (${account.currency} ${account.balance})`,
            });
        });

        const from_accounts = {
            [localize('Deriv accounts')]: accounts_from,
            ...(mt_accounts_from.length && { [localize('DMT5 accounts')]: mt_accounts_from }),
        };

        const to_accounts = {
            [localize('Deriv accounts')]: accounts_to,
            ...(mt_accounts_to.length && { [localize('DMT5 accounts')]: mt_accounts_to }),
        };

        const is_transfer_to_mt5 =
            mt_accounts_to.length &&
            this.props.selected_to &&
            mt_accounts_to.find(account => account.value === this.props.selected_to.value);

        const transfer_to_hint = account_limits?.daily_transfers && (
            <Localize
                i18n_default_text='Remaining {{type}} transfers for today: {{remaining}}'
                values={{
                    remaining: is_transfer_to_mt5
                        ? account_limits.daily_transfers.mt5?.available
                        : account_limits.daily_transfers.internal?.available,
                    type: is_transfer_to_mt5 ? 'MT5' : '',
                }}
            />
        );

        return (
            <div className='cashier__wrapper cashier__wrapper--align-left'>
                <React.Fragment>
                    <Formik
                        initialValues={{
                            amount: '',
                        }}
                        onSubmit={this.onTransferPassthrough}
                    >
                        {({ errors, isSubmitting, isValid, touched, validateField, handleChange }) => (
                            <React.Fragment>
                                {isSubmitting ? (
                                    <div className='cashier__loader-wrapper'>
                                        <Loading className='cashier__loader' />
                                    </div>
                                ) : (
                                    <Form>
                                        <div className='cashier__drop-down-wrapper'>
                                            <DesktopWrapper>
                                                <Dropdown
                                                    id='transfer_from'
                                                    className='cashier__drop-down account-transfer__drop-down'
                                                    classNameDisplay='cashier__drop-down-display'
                                                    classNameDisplaySpan='cashier__drop-down-display-span'
                                                    classNameItems='cashier__drop-down-items'
                                                    classNameLabel='cashier__drop-down-label'
                                                    label={localize('From')}
                                                    list={from_accounts}
                                                    name='transfer_from'
                                                    value={this.props.selected_from.value}
                                                    onChange={e => {
                                                        this.props.onChangeTransferFrom(e);
                                                        handleChange(e);
                                                        validateField('amount');
                                                    }}
                                                    disabled
                                                />
                                            </DesktopWrapper>
                                            <MobileWrapper>
                                                <SelectNative
                                                    className='account-transfer__transfer-from'
                                                    label={localize('From')}
                                                    value={this.props.selected_from.value}
                                                    list_items={from_accounts}
                                                    onChange={e => {
                                                        this.props.onChangeTransferFrom(e);
                                                        handleChange(e);
                                                        validateField('amount');
                                                    }}
                                                    disabled
                                                />
                                                <p className='account-transfer__transfer-info'>
                                                    <Localize
                                                        i18n_default_text='To transfer from another account, please go to <0/> and change to your preferred account.'
                                                        components={[
                                                            <Button
                                                                type='button'
                                                                key={0}
                                                                text={localize('Account Switcher')}
                                                                onClick={this.props.toggleAccountsDialog}
                                                                has_effect
                                                                tertiary
                                                                small
                                                            />,
                                                        ]}
                                                    />
                                                </p>
                                            </MobileWrapper>
                                            <DesktopWrapper>
                                                <Icon
                                                    className='cashier__transferred-icon account-transfer__transfer-icon'
                                                    icon='IcArrowLeftBold'
                                                />
                                            </DesktopWrapper>
                                            <DesktopWrapper>
                                                <Dropdown
                                                    id='transfer_to'
                                                    className='cashier__drop-down account-transfer__drop-down'
                                                    classNameDisplay='cashier__drop-down-display'
                                                    classNameDisplaySpan='cashier__drop-down-display-span'
                                                    classNameItems='cashier__drop-down-items'
                                                    classNameLabel='cashier__drop-down-label'
                                                    label={localize('To')}
                                                    list={to_accounts}
                                                    name='transfer_to'
                                                    value={this.props.selected_to.value}
                                                    onChange={this.props.onChangeTransferTo}
                                                    hint={transfer_to_hint}
                                                />
                                            </DesktopWrapper>
                                            <MobileWrapper>
                                                <SelectNative
                                                    className='account-transfer__transfer-to'
                                                    label={localize('To')}
                                                    value={this.props.selected_to.value}
                                                    list_items={to_accounts}
                                                    onChange={this.props.onChangeTransferTo}
                                                    hint={transfer_to_hint}
                                                />
                                            </MobileWrapper>
                                        </div>
                                        <Field name='amount' validate={this.validateAmount}>
                                            {({ field }) => (
                                                <Input
                                                    {...field}
                                                    onChange={e => {
                                                        this.props.setErrorMessage('');
                                                        handleChange(e);
                                                    }}
                                                    className='cashier__input cashier__input--long dc-input--no-placeholder'
                                                    type='text'
                                                    label={localize('Amount')}
                                                    error={touched.amount && errors.amount}
                                                    required
                                                    leading_icon={
                                                        this.props.selected_from.currency ? (
                                                            <span
                                                                className={classNames(
                                                                    'symbols',
                                                                    `symbols--${this.props.selected_from.currency.toLowerCase()}`
                                                                )}
                                                            />
                                                        ) : (
                                                            undefined
                                                        )
                                                    }
                                                    autoComplete='off'
                                                    maxLength='30'
                                                    hint={
                                                        this.props.transfer_limit.max && (
                                                            <Localize
                                                                i18n_default_text='Max transfer amount: <0 />'
                                                                components={[
                                                                    <Money
                                                                        key={0}
                                                                        amount={this.props.transfer_limit.max}
                                                                        currency={this.props.selected_from.currency}
                                                                    />,
                                                                ]}
                                                            />
                                                        )
                                                    }
                                                />
                                            )}
                                        </Field>
                                        <DesktopWrapper>
                                            <AccountTransferNote
                                                transfer_fee={this.props.transfer_fee}
                                                currency={this.props.selected_from.currency}
                                                minimum_fee={this.props.minimum_fee}
                                            />
                                            <div className='cashier__form-submit'>
                                                {this.props.error.message && (
                                                    <React.Fragment>
                                                        <Icon
                                                            icon='IcAlertDanger'
                                                            className='cashier__form-error-icon'
                                                            size={128}
                                                        />
                                                        <Icon
                                                            icon='IcAlertDanger'
                                                            className='cashier__form-error-small-icon'
                                                        />
                                                        <p className='cashier__form-error'>
                                                            {this.props.error.message}
                                                        </p>
                                                    </React.Fragment>
                                                )}
                                                <Button
                                                    className='cashier__form-submit-button'
                                                    type='submit'
                                                    is_disabled={!isValid || isSubmitting}
                                                    primary
                                                    large
                                                >
                                                    <Localize i18n_default_text='Transfer' />
                                                </Button>
                                            </div>
                                        </DesktopWrapper>
                                        <MobileWrapper>
                                            <div className='cashier__form-submit  cashier__form-submit--align-end'>
                                                {this.props.error.message && (
                                                    <div className='cashier__form-error-container'>
                                                        <Icon
                                                            icon='IcAlertDanger'
                                                            className='cashier__form-error-small-icon'
                                                        />
                                                        <p className='cashier__form-error'>
                                                            {this.props.error.message}
                                                        </p>
                                                    </div>
                                                )}
                                                <Button
                                                    className='cashier__form-submit-button'
                                                    type='submit'
                                                    is_disabled={!isValid || isSubmitting}
                                                    primary
                                                    large
                                                >
                                                    <Localize i18n_default_text='Transfer' />
                                                </Button>
                                            </div>
                                            <AccountTransferNote
                                                transfer_fee={this.props.transfer_fee}
                                                currency={this.props.selected_from.currency}
                                                minimum_fee={this.props.minimum_fee}
                                            />
                                        </MobileWrapper>
                                    </Form>
                                )}
                            </React.Fragment>
                        )}
                    </Formik>
                </React.Fragment>
            </div>
        );
    }
}

AccountTransferForm.propTypes = {
    accounts_list: PropTypes.array,
    error: PropTypes.object,
    minimum_fee: PropTypes.string,
    onChangeTransferFrom: PropTypes.func,
    onChangeTransferTo: PropTypes.func,
    requestTransferBetweenAccounts: PropTypes.func,
    selected_from: PropTypes.object,
    selected_to: PropTypes.object,
    setErrorMessage: PropTypes.func,
    transfer_fee: PropTypes.number,
    transfer_limit: PropTypes.object,
};

export default connect(({ modules, client, ui }) => ({
    accounts_list: modules.cashier.config.account_transfer.accounts_list,
    minimum_fee: modules.cashier.config.account_transfer.minimum_fee,
    onChangeTransferFrom: modules.cashier.onChangeTransferFrom,
    onChangeTransferTo: modules.cashier.onChangeTransferTo,
    requestTransferBetweenAccounts: modules.cashier.requestTransferBetweenAccounts,
    selected_from: modules.cashier.config.account_transfer.selected_from,
    selected_to: modules.cashier.config.account_transfer.selected_to,
    setErrorMessage: modules.cashier.setErrorMessage,
    transfer_fee: modules.cashier.config.account_transfer.transfer_fee,
    transfer_limit: modules.cashier.config.account_transfer.transfer_limit,
    account_limits: client.account_limits,
    onMount: client.getLimits,
    toggleAccountsDialog: ui.toggleAccountsDialog,
}))(AccountTransferForm);

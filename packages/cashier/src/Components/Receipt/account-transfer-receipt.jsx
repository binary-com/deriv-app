import PropTypes from 'prop-types';
import React from 'react';
import { withRouter } from 'react-router';
import { Button, Modal, Icon, Text } from '@deriv/components';
import { formatMoney, getCurrencyDisplayCode, routes } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { getAccountText } from '../../_common/utility';

const AccountTransferReceipt = ({
    disableApp,
    enableApp,
    history,
    loginid,
    receipt,
    resetAccountTransfer,
    selected_from,
    selected_to,
    switchAccount,
}) => {
    const [is_switch_visible, setIsSwitchVisible] = React.useState(false);
    const [switch_to, setSwitchTo] = React.useState({});

    React.useEffect(() => {
        return () => {
            resetAccountTransfer();
        };
    }, [resetAccountTransfer]);

    const openStatement = () => {
        history.push(routes.statement);
        resetAccountTransfer();
    };

    const switchAndRedirect = async () => {
        await switchAccount(switch_to.value);
        openStatement();
    };

    const toggleSwitchAlert = () => {
        setIsSwitchVisible(!is_switch_visible);
    };

    const checkAccount = () => {
        // we should always show the statement of the account transferred to
        // unless if the account transferred to is your logged in account, or
        // the account transferred to is a DMT5 account that can't be switched to and from account is your logged in account
        if (
            selected_to.value === loginid ||
            ((selected_to.is_mt || selected_to.is_dxtrade) && selected_from.value === loginid)
        ) {
            openStatement();
        } else {
            // if the account transferred to is a DMT5 account that can't be switched to, switch to from account instead
            // otherwise switch to the account transferred to
            setSwitchTo(selected_to.is_mt ? selected_from : selected_to);
            toggleSwitchAlert();
        }
    };

    return (
        <div className='cashier__wrapper account-transfer__receipt'>
            <Text as='h2' color='prominent' align='center' weight='bold' className='cashier__header'>
                <Localize i18n_default_text='Your funds have been transferred' />
            </Text>
            <div className='cashier__transferred-amount cashier__text--bold'>
                {formatMoney(selected_from.currency, receipt.amount_transferred, true)}
                <span className='symbols'>{getCurrencyDisplayCode(selected_from.currency)}</span>
            </div>
            <div className='cashier__transferred-details-wrapper'>
                <span className='account-transfer__transfer-details-from'>
                    <div className='cashier__transferred-details'>
                        <div className='cashier__text--bold cashier__text--right'>{getAccountText(selected_from)}</div>
                        <div className='cashier__text--faint cashier__text--right'>{selected_from.value}</div>
                    </div>
                    <Icon
                        icon={selected_from.platform_icon || `IcCurrency-${selected_from.currency?.toLowerCase()}`}
                        size={32}
                    />
                </span>
                <Icon className='cashier__transferred-icon' icon='IcArrowLeftBold' />
                <span className='account-transfer__transfer-details-to'>
                    <Icon
                        icon={selected_to.platform_icon || `IcCurrency-${selected_to.currency?.toLowerCase()}`}
                        size={32}
                    />
                    <div className='cashier__transferred-details'>
                        <div className='cashier__text--bold'>{getAccountText(selected_to)}</div>
                        <div className='cashier__text--faint'>{selected_to.value}</div>
                    </div>
                </span>
            </div>
            <div className='account-transfer__receipt-form-submit'>
                <Button
                    className='account-transfer__button'
                    has_effect
                    text={localize('View in statement')}
                    onClick={checkAccount}
                    secondary
                    large
                />
                <Button
                    className='account-transfer__button'
                    has_effect
                    text={localize('Make a new transfer')}
                    onClick={resetAccountTransfer}
                    primary
                    large
                />
            </div>

            <Modal
                is_open={is_switch_visible}
                toggleModal={toggleSwitchAlert}
                enableApp={enableApp}
                disableApp={disableApp}
                has_close_icon
                id='account_transfer_switch_modal'
                small
                title={localize('Switching accounts')}
            >
                <Modal.Body>
                    <Localize
                        i18n_default_text='We’re switching over to your {{currency}} account to view the statement.'
                        values={{ currency: switch_to.currency }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button has_effect text={localize('OK')} onClick={switchAndRedirect} primary large />
                </Modal.Footer>
            </Modal>
        </div>
    );
};

AccountTransferReceipt.propTypes = {
    disableApp: PropTypes.func,
    enableApp: PropTypes.func,
    loginid: PropTypes.string,
    receipt: PropTypes.object,
    resetAccountTransfer: PropTypes.func,
    selected_from: PropTypes.object,
    selected_to: PropTypes.object,
    switchAccount: PropTypes.func,
};

export default withRouter(
    connect(({ client, modules, ui }) => ({
        loginid: client.loginid,
        switchAccount: client.switchAccount,
        receipt: modules.cashier.general.config.account_transfer.receipt,
        resetAccountTransfer: modules.cashier.general.resetAccountTransfer,
        selected_from: modules.cashier.general.config.account_transfer.selected_from,
        selected_to: modules.cashier.general.config.account_transfer.selected_to,
        disableApp: ui.disableApp,
        enableApp: ui.enableApp,
    }))(AccountTransferReceipt)
);

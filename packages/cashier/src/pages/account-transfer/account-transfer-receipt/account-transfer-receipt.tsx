import React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import classNames from 'classnames';

import { Button, Icon, Modal, Text } from '@deriv/components';
import { getCurrencyDisplayCode, isMobileOrTablet, routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';

import AccountPlatformIcon from '../../../components/account-platform-icon';
import { useCashierStore } from '../../../stores/useCashierStores';

import './account-transfer-receipt.scss';

type TSwitch = {
    value?: string;
    currency?: string;
};

type TAccountTransferReceipt = RouteComponentProps & {
    onClose: () => void;
};

const AccountTransferReceipt = observer(({ onClose, history }: TAccountTransferReceipt) => {
    const { common, client, traders_hub } = useStore();
    const { account_transfer } = useCashierStore();
    const { is_from_derivgo } = common;
    const { loginid, switchAccount } = client;
    const { closeAccountTransferModal } = traders_hub;
    const { receipt, resetAccountTransfer, selected_from, selected_to, setShouldSwitchAccount } = account_transfer;

    const is_from_outside_cashier = !location.pathname.startsWith(routes.cashier);

    const [is_switch_visible, setIsSwitchVisible] = React.useState(false);
    const [switch_to, setSwitchTo] = React.useState<TSwitch>({});

    React.useEffect(() => {
        return () => {
            resetAccountTransfer();
            closeAccountTransferModal();
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
        // the account transferred to is a Deriv MT5 account that can't be switched to and from account is your logged in account
        if (
            selected_to.value === loginid ||
            ((selected_to.is_mt || selected_to.is_dxtrade || selected_to.is_ctrader) && selected_from.value === loginid)
        ) {
            openStatement();
        } else {
            // if the account transferred to is a Deriv MT5 account that can't be switched to, switch to from account instead
            // otherwise switch to the account transferred to
            setShouldSwitchAccount(true);
            setSwitchTo(selected_to.is_mt ? selected_from : selected_to);
            toggleSwitchAlert();
        }
    };

    return (
        <div
            className={classNames(
                'account-transfer-receipt__crypto',
                !is_from_outside_cashier && 'account-transfer-receipt__crypto-padding'
            )}
        >
            <Text as='h2' color='prominent' align='center' weight='bold' className='cashier__header'>
                <Localize i18n_default_text='Your funds have been transferred' />
            </Text>
            <div className='account-transfer-receipt__crypto--amount'>
                <Text as='p' size='l' weight='bold' color='profit-success'>
                    <Localize
                        i18n_default_text='{{amount}} {{currency}}'
                        values={{
                            amount: receipt.amount_transferred,
                            currency: getCurrencyDisplayCode(selected_from.currency),
                        }}
                    />
                </Text>
            </div>
            <div className='account-transfer-receipt__crypto--details-wrapper'>
                <div className='crypto-transfer-from'>
                    <div className='crypto-transfer-from-details'>
                        <AccountPlatformIcon account={selected_from} size={32} />
                        <Text as='p' size='s' weight='bold'>
                            <Localize i18n_default_text={selected_from.text} />
                        </Text>
                    </div>
                    {!is_from_derivgo && (
                        <Text as='p' size='s' color='less-prominent' align='center'>
                            {selected_from.value}
                        </Text>
                    )}
                </div>
                <Icon className='crypto-transferred-icon' icon='IcArrowDownBold' />
                <div className='crypto-transfer-to'>
                    <div className='crypto-transfer-to-details'>
                        <AccountPlatformIcon account={selected_to} size={32} />
                        <Text as='p' size='s' weight='bold'>
                            <Localize i18n_default_text={selected_to.text} />
                        </Text>
                    </div>
                    {!is_from_derivgo && (
                        <Text as='p' size='s' color='less-prominent' align='center'>
                            {selected_to.value}
                        </Text>
                    )}
                </div>
            </div>
            <div className='account-transfer-receipt__crypto--form-submit'>
                {!is_from_derivgo && (
                    <Button
                        className='account-transfer-receipt__button'
                        has_effect
                        text={localize('View transaction details')}
                        onClick={checkAccount}
                        secondary
                        large
                    />
                )}
                <Button
                    className='account-transfer-receipt__button'
                    has_effect
                    text={is_from_outside_cashier ? localize('Close') : localize('Make a new transfer')}
                    onClick={is_from_outside_cashier ? onClose : resetAccountTransfer}
                    primary
                    large
                />
            </div>
            <Modal
                is_open={is_switch_visible}
                toggleModal={toggleSwitchAlert}
                has_close_icon={isMobileOrTablet()}
                className='account_transfer_switch_modal'
                small
                title={localize(`Switch to ${switch_to.currency} account?`)}
            >
                <Modal.Body>
                    <Localize
                        i18n_default_text='We’re switching over to your {{currency}} account to view the transaction.'
                        values={{ currency: switch_to.currency }}
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        has_effect
                        text={localize('Cancel')}
                        onClick={() => {
                            setShouldSwitchAccount(false);
                            toggleSwitchAlert();
                        }}
                        secondary
                        large
                    />
                    <Button
                        has_effect
                        text={localize(`Switch to ${switch_to.currency} account`)}
                        onClick={switchAndRedirect}
                        primary
                        large
                    />
                </Modal.Footer>
            </Modal>
        </div>
    );
});

export default withRouter(AccountTransferReceipt);

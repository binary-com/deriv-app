import PropTypes from 'prop-types';
import React from 'react';
import { Loading } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { isCryptocurrency, isDesktop } from '@deriv/shared';
import { connect } from 'Stores/connect';
import Withdraw from 'Components/withdraw.jsx';
import SendEmail from 'Components/Email/send-email.jsx';
import Error from 'Components/Error/error.jsx';
import NoBalance from 'Components/Error/no-balance.jsx';
import Virtual from 'Components/Error/virtual.jsx';
import WithdrawalLocked from 'Components/Error/withdrawal-locked.jsx';
import CashierLocked from 'Components/Error/cashier-locked.jsx';
import SideNote from 'Components/side-note.jsx';
import USDTSideNote from 'Components/usdt-side-note.jsx';

const WithdrawalSideNote = () => {
    const notes = [
        <Localize
            i18n_default_text='Do not enter an address linked to an ICO purchase or crowdsale. If you do, the ICO tokens will not be credited into your account.'
            key={0}
        />,
        /*
        <Localize
            i18n_default_text='Each transaction will be confirmed once we receive three confirmations from the blockchain.'
            key={1}
        />,
        <Localize
            i18n_default_text='To view confirmed transactions, kindly visit the <0>statement page</0>'
            key={3}
            components={[<Link to='/reports/statement' key={0} className='link link--orange' />]}
        />,
        */
    ];
    const side_note_title =
        notes?.length > 1 ? <Localize i18n_default_text='Notes' /> : <Localize i18n_default_text='Note' />;

    return <SideNote has_bullets notes={notes} title={side_note_title} />;
};

const Withdrawal = ({
    balance,
    container,
    currency,
    error,
    check10kLimit,
    verify_error,
    iframe_url,
    is_10k_withdrawal_limit_reached,
    is_cashier_locked,
    is_virtual,
    is_withdrawal_locked,
    setActiveTab,
    setErrorMessage,
    setSideNotes,
    verification_code,
}) => {
    React.useEffect(() => {
        setActiveTab(container);
        return () => {
            setErrorMessage('');
        };
    }, [container, setActiveTab, setErrorMessage]);

    React.useEffect(() => {
        check10kLimit();
    }, [check10kLimit]);

    React.useEffect(() => {
        if ((iframe_url || verification_code) && isDesktop()) {
            if (isCryptocurrency(currency) && typeof setSideNotes === 'function') {
                const side_notes = [
                    <WithdrawalSideNote key={0} />,
                    ...(/^(UST)$/i.test(currency) ? [<USDTSideNote type='usdt' key={1} />] : []),
                    ...(/^(eUSDT)$/i.test(currency) ? [<USDTSideNote type='eusdt' key={1} />] : []),
                ];
                setSideNotes(side_notes);
            } else setSideNotes(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currency, iframe_url, verification_code]);

    if (is_10k_withdrawal_limit_reached === undefined) {
        return <Loading is_fullscreen />;
    }
    if (is_10k_withdrawal_limit_reached) {
        return <WithdrawalLocked is_10K_limit />;
    }
    if (verification_code || iframe_url) {
        return <Withdraw />;
    }
    if (is_virtual) {
        return <Virtual />;
    }
    if (!+balance) {
        return <NoBalance />;
    }
    if (is_cashier_locked) {
        return <CashierLocked />;
    }
    if (is_withdrawal_locked) {
        return <WithdrawalLocked />;
    }
    if (error.message) {
        return <Error error={error} container='withdraw' />;
    }
    if (verify_error.message) {
        return <Error error={verify_error} container='withdraw' />;
    }
    return <SendEmail />;
};

Withdrawal.propTypes = {
    balance: PropTypes.string,
    container: PropTypes.string,
    error: PropTypes.object,
    iframe_url: PropTypes.string,
    is_virtual: PropTypes.bool,
    is_cashier_locked: PropTypes.bool,
    is_withdrawal_locked: PropTypes.bool,
    setActiveTab: PropTypes.func,
    verification_code: PropTypes.string,
};

export default connect(({ client, modules }) => ({
    balance: client.balance,
    check10kLimit: modules.cashier.general.check10kLimit,
    container: modules.cashier.general.config.withdraw.container,
    currency: client.currency,
    error: modules.cashier.general.config.withdraw.error,
    iframe_url: modules.cashier.general.config.withdraw.iframe_url,
    is_10k_withdrawal_limit_reached: modules.cashier.general.is_10k_withdrawal_limit_reached,
    is_cashier_locked: modules.cashier.general.is_cashier_locked,
    is_virtual: client.is_virtual,
    is_withdrawal_locked: modules.cashier.general.is_withdrawal_locked,
    verification_code: client.verification_code.payment_withdraw,
    verify_error: modules.cashier.general.config.withdraw.verification.error,
    setActiveTab: modules.cashier.general.setActiveTab,
    setErrorMessage: modules.cashier.general.setErrorMessage,
}))(Withdrawal);

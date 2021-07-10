import PropTypes from 'prop-types';
import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import EmailSent from './email-sent.jsx';

const SendEmail = ({ is_email_sent, is_resend_clicked, resend_timeout, sendVerificationEmail }) => (
    <div className='cashier__wrapper'>
        {is_email_sent ? (
            <EmailSent
                is_email_sent={is_email_sent}
                is_resend_clicked={is_resend_clicked}
                resend_timeout={resend_timeout}
            />
        ) : (
            <React.Fragment>
                <Icon icon='IcCashierAuthenticate' className='withdraw__icon' size={128} />
                <Text weight='bold' as='p' align='center' className='withdraw__header'>
                    <Localize i18n_default_text='We will send you an email to confirm your withdrawal request.' />
                </Text>
                <Text size='xs' as='p' align='center'>
                    <Localize i18n_default_text='This is to protect your account from unauthorised withdrawals.' />
                </Text>
                <Button
                    className='withdraw__verify-button'
                    has_effect
                    text={localize('Verify my request')}
                    onClick={sendVerificationEmail}
                    primary
                    large
                />
            </React.Fragment>
        )}
    </div>
);

SendEmail.propTypes = {
    is_email_sent: PropTypes.bool,
    is_resend_clicked: PropTypes.bool,
    resend_timeout: PropTypes.number,
    sendVerificationEmail: PropTypes.func,
};

export default connect(({ modules }) => ({
    is_email_sent: modules.cashier.general.config.withdraw.verification.is_email_sent,
    is_resend_clicked: modules.cashier.general.config.withdraw.verification.is_resend_clicked,
    resend_timeout: modules.cashier.general.config.withdraw.verification.resend_timeout,
    sendVerificationEmail: modules.cashier.general.sendVerificationEmail,
}))(SendEmail);

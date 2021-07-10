import PropTypes from 'prop-types';
import React from 'react';
import { Button, Icon, Text } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

const EmailSent = ({ is_resend_clicked, resend_timeout, resendVerificationEmail, setVerificationResendClicked }) => (
    <div className='withdraw__email-sent'>
        <Icon icon='IcEmailSent' className='withdraw__icon' size={128} />
        <Text as='p' weight='bold' align='center' className='withdraw__email-sent-title'>
            <Localize i18n_default_text={"We've sent you an email."} />
        </Text>
        <Text as='p' size='xs' line_height='s' align='center' className='withdraw__email-sent'>
            <Localize i18n_default_text='Please check your email for the verification link to complete the process.' />
        </Text>
        <div className='withdraw__email-resend'>
            {is_resend_clicked ? (
                <React.Fragment>
                    <Text as='p' align='center' weight='bold' size='xs' className='withdraw__email-sent-title'>
                        <Localize i18n_default_text={"Didn't receive the email?"} />
                    </Text>
                    <Text as='p' align='center' size='xs' line_height='s' className='withdraw__email-sent'>
                        <Localize
                            i18n_default_text={
                                "Check your spam or junk folder. If it's not there, try resending the email."
                            }
                        />
                    </Text>
                    <Button
                        className='withdraw__resend-button'
                        classNameSpan='withdraw__resend-button-text'
                        is_disabled={resend_timeout < 60}
                        has_effect
                        text={
                            resend_timeout < 60
                                ? localize('Resend email in {{seconds}}s', {
                                      seconds: resend_timeout,
                                  })
                                : localize('Resend email')
                        }
                        onClick={resendVerificationEmail}
                        primary
                        large
                    />
                </React.Fragment>
            ) : (
                <Button
                    className='withdraw__email-resend-text'
                    text={localize("Didn't receive the email?")}
                    onClick={() => setVerificationResendClicked(true)}
                    tertiary
                />
            )}
        </div>
    </div>
);

EmailSent.propTypes = {
    is_resend_clicked: PropTypes.bool,
    resend_timeout: PropTypes.number,
    resendVerificationEmail: PropTypes.func,
    setVerificationResendClicked: PropTypes.func,
};

export default connect(({ modules }) => ({
    resendVerificationEmail: modules.cashier.general.resendVerificationEmail,
    sendVerificationEmail: modules.cashier.general.sendVerificationEmail,
    setVerificationResendClicked: modules.cashier.general.setVerificationResendClicked,
}))(EmailSent);

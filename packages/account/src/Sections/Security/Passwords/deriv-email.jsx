import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { Button, Text, Input } from '@deriv/components';
import { WS, toTitleCase } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import FormSubHeader from 'Components/form-sub-header';
import SentEmailModal from 'Components/sent-email-modal';
import UnlinkAccountModal from 'Components/unlink-account-modal';

const DerivEmail = ({ email, social_identity_provider }) => {
    const [is_unlink_account_modal_open, setIsUnlinkAccountModalOpen] = React.useState(false);
    const [is_send_email_modal_open, setIsSendEmaliMldalOpen] = React.useState(false);

    const onClickChangeEmail = () => {
        setIsUnlinkAccountModalOpen(true);
    };

    const onClickSendEmail = () => {
        WS.verifyEmail(email, 'request_email');
        setIsUnlinkAccountModalOpen(false);
        setIsSendEmaliMldalOpen(true);
    };

    const onClickResendEmail = () => {
        WS.verifyEmail(email, 'request_email');
        setIsUnlinkAccountModalOpen(false);
    };

    return (
        <React.Fragment>
            <FormSubHeader title={localize('Email address')} />
            <div className='account__email-wrapper'>
                <React.Fragment>
                    <Text as='p' className='email-platform__desc' color='prominent' size='xs' weight='lighter'>
                        <Localize i18n_default_text='This is the email address associated with your Deriv account.' />
                    </Text>
                </React.Fragment>
                <div className='email-platform__content'>
                    <Formik>
                        <fieldset className='email-platform__content__fieldset'>
                            <Input
                                className='email-input'
                                data-lpignore='true'
                                type='text'
                                name='email'
                                id={'email'}
                                label={localize('Email address*')}
                                value={email}
                                disabled={true}
                            />
                        </fieldset>
                    </Formik>
                    <Button
                        className='email-change_button'
                        type='submit'
                        onClick={onClickChangeEmail}
                        has_effect
                        is_disabled={false}
                        is_loading={false}
                        text={localize('Change email')}
                        large
                        primary
                    />
                </div>
                <UnlinkAccountModal
                    is_open={is_unlink_account_modal_open}
                    onClose={() => setIsUnlinkAccountModalOpen(false)}
                    identifier_title={toTitleCase(social_identity_provider)}
                    onClickSendEmail={onClickSendEmail}
                />
                <SentEmailModal
                    is_open={is_send_email_modal_open}
                    onClose={() => setIsSendEmaliMldalOpen(false)}
                    identifier_title={'Change_Email'}
                    onClickSendEmail={onClickResendEmail}
                    has_live_chat={true}
                />
            </div>
        </React.Fragment>
    );
};

DerivEmail.propTypes = {
    email: PropTypes.string,
    is_dark_mode_on: PropTypes.bool,
    is_social_signup: PropTypes.bool,
    social_identity_provider: PropTypes.string,
};

export default DerivEmail;

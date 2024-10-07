import React from 'react';
import { Button, Modal, Text, Icon, Loading } from '@deriv/components';
import { localize, Localize, getLanguage } from '@deriv/translations';
import { redirectToLogin, removeActionParam } from '@deriv/shared';
import { WS } from 'Services';
import { observer, useStore } from '@deriv/stores';

const UpdateEmailModal = observer(() => {
    const { ui, client } = useStore();
    const { logout: logoutClient, is_logged_in } = client;
    const { is_update_email_modal_visible: is_visible, toggleUpdateEmailModal } = ui;
    const new_email = client.new_email.system_email_change;
    const verification_code = client.verification_code.system_email_change;

    const [is_email_updated, setIsEmailUpdated] = React.useState(false);
    const [update_email_error, setUpdateEmailMessage] = React.useState(null);

    const onClickButton = () => {
        toggleUpdateEmailModal(false);
        removeActionParam('system_email_change');
        if (is_logged_in) {
            logoutClient().then(() => {
                redirectToLogin(false, getLanguage(), false);
            });
        } else {
            redirectToLogin(false, getLanguage(), false);
        }
    };

    const api_request = {
        change_email: 'update',
        new_email,
        verification_code,
    };

    const sendUpdateEmail = () => {
        WS.changeEmail(api_request).then(response => {
            setIsEmailUpdated(true);
            if (response.error) {
                setUpdateEmailMessage(response.error.message);
                logoutClient();
            }
        });
    };

    React.useEffect(() => {
        if (is_logged_in) {
            WS.wait('authorize').then(() => {
                sendUpdateEmail();
            });
            return;
        }
        sendUpdateEmail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Modal
            is_open={is_visible}
            has_close_icon={false}
            toggleModal={toggleUpdateEmailModal}
            width='440px'
            minHeight='400px'
        >
            {is_email_updated ? (
                <div className='change-email-update'>
                    {!update_email_error && (
                        <Icon className='change-email-update__modal-icon' icon={'IcEmailVerified'} size={128} />
                    )}
                    <Text className='change-email-update__modal-title' weight='bold' size='s'>
                        {update_email_error ? (
                            <Localize i18n_default_text='Failed' />
                        ) : (
                            <Localize i18n_default_text='Success!' />
                        )}
                    </Text>
                    <Text className='change-email-update__modal-description' size='xs'>
                        {update_email_error ?? (
                            <Localize
                                i18n_default_text='Your email address has changed.<0/>Now, log in with your new email address.'
                                components={[<br key={0} />]}
                            />
                        )}
                    </Text>
                    <Modal.Footer className='change-email-update__footer'>
                        <Button onClick={onClickButton} has_effect text={localize('Log in')} primary large />
                    </Modal.Footer>
                </div>
            ) : (
                <Loading is_fullscreen={false} />
            )}
        </Modal>
    );
});

export default UpdateEmailModal;

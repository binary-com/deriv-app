import React from 'react';
import { localize } from '@deriv/translations';
import { Modal, FormSubmitButton, Text } from '@deriv/components';
import { routes, isNavigationFromExternalPlatform } from '@deriv/shared';
import { Analytics } from '@deriv-com/analytics';
import { useStore } from '@deriv/stores';

const WarningMessageModal = ({
    is_closing_create_real_account_modal,
    setIsClosingCreateRealAccountModal,
    closeRealAccountSignup,
    routing_history,
    real_account_signup_target,
}) => {
    const { client } = useStore();
    const { setRealAccountSignupFormData, setRealAccountSignupFormStep } = client;

    const closeModal = () => {
        real_account_signup_target !== 'maltainvest' &&
            Analytics.trackEvent('ce_real_account_signup_form', {
                action: 'close',
                form_source: document.referrer,
                form_name: 'real_account_signup_form',
            });

        setIsClosingCreateRealAccountModal(false);

        closeRealAccountSignup();

        // clear the store
        setRealAccountSignupFormData([]);
        setRealAccountSignupFormStep(0);

        if (isNavigationFromExternalPlatform(routing_history, routes.smarttrader)) {
            window.location = routes.smarttrader;
        }

        if (isNavigationFromExternalPlatform(routing_history, routes.binarybot)) {
            window.location = routes.binarybot;
        }
    };

    return (
        <Modal
            id='close_real_acc_modal'
            portalId='modal_root_absolute'
            is_open={is_closing_create_real_account_modal}
            has_close_icon={false}
        >
            <div className='close-real-acc-modal'>
                <Text line_height='x' weight='bold' className='close-real-acc-modal__warning-message'>
                    {localize('Stop creating an account?')}
                </Text>
                <div className='close-real-acc-modal__content-wrapper'>
                    <Text size='xs' as='p' align='left' className='close-real-acc-modal__content'>
                        {localize('If you hit Yes, the info you entered will be lost.')}
                    </Text>
                </div>
                <FormSubmitButton
                    is_disabled={false}
                    label={localize('No')}
                    className='close-real-acc-modal__close-account-button'
                    has_cancel
                    cancel_label={localize('Yes')}
                    onClick={() => setIsClosingCreateRealAccountModal(false)}
                    onCancel={closeModal}
                />
            </div>
        </Modal>
    );
};

export default WarningMessageModal;

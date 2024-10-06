import { useEffect } from 'react';
import { usePhoneVerificationAnalytics } from '@deriv/hooks';
import { Modal, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import { observer, useStore } from '@deriv/stores';
import { useHistory } from 'react-router-dom';
import { routes } from '@deriv/shared';

type TPhoneNumberVerifiedModal = {
    should_show_phone_number_verified_modal: boolean;
};

const PhoneNumberVerifiedModal = observer(({ should_show_phone_number_verified_modal }: TPhoneNumberVerifiedModal) => {
    const history = useHistory();
    const previous_route = localStorage.getItem('routes_from_notification_to_pnv');
    const should_route_back_to_previous =
        !!previous_route &&
        (previous_route !== routes.personal_details || previous_route !== routes.phone_verification);

    const handleDoneButton = () => {
        localStorage.removeItem('routes_from_notification_to_pnv');

        should_route_back_to_previous ? history.push(previous_route) : history.push(routes.traders_hub);
    };

    const { isMobile } = useDevice();
    const {
        ui,
        client: {
            account_settings: { phone },
        },
    } = useStore();
    const { setIsPhoneVerificationCompleted } = ui;
    const { trackPhoneVerificationEvents } = usePhoneVerificationAnalytics();

    useEffect(() => {
        if (should_show_phone_number_verified_modal) {
            trackPhoneVerificationEvents({
                action: 'open',
                subform_name: 'verification_successful',
            });
            setIsPhoneVerificationCompleted(true);
        }
    }, [should_show_phone_number_verified_modal, trackPhoneVerificationEvents]);

    return (
        <Modal
            isMobile={isMobile}
            isOpened={should_show_phone_number_verified_modal}
            showHandleBar={false}
            showCrossIcon={false}
            isNonExpandable
            buttonColor='coral'
            primaryButtonCallback={handleDoneButton}
            primaryButtonLabel={<Localize i18n_default_text='OK' />}
            disableCloseOnOverlay
        >
            <Modal.Header title={<Localize i18n_default_text='Phone number verified' />} />
            <Modal.Body>
                <div className='phone-verification__verified-modal--contents'>
                    <Text>
                        <Localize
                            i18n_default_text='{{ phone }} is verified as your phone number.'
                            values={{ phone }}
                        />
                    </Text>
                </div>
            </Modal.Body>
        </Modal>
    );
});

export default PhoneNumberVerifiedModal;

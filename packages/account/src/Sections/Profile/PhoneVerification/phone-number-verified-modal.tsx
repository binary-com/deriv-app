import React from 'react';
import { useHistory } from 'react-router';
import { Modal, Text } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { LabelPairedBadgeCheckLgRegularIcon } from '@deriv/quill-icons';

type TPhoneNumberVerifiedModal = {
    should_show_phone_number_verified_modal: boolean;
    setShouldShowPhoneNumberVerifiedModal: (value: boolean) => void;
};

const PhoneNumberVerifiedModal = observer(
    ({ should_show_phone_number_verified_modal, setShouldShowPhoneNumberVerifiedModal }: TPhoneNumberVerifiedModal) => {
        const history = useHistory();
        const handleDoneButton = () => {
            setShouldShowPhoneNumberVerifiedModal(false);
            history.push(routes.personal_details);
        };
        const { ui } = useStore();
        const { is_mobile } = ui;

        return (
            <Modal
                isMobile={is_mobile}
                showHandleBar
                isOpened={should_show_phone_number_verified_modal}
                primaryButtonCallback={handleDoneButton}
                primaryButtonLabel={<Localize i18n_default_text='Done' />}
                disableCloseOnOverlay
            >
                <Modal.Header
                    className='phone-verification__verified-modal--header'
                    image={<LabelPairedBadgeCheckLgRegularIcon fill='#007A22' height={96} width={96} />}
                />
                <Modal.Body>
                    <div className='phone-verification__verified-modal--contents'>
                        <Text bold>
                            <Localize i18n_default_text='Verification successful' />
                        </Text>
                        <Text>
                            <Localize i18n_default_text="That's it! Your number is verified." />
                        </Text>
                    </div>
                </Modal.Body>
            </Modal>
        );
    }
);

export default PhoneNumberVerifiedModal;

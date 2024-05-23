import React from 'react';
import { Button, Checkbox, Modal, Text } from '@deriv/components';
import { localize, Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { api_error_codes } from 'Constants/api-error-codes';
import { useStores } from 'Stores';

type TAdCreatedModalProps = {
    adverts_archive_period: number;
};

const AdCreatedModal = ({ adverts_archive_period }: TAdCreatedModalProps) => {
    const { hideModal, is_modal_open } = useModalManagerContext();
    const { general_store, my_ads_store } = useStores();
    const should_not_show_auto_archive_message_again = React.useRef(false);

    const onCheckboxChange = () =>
        (should_not_show_auto_archive_message_again.current = !should_not_show_auto_archive_message_again.current);

    const onClickOkCreatedAd = () => {
        localStorage.setItem(
            'should_not_show_auto_archive_message',
            JSON.stringify(should_not_show_auto_archive_message_again.current)
        );
        my_ads_store.setIsAdCreatedModalVisible(false);
        if (my_ads_store.advert_details?.visibility_status?.includes(api_error_codes.AD_EXCEEDS_BALANCE)) {
            general_store.showModal({
                key: 'AdVisibilityErrorModal',
                props: { error_code: api_error_codes.AD_EXCEEDS_BALANCE },
            });
        } else if (my_ads_store.advert_details?.visibility_status?.includes(api_error_codes.AD_EXCEEDS_DAILY_LIMIT)) {
            general_store.showModal({
                key: 'AdVisibilityErrorModal',
                props: { error_code: api_error_codes.AD_EXCEEDS_DAILY_LIMIT },
            });
        }

        my_ads_store.setShowAdForm(false);
        hideModal({ should_hide_all_modals: true });
    };

    return (
        <Modal
            className='my-ads__ad-created'
            has_close_icon={false}
            is_open={is_modal_open}
            small
            title={localize("You've created an ad")}
            toggleModal={hideModal}
        >
            <Modal.Body>
                <Text as='p' size='xs' color='prominent'>
                    <Localize
                        i18n_default_text="If the ad doesn't receive an order for {{adverts_archive_period}} days, it will be deactivated."
                        values={{ adverts_archive_period }}
                    />
                </Text>
                <br />
                <Checkbox
                    label={localize('Don’t show this message again.')}
                    onChange={onCheckboxChange}
                    value={should_not_show_auto_archive_message_again.current}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button has_effect text={localize('OK')} onClick={onClickOkCreatedAd} primary large />
            </Modal.Footer>
        </Modal>
    );
};

export default AdCreatedModal;

import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { ads } from 'Constants/ads';
import { api_error_codes } from 'Constants/api-error-codes';
import { useStores } from 'Stores';
import { generateErrorDialogBody, generateErrorDialogTitle } from 'Utils/adverts';

type TAdCreateEditErrorModalProps = {
    ad_type?: string;
};

const AdCreateEditErrorModal = ({ ad_type = ads.CREATE }: TAdCreateEditErrorModalProps) => {
    const { my_ads_store } = useStores();
    const { hideModal, is_modal_open } = useModalManagerContext();
    const { api_error_message, edit_ad_form_error, error_code } = my_ads_store;

    const error_message = ad_type === ads.CREATE ? api_error_message : edit_ad_form_error;

    const is_api_error = [api_error_codes.ADVERT_SAME_LIMITS, api_error_codes.DUPLICATE_ADVERT].includes(error_code);

    return (
        <Modal
            className='create-ad-error-modal'
            is_open={is_modal_open}
            small
            has_close_icon={false}
            title={generateErrorDialogTitle(error_code)}
        >
            <Modal.Body>
                <Text as='p' color='prominent' size='xs'>
                    {generateErrorDialogBody(error_code, error_message)}
                </Text>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    has_effect
                    text={is_api_error ? localize('Update ad') : localize('Ok')}
                    onClick={is_api_error ? hideModal : () => hideModal({ should_hide_all_modals: true })}
                    primary
                    large
                />
            </Modal.Footer>
        </Modal>
    );
};

export default observer(AdCreateEditErrorModal);

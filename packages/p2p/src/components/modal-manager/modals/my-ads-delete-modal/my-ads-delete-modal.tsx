import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { observer } from '@deriv/stores';
import { useDevice } from '@deriv-com/ui';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';
import { requestWS } from 'Utils/websocket';

const MyAdsDeleteModal = () => {
    const { my_ads_store } = useStores();
    const { hideModal, is_modal_open, showModal } = useModalManagerContext();
    const { isDesktop } = useDevice();

    const onClickCancel = () => {
        my_ads_store.setDeleteErrorMessage('');
        my_ads_store.setSelectedAdId('');
        hideModal();
    };

    const onClickConfirm = () => {
        hideModal();
        // TODO: Move this API call out of the modal and update the test file
        requestWS({ p2p_advert_update: 1, id: my_ads_store.selected_ad_id, delete: 1 }).then(response => {
            if (response.error) {
                my_ads_store.setDeleteErrorMessage(response.error.message);
                showModal({ key: 'MyAdsDeleteErrorModal', props: {} });
            } else {
                // TODO: Fix typings for adverts in store or move it out from store
                // remove the deleted ad from the list of items
                const updated_items = my_ads_store.adverts.filter(ad => ad.id !== response.p2p_advert_update?.id);
                my_ads_store.setAdverts(updated_items);
            }
        });
    };

    return (
        <React.Fragment>
            <Modal
                className='my-ads-delete-modal'
                is_open={is_modal_open}
                toggleModal={onClickCancel}
                has_close_icon
                renderTitle={() => (
                    <Text color='prominent' size={isDesktop ? 's' : 'xs'} weight='bold'>
                        <Localize i18n_default_text='Do you want to delete this ad?' />
                    </Text>
                )}
                width='440px'
            >
                <Modal.Body>
                    <Localize i18n_default_text='You will NOT be able to restore it.' />
                </Modal.Body>
                <Modal.Footer>
                    <Button.Group>
                        <Button secondary type='button' onClick={onClickCancel} large>
                            <Localize i18n_default_text='Cancel' />
                        </Button>
                        <Button primary large onClick={onClickConfirm}>
                            <Localize i18n_default_text='Delete' />
                        </Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default observer(MyAdsDeleteModal);

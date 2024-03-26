import React from 'react';
import { Button, Modal } from '@deriv/components';
import { observer } from '@deriv/stores';
import { Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { ad_type } from 'Constants/floating-rate';
import { useStores } from 'Stores';

const MyAdsFloatingRateSwitchModal = () => {
    const { floating_rate_store, my_ads_store } = useStores();
    const { hideModal, is_modal_open } = useModalManagerContext();
    const { fixed_rate_adverts_end_date, rate_type, reached_target_date } = floating_rate_store;
    const { selected_ad_type, toggleMyAdsRateSwitchModal } = my_ads_store;
    const has_reached_target_date = reached_target_date && fixed_rate_adverts_end_date !== null;

    return (
        <Modal is_open={is_modal_open} toggleModal={hideModal} small className='my-ads-floating-rate-switch-modal'>
            <Modal.Body>
                {rate_type === ad_type.FLOAT ? (
                    <Localize i18n_default_text='Set a floating rate for your ad.' />
                ) : (
                    <Localize i18n_default_text='Set a fixed rate for your ad.' />
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button.Group>
                    <Button
                        secondary
                        type='button'
                        onClick={() => toggleMyAdsRateSwitchModal(selected_ad_type, has_reached_target_date)}
                        large
                    >
                        {has_reached_target_date ? (
                            <Localize i18n_default_text='Cancel' />
                        ) : (
                            <Localize i18n_default_text="I'll do this later" />
                        )}
                    </Button>
                    <Button primary large onClick={() => toggleMyAdsRateSwitchModal(rate_type, true)}>
                        {rate_type === ad_type.FLOAT ? (
                            <Localize i18n_default_text='Set floating rate' />
                        ) : (
                            <Localize i18n_default_text='Set fixed rate' />
                        )}
                    </Button>
                </Button.Group>
            </Modal.Footer>
        </Modal>
    );
};

export default observer(MyAdsFloatingRateSwitchModal);

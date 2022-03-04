import { Modal } from '@deriv/components';
import React from 'react';

const MyAdsFloatingRateSwitchModal = () => {
    const { my_ads_store } = useStores();

    const onClickDoLater = () => {
        my_ads_store.setIsSwitchModalOpen(false, null);
        my_ads_store.setShouldSwitchAdRate(false);
    };

    const onClickSetFloatingRate = () => {
        my_ads_store.setShouldSwitchAdRate(true);
    };

    return (
        <React.Fragment>
            <Modal is_open={my_ads_store.is_switch_modal_open} toggleModal={onClickDoLater} width='440px'>
                <Modal.Body>
                    <Localize i18n_default_text='Set a floating rate for your ad.' />
                </Modal.Body>
                <Modal.Footer>
                    <Button.Group>
                        <Button secondary type='button' onClick={onClickDoLater} large>
                            <Localize i18n_default_text="I'll do this later" />
                        </Button>
                        <Button primary large onClick={onClickSetFloatingRate}>
                            <Localize i18n_default_text='Set floating rate' />
                        </Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default observer(MyAdsFloatingRateSwitchModal);

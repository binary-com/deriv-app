import React from 'react';
import { observer } from 'mobx-react-lite';
import { Button, Modal } from '@deriv/components';
import { Localize } from 'Components/i18next';
import { ad_type } from 'Constants/floating-rate';
import { useStores } from 'Stores';

const MyAdsFloatingRateSwitchModal = () => {
    const { floating_rate_store, my_ads_store } = useStores();

    const onClickDoLater = () => {
        my_ads_store.setIsSwitchModalOpen(false);
        my_ads_store.setShouldSwitchAdRate(false);
    };

    const onClickSetFloatingRate = () => {
        my_ads_store.setShouldSwitchAdRate(true);
    };

    return (
        <React.Fragment>
            <Modal is_open={my_ads_store.is_switch_modal_open} toggleModal={onClickDoLater} width='440px'>
                <Modal.Body>
                    {floating_rate_store.rate_type === ad_type.FLOAT ? (
                        <Localize i18n_default_text='Set a floating rate for your ad.' />
                    ) : (
                        <Localize i18n_default_text='Set a fixed rate for your ad.' />
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button.Group>
                        <Button secondary type='button' onClick={onClickDoLater} large>
                            <Localize i18n_default_text="I'll do this later" />
                        </Button>
                        <Button primary large onClick={onClickSetFloatingRate}>
                            {floating_rate_store.rate_type === ad_type.FLOAT ? (
                                <Localize i18n_default_text='Set floating rate' />
                            ) : (
                                <Localize i18n_default_text='Set fixed rate' />
                            )}
                        </Button>
                    </Button.Group>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default observer(MyAdsFloatingRateSwitchModal);

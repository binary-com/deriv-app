import React from 'react';
import { Modal, Button, StaticUrl, Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import { WS } from '@deriv/shared';
import { useDevice } from '@deriv-com/ui';
import './tnc-status-update-modal.scss';

const TncStatusUpdateModal = observer(() => {
    const { client, ui } = useStore();
    const { is_cr_account } = client;
    const { is_tnc_update_modal_open, toggleTncUpdateModal } = ui;
    const { isDesktop } = useDevice();

    const onClick = async () => {
        await WS.tncApproval();
        WS.getSettings();
        toggleTncUpdateModal(false);
    };

    return (
        <Modal
            className='tnc-status-update-modal-wrapper'
            is_open={is_tnc_update_modal_open}
            has_close_icon={false}
            width='44rem'
        >
            <div className='tnc-status-update-modal'>
                <Text size={isDesktop ? 's' : 'xs'} weight='bold'>
                    <Localize i18n_default_text="Updated T&C's" />
                </Text>
                <div className='tnc-status-update-modal__text-container'>
                    <Text size={isDesktop ? 'xs' : 'xxs'}>
                        <Localize
                            i18n_default_text='Please review our updated <0>terms and conditions</0>.'
                            components={[
                                <StaticUrl
                                    key={0}
                                    className='link'
                                    href='terms-and-conditions'
                                    is_eu_url={!is_cr_account}
                                />,
                            ]}
                        />
                    </Text>
                    <Text size={isDesktop ? 'xs' : 'xxs'}>
                        <Localize i18n_default_text='By continuing you understand and accept the changes.' />
                    </Text>
                </div>
                <div className='tnc-status-update-modal__button'>
                    <Button className='dc-dialog__button' has_effect onClick={onClick} primary large>
                        <Localize i18n_default_text='Continue' />
                    </Button>
                </div>
            </div>
        </Modal>
    );
});

export default TncStatusUpdateModal;

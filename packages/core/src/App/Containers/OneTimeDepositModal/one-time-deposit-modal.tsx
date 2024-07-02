import React from 'react';
import { useDevice } from '@deriv-com/ui';
import { MobileFullPageModal, Modal, Text } from '@deriv/components';
import { useHasMFAccountDeposited } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import DepositFiatIframe from '@deriv/cashier/src/modules/deposit-fiat/components/deposit-fiat-iframe/deposit-fiat-iframe';
import useLiveChat from 'App/Components/Elements/LiveChat/use-livechat';

const OneTimeDepositModal = observer(() => {
    const { isDesktop } = useDevice();
    const { client, ui } = useStore();
    const { loginid } = client;
    const { should_show_one_time_deposit_modal, setShouldShowOneTimeDepositModal, toggleAccountSuccessModal } = ui;
    const liveChat = useLiveChat(false, loginid);
    const { has_mf_account_deposited } = useHasMFAccountDeposited();

    React.useEffect(() => {
        if (has_mf_account_deposited) {
            onCloseModal();
        }
    }, [has_mf_account_deposited]);

    const onLiveChatClick = () => {
        liveChat.widget?.call('maximize');
    };

    const onCloseModal = () => {
        setShouldShowOneTimeDepositModal(false);
        toggleAccountSuccessModal();
    };

    const getModalContent = () => (
        <div className='one-time-deposit-modal__content'>
            <div className='one-time-deposit-modal__title'>
                <Text as='h1' size={!isDesktop ? 'm' : 'l'} weight='bold'>
                    <Localize i18n_default_text='Deposit' />
                </Text>
                <Text size={!isDesktop ? 'xs' : 's'} align='center'>
                    <Localize
                        i18n_default_text='Select a payment method to make a deposit into your account.<0 />Need help? Contact us via <1>live chat</1>'
                        components={[
                            <br key={0} />,
                            <Text
                                key={1}
                                className='one-time-deposit-modal__livechat'
                                size={!isDesktop ? 'xs' : 's'}
                                color='loss-danger'
                                onClick={onLiveChatClick}
                                data-testid='dt_live_chat'
                            />,
                        ]}
                    />
                </Text>
            </div>
            <DepositFiatIframe />
        </div>
    );

    return (
        <React.Fragment>
            {isDesktop ? (
                <Modal
                    className='one-time-deposit-modal'
                    is_open={should_show_one_time_deposit_modal}
                    title=' '
                    toggleModal={onCloseModal}
                    height='auto'
                    has_close_icon
                >
                    <Modal.Body className='one-time-deposit-modal__body'>{getModalContent()}</Modal.Body>
                </Modal>
            ) : (
                <MobileFullPageModal
                    className='one-time-deposit-modal'
                    body_className='one-time-deposit-modal__body'
                    header=' '
                    height_offset='80px'
                    is_modal_open={should_show_one_time_deposit_modal}
                    onClickClose={onCloseModal}
                >
                    {getModalContent()}
                </MobileFullPageModal>
            )}
        </React.Fragment>
    );
});

export default OneTimeDepositModal;

import React from 'react';
import {
    Button,
    DesktopWrapper,
    Icon,
    InlineMessage,
    MobileFullPageModal,
    MobileOrTabletWrapper,
    Modal,
    Text,
} from '@deriv/components';
import { useHasMFAccountDeposited } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import DepositFiatIframe from '@deriv/cashier/src/modules/deposit-fiat/components/deposit-fiat-iframe/deposit-fiat-iframe';
import useLiveChat from 'App/Components/Elements/LiveChat/use-livechat';

const OneTimeDepositModal = observer(() => {
    const { client, ui } = useStore();
    const { loginid } = client;
    const {
        is_mobile_or_tablet,
        should_show_one_time_deposit_modal,
        setShouldShowOneTimeDepositModal,
        toggleAccountSuccessModal,
    } = ui;
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
                <Text as='h1' size={is_mobile_or_tablet ? 'm' : 'l'} weight='bold'>
                    <Localize i18n_default_text='Deposit' />
                </Text>
                <Text as='p' size={is_mobile_or_tablet ? 'xs' : 's'} align='center'>
                    <Localize i18n_default_text='Account created. Select payment method for deposit.' />
                </Text>
            </div>
            <div className='one-time-deposit-modal__description'>
                <InlineMessage
                    type='information'
                    size='sm'
                    message={
                        <Localize i18n_default_text='We don’t charge deposit fees! Once your account is verified, you will be able to trade, make additional deposits, or withdraw funds.' />
                    }
                />
                <Button
                    className='one-time-deposit-modal__description--livechat'
                    data-testid='dt_live_chat'
                    onClick={onLiveChatClick}
                    transparent
                    type='button'
                >
                    <Icon
                        color='red'
                        icon='IcLiveChat'
                        className='one-time-deposit-modal__description--livechat-icon'
                    />
                    <Text color='loss-danger' size='xs' weight='bold'>
                        <Localize i18n_default_text='Live Chat' />
                    </Text>
                </Button>
            </div>
            <DepositFiatIframe />
        </div>
    );

    return (
        <React.Fragment>
            <DesktopWrapper>
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
            </DesktopWrapper>
            <MobileOrTabletWrapper>
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
            </MobileOrTabletWrapper>
        </React.Fragment>
    );
});

export default OneTimeDepositModal;

import React from 'react';
import { observer } from 'mobx-react-lite';
import { localize, Localize } from '@deriv/translations';
import { Modal, Text, Wizard } from '@deriv/components';
import { useStores } from 'Stores';
import { TStepProps } from './types';
import QuickGuideFooter from './quick-guide-footer';

const StepOne: React.FC<TStepProps> = props => {
    return (
        <div className='dw-guide-step__container'>
            <div>
                <Text size='xxs' weight='bold'>
                    <Localize
                        i18n_default_text='Your favourite payment methods<0/>are now Wallets. Deposit and<1/>withdraw with your Wallets.'
                        components={[<br key={0} />, <br key={1} />]}
                    />
                </Text>
                <Text size='xxs' weight='bold'>
                    <Localize
                        i18n_default_text='Transfer funds to your trading<0/>accounts, which are now Apps'
                        components={[<br key={0} />]}
                    />
                </Text>
                <Text size='xxs' weight='bold'>
                    <Localize
                        i18n_default_text='Link an App to a Wallet<0/>for fast fund transfers<1/>for trading'
                        components={[<br key={0} />, <br key={1} />]}
                    />
                </Text>
            </div>
            <div className='dw-guide-step__img-wrapper'>
                <img className='dw-guide-step__img' src={`${props.config_store.asset_path}/images/onboarding-1.svg`} />
            </div>
            <QuickGuideFooter {...props} />
        </div>
    );
};

const StepTwo: React.FC<TStepProps> = props => {
    return (
        <div className='dw-guide-step__wrapper'>
            <div>
                <Text size='1.6rem'>Customized Contents {props.getCurrentStep()}</Text>
            </div>
            <QuickGuideFooter {...props} />
        </div>
    );
};

const StepThree: React.FC<TStepProps> = props => {
    return (
        <div className='dw-guide-step__wrapper'>
            <div>
                <Text size='1.6rem'>Customized Contents {props.getCurrentStep()}</Text>
            </div>
            <QuickGuideFooter {...props} />
        </div>
    );
};

const QuickGuideModal: React.FC = () => {
    const { config_store, ui_store } = useStores();

    const closeModal = () => {
        ui_store.toggleQuickGuideModal();
    };

    return (
        <Modal
            is_open={ui_store.is_quick_guide_modal_open}
            toggleModal={closeModal}
            has_close_icon
            title={localize('Quick guide to the new My Apps Beta!')}
            height='608px'
            width='776px'
        >
            <Modal.Body className='dw-quick-guide-modal__body'>
                <Wizard>
                    <StepOne config_store={config_store} closeModal={closeModal} />
                    <StepTwo closeModal={closeModal} />
                    <StepThree closeModal={closeModal} />
                </Wizard>
            </Modal.Body>
        </Modal>
    );
};

export default observer(QuickGuideModal);

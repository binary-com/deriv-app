import React from 'react';
import { Button, Modal, Text } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { localize, Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';
import './market-rate-change-error-modal.scss';

type TMarketRateChangeErrorModal = {
    submitForm: () => void;
    values: {
        currency: string;
        input_amount: string;
        local_currency: string;
        received_amount: number;
    };
};

const MarketRateChangeErrorModal = ({ submitForm, values }: TMarketRateChangeErrorModal) => {
    const { is_modal_open, hideModal } = useModalManagerContext();
    const { buy_sell_store } = useStores();
    const {
        ui: { is_desktop, is_mobile },
    } = useStore();

    React.useEffect(() => {
        buy_sell_store.form_props.setIsMarketRateErrorModalOpen(true);
    }, []);

    return (
        <Modal
            className='market-rate-change-error-modal'
            has_close_icon={false}
            is_open={is_modal_open}
            small
            title={
                <Text weight='bold'>
                    <Localize i18n_default_text='Attention: Rate fluctuation' />
                </Text>
            }
        >
            <Modal.Body className='market-rate-change-error-modal__body'>
                <div className='market-rate-change-error-modal__message'>
                    <Text as='p' size='xs' line_height='s'>
                        <Localize
                            i18n_default_text='You are creating an order to buy <0>{{currency}} {{input_amount}}</0> for <1>{{local_currency}} {{received_amount}}</1>.'
                            components={[
                                <Text key={0} size='xs' weight='bold' />,
                                <Text key={1} size='xs' weight='bold' />,
                            ]}
                            values={values}
                        />
                    </Text>
                    <Text as='p' size='xs' line_height='s'>
                        <Localize i18n_default_text='The exchange rate may vary slightly due to market fluctuations. The final rate will be shown when you proceed with your order.' />
                    </Text>
                    <Text as='p' size='xxs' line_height='xs'>
                        <Localize i18n_default_text='If the rate changes significantly, we may not be able to create your order.' />
                    </Text>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button.Group>
                    <Button
                        onClick={() => {
                            hideModal();
                            buy_sell_store.form_props.setIsMarketRateErrorModalOpen(false);
                            if (is_desktop) {
                                buy_sell_store.setTempContactInfo(null);
                                buy_sell_store.setTempPaymentInfo(null);
                                buy_sell_store.payment_method_ids = [];
                            }
                        }}
                        text={localize('Cancel')}
                        secondary
                        large
                    />
                    <Button
                        className='market-rate-change-error-modal__continue'
                        onClick={() => {
                            if (is_mobile) hideModal();
                            submitForm();
                        }}
                        text={localize('Continue with order')}
                        primary
                        large
                    />
                </Button.Group>
            </Modal.Footer>
        </Modal>
    );
};

export default MarketRateChangeErrorModal;

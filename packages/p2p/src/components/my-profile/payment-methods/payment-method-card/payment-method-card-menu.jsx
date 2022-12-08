import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from 'Components/i18next';
import { useStore } from '@deriv/stores';

const PaymentMethodCardMenu = ({ payment_method }) => {
    const {
        modules: { p2p_store },
    } = useStore();
    const { my_profile_store } = p2p_store;

    return (
        <div className='payment-method-card__menu'>
            <Text className='payment-method-card__menu--text' color='prominent' size='s'>
                <Localize i18n_default_text='Edit' />
            </Text>
            <Text
                className='payment-method-card__menu--text'
                color='prominent'
                onClick={() => {
                    my_profile_store.setPaymentMethodToDelete(payment_method);
                    my_profile_store.setIsConfirmDeleteModalOpen(true);
                }}
                size='s'
            >
                <Localize i18n_default_text='Delete' />
            </Text>
        </div>
    );
};

export default PaymentMethodCardMenu;

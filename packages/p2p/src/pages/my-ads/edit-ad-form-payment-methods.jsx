import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { useP2PAdvertiserPaymentMethods } from '@deriv/hooks';
import { useStores } from 'Stores';
import { localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import PaymentMethodCard from 'Components/payment-method-card';
import BuyAdPaymentMethodsList from 'Pages/my-ads/buy-ad-payment-methods-list.jsx';
import SellAdPaymentMethodsList from 'Pages/my-ads/sell-ad-payment-methods-list.jsx';

const EditAdFormPaymentMethods = ({ is_sell_advert, selected_methods, setSelectedMethods, touched }) => {
    const { showModal } = useModalManagerContext();
    const { data: p2p_advertiser_payment_methods } = useP2PAdvertiserPaymentMethods();
    const { my_ads_store } = useStores();

    const onClickPaymentMethodCard = payment_method => {
        if (!my_ads_store.payment_method_ids.includes(payment_method.id)) {
            if (my_ads_store.payment_method_ids.length < 3) {
                my_ads_store.payment_method_ids.push(payment_method.id);
                setSelectedMethods([...selected_methods, payment_method.id]);
            }
        } else {
            my_ads_store.payment_method_ids = my_ads_store.payment_method_ids.filter(
                payment_method_id => payment_method_id !== payment_method.id
            );
            setSelectedMethods(selected_methods.filter(i => i !== payment_method.id));
        }
        touched(true);
    };

    if (is_sell_advert) {
        if (p2p_advertiser_payment_methods?.length) {
            return (
                <SellAdPaymentMethodsList
                    selected_methods={selected_methods}
                    onClickAdd={() =>
                        showModal({
                            key: 'CreateAdAddPaymentMethodModal',
                        })
                    }
                    onClickPaymentMethodCard={onClickPaymentMethodCard}
                    p2p_advertiser_payment_methods={p2p_advertiser_payment_methods}
                />
            );
        }

        return (
            <PaymentMethodCard
                is_add={true}
                label={localize('Payment method')}
                medium
                onClickAdd={() =>
                    showModal({
                        key: 'CreateAdAddPaymentMethodModal',
                    })
                }
            />
        );
    }

    return (
        <BuyAdPaymentMethodsList
            selected_methods={selected_methods}
            setSelectedMethods={setSelectedMethods}
            touched={touched}
        />
    );
};

export default observer(EditAdFormPaymentMethods);

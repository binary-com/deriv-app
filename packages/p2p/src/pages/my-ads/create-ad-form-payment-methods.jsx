import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { useP2PAdvertiserPaymentMethods } from '@deriv/hooks';
import { useStores } from 'Stores';
import PaymentMethodCard from 'Components/payment-method-card';
import { localize } from 'Components/i18next';
import BuyAdPaymentMethodsList from 'Pages/my-ads/buy-ad-payment-methods-list.jsx';
import SellAdPaymentMethodsList from 'Pages/my-ads/sell-ad-payment-methods-list.jsx';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';

const CreateAdFormPaymentMethods = ({ is_sell_advert, onSelectPaymentMethods }) => {
    const { showModal } = useModalManagerContext();
    const { data: p2p_advertiser_payment_methods } = useP2PAdvertiserPaymentMethods();
    const { my_ads_store } = useStores();
    const [selected_buy_methods, setSelectedBuyMethods] = React.useState(my_ads_store.payment_method_names);
    const [selected_sell_methods, setSelectedSellMethods] = React.useState(my_ads_store.payment_method_ids);

    const onClickPaymentMethodCard = payment_method => {
        if (!my_ads_store.payment_method_ids.includes(payment_method.id)) {
            if (my_ads_store.payment_method_ids.length < 3) {
                my_ads_store.payment_method_ids.push(payment_method.id);
                setSelectedSellMethods([...selected_sell_methods, payment_method.id]);
            }
        } else {
            my_ads_store.payment_method_ids = my_ads_store.payment_method_ids.filter(
                payment_method_id => payment_method_id !== payment_method.id
            );
            setSelectedSellMethods(selected_sell_methods.filter(i => i !== payment_method.id));
        }
    };

    React.useEffect(() => {
        if (is_sell_advert) {
            onSelectPaymentMethods(selected_sell_methods);
        } else {
            onSelectPaymentMethods(selected_buy_methods);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_sell_advert, selected_buy_methods, selected_sell_methods]);

    if (is_sell_advert) {
        if (p2p_advertiser_payment_methods?.length) {
            return (
                <SellAdPaymentMethodsList
                    selected_methods={selected_sell_methods}
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
                is_add
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
            is_alignment_top
            selected_methods={selected_buy_methods}
            setSelectedMethods={setSelectedBuyMethods}
        />
    );
};

export default observer(CreateAdFormPaymentMethods);

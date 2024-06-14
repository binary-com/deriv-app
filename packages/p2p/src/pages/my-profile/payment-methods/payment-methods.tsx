import React from 'react';
import { Loading } from '@deriv/components';
import { useP2PAdvertiserPaymentMethods } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { useStores } from 'Stores';
import AddPaymentMethod from 'Components/add-payment-method';
import EditPaymentMethodForm from './edit-payment-method-form';
import PaymentMethodsEmpty from './payment-methods-empty';
import PaymentMethodsList from './payment-methods-list';

const PaymentMethods = () => {
    const { my_profile_store } = useStores();
    const {
        ui: { is_mobile_or_tablet },
    } = useStore();
    const { data: p2p_advertiser_payment_methods, isRefetching } = useP2PAdvertiserPaymentMethods();

    React.useEffect(() => {
        my_profile_store.setIsLoading(true);
        my_profile_store.getAdvertiserPaymentMethods();
        my_profile_store.getPaymentMethodsList();
        my_profile_store.setShouldShowAddPaymentMethodForm(false);
        my_profile_store.setShouldShowEditPaymentMethodForm(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (my_profile_store.is_loading) {
        return <Loading is_fullscreen={is_mobile_or_tablet} />;
    } else if (my_profile_store.should_show_add_payment_method_form) {
        return <AddPaymentMethod />;
    } else if (!p2p_advertiser_payment_methods?.length && !isRefetching) {
        return <PaymentMethodsEmpty />;
    } else if (my_profile_store.should_show_edit_payment_method_form) {
        return <EditPaymentMethodForm />;
    }

    return <PaymentMethodsList />;
};

export default observer(PaymentMethods);

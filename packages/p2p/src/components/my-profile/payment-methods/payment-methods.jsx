import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import AddPaymentMethod from './add-payment-method';
import PaymentMethodsEmpty from './payment-methods-empty';
import PaymentMethodsList from './payment-methods-list';
import EditPaymentMethodForm from './payment-methods-list/edit-payment-method-form.jsx';
import { isMobile } from '@deriv/shared';
import { Loading } from '@deriv/components';

const PaymentMethods = ({ isMountedOnce }) => {
    const { my_profile_store } = useStores();

    React.useEffect(() => {
        // checks if this component is already mounted previously to prevent Mobx action to re-render/recall the store actions when an observable is mutated
        if (!isMountedOnce.current) {
            my_profile_store.getAdvertiserPaymentMethods();
            my_profile_store.setShouldShowAddPaymentMethodForm(false);
            my_profile_store.setShouldShowEditPaymentMethodForm(false);
            isMountedOnce.current = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    if (my_profile_store.is_loading && isMobile()) {
        return <Loading is_fullscreen={true} />;
    }
    if (my_profile_store.should_show_add_payment_method_form) {
        return <AddPaymentMethod />;
    } else if (!my_profile_store.advertiser_has_payment_methods && isMountedOnce.current) {
        return <PaymentMethodsEmpty />;
    } else if (my_profile_store.should_show_edit_payment_method_form) {
        return <EditPaymentMethodForm />;
    }

    return <PaymentMethodsList />;
};

export default observer(PaymentMethods);

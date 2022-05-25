import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import AddPaymentMethod from './add-payment-method';
import PaymentMethodsEmpty from './payment-methods-empty';
import PaymentMethodsList from './payment-methods-list';
import PropTypes from 'prop-types';
import EditPaymentMethodForm from './payment-methods-list/edit-payment-method-form.jsx';
import { isMobile } from '@deriv/shared';
import { Loading } from '@deriv/components';

const PaymentMethods = ({ formik_ref }) => {
    const { my_profile_store } = useStores();

    React.useEffect(() => {
        my_profile_store.getAdvertiserPaymentMethods();
        my_profile_store.setShouldShowAddPaymentMethodForm(false);
        my_profile_store.setShouldShowEditPaymentMethodForm(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    if (my_profile_store.is_loading) {
        return <Loading is_fullscreen={isMobile()} />;
    } else if (my_profile_store.should_show_add_payment_method_form) {
        return <AddPaymentMethod />;
    } else if (!my_profile_store.advertiser_has_payment_methods) {
        return <PaymentMethodsEmpty />;
    } else if (my_profile_store.should_show_edit_payment_method_form) {
        return <EditPaymentMethodForm formik_ref={formik_ref} />;
    }

    return <PaymentMethodsList />;
};

PaymentMethods.propTypes = {
    // formik_ref is used to obtain Formik's form state from outside Formik component in AddPaymentMethodForm and EditPaymentMethodForm
    formik_ref: PropTypes.oneOfType([PropTypes.func, PropTypes.shape({ current: PropTypes.instanceOf(Element) })]),
};

export default observer(PaymentMethods);

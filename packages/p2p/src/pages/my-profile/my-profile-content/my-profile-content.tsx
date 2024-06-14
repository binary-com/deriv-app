import React from 'react';
import classNames from 'classnames';
import { DesktopWrapper, MobileFullPageModal, MobileOrTabletWrapper } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { useStores } from 'Stores';
import BlockUser from '../block-user';
import MyProfileForm from '../my-profile-form';
import MyProfileStats from '../my-profile-stats';
import PaymentMethods from '../payment-methods';

const MyProfileContent = () => {
    const { general_store, my_profile_store } = useStores();
    const {
        active_tab,
        selected_payment_method,
        should_show_add_payment_method_form,
        should_show_edit_payment_method_form,
    } = my_profile_store;
    const { showModal } = useModalManagerContext() || {};

    if (active_tab === my_profile_tabs.AD_TEMPLATE) {
        return <MyProfileForm />;
    } else if (active_tab === my_profile_tabs.PAYMENT_METHODS) {
        return (
            <React.Fragment>
                <DesktopWrapper>
                    <PaymentMethods />
                </DesktopWrapper>
                <MobileOrTabletWrapper>
                    <MobileFullPageModal
                        body_className={classNames('payment-methods-list__modal', {
                            'payment-methods-list__modal-add':
                                selected_payment_method || should_show_edit_payment_method_form,
                        })}
                        height_offset='80px'
                        is_modal_open
                        is_flex
                        onClickClose={() => {
                            // do nothing
                        }}
                        page_header_className='buy-sell__modal-header'
                        page_header_text={localize('Add payment method')}
                        pageHeaderReturnFn={() => {
                            if (general_store.is_form_modified || !!selected_payment_method) {
                                if (should_show_add_payment_method_form) {
                                    showModal({
                                        key: 'CancelAddPaymentMethodModal',
                                    });
                                }
                                if (should_show_edit_payment_method_form) {
                                    showModal({
                                        key: 'CancelEditPaymentMethodModal',
                                    });
                                }
                            } else {
                                my_profile_store.hideAddPaymentMethodForm();
                                my_profile_store.setShouldShowEditPaymentMethodForm(false);
                            }
                        }}
                    >
                        <PaymentMethods />
                    </MobileFullPageModal>
                </MobileOrTabletWrapper>
            </React.Fragment>
        );
    } else if (active_tab === my_profile_tabs.MY_COUNTERPARTIES) {
        return <BlockUser />;
    }
    return <MyProfileStats />;
};

export default observer(MyProfileContent);

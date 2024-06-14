import React from 'react';
import { DesktopWrapper, Icon, MobileFullPageModal, MobileOrTabletWrapper, Text, Button } from '@deriv/components';
import { observer } from '@deriv/stores';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { Localize, localize } from 'Components/i18next';
import { useStores } from 'Stores';

const PaymentMethodsEmpty = () => {
    const { my_profile_store } = useStores();

    const payment_method_empty_icon = (
        <React.Fragment>
            <Icon icon='IcPaymentMethodsWallet' className='payment-methods-empty__icon' height={159} width={256} />
            <Text className='payment-methods-empty__text' weight='bold'>
                <Localize i18n_default_text='You haven’t added any payment methods yet' />
            </Text>
            <Text>
                <Localize i18n_default_text='Hit the button below to add payment methods.' />
            </Text>
            <Button
                className='payment-methods-empty__button'
                has_effect
                large
                primary
                onClick={my_profile_store.showAddPaymentMethodForm}
                text={localize('Add payment methods')}
            />
        </React.Fragment>
    );

    return (
        <React.Fragment>
            <DesktopWrapper>
                <div className='payment-methods-empty'>{payment_method_empty_icon}</div>
            </DesktopWrapper>
            <MobileOrTabletWrapper>
                <MobileFullPageModal
                    body_className='payment-methods-list__modal'
                    height_offset='80px'
                    is_flex
                    is_modal_open
                    onClickClose={() => {
                        // do nothing
                    }}
                    page_header_text={localize('Payment methods')}
                    pageHeaderReturnFn={() => my_profile_store.setActiveTab(my_profile_tabs.MY_STATS)}
                >
                    {payment_method_empty_icon}
                </MobileFullPageModal>
            </MobileOrTabletWrapper>
        </React.Fragment>
    );
};

export default observer(PaymentMethodsEmpty);

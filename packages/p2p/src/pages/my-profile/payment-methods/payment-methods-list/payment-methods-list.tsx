import React from 'react';
import { observer } from '@deriv/stores';
import {
    Button,
    DesktopWrapper,
    Loading,
    MobileFullPageModal,
    MobileOrTabletWrapper,
    Text,
    ThemedScrollbars,
} from '@deriv/components';
import { useP2PAdvertiserPaymentMethods } from '@deriv/hooks';
import { useStores } from 'Stores';
import { Localize, localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import PaymentMethodCard from 'Components/payment-method-card';
import ScrollbarWrapper from 'Components/scrollbar-wrapper';
import { my_profile_tabs } from 'Constants/my-profile-tabs';
import { TPaymentMethod } from 'Types/my-profile.types';

const PaymentMethodsList = () => {
    const { data: advertiser_payment_methods, isRefetching } = useP2PAdvertiserPaymentMethods();
    const { isCurrentModal } = useModalManagerContext();
    const { my_profile_store } = useStores();

    const should_show_loading_screen =
        !advertiser_payment_methods || (isRefetching && !isCurrentModal('DeletePaymentMethodConfirmationModal'));

    type TTypeToTitleMapper = {
        [key: string]: string;
    };

    const type_to_title_mapper: TTypeToTitleMapper = {
        bank: localize('Bank Transfers'),
        ewallet: localize('E-wallets'),
        other: localize('Others'),
    };

    React.useEffect(() => {
        my_profile_store.setPaymentMethodToDelete(null);
        my_profile_store.setPaymentMethodToEdit(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const add_new_button = (
        <Button
            className='payment-methods-list__button'
            large
            onClick={() => my_profile_store.setShouldShowAddPaymentMethodForm(true)}
            primary
        >
            <Localize i18n_default_text='Add new' />
        </Button>
    );

    if (should_show_loading_screen) return <Loading is_fullscreen={false} />;

    return (
        <ScrollbarWrapper height='39rem'>
            <React.Fragment>
                <DesktopWrapper>
                    <div className='payment-methods-list'>
                        {add_new_button}
                        <div className='payment-methods-list__list-container'>
                            {advertiser_payment_methods &&
                                Object.keys(type_to_title_mapper).map(key => {
                                    const current_title = type_to_title_mapper[key];
                                    const payment_methods = advertiser_payment_methods.filter(
                                        payment_method => payment_method.type === key
                                    );

                                    if (!payment_methods.length) return null;

                                    return (
                                        <React.Fragment key={key}>
                                            <Text className='payment-methods-list__list-header' size='xs' weight='bold'>
                                                {current_title}
                                            </Text>
                                            <div className='payment-methods-list__list-body'>
                                                {payment_methods.map(
                                                    (each_payment_method: TPaymentMethod, key: number) => (
                                                        <PaymentMethodCard
                                                            key={`${key}__${each_payment_method.id}`}
                                                            large
                                                            payment_method={each_payment_method}
                                                            show_payment_method_name={false}
                                                        />
                                                    )
                                                )}
                                            </div>
                                        </React.Fragment>
                                    );
                                })}
                        </div>
                    </div>
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
                        page_footer_className='payment-methods-list__modal--footer'
                        renderPageFooterChildren={() => add_new_button}
                    >
                        <div className='payment-methods-list__list-container'>
                            {advertiser_payment_methods &&
                                Object.keys(type_to_title_mapper).map((key: string) => {
                                    const current_title = type_to_title_mapper[key];
                                    const payment_methods = advertiser_payment_methods.filter(
                                        payment_method => payment_method.type === key
                                    );

                                    if (!payment_methods.length) return null;

                                    return (
                                        <React.Fragment key={key}>
                                            <Text className='payment-methods-list__list-header' size='xs' weight='bold'>
                                                {current_title}
                                            </Text>
                                            <ThemedScrollbars
                                                className='payment-methods-list__list-horizontal'
                                                has_horizontal
                                                is_only_horizontal
                                                is_scrollbar_hidden
                                            >
                                                {payment_methods.map(
                                                    (each_payment_method: TPaymentMethod, key: number) => (
                                                        <PaymentMethodCard
                                                            key={`${key}__${each_payment_method.id}`}
                                                            payment_method={each_payment_method}
                                                            small
                                                            show_payment_method_name={false}
                                                        />
                                                    )
                                                )}
                                            </ThemedScrollbars>
                                        </React.Fragment>
                                    );
                                })}
                        </div>
                    </MobileFullPageModal>
                </MobileOrTabletWrapper>
            </React.Fragment>
        </ScrollbarWrapper>
    );
};

export default observer(PaymentMethodsList);

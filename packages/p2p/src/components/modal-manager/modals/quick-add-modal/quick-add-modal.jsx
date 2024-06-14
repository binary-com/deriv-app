import React from 'react';
import classNames from 'classnames';
import { Button, Icon, MobileFullPageModal, Modal, Text } from '@deriv/components';
import { useP2PAdvertiserPaymentMethods } from '@deriv/hooks';
import { isMobileOrTablet } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { localize, Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import AddPaymentMethod from 'Components/add-payment-method';
import BuyAdPaymentMethodsList from 'Pages/my-ads/buy-ad-payment-methods-list.jsx';
import SellAdPaymentMethodsList from 'Pages/my-ads/sell-ad-payment-methods-list.jsx';
import { buy_sell } from 'Constants/buy-sell';
import { useStores } from 'Stores';

const QuickAddModal = ({ advert }) => {
    const { is_modal_open, showModal, useSavedState } = useModalManagerContext();
    const { my_ads_store, my_profile_store } = useStores();
    const { data: p2p_advertiser_payment_methods } = useP2PAdvertiserPaymentMethods();

    const type = advert ? advert.type : null;

    const [selected_methods, setSelectedMethods] = useSavedState('selected_methods', []);

    const is_buy_advert = type === buy_sell.BUY;
    const is_sell_ad_add_payment_methods_selected =
        !is_buy_advert && my_profile_store.selected_payment_method.length > 0;
    const is_buy_ad_add_payment_methods_selected = is_buy_advert && selected_methods.length > 0;
    const is_payment_methods_selected =
        is_sell_ad_add_payment_methods_selected || is_buy_ad_add_payment_methods_selected;

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
    };

    const setShouldCloseAllModals = should_close_all_modals => {
        if (is_payment_methods_selected) {
            showModal({
                key: 'CancelAddPaymentMethodModal',
                props: {
                    should_hide_all_modals_on_cancel: is_buy_advert,
                    onCancel: () => {
                        my_ads_store.payment_method_ids = [];
                        my_ads_store.payment_method_names = [];
                    },
                },
            });
        } else {
            my_ads_store.payment_method_ids = [];
            my_ads_store.payment_method_names = [];
            setSelectedMethods([]);
            if (should_close_all_modals) {
                my_ads_store.setShouldShowAddPaymentMethod(false);
                my_ads_store.hideQuickAddModal();
            } else {
                if (!my_ads_store.should_show_add_payment_method) {
                    my_ads_store.hideQuickAddModal();
                }
                my_ads_store.setShouldShowAddPaymentMethod(false);
            }
        }
    };

    if (isMobileOrTablet()) {
        if (is_buy_advert) {
            return (
                <MobileFullPageModal
                    body_className='quick-add-modal__body'
                    height_offset='80px'
                    is_flex
                    is_modal_open={is_modal_open}
                    page_header_text={localize('Add payment method')}
                    pageHeaderReturnFn={() => setShouldCloseAllModals(false)}
                    secondary
                    text={localize('Cancel')}
                    renderPageFooterChildren={() => (
                        <>
                            <Button
                                has_effect
                                large
                                onClick={setShouldCloseAllModals}
                                secondary
                                text={localize('Cancel')}
                            />
                            <Button
                                className='quick-add-modal__button'
                                has_effect
                                is_disabled={
                                    selected_methods.length === 0 || my_ads_store.payment_method_names.length === 0
                                }
                                large
                                onClick={() => my_ads_store.onClickUpdatePaymentMethods(advert?.id, is_buy_advert)}
                                primary
                                text={localize('Add')}
                            />
                        </>
                    )}
                >
                    <div className='quick-add-modal__info'>
                        <Text color='prominent' size='xxs'>
                            <Localize i18n_default_text='You may choose up to 3 payment methods for this ad.' />
                        </Text>
                    </div>
                    <BuyAdPaymentMethodsList
                        is_alignment_top={false}
                        list_portal_id='popup_root'
                        should_show_hint
                        selected_methods={selected_methods}
                        setSelectedMethods={setSelectedMethods}
                        should_clear_payment_method_selections={!is_payment_methods_selected}
                    />
                </MobileFullPageModal>
            );
        }

        return (
            <MobileFullPageModal
                body_className='quick-add-modal__body'
                height_offset='80px'
                is_flex
                is_modal_open={is_modal_open}
                page_header_text={localize('Add payment method')}
                pageHeaderReturnFn={() => setShouldCloseAllModals(false)}
                secondary
                text={localize('Cancel')}
                {...(!my_ads_store.should_show_add_payment_method && {
                    renderPageFooterChildren: () => (
                        <>
                            <Button
                                has_effect
                                large
                                onClick={setShouldCloseAllModals}
                                secondary
                                text={localize('Cancel')}
                            />
                            <Button
                                className='quick-add-modal__button'
                                has_effect
                                is_disabled={
                                    selected_methods.length === 0 || my_ads_store.payment_method_ids.length === 0
                                }
                                large
                                onClick={() => my_ads_store.onClickUpdatePaymentMethods(advert?.id, is_buy_advert)}
                                primary
                                text={localize('Add')}
                            />
                        </>
                    ),
                })}
            >
                {my_ads_store.should_show_add_payment_method ? (
                    <AddPaymentMethod should_show_page_return={false} />
                ) : (
                    <>
                        <Text color='prominent' size='xxs'>
                            <Localize i18n_default_text='You may choose up to 3 payment methods for this ad.' />
                        </Text>
                        <SellAdPaymentMethodsList
                            onClickPaymentMethodCard={onClickPaymentMethodCard}
                            onClickAdd={() => my_ads_store.setShouldShowAddPaymentMethod(true)}
                            p2p_advertiser_payment_methods={p2p_advertiser_payment_methods}
                            selected_methods={selected_methods}
                        />
                    </>
                )}
            </MobileFullPageModal>
        );
    }

    if (is_buy_advert) {
        return (
            <Modal
                className='quick-add-modal'
                has_close_icon
                height='452px'
                is_open={is_modal_open}
                title={localize('Add payment method')}
                toggleModal={() => setShouldCloseAllModals(true)}
            >
                <Modal.Body>
                    <div className='quick-add-modal__info'>
                        <Text color='prominent' size='xxs'>
                            <Localize i18n_default_text='You may choose up to 3 payment methods for this ad.' />
                        </Text>
                    </div>
                    <BuyAdPaymentMethodsList
                        is_alignment_top={false}
                        list_portal_id='modal_root'
                        should_show_hint
                        selected_methods={selected_methods}
                        setSelectedMethods={setSelectedMethods}
                        should_clear_payment_method_selections={!is_payment_methods_selected}
                    />
                </Modal.Body>
                <Modal.Footer has_separator>
                    <Button
                        has_effect
                        large
                        onClick={() => setShouldCloseAllModals(true)}
                        secondary
                        text={localize('Cancel')}
                    />

                    <Button
                        has_effect
                        is_disabled={selected_methods.length === 0 || my_ads_store.payment_method_names.length === 0}
                        large
                        onClick={() => my_ads_store.onClickUpdatePaymentMethods(advert?.id, is_buy_advert)}
                        primary
                        text={localize('Add')}
                    />
                </Modal.Footer>
            </Modal>
        );
    }

    return (
        <Modal
            className={classNames('quick-add-modal', {
                'quick-add-modal--form': my_profile_store.selected_payment_method,
            })}
            has_close_icon
            height={my_ads_store.should_show_add_payment_method ? '560px' : 'auto'}
            is_open={is_modal_open}
            title={
                <React.Fragment>
                    {my_ads_store.should_show_add_payment_method && (
                        <Icon
                            className='quick-add-modal__icon'
                            icon='icArrowLeftBold'
                            onClick={() => {
                                setShouldCloseAllModals(false);
                            }}
                        />
                    )}
                    {my_ads_store.should_show_add_payment_method
                        ? localize('Add payment method')
                        : localize('Add payment methods')}
                </React.Fragment>
            }
            width='440px'
            toggleModal={() => setShouldCloseAllModals(true)}
        >
            <Modal.Body
                className={classNames({
                    'quick-add-modal__horizontal': !my_ads_store.should_show_add_payment_method,
                    'quick-add-modal__scroll': my_profile_store.selected_payment_method,
                })}
            >
                {my_ads_store.should_show_add_payment_method ? (
                    <AddPaymentMethod should_show_page_return={false} />
                ) : (
                    <>
                        <Text color='prominent' size='xs'>
                            <Localize i18n_default_text='You may choose up to 3 payment methods for this ad.' />
                        </Text>
                        <SellAdPaymentMethodsList
                            is_only_horizontal
                            is_scrollable
                            onClickPaymentMethodCard={onClickPaymentMethodCard}
                            onClickAdd={() => my_ads_store.setShouldShowAddPaymentMethod(true)}
                            p2p_advertiser_payment_methods={p2p_advertiser_payment_methods}
                            selected_methods={selected_methods}
                        />
                    </>
                )}
            </Modal.Body>
            {!my_ads_store.should_show_add_payment_method && (
                <Modal.Footer has_separator>
                    <Button has_effect large onClick={setShouldCloseAllModals} secondary text={localize('Cancel')} />

                    <Button
                        has_effect
                        is_disabled={selected_methods.length === 0 || my_ads_store.payment_method_ids.length === 0}
                        large
                        onClick={() => my_ads_store.onClickUpdatePaymentMethods(advert?.id, is_buy_advert)}
                        primary
                        text={localize('Add')}
                    />
                </Modal.Footer>
            )}
            {!my_profile_store.selected_payment_method && my_ads_store.should_show_add_payment_method && (
                <Modal.Footer>
                    <Button
                        has_effect
                        large
                        onClick={() => setShouldCloseAllModals(false)}
                        secondary
                        text={localize('Cancel')}
                    />
                </Modal.Footer>
            )}
        </Modal>
    );
};

export default observer(QuickAddModal);

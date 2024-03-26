import React from 'react';
import classNames from 'classnames';
import { reaction } from 'mobx';
import { useHistory, useLocation } from 'react-router-dom';
import { useInvalidateQuery } from '@deriv/api';
import { DesktopWrapper, MobileFullPageModal, MobileWrapper, Modal, ThemedScrollbars } from '@deriv/components';
import { routes } from '@deriv/shared';
import { observer } from '@deriv/stores';
import { localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import AddPaymentMethodForm from 'Components/add-payment-method-form';
import BuySellForm from 'Pages/buy-sell/buy-sell-form.jsx';
import BuySellFormReceiveAmount from 'Pages/buy-sell/buy-sell-form-receive-amount.jsx';
import { useStores } from 'Stores';
import BuySellModalFooter from './buy-sell-modal-footer';
import BuySellModalTitle from './buy-sell-modal-title';
import BuySellModalError from './buy-sell-modal-error';

const BuySellModal = () => {
    const { hideModal, is_modal_open, showModal } = useModalManagerContext();
    const { buy_sell_store, general_store, my_profile_store, order_store } = useStores();
    const { is_buy_advert, selected_ad_state, submitForm } = buy_sell_store;
    const { account_currency } = selected_ad_state;
    const { balance } = general_store;
    const { should_show_add_payment_method_form } = my_profile_store;

    const invalidate = useInvalidateQuery();
    const history = useHistory();
    const location = useLocation();
    const scroll_ref = React.useRef<HTMLDivElement & SVGSVGElement>(null);
    const [error_message, setErrorMessage] = React.useState('');
    const [is_submit_disabled, setIsSubmitDisabled] = React.useState(false);
    const [is_account_balance_low, setIsAccountBalanceLow] = React.useState(false);
    const [has_rate_changed, setHasRateChanged] = React.useState(false);

    const show_low_balance_message = !is_buy_advert && is_account_balance_low;

    const onCancel = () => {
        if (should_show_add_payment_method_form) {
            if (general_store.is_form_modified) {
                showModal({
                    key: 'CancelAddPaymentMethodModal',
                    props: {},
                });
            } else {
                my_profile_store.hideAddPaymentMethodForm();
            }
        } else {
            hideModal({ should_hide_all_modals: true });
            buy_sell_store.fetchAdvertiserAdverts();
            buy_sell_store.unsubscribeAdvertInfo();
        }
    };

    const onConfirmClick = (order_info: { id: string }) => {
        const current_query_params = new URLSearchParams(location.search);
        current_query_params.append('order', order_info.id);
        general_store.redirectTo('orders', { nav: { location: 'buy_sell' } });
        history.replace({
            pathname: routes.p2p_orders,
            search: current_query_params.toString(),
            hash: location.hash,
        });
        order_store.setOrderId(order_info.id);
        hideModal();
        buy_sell_store.fetchAdvertiserAdverts();
        buy_sell_store.setShowAdvertiserPage(false);
    };

    const getModalTitle = () => {
        if (should_show_add_payment_method_form) {
            return localize('Add payment method');
        }
        if (is_buy_advert) {
            return localize('Buy {{ currency }}', { currency: account_currency });
        }
        return localize('Sell {{ currency }}', { currency: account_currency });
    };

    const onReturn = () => {
        if (general_store.is_form_modified) {
            showModal({
                key: 'CancelAddPaymentMethodModal',
                props: {},
            });
        } else {
            my_profile_store.setShouldShowAddPaymentMethodForm(false);
        }
    };

    React.useEffect(() => {
        const balance_check =
            parseFloat(balance) === 0 || parseFloat(balance) < buy_sell_store.advert?.min_order_amount_limit;

        setIsAccountBalanceLow(balance_check);
        if (!is_modal_open) {
            setErrorMessage('');
        }

        if (general_store.counterparty_advert_id) general_store.setCounterpartyAdvertId('');

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_modal_open]);

    React.useEffect(() => {
        if ((error_message || show_low_balance_message) && scroll_ref.current) {
            scroll_ref.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [error_message, show_low_balance_message]);

    React.useEffect(() => {
        const disposeHasRateChangedReaction = reaction(
            () => buy_sell_store.advert,
            (new_advert, previous_advert) => {
                // check to see if the rate is initialized in the store for the first time (when uninitialized it is undefined) AND
                const rate_has_changed = previous_advert?.rate !== new_advert.rate;
                // check to see if user is not switching between different adverts, it should not trigger rate change modal
                const is_the_same_advert = previous_advert?.id === new_advert.id;
                if (rate_has_changed && is_the_same_advert) {
                    showModal({ key: 'MarketRateChangeErrorModal', props: {} });
                    setHasRateChanged(true);
                    buy_sell_store.setFormErrorCode('');
                    invalidate('p2p_advert_list');
                }
            },
            { fireImmediately: true }
        );

        return () => {
            disposeHasRateChangedReaction();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <React.Fragment>
            <MobileWrapper>
                <MobileFullPageModal
                    body_className='buy-sell-modal__body'
                    className='buy-sell-modal'
                    height_offset='80px'
                    is_flex
                    is_modal_open={is_modal_open}
                    page_header_className='buy-sell-modal__header'
                    renderPageHeaderElement={<BuySellModalTitle is_buy={is_buy_advert} onReturn={onReturn} />}
                    pageHeaderReturnFn={onCancel}
                >
                    <ThemedScrollbars refSetter={scroll_ref}>
                        <BuySellModalError
                            error_message={error_message}
                            show_low_balance_message={show_low_balance_message}
                        />
                        {should_show_add_payment_method_form ? (
                            <AddPaymentMethodForm should_show_separated_footer />
                        ) : (
                            <React.Fragment>
                                <BuySellForm
                                    advert={selected_ad_state}
                                    has_rate_changed={has_rate_changed}
                                    handleClose={onCancel}
                                    handleConfirm={onConfirmClick}
                                    setIsSubmitDisabled={setIsSubmitDisabled}
                                    setErrorMessage={setErrorMessage}
                                    setHasRateChanged={setHasRateChanged}
                                />
                                <BuySellFormReceiveAmount />
                                <BuySellModalFooter
                                    is_submit_disabled={!!is_submit_disabled}
                                    onCancel={onCancel}
                                    onSubmit={submitForm}
                                />
                            </React.Fragment>
                        )}
                    </ThemedScrollbars>
                </MobileFullPageModal>
            </MobileWrapper>
            <DesktopWrapper>
                <Modal
                    className={classNames('buy-sell-modal', {
                        'buy-sell-modal__form': should_show_add_payment_method_form,
                    })}
                    has_return_icon={should_show_add_payment_method_form}
                    height={is_buy_advert ? 'auto' : '649px'}
                    is_open={is_modal_open}
                    onReturn={onReturn}
                    portalId='modal_root'
                    title={getModalTitle()}
                    toggleModal={onCancel}
                    width='456px'
                >
                    {/* Parent height - Modal.Header height - Modal.Footer height */}
                    <ThemedScrollbars
                        height={is_buy_advert ? '100%' : 'calc(100% - 5.8rem - 7.4rem)'}
                        refSetter={scroll_ref}
                    >
                        <Modal.Body className='buy-sell-modal__layout'>
                            <BuySellModalError
                                error_message={error_message}
                                show_low_balance_message={show_low_balance_message}
                            />
                            {should_show_add_payment_method_form ? (
                                <AddPaymentMethodForm should_show_separated_footer />
                            ) : (
                                <BuySellForm
                                    advert={selected_ad_state}
                                    has_rate_changed={has_rate_changed}
                                    handleClose={onCancel}
                                    handleConfirm={onConfirmClick}
                                    setIsSubmitDisabled={setIsSubmitDisabled}
                                    setErrorMessage={setErrorMessage}
                                    setHasRateChanged={setHasRateChanged}
                                />
                            )}
                        </Modal.Body>
                    </ThemedScrollbars>
                    {!should_show_add_payment_method_form && (
                        <Modal.Footer has_separator>
                            <BuySellModalFooter
                                is_submit_disabled={!!is_submit_disabled}
                                onCancel={onCancel}
                                onSubmit={submitForm}
                            />
                        </Modal.Footer>
                    )}
                </Modal>
            </DesktopWrapper>
        </React.Fragment>
    );
};

export default observer(BuySellModal);

import React from 'react';
import { observer } from '@deriv/stores';
import { DesktopWrapper, MobileFullPageModal, MobileWrapper, Modal } from '@deriv/components';
import { useDevice } from '@deriv-com/ui';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import { useStores } from 'Stores';
import { getListDifference } from 'Utils/helper';
import FilterModalBody from './filter-modal-body';
import FilterModalFooter from './filter-modal-footer';
import FilterModalHeader from './filter-modal-header';

export type TPaymentMethod = {
    text: string;
    value: string;
};

const FilterModal = () => {
    const { buy_sell_store, my_profile_store } = useStores();
    const { isMobile } = useDevice();

    const { hideModal, is_modal_open, showModal, useSavedState } = useModalManagerContext();
    const {
        onClickApply: onClickApplyFilter,
        selected_payment_method_text,
        selected_payment_method_value,
        setSelectedPaymentMethodText,
        setSelectedPaymentMethodValue,
        setShowFilterPaymentMethods,
        setShouldUseClientLimits,
        show_filter_payment_methods,
    } = buy_sell_store;

    const { getPaymentMethodsList, setSearchResults, setSearchTerm } = my_profile_store;

    const [selected_methods, setSelectedMethods] = useSavedState(
        'selected_methods',
        selected_payment_method_value ?? []
    );
    const [selected_methods_text, setSelectedMethodsText] = useSavedState(
        'selected_methods_text',
        selected_payment_method_text ?? []
    );
    const [has_made_changes, setHasMadeChanges] = useSavedState('has_made_changes', false);
    // eslint-disable-next-line no-unused-vars
    const [is_matching_ads_toggled, _] = useSavedState('has_made_changes', buy_sell_store.should_use_client_limits);

    // if user has previously already selected some payment methods and clicked Apply
    const has_already_selected_payment_methods =
        selected_payment_method_value?.length &&
        (selected_methods.length !== selected_payment_method_value.length ||
            getListDifference(selected_methods, selected_payment_method_value).length > 0);
    // if user is selecting payment methods for the first time and has selected some payment methods
    const has_recently_selected_payment_methods =
        selected_payment_method_value?.length === 0 && selected_methods.length > 0;
    const has_selected_payment_methods = has_already_selected_payment_methods || has_recently_selected_payment_methods;

    const onChange = (payment_method: TPaymentMethod) => {
        if (!selected_methods.includes(payment_method.value)) {
            setSelectedMethods((prev_selected_methods: string[]) => [...prev_selected_methods, payment_method.value]);
            setSelectedMethodsText((prev_selected_methods_text: string[]) => [
                ...prev_selected_methods_text,
                payment_method.text,
            ]);
        } else {
            setSelectedMethods((prev_selected_methods: string[]) =>
                prev_selected_methods.filter(method => method !== payment_method.value)
            );
            setSelectedMethodsText((prev_selected_methods_text: string[]) =>
                prev_selected_methods_text.filter(method => method !== payment_method.text)
            );
        }
    };

    const clearSearchSection = () => {
        setSearchTerm('');
        setSearchResults([]);
    };

    const onClose = () => {
        if (has_selected_payment_methods || has_made_changes) {
            showModal({
                key: 'LeavePageModal',
                props: {
                    onLeavePage: () => {
                        if (isMobile) {
                            setSelectedMethods(
                                selected_methods.filter((selected_method: string) =>
                                    selected_payment_method_value.includes(selected_method)
                                )
                            );
                            setSelectedMethodsText(
                                selected_methods_text.filter((selected_method_text: string) =>
                                    selected_payment_method_text.includes(selected_method_text)
                                )
                            );
                        }
                        buy_sell_store.setShouldUseClientLimits(is_matching_ads_toggled);
                        setSelectedMethods(selected_payment_method_value);
                        setSelectedMethodsText(selected_payment_method_text);
                        hideModal({
                            should_restore_local_state: false,
                            should_hide_all_modals: true,
                        });
                    },
                },
            });
        } else {
            setShowFilterPaymentMethods(false);
            clearSearchSection();
            hideModal({
                should_restore_local_state: false,
            });
        }
    };

    const onClickReset = () => {
        setShouldUseClientLimits(true);

        setSelectedMethods([]);
        setSelectedMethodsText([]);

        setHasMadeChanges(
            selected_payment_method_value.length > 0 &&
                getListDifference(selected_methods, selected_payment_method_value).length === 0
        );
    };

    const onClickConfirmPaymentMethods = () => {
        clearSearchSection();
        setShowFilterPaymentMethods(false);
        setHasMadeChanges(true);
    };

    const onClickClearPaymentMethods = () => {
        setSelectedMethods([]);
        setSelectedMethodsText([]);
    };

    const onClickApply = () => {
        setSelectedPaymentMethodValue(selected_methods);
        setSelectedPaymentMethodText(selected_methods_text);
        onClickApplyFilter(selected_methods, selected_methods_text);
        hideModal();
    };

    const onToggle = () => {
        buy_sell_store.setShouldUseClientLimits(!buy_sell_store.should_use_client_limits);
        if (!has_made_changes) setHasMadeChanges(is_matching_ads_toggled !== buy_sell_store.should_use_client_limits);
    };

    React.useEffect(() => {
        getPaymentMethodsList();

        return () => {
            clearSearchSection();
        };
    }, []);

    const pageHeaderReturnFn = () => {
        if (show_filter_payment_methods) {
            clearSearchSection();
            setSelectedMethods(selected_payment_method_value);
            setSelectedMethodsText(selected_payment_method_text);
            setShowFilterPaymentMethods(false);
        } else {
            hideModal({
                should_restore_local_state: false,
            });
        }
    };

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Modal
                    className='payment-methods'
                    has_close_icon
                    height='56rem'
                    title={<FilterModalHeader pageHeaderReturnFn={pageHeaderReturnFn} />}
                    is_open={is_modal_open}
                    toggleModal={onClose}
                    width='44rem'
                >
                    <Modal.Body>
                        <FilterModalBody
                            handleToggle={onToggle}
                            onChange={onChange}
                            selected_methods={selected_methods}
                            selected_methods_text={selected_methods_text}
                        />
                    </Modal.Body>
                    <Modal.Footer has_separator>
                        <FilterModalFooter
                            class_name='filter-modal__footer-button-group'
                            has_made_changes={has_made_changes}
                            has_selected_payment_methods={has_selected_payment_methods}
                            onClickApply={onClickApply}
                            onClickClearPaymentMethods={onClickClearPaymentMethods}
                            onClickConfirmPaymentMethods={onClickConfirmPaymentMethods}
                            onClickReset={onClickReset}
                            selected_methods={selected_methods}
                        />
                    </Modal.Footer>
                </Modal>
            </DesktopWrapper>
            <MobileWrapper>
                <MobileFullPageModal
                    body_className='filter-modal__body'
                    is_modal_open={is_modal_open}
                    height_offset='80px'
                    is_flex
                    header={<FilterModalHeader pageHeaderReturnFn={pageHeaderReturnFn} />}
                    onClickClose={onClose}
                    renderPageFooterChildren={() => {
                        return (
                            <FilterModalFooter
                                class_name='filter-modal__footer-button-group'
                                has_made_changes={has_made_changes}
                                has_selected_payment_methods={has_selected_payment_methods}
                                onClickApply={onClickApply}
                                onClickClearPaymentMethods={onClickClearPaymentMethods}
                                onClickConfirmPaymentMethods={onClickConfirmPaymentMethods}
                                onClickReset={onClickReset}
                                selected_methods={selected_methods}
                            />
                        );
                    }}
                >
                    <FilterModalBody
                        handleToggle={onToggle}
                        onChange={onChange}
                        selected_methods={selected_methods}
                        selected_methods_text={selected_methods_text}
                    />
                </MobileFullPageModal>
            </MobileWrapper>
        </React.Fragment>
    );
};

export default observer(FilterModal);

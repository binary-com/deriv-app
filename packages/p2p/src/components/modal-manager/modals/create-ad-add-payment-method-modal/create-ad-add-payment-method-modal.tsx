import React from 'react';
import classNames from 'classnames';
import { Button, DesktopWrapper, Icon, MobileFullPageModal, MobileOrTabletWrapper, Modal } from '@deriv/components';
import { observer } from '@deriv/stores';
import { localize, Localize } from 'Components/i18next';
import { useModalManagerContext } from 'Components/modal-manager/modal-manager-context';
import AddPaymentMethod from 'Components/add-payment-method';
import { useStores } from 'Stores';

const CreateAdAddPaymentMethodModal = () => {
    const { hideModal, is_modal_open, showModal } = useModalManagerContext();
    const { general_store, my_profile_store } = useStores();
    const { is_form_modified } = general_store;
    const { selected_payment_method } = my_profile_store;

    const onCancel = () => {
        if (selected_payment_method.length > 0 || is_form_modified) {
            showModal({
                key: 'CancelAddPaymentMethodModal',
                props: {
                    should_hide_all_modals_on_cancel: true,
                },
            });
        } else {
            hideModal({
                should_hide_all_modals: true,
            });
        }
    };

    return (
        <React.Fragment>
            <DesktopWrapper>
                <Modal
                    className={classNames('create-ad-add-payment-method-modal__error', {
                        'create-ad-add-payment-method-modal__error--form': selected_payment_method,
                    })}
                    has_close_icon
                    height='560px'
                    is_open={is_modal_open}
                    title={
                        <React.Fragment>
                            <Icon
                                icon='IcArrowLeftBold'
                                onClick={onCancel}
                                className='create-ad-add-payment-method-modal__icon'
                            />
                            {localize('Add payment method')}
                        </React.Fragment>
                    }
                    toggleModal={onCancel}
                >
                    <Modal.Body
                        className={classNames({
                            'create-ad-add-payment-method-modal__body--scroll': selected_payment_method,
                        })}
                    >
                        <AddPaymentMethod should_show_page_return={false} should_show_separated_footer />
                    </Modal.Body>
                    {!selected_payment_method && (
                        <Modal.Footer has_separator>
                            <Button large onClick={onCancel} secondary>
                                <Localize i18n_default_text='Cancel' />
                            </Button>
                        </Modal.Footer>
                    )}
                </Modal>
            </DesktopWrapper>
            <MobileOrTabletWrapper>
                <MobileFullPageModal
                    body_className={classNames('create-ad-add-payment-method-modal__body', {
                        'create-ad-add-payment-method-modal__body--form': selected_payment_method,
                    })}
                    height_offset='80px'
                    is_flex
                    is_modal_open={is_modal_open}
                    onClickClose={onCancel}
                    page_header_className='buy-sell__modal-header'
                    page_header_text={localize('Add payment method')}
                    pageHeaderReturnFn={onCancel}
                >
                    <AddPaymentMethod should_show_page_return={false} should_show_separated_footer />
                </MobileFullPageModal>
            </MobileOrTabletWrapper>
        </React.Fragment>
    );
};

export default observer(CreateAdAddPaymentMethodModal);

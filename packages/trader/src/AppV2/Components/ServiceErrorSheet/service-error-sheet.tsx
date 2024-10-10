import React, { useEffect, useState } from 'react';
import { observer, useStore } from '@deriv/stores';
import { useTraderStore } from 'Stores/useTraderStores';
import { ActionSheet } from '@deriv-com/quill-ui';
import { getLanguage, Localize } from '@deriv/translations';
import { isEmptyObject, redirectToLogin, routes } from '@deriv/shared';
import { useHistory } from 'react-router';
import { useSignupTrigger } from 'AppV2/Hooks/useSignupTrigger';
import ServiceErrorDescription from './service-error-description';
import { checkIsServiceModalError } from 'AppV2/Utils/layout-utils';

const ServiceErrorSheet = observer(() => {
    const [is_open, setIsOpen] = useState(false);
    const { common, client, ui } = useStore();
    const { is_mf_verification_pending_modal_visible, setIsMFVericationPendingModal } = ui;
    const { has_wallet, is_virtual } = client;
    const { services_error, resetServicesError } = common;
    const { clearPurchaseInfo, requestProposal: resetPurchase } = useTraderStore();
    const { handleSignup } = useSignupTrigger();
    const history = useHistory();

    const { code, message, type } = services_error || {};
    const is_insufficient_balance = code === 'InsufficientBalance' || code === 'InvalidContractProposal';
    const is_authorization_required = code === 'AuthorizationRequired' && type === 'buy';
    const is_account_verification_required = code === 'PleaseAuthenticate';
    const should_show_error_modal =
        !isEmptyObject(services_error) &&
        checkIsServiceModalError({ services_error, is_mf_verification_pending_modal_visible });

    const onClose = () => {
        setIsOpen(false);
        if (services_error.type === 'buy') {
            clearPurchaseInfo();
            resetPurchase();
        }
    };

    const getActionButtonProps = () => {
        if (is_insufficient_balance) {
            return {
                primaryAction: {
                    content: <Localize i18n_default_text='Deposit now' />,
                    onAction: () => {
                        resetServicesError();
                        if (!is_virtual) {
                            history?.push?.(has_wallet ? routes.wallets_deposit : routes.cashier_deposit);
                        } else {
                            onClose();
                        }
                    },
                },
            };
        }
        if (is_authorization_required) {
            return {
                primaryAction: {
                    content: <Localize i18n_default_text='Create free account' />,
                    onAction: () => {
                        resetServicesError();
                        handleSignup();
                    },
                },
                secondaryAction: {
                    content: <Localize i18n_default_text='Login' />,
                    onAction: () => {
                        resetServicesError();
                        redirectToLogin(false, getLanguage());
                    },
                },
            };
        }
        if (is_account_verification_required) {
            return {
                primaryAction: {
                    content: <Localize i18n_default_text='Submit Proof' />,
                    onAction: () => {
                        resetServicesError();
                        history.push(routes.proof_of_identity);
                    },
                },
            };
        }
        if (is_mf_verification_pending_modal_visible) {
            return {
                primaryAction: {
                    content: <Localize i18n_default_text='Got it' />,
                    onAction: () => {
                        resetServicesError();
                        setIsMFVericationPendingModal(false);
                        onClose();
                    },
                },
            };
        }
    };

    useEffect(() => {
        setIsOpen(should_show_error_modal);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [should_show_error_modal]);

    useEffect(() => {
        if (!is_open && code) {
            resetServicesError();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetServicesError, is_open]);

    if (!should_show_error_modal) return null;

    return (
        <ActionSheet.Root
            className='service-error-sheet'
            isOpen={is_open}
            onClose={onClose}
            expandable={false}
            position='left'
        >
            <ActionSheet.Portal showHandlebar shouldCloseOnDrag>
                <div className='service-error-sheet__body'>
                    <ServiceErrorDescription
                        is_authorization_required={is_authorization_required}
                        is_insufficient_balance={is_insufficient_balance}
                        is_account_verification_required={is_account_verification_required}
                        is_mf_verification_pending_modal_visible={is_mf_verification_pending_modal_visible}
                        services_error_message={message}
                    />
                </div>
                <ActionSheet.Footer
                    className='service-error-sheet__footer'
                    alignment='vertical'
                    primaryButtonColor='coral'
                    {...getActionButtonProps()}
                />
            </ActionSheet.Portal>
        </ActionSheet.Root>
    );
});

export default ServiceErrorSheet;

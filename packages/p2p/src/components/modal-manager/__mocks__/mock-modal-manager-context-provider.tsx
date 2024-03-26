import React from 'react';
import { useModalManagerContext } from '../modal-manager-context';
import { Modal } from '@deriv/components';

type TMockBuySellModalProps = {
    title?: string;
    subtitle?: string;
};

type TMockMyAdsDeleteModalProps = {
    title?: string;
};

export function MockBuySellModal({ title, subtitle }: TMockBuySellModalProps) {
    const { is_modal_open, hideModal, showModal, useRegisterModalProps } = useModalManagerContext();

    useRegisterModalProps({
        key: 'MyAdsDeleteModal',
        props: {
            title: 'Title from BuySellModal',
        } as unknown as Record<string, never>,
    });

    const showMyAdsDeleteModal = () => {
        showModal({
            key: 'MyAdsDeleteModal',
            props: {},
        });
    };

    return (
        <Modal is_open={is_modal_open}>
            {title && <div>BuySellModal with {title}</div>}
            {title && subtitle && (
                <div>
                    BuySellModal with {title} and {subtitle}
                </div>
            )}
            {!title && !subtitle && <div>BuySellModal</div>}
            <button onClick={() => hideModal()}>Cancel</button>
            <button onClick={showMyAdsDeleteModal}>Apply</button>
        </Modal>
    );
}

export function MockMyAdsDeleteModal({ title }: TMockMyAdsDeleteModalProps) {
    const { is_modal_open, hideModal } = useModalManagerContext();
    return (
        <Modal is_open={is_modal_open}>
            {title && <h1>{title}</h1>}
            <h1>MyAdsDeleteModal</h1>
            <button onClick={() => hideModal()}>Cancel</button>
        </Modal>
    );
}

export function MockAdCancelModal() {
    const { hideModal, showModal, useRegisterModalProps } = useModalManagerContext();

    const showBuySellModal = () =>
        showModal({
            key: 'BuySellModal',
            props: {},
        });

    const onSubmit = () => {
        hideModal({
            should_save_form_history: true,
        });
    };

    useRegisterModalProps([
        {
            key: 'BuySellModal',
            props: {
                title: 'my title',
                subtitle: 'my subtitle',
            },
        },
    ]);

    return (
        <div>
            <button onClick={showBuySellModal}>Go to BuySellModal</button>
            <button onClick={onSubmit}>Submit</button>
        </div>
    );
}

export function MockPage() {
    const { isCurrentModal, showModal, hideModal } = useModalManagerContext();

    const showBuySellModal = () =>
        showModal({
            key: 'BuySellModal',
            props: {},
        });

    const showMyAdsDeleteModal = () => {
        showModal({
            key: 'MyAdsDeleteModal',
            props: {},
        });
    };

    const showAdCancelModal = () => {
        showModal({
            key: 'AdCancelModal',
            props: {
                confirm_label: "Don't cancel",
                message: 'If you choose to cancel, the edited details will be lost.',
                title: 'Cancel your edits?',
            },
        });
    };

    const hideModals = () => {
        hideModal({ should_hide_all_modals: true });
    };

    return (
        <div>
            {isCurrentModal('MyAdsDeleteModal') && <h1>Delete Ads</h1>}
            <button onClick={showBuySellModal}>Show BuySellModal</button>
            <button onClick={showMyAdsDeleteModal}>Show MyAdsDeleteModal</button>
            <button onClick={showAdCancelModal}>Show AdCancelModal</button>
            <button onClick={() => hideModal()}>Hide Modal</button>
            <button onClick={hideModals}>Hide All Modals</button>
        </div>
    );
}

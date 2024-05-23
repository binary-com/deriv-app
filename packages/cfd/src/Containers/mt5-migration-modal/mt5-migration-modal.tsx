import React from 'react';
import { DesktopWrapper, Modal, PageOverlay, UILoader, MobileWrapper, Text, Dialog } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { observer, useStore } from '@deriv/stores';
import MT5MigrationModalContent from './mt5-migration-modal-content';
import { MT5MigrationModalContext } from './mt5-migration-modal-context';
import './mt5-migration-modal.scss';

const MT5MigrationModal = observer(() => {
    const {
        ui,
        modules: { cfd },
    } = useStore();
    const {
        disableApp,
        enableApp,
        is_mt5_migration_modal_open,
        is_mobile,
        toggleMT5MigrationModal,
        setMT5MigrationModalEnabled,
        is_mt5_migration_modal_enabled,
    } = ui;
    const { mt5_migration_error, setMT5MigrationError, setIsFromMt5MigrationModal } = cfd;
    const [show_modal_front_side, setShowModalFrontSide] = React.useState(true);
    const modal_title = (
        <Text size={is_mobile ? 'xs' : 's'} weight='bold'>
            {show_modal_front_side ? (
                <Localize i18n_default_text='Upgrade your MT5 account(s)' />
            ) : (
                <Localize i18n_default_text='Enter your Deriv MT5 password' />
            )}
        </Text>
    );

    React.useEffect(() => {
        if (is_mt5_migration_modal_enabled) {
            setShowModalFrontSide(false);
        } else {
            setShowModalFrontSide(true);
        }
    }, [is_mt5_migration_modal_enabled, setShowModalFrontSide, is_mt5_migration_modal_open]);

    const closeModal = () => {
        setMT5MigrationModalEnabled(false);
        setIsFromMt5MigrationModal(false);
        toggleMT5MigrationModal(false);
    };

    return (
        <div>
            <React.Suspense fallback={<UILoader />}>
                <MT5MigrationModalContext.Provider value={{ show_modal_front_side, setShowModalFrontSide }}>
                    <Dialog
                        title={localize('Sorry for the interruption')}
                        confirm_button_text={localize('Try again')}
                        onConfirm={() => {
                            setMT5MigrationError('');
                            setMT5MigrationModalEnabled(false);
                            toggleMT5MigrationModal(true);
                        }}
                        disableApp={disableApp}
                        enableApp={enableApp}
                        has_close_icon
                        className='mt5-migration-modal__error-dialog'
                        is_visible={!!mt5_migration_error}
                        onClose={() => {
                            setMT5MigrationError('');
                            closeModal();
                        }}
                    >
                        <Localize i18n_default_text='{{mt5_migration_error}}' values={{ mt5_migration_error }} />
                    </Dialog>
                    <DesktopWrapper>
                        <Modal
                            className='mt5-migration-modal'
                            disableApp={disableApp}
                            enableApp={enableApp}
                            exit_classname='cfd-modal--custom-exit'
                            is_open={is_mt5_migration_modal_open && !mt5_migration_error}
                            title={modal_title}
                            toggleModal={closeModal}
                            width={show_modal_front_side ? '58.8rem' : '43.2rem'}
                            has_return_icon={!show_modal_front_side}
                            onReturn={() => setShowModalFrontSide(true)}
                        >
                            <MT5MigrationModalContent />
                        </Modal>
                    </DesktopWrapper>
                    <MobileWrapper>
                        <PageOverlay
                            is_open={is_mt5_migration_modal_open}
                            header_classname='mt5-migration-modal__mobile-header'
                            portal_id='deriv_app'
                            header={modal_title}
                            onClickClose={closeModal}
                            has_return_icon={!show_modal_front_side}
                            onReturn={() => setShowModalFrontSide(true)}
                        >
                            <MT5MigrationModalContent />
                        </PageOverlay>
                    </MobileWrapper>
                </MT5MigrationModalContext.Provider>
            </React.Suspense>
        </div>
    );
});

export default MT5MigrationModal;

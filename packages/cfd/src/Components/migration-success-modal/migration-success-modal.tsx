import React from 'react';
import { useHistory } from 'react-router-dom';
import { Modal, PageOverlay } from '@deriv/components';
import { Jurisdiction, MT5_ACCOUNT_STATUS, routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { getFormattedJurisdictionCode } from '../../Stores/Modules/CFD/Helpers/cfd-config';
import { useCfdStore } from '../../Stores/Modules/CFD/Helpers/useCfdStores';
import MigrationSuccessModalContent from './migration-success-modal-content';

type TMigrationSuccessModal = {
    is_open: boolean;
    closeModal: () => void;
};

const MigrationSuccessModal = observer(({ is_open, closeModal }: TMigrationSuccessModal) => {
    const history = useHistory();
    const { ui, client } = useStore();
    const { mt5_login_list } = client;
    const { is_mobile_or_tablet, setMT5MigrationModalEnabled } = ui;
    const { migrated_mt5_accounts, setIsFromMt5MigrationModal } = useCfdStore();

    const has_migrated_mt5_accounts = !!migrated_mt5_accounts.length;
    const eligible_account_to_migrate = getFormattedJurisdictionCode(
        migrated_mt5_accounts.map(account => Object.values(account?.to_account ?? {})?.[0])?.[0]
    );
    const has_open_positions = React.useMemo(
        () =>
            mt5_login_list.some(account =>
                migrated_mt5_accounts.some(
                    migrated_acc =>
                        migrated_acc.login_id === account.login &&
                        account.status === MT5_ACCOUNT_STATUS.MIGRATED_WITH_POSITION
                )
            ),
        [mt5_login_list, migrated_mt5_accounts]
    );

    const directToCashier = () => {
        closeMigrationModals();
        if (!has_open_positions) {
            history.push(routes.cashier_acc_transfer);
        }
    };

    const closeMigrationModals = () => {
        setIsFromMt5MigrationModal(false);
        setMT5MigrationModalEnabled(false);
        closeModal();
    };

    const getMigrationIcon = () => {
        if (has_migrated_mt5_accounts) {
            const to_acc = Object.values(migrated_mt5_accounts[0]?.to_account)?.[0] || '';
            if (migrated_mt5_accounts?.length === 1) {
                switch (to_acc) {
                    case Jurisdiction.BVI:
                        return 'IcMt5Bvi';
                    case Jurisdiction.VANUATU:
                        return 'IcMt5Vanuatu';
                    default:
                        return '';
                }
            } else {
                switch (to_acc) {
                    case Jurisdiction.BVI:
                        return 'IcMt5StandardFinancialBvi';
                    case Jurisdiction.VANUATU:
                        return 'IcMt5StandardFinancialVanuatu';
                    default:
                        return '';
                }
            }
        }
    };

    const ModalContent = () => (
        <MigrationSuccessModalContent
            directToCashier={directToCashier}
            icon={getMigrationIcon()}
            eligible_account_to_migrate={eligible_account_to_migrate}
            has_open_positions={has_open_positions}
        />
    );

    return is_mobile_or_tablet ? (
        <PageOverlay
            is_open={is_open}
            header_classname='cfd-success-dialog-migration'
            portal_id='deriv_app'
            header=' '
            onClickClose={closeMigrationModals}
        >
            <ModalContent />
        </PageOverlay>
    ) : (
        <Modal
            className='cfd-success-dialog-migration'
            is_open={is_open}
            toggleModal={closeMigrationModals}
            has_close_icon
            title=' '
            width='58.8rem'
            should_header_stick_body={false}
        >
            <ModalContent />
        </Modal>
    );
});

export default MigrationSuccessModal;

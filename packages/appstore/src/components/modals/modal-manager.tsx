import React from 'react';
import { observer } from 'mobx-react-lite';
import { makeLazyLoader, moduleLoader } from '@deriv/shared';
import { Loading } from '@deriv/components';
import { TTradingPlatformAvailableAccount } from './account-type-modal/types';
import { useStores } from 'Stores';
import { TOpenAccountTransferMeta } from 'Types';
import { DetailsOfEachMT5Loginid } from '@deriv/api-types';
import { useWalletMigration } from '@deriv/hooks';

const RealWalletsUpgrade = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "modal_real-wallets-upgrade" */ './real-wallets-upgrade')),
    () => <Loading />
)();

const MT5AccountTypeModal = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "modal_account-type-modal" */ './account-type-modal')),
    () => <Loading />
)();

const FailedVerificationModal = makeLazyLoader(
    () =>
        moduleLoader(
            () => import(/* webpackChunkName: "modal_failed-veriification-modal" */ './failed-veriification-modal')
        ),
    () => <Loading />
)();

const AccountTransferModal = makeLazyLoader(
    () =>
        moduleLoader(
            () =>
                import(
                    /* webpackChunkName: "modal_Components_account-transfer-modal" */ 'Components/account-transfer-modal'
                )
        ),
    () => <Loading />
)();

const RegulatorsCompareModal = makeLazyLoader(
    () =>
        moduleLoader(
            () => import(/* webpackChunkName: "modal_regulators-compare-modal" */ './regulators-compare-modal')
        ),
    () => <Loading />
)();

const WalletsMigrationFailed = makeLazyLoader(
    () =>
        moduleLoader(
            () => import(/* webpackChunkName: "modal_wallets-migration-failed" */ './wallets-migration-failed')
        ),
    () => <Loading />
)();

const WalletsUpgradeModal = makeLazyLoader(
    () => moduleLoader(() => import(/* webpackChunkName: "modal_wallets-upgrade-modal" */ './wallets-upgrade-modal')),
    () => <Loading />
)();

const CFDServerErrorDialog = makeLazyLoader(
    () =>
        moduleLoader(
            () =>
                import(
                    /* webpackChunkName: "modal_cfd_cfd-server-error-dialog" */ '@deriv/cfd/src/Containers/cfd-server-error-dialog'
                )
        ),
    () => <Loading />
)();

const JurisdictionModal = makeLazyLoader(
    () =>
        moduleLoader(
            () =>
                import(
                    /* webpackChunkName: "modal_cfd_jurisdiction-modal" */ '@deriv/cfd/src/Containers/jurisdiction-modal/jurisdiction-modal'
                )
        ),
    () => <Loading />
)();

const CFDPasswordModal = makeLazyLoader(
    () =>
        moduleLoader(
            () =>
                import(
                    /* webpackChunkName: "modal_cfd_cfd-password-modal" */ '@deriv/cfd/src/Containers/cfd-password-modal'
                )
        ),
    () => <Loading />
)();

const CFDDbviOnBoarding = makeLazyLoader(
    () =>
        moduleLoader(
            () =>
                import(
                    /* webpackChunkName: "modal_cfd_cfd-dbvi-onboarding" */ '@deriv/cfd/src/Containers/cfd-dbvi-onboarding'
                )
        ),
    () => <Loading />
)();

const CFDResetPasswordModal = makeLazyLoader(
    () =>
        moduleLoader(
            () =>
                import(
                    /* webpackChunkName: "modal_cfd_cfd-reset-password-modal" */ '@deriv/cfd/src/Containers/cfd-reset-password-modal'
                )
        ),
    () => <Loading />
)();

const CFDTopUpDemoModal = makeLazyLoader(
    () =>
        moduleLoader(
            () =>
                import(
                    /* webpackChunkName: "modal_cfd_cfd-top-up-demo-modal" */ '@deriv/cfd/src/Containers/cfd-top-up-demo-modal'
                )
        ),
    () => <Loading />
)();

const MT5TradeModal = makeLazyLoader(
    () =>
        moduleLoader(
            () =>
                import(/* webpackChunkName: "modal_cfd_mt5-trade-modal" */ '@deriv/cfd/src/Containers/mt5-trade-modal')
        ),
    () => <Loading />
)();

const CFDPasswordManagerModal = makeLazyLoader(
    () =>
        moduleLoader(
            () =>
                import(
                    /* webpackChunkName: "modal_cfd_cfd-password-manager-modal" */ '@deriv/cfd/src/Containers/cfd-password-manager-modal'
                )
        ),
    () => <Loading />
)();

const MT5MigrationModal = makeLazyLoader(
    () =>
        moduleLoader(
            () =>
                import(
                    /* webpackChunkName: "modal_cfd_mt5-migration-modal" */ '@deriv/cfd/src/Containers/mt5-migration-modal'
                )
        ),
    () => <Loading />
)();

const ResetTradingPasswordModal = makeLazyLoader(
    () =>
        moduleLoader(
            () =>
                import(
                    /* webpackChunkName: "modal_account_reset-trading-password-modal" */ '@deriv/account/src/Components/reset-trading-password-modal'
                )
        ),
    () => <Loading />
)();

type TCurrentList = DetailsOfEachMT5Loginid & {
    enabled: number;
};

const ModalManager = () => {
    const { is_eligible } = useWalletMigration();
    const store = useStores();
    const { common, client, modules, traders_hub, ui, is_wallet_migration_eligible } = store;
    const { is_logged_in, is_eu, is_eu_country, is_populating_mt5_account_list, verification_code } = client;
    const { platform } = common;
    const {
        current_list,
        enableCFDPasswordModal,
        is_mt5_trade_modal_visible,
        setAccountType,
        toggleMT5TradeModal,
        getRealSyntheticAccountsExistingData,
        getRealFinancialAccountsExistingData,
        getRealSwapfreeAccountsExistingData,
        has_cfd_error,
        is_jurisdiction_modal_visible,
        is_cfd_verification_modal_visible,
        mt5_migration_error,
        is_mt5_password_invalid_format_modal_visible,
        is_cfd_password_modal_enabled,
        is_cfd_success_dialog_enabled,
        is_sent_email_modal_enabled,
    } = modules.cfd;
    const {
        enableApp,
        disableApp,
        is_reset_trading_password_modal_visible,
        setResetTradingPasswordModalOpen,
        is_cfd_reset_password_modal_enabled,
        is_top_up_virtual_open,
        is_top_up_virtual_success,
        is_mt5_migration_modal_open,
    } = ui;
    const {
        is_demo,
        is_account_transfer_modal_open,
        toggleAccountTransferModal,
        is_real_wallets_upgrade_on,
        is_account_type_modal_visible,
        is_failed_verification_modal_visible,
        is_regulators_compare_modal_visible,
        is_wallet_migration_failed,
    } = traders_hub;

    const [password_manager, setPasswordManager] = React.useState<{
        is_visible: boolean;
        selected_login: string;
        selected_account: string;
        selected_account_type: string;
        selected_account_group: '' | 'demo' | 'real';
        selected_server: string;
    }>({
        is_visible: false,
        selected_login: '',
        selected_account: '',
        selected_account_type: '',
        selected_account_group: '',
        selected_server: '',
    });

    const togglePasswordManagerModal = (
        login?: string,
        title?: string,
        group?: 'demo' | 'real' | '',
        type?: string,
        server?: string
    ) => {
        setPasswordManager(prev_state => ({
            is_visible: !prev_state.is_visible,
            selected_login: typeof login === 'string' ? login : '',
            selected_account: typeof title === 'string' ? title : '',
            selected_account_group: group || '',
            selected_account_type: type || '',
            selected_server: server || '',
        }));
    };

    const openRealPasswordModal = (account_type: TOpenAccountTransferMeta) => {
        setAccountType(account_type);
        enableCFDPasswordModal();
    };

    const existing_accounts_data = (acc_type: TTradingPlatformAvailableAccount['market_type'] | 'synthetic') => {
        const current_list_keys = Object.keys(current_list);
        const should_be_enabled = (list_item: TCurrentList) =>
            platform === 'dxtrade' ? list_item.enabled === 1 : true;
        const acc = current_list_keys.some(
            key => key.startsWith(`${platform}.real.${acc_type}`) && should_be_enabled(current_list[key])
        )
            ? Object.keys(current_list)
                  .filter(key => key.startsWith(`${platform}.real.${acc_type}`))
                  .reduce((_acc, cur) => {
                      _acc.push(current_list[cur]);
                      return _acc;
                  }, [] as DetailsOfEachMT5Loginid[])
            : undefined;
        return acc;
    };
    const trading_platform_dxtrade_password_reset = verification_code?.trading_platform_dxtrade_password_reset;
    const trading_platform_mt5_password_reset = verification_code?.trading_platform_mt5_password_reset;

    getRealSyntheticAccountsExistingData(existing_accounts_data('synthetic'));
    getRealFinancialAccountsExistingData(existing_accounts_data('financial'));
    getRealSwapfreeAccountsExistingData(existing_accounts_data('all'));

    const should_show_cfd_password_modal =
        is_cfd_password_modal_enabled ||
        is_cfd_success_dialog_enabled ||
        is_mt5_password_invalid_format_modal_visible ||
        is_sent_email_modal_enabled;

    return (
        <React.Fragment>
            {is_jurisdiction_modal_visible && <JurisdictionModal openPasswordModal={openRealPasswordModal} />}
            {should_show_cfd_password_modal && <CFDPasswordModal platform={platform} />}
            {is_cfd_verification_modal_visible && <CFDDbviOnBoarding />}
            {is_cfd_reset_password_modal_enabled && <CFDResetPasswordModal platform={platform} />}
            {has_cfd_error && <CFDServerErrorDialog />}
            {(is_top_up_virtual_open || is_top_up_virtual_success) && <CFDTopUpDemoModal platform={platform} />}
            {is_mt5_trade_modal_visible && (
                <MT5TradeModal
                    is_open={is_mt5_trade_modal_visible}
                    onPasswordManager={togglePasswordManagerModal}
                    toggleModal={toggleMT5TradeModal}
                    is_eu_user={(is_logged_in && is_eu) || (!is_logged_in && is_eu_country)}
                    is_demo={is_demo}
                />
            )}
            {password_manager.is_visible && (
                <CFDPasswordManagerModal
                    is_visible={password_manager.is_visible}
                    selected_login={password_manager.selected_login}
                    selected_account_group={password_manager.selected_account_group}
                    selected_account_type={password_manager.selected_account_type}
                    selected_server={password_manager.selected_server}
                    platform={platform}
                    toggleModal={togglePasswordManagerModal}
                />
            )}
            {is_reset_trading_password_modal_visible && (
                <ResetTradingPasswordModal
                    platform={trading_platform_dxtrade_password_reset ? 'dxtrade' : 'mt5'}
                    enableApp={enableApp}
                    disableApp={disableApp}
                    toggleResetTradingPasswordModal={setResetTradingPasswordModalOpen}
                    is_visible={is_reset_trading_password_modal_visible}
                    is_loading={is_populating_mt5_account_list}
                    verification_code={trading_platform_dxtrade_password_reset || trading_platform_mt5_password_reset}
                />
            )}
            {is_account_type_modal_visible && <MT5AccountTypeModal />}
            {(is_mt5_migration_modal_open || !!mt5_migration_error) && <MT5MigrationModal />}
            {is_regulators_compare_modal_visible && <RegulatorsCompareModal />}
            {is_account_transfer_modal_open && (
                <AccountTransferModal
                    is_modal_open={is_account_transfer_modal_open}
                    toggleModal={toggleAccountTransferModal}
                />
            )}
            {is_failed_verification_modal_visible && <FailedVerificationModal />}
            {is_real_wallets_upgrade_on && <RealWalletsUpgrade />}
            {is_wallet_migration_failed && <WalletsMigrationFailed />}
            {is_eligible && <WalletsUpgradeModal />}
        </React.Fragment>
    );
};

export default observer(ModalManager);

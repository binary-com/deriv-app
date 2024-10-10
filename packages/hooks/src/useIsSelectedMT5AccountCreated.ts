import React from 'react';
import { useStore } from '@deriv/stores';
import { MT5_ACCOUNT_STATUS } from '@deriv/shared';

const getStatusBadge = (status: string) => {
    if (status === 'proof_failed') {
        return MT5_ACCOUNT_STATUS.FAILED;
    } else if (status === 'verification_pending') {
        return MT5_ACCOUNT_STATUS.PENDING;
    } else if (status === 'needs_verification') {
        return MT5_ACCOUNT_STATUS.NEEDS_VERIFICATION;
    }
};

/**
 * Custom React hook to check if the selected MT5 account has been created.
 *
 * @returns {Object} An object containing the following properties:
 *
 * - `is_selected_MT5_account_created` (boolean): Indicates whether the selected MT5 account has been created.
 * - `existing_account` (Object | null): If the selected account is created, contains the MT5 account details; otherwise `null`.
 * - `existing_account_status` (string | null): Status of the created account (e.g., 'failed', 'pending', 'needs_verification'), or `null` if no account is created.
 * - `available_account_to_create` (Object | null): The account available to create for the selected product. Will be `null` if an account is already created.
 */

const useIsSelectedMT5AccountCreated = () => {
    const {
        client,
        modules: { cfd },
    } = useStore();
    const { mt5_login_list, trading_platform_available_accounts, updateMT5AccountDetails } = client;

    React.useEffect(() => {
        async function fetchData() {
            await updateMT5AccountDetails();
        }
        fetchData();
    }, [updateMT5AccountDetails]);

    const { jurisdiction_selected_shortcode, product } = cfd;
    const created_account = mt5_login_list.filter(
        account => account.landing_company_short === jurisdiction_selected_shortcode && account.product === product
    );
    const selected_account = trading_platform_available_accounts.filter(
        account => account.shortcode === jurisdiction_selected_shortcode && account.product === product
    );

    const is_selected_MT5_account_created = created_account && Object.keys(created_account).length > 0;

    const existing_account = is_selected_MT5_account_created ? created_account[0] : null;
    const existing_account_status = existing_account?.status ? getStatusBadge(existing_account?.status) : null;

    const available_account_to_create = !is_selected_MT5_account_created ? selected_account[0] : null;
    return {
        is_selected_MT5_account_created,
        existing_account,
        existing_account_status,
        available_account_to_create,
    };
};

export default useIsSelectedMT5AccountCreated;

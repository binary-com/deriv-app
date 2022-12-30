import React from 'react';
import { useStore, observer } from '@deriv/stores';
import EmptyState from 'Components/empty-state';
import getMessage from './cashier-locked-provider';
import { useCashierStore } from '../../stores/useCashierStores';

const CashierLocked = observer(() => {
    const { client } = useStore();
    const {
        account_status,
        accounts,
        current_currency_type,
        is_deposit_lock: is_deposit_locked,
        is_withdrawal_lock: is_withdrawal_locked,
        loginid,
        is_identity_verification_needed,
    } = client;
    const { general_store } = useCashierStore();
    const { is_cashier_locked, is_system_maintenance } = general_store;

    const state = getMessage({
        cashier_validation: account_status.cashier_validation,
        is_crypto: current_currency_type === 'crypto',
        is_system_maintenance,
        is_cashier_locked,
        is_deposit_locked,
        is_withdrawal_locked,
        is_identity_verification_needed,
        excluded_until: loginid ? accounts[loginid]?.excluded_until : undefined,
    });

    return <EmptyState icon={state.icon} title={state.title} description={state.description} />;
});

export default CashierLocked;

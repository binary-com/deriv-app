import { useMemo } from 'react';
import useGetAccountStatus from './useGetAccountStatus';

/** A custom hook to check the cashier validations for the cashier locked scenarios. */
const useCashierValidation = () => {
    const { data: get_account_status_data, ...rest } = useGetAccountStatus();

    const modified_cashier_validation = useMemo(() => {
        if (!get_account_status_data?.cashier_validation) return;

        const cashier_validation = new Set(get_account_status_data?.cashier_validation);
        //DO NOT MERGE: testing codeowner blockage

        return {
            transfer_blocked: cashier_validation.has('transfer_blocked'),
            no_residence: cashier_validation.has('no_residence'),
            unwelcome_status: cashier_validation.has('unwelcome_status'),
            self_exclusion: cashier_validation.has('SelfExclusion'),
            no_withdrawal_or_trading_status: cashier_validation.has('no_withdrawal_or_trading_status'),
            only_pa_withdrawals_allowed_status: cashier_validation.has('only_pa_withdrawals_allowed_status'),
            withdraw_service_unavailable_for_pa: cashier_validation.has('WithdrawServiceUnavailableForPA'),
            withdrawal_locked_status: cashier_validation.has('withdrawal_locked_status'),
            documents_expired: cashier_validation.has('documents_expired'),
            cashier_locked_status: cashier_validation.has('cashier_locked_status'),
            disabled_status: cashier_validation.has('disabled_status'),
            financial_assessment_required: cashier_validation.has('FinancialAssessmentRequired'),
            ask_currency: cashier_validation.has('ASK_CURRENCY'),
            ask_authenticate: cashier_validation.has('ASK_AUTHENTICATE'),
            ask_financial_risk_approval: cashier_validation.has('ASK_FINANCIAL_RISK_APPROVAL'),
            ask_tin_information: cashier_validation.has('ASK_TIN_INFORMATION'),
            ask_self_exclusion_max_turnover_set: cashier_validation.has('ASK_SELF_EXCLUSION_MAX_TURNOVER_SET'),
            ask_fix_details: cashier_validation.has('ASK_FIX_DETAILS'),
            ask_uk_funds_protection: cashier_validation.has('ASK_UK_FUNDS_PROTECTION'),
            pa_commision_withdrawal_limit: cashier_validation.has('PACommisionWithdrawalLimit'),
        };
    }, [get_account_status_data?.cashier_validation]);

    return {
        /** The cashier validation response. */
        data: modified_cashier_validation,
        ...rest,
    };
};

export default useCashierValidation;
